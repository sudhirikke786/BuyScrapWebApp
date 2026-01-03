import { Component, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { style } from '@angular/animations';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HelperService } from 'src/app/core/services/helper.service';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-full-calnder-dispatch',
  templateUrl: './full-calnder-dispatch.component.html',
  styleUrls: ['./full-calnder-dispatch.component.scss']
})
export class FullCalnderDispatchComponent implements OnInit {
  containers: any[] = [];
  drivers: any[] = [];
  locId: string | number | null | undefined;
  customerName: string = '';
  address: string | null = null;
  backUrl:any;


  fileDataObj: any;
  showDownload = false;
  showLoaderReport = false;
  isReportShow = false;
  
  checkTabView: boolean = false;
  totalCharges: number = 0;
  firstname: string = '';
  isLoading: boolean = false;
  showLoader: boolean = false;
  dispatchRes: any;

  currentRole: any;
  adminAdvertisement!: string | null;
  pickupID:any

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router:Router,
    private localService:StorageService,
    private messageService: MessageService,
    public helperService:HelperService,
    private cdRef: ChangeDetectorRef,
    private authService:AuthService
    

  ) {}



 
  
  orgName!: string | null;


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    aspectRatio: 1.8,
    editable: true,
    droppable: true,
    customButtons: {
      myCustomButton: {
        text: 'Back',
        click: () => {
          this.router.navigateByUrl(this.backUrl)
        }
      },
      myprev: {
        text: 'Prev',
        click: () => {
          this.goToPreviousMonth();
        }
      },
      mynext: {
        text: 'Next',
        click: () => {
          this.goToNextMonth();
        }
      }
    },
    headerToolbar: {
      left: 'prev,next,myCustomButton,myprev,mynext',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    buttonText: {
      prev: 'Previous',
      next: 'Next'
    },
    events: [],
    eventContent: this.renderEventContent,
    eventDrop: (info) => {
      this.handleEventDrop(info);
    },
    datesSet: (info) => {
      this.filterEventsForCurrentMonth();
    }
  };

  @ViewChild('calendarRef') calendarRef!: FullCalendarComponent;


  ngOnInit(){
    this.currentRole = this.authService.userCurrentRole();
    if (this.currentRole === 'Scale') {
      const orgName = localStorage.getItem('orgName');
      this.router.navigate([`/${orgName}/dispatch`]); 
    }    
    this.locId = localStorage.getItem('locId');
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.getAllCODTickets();
    this.backUrl = `/${this.orgName}/dispatch/meeting`;
    (window as any).dispatchPrint = (rowId: any) => {
      this.generateDispatchReport(rowId);
    };
    (window as any).convertToTicket = (sellerID: any, rowId: any, pickupID:any) => {
      this.convertToTicket(sellerID, rowId, pickupID);
    };
    (window as any).showTicketclick = (ticketRowID: any, sellerID: any) => {
      this.showTicketclick(ticketRowID, sellerID);
    };
    this.setCalendarPermissions();
    this.calendarOptions.eventContent = this.renderEventContent.bind(this);

  }
  
  generateDispatchReport(rowId: any) {
    this.isReportShow =true;
    this.showLoaderReport = true;

    const param = {
      PickUpID: rowId,
      LocationId: this.locId,
      Advertising: this.adminAdvertisement
    }

    this.commonService.getDispatchReportData(param)
      .subscribe(data => {
        console.log('getDispatchReportData :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        //this.showLoaderReport = false;
        //this.showLoaderReport = true;
        this.cdRef.detectChanges(); 
        this.showLoaderReport = false;
       
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Dispatch Report " + rowId);
        }
      },
        (err: any) => {
          this.showLoaderReport = false;
        }
      );
  }

  closePdfReport() {
    this.showDownload = false;    
  }

  convertToTicket(sellerID: any, rowId: any, pickupID:any) {
    this.router.navigate([`/${this.orgName}/home/detail/new/${sellerID}/false`], {
      queryParams: { dispatchID: rowId, PickupID:pickupID },
    });
  }

  showTicketclick(ticketRowID: any, sellerID: any) {
    this.router.navigate([`/${this.orgName}/home/detail/${ticketRowID}/${sellerID}/false`]);
  }
    


  setCalendarPermissions() {
    const restrictedRoles = ['driver', 'scale'];
    const role = this.currentRole?.toLowerCase();
      if (restrictedRoles.includes(role)) {
        this.calendarOptions.editable = false;
        this.calendarOptions.droppable = false;
      }
  }
  
  handleEventDrop(info: any) {
    const dispatchID = info.event.extendedProps.detailObj?.rowId || info.event.id;

    const status = info.event.extendedProps.detailObj?.ticketStatus;

    if (status === 'Completed') {
      this.messageService.add({ 
        severity: "warn", 
        summary: "Warning",
        detail: "This Pickup is completed and cannot be moved."
      });
      info.revert(); // cancel drop
      return; 
    }
    
    const newDate = new Date(info.event.start);
    const formattedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')} 00:00:00.000`;
    
    console.log('Original date:', info.oldEvent.start);
    console.log('New date:', newDate);
    console.log('Formatted date for API:', formattedDate);
    
    if (dispatchID) {
      this.updateDispatchDateAPI(dispatchID, formattedDate);
    }
  }
  
  updateDispatchDateAPI(dispatchID: number, pickUpDate: string) {
    const requestObj = {
      dispatchID: dispatchID,
      pickUpDate: pickUpDate
    };
    const postParams = {
      dispatchID: dispatchID,
      pickUpDate: pickUpDate
    };
        this.commonService.UpdateDispatchDateDispatch(requestObj,postParams).subscribe(
      (res) => {
        console.log('API Response:', res); 
        
        if (res?.body?.data === true) {
          this.messageService.add({ 
            severity: "success", 
            summary: "Success",
            detail: "Dispatch date updated successfully."
          });
        }
        this.getAllCODTickets();  
      },
      (error) => {
        this.messageService.add({ 
          severity: "error", 
          summary: "Error",
          detail: "An error occurred while updating dispatch date."
        });
      }
    );
  }
  

  getAllCODTickets() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SerachText: ''
    };
    this.isLoading = true;

    this.commonService.GetAllPickUpDetails(paramObject).subscribe(
      
      (data: any) => {
        this.isLoading = false;
        //console.log('API Response:', data); 
        console.log('getAllCODTickets :: ', data);

        if (data && data.body && data.body.data) {
          this.dispatchRes = data.body.data.map((item: any) => {
            //console.log('Mapped item:', item.ticketRowID);
            return {
              rowId: item.rowID,       
              pickUpDate: item.pickUpDate,
              customerName: item.customerName,
              sellerName: item.sellerName,
              sellerID:item.sellerID,
              ticketRowID:item.ticketRowID,
              charges: item.charges,
              selected: item.closedDate ? true : false,
              closedDate: item.closedDate,
              typeID:item.typeID,
              type:item.type,
              driverID:item.driverID,
              ticketStatus:this.addStatus(item),
              colorStatus:this.addColorStatus(item),
              driverFullName:item.driverFullName,
              ticketId: item.ticketRowID > 0 ? item.ticketRowID : 0,
              sellerAddress: item.streetAddress,
              pickupID: item.pickupID        
            };
          });
        } else {
          console.error('No data found or incorrect response structure.');
        }

        this.calendarOptions.events = this.getCalnderData(this.dispatchRes);
          this.filterEventsForCurrentMonth();
      
      },
      (err: any) => {
        this.isLoading = false;
        this.showLoader = false;
        console.error('Error fetching COD tickets:', err);
      },
      () => {
        this.isLoading = false;
        this.showLoader = false;
      }
    );
    
  }

  filterEventsForCurrentMonth() {
    if (this.calendarRef && this.calendarRef.getApi()) {
      const calendarApi = this.calendarRef.getApi();
      const currentView = calendarApi.view;
      
      if (currentView.type === 'dayGridMonth') {
        const start = new Date(currentView.currentStart);
        const end = new Date(currentView.currentEnd);
        
        const viewDate = calendarApi.getDate();
        const viewMonth = viewDate.getMonth();
        const viewYear = viewDate.getFullYear();
        
        const allEvents = calendarApi.getEvents();
        allEvents.forEach(event => {
          const eventDate = new Date(event.start!);
          const eventMonth = eventDate.getMonth();
          const eventYear = eventDate.getFullYear();
          
          if (eventMonth !== viewMonth || eventYear !== viewYear) {
            event.setProp('display', 'none');
          } else {
            event.setProp('display', 'auto');
          }
        });
      }
    }
  }

  getCalnderData(res:any) {

    const events = res.map((item: any) => {
      return {
        title: item.sellerName,
        start: item.pickUpDate,
        end: item.pickUpDate,
        detailObj : {
          customerName:item.sellerName,
          driverFullName:item.driverFullName,
          driverID:item.driverID,
          type:item.type,
          rowId:item.rowId,
          closedDate:item.closedDate,
          ticketStatus:item.ticketStatus,
          colorStatus:item.colorStatus,
          sellerID: item.sellerID, 
          ticketRowID: item.ticketRowID,
          pickupID: item.pickupID
        },
        description: item.sellerName,
        url: `/${this.orgName}/dispatch/dispatch-detail/${item.rowId}/${item.sellerID}/show?view=calendar`,
        icon: 'fa-solid fa-calendar'
        };
    })
    
    return events

    // [
    //   { title: 'Collabartion', start: '2024-07-16T10:00:00', end: '2024-07-16T11:00:00', icon: 'fa-solid fa-calendar' },
    //   { title: 'Planing', start: '2024-07-18T12:00:00', end: '2024-07-16T18:00:00', icon: 'fa-solid fa-calendar-check' },
    //   { title: 'Collabartion', start: '2024-07-19T10:00:00', end: '2024-07-19T11:00:00', icon: 'fa-solid fa-calendar' },
    //   { title: 'Planing', start: '2024-07-20T12:00:00', end: '2024-07-20T13:00:00', icon: 'fa-solid fa-calendar-check' },
    //   { title: 'Collabartion', start: '2024-07-21T10:00:00', end: '2024-07-21T11:00:00', icon: 'fa-solid fa-calendar' },
    //   { title: 'Planing', start: '2024-07-22T12:00:00', end: '2024-07-22T13:00:00', icon: 'fa-solid fa-calendar-check' }
    // ],
  }



addStatus(driver:any) {
  let status  = 'Unassigned';
  if(driver.driverID>0){
    status = 'Assigned'
  }else{
     status = 'Unassigned'
  }
  if(driver.isCompleted === true){
    status = 'Completed'
  }
  return status;

}


addColorStatus(driver:any) {
  
  let colorStatus = '#06669c'
  if(driver.driverID>0){
    colorStatus = '#6658dd'
  }else{
    colorStatus = '#06669c'
  }
  if(driver.isCompleted === true){
    colorStatus = '#4CAF50'
  }
  return colorStatus;

}



goToPreviousMonth() {
  this.calendarRef.getApi().prev(); // Use FullCalendar's API to go to the previous month
}

// Navigate to the next month
goToNextMonth() {
  this.calendarRef.getApi().next(); // Use FullCalendar's API to go to the next month
}




 
 renderEventContent(info: any) {

  //[routerLink]="['dispatch-detail', certificate.rowId, certificate.sellerID,'show']
//this.router.navigateByUrl(`/${this.orgName}/dispatch/dispatch-status`)
  const role = this.currentRole?.toLowerCase();
  const isDriver = role === 'driver';

  const start = new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const end = new Date(info.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const type = info.event.extendedProps.detailObj?.type || '';
  const  driverName = info.event.extendedProps?.detailObj?.driverFullName || 'Unassigned';
  //Unassign
  const ticketStatus = info.event.extendedProps?.detailObj?.ticketStatus;
  const colorStatus = info.event.extendedProps?.detailObj?.colorStatus;
  const rowID = info.event.extendedProps?.detailObj?.rowId;
  const pickupID = info.event.extendedProps?.detailObj?.pickupID; 
  const sellerID = info.event.extendedProps?.detailObj?.sellerID;
  const ticketRowID = info.event.extendedProps?.detailObj?.ticketRowID;

  const lightBackgrounds: { [key: string]: string } = {
    '#4CAF50': '#A5D6A7', 
    '#6658dd': '#C5CAE9', 
    '#06669c': '#90CAF9', 
  };

  let statusBarColor = colorStatus || '#4CAF50'; 
  let statusTextColor = colorStatus || '#4CAF50';
  const bgColor = lightBackgrounds[colorStatus] || '#f0f0f0';


  // let bgColor =  '#FF69B4';
  // let textColor = '#ffffff';

  // switch (info?.event?.extendedProps?.detailObj?.type) {
  //   case 'Drop off':
  //     bgColor = '#E6FFE6';
  //     textColor = '#000000';
  //     break;
  //   case 'Exchange':
  //     bgColor = '#FFC107';
  //     textColor = '#FFFFFFF';
  //     break;
  //   case 'Pickup':
  //     bgColor = '#4CAF50';
  //     textColor = '#000000';
  //     break;
  //   default:
  //     bgColor = '#000000';
  // }

  const showConvertButton = !isDriver && ticketRowID === 0;
  const showTicketButton = !isDriver && ticketRowID > 0;


  return {
    html: `
      <div class="event-card" style="border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); background-color: ${bgColor}; margin: 1px 0; height: auto; display: flex; flex-direction: column; width: 100%; transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div style="background-color: ${statusBarColor}; height: 4px; width: 100%;"></div>
        
        <div style="padding: 6px; text-align: left; flex: 1; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <div style="font-size: 12px; color: #666;">#${pickupID}</div>
            <div style="font-size: 12px; color: ${statusTextColor}; font-weight: 500;">${ticketStatus}</div>
          </div>
          
          <div style="font-weight: 500; font-size: 13px; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${info.event.title}
          </div>
          
          <div style="margin-bottom: 3px; font-size: 12px; color: #666;">
            ${type}
          </div>
          
          <div style="margin-bottom: 3px; font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            Driver: ${driverName}
          </div>
          
          <div style="margin-bottom: 3px; font-size: 12px; color: #888;">
          <div>${start} - ${end}</div>
          </div>
          
          <div style="margin-top: 2px;">
              <div style="display: flex; gap: 6px; align-items: center;">
                <a href="${info.event?.url}" style="color: #6658dd; text-decoration: none; font-size: 12px;">View All</a>
                <button onclick="event.stopPropagation(); event.preventDefault(); window.dispatchPrint('${rowID}')" 
                  style="background: none; border: none; color: #28a745; cursor: pointer; font-size: 12px; padding: 0;">
                  Print
                </button>
                ${showConvertButton ? `
                  <button onclick="event.stopPropagation(); event.preventDefault(); window.convertToTicket('${sellerID}', '${rowID}', '${pickupID}')" 
                    style="background: none; border: none; color: #007bff; cursor: pointer; font-size: 12px; padding: 0;">
                    Convert to Ticket
                  </button>
                ` : ''}
                 ${showTicketButton ? `
                  <button onclick="event.stopPropagation(); event.preventDefault(); window.showTicketclick('${ticketRowID}', '${sellerID}')" 
                    style="background: none; border: none; color: #ff6666; cursor: pointer; font-size: 12px; padding: 0;">
                    Show Ticket
                  </button>
                ` : ''}
              </div>  
            </div>
          </div>
        </div>`
    }
}
getColor(type:any) {
  try {
   
    
  } catch (error) {
    
  }
 
 }


}
