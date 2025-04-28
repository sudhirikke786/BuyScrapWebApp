import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { style } from '@angular/animations';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import { ConfirmationService, MessageService } from 'primeng/api';


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

  totalCharges: number = 0;
  firstname: string = '';
  isLoading: boolean = false;
  showLoader: boolean = false;
  dispatchRes: any;
  searchInput: any;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router:Router,
    private localService:StorageService,
    private messageService: MessageService,
    

  ) {


    this.route.queryParams.subscribe(params => {
      this.searchInput = params['searchText'] || '';
      this.getAllCODTickets();
    })
  }



 
  
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
    }
  };

  @ViewChild('calendarRef') calendarRef!: FullCalendarComponent;


  ngOnInit(){
    this.orgName = localStorage.getItem('orgName');
    this.locId = localStorage.getItem('locId');
    this.getAllCODTickets();
    this.backUrl = `/${this.orgName}/dispatch/meeting`;
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
      SerachText: this.searchInput
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
              sellerAddress: item.streetAddress         
            };
          });
        } else {
          console.error('No data found or incorrect response structure.');
        }

        this.calendarOptions.events = this.getCalnderData(this.dispatchRes);
      
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
 

  const start = new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const end = new Date(info.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const type = info.event.extendedProps.detailObj?.type || '';
  const  driverName = info.event.extendedProps?.detailObj?.driverFullName || 'Unassigned';
  //Unassign
  const ticketStatus = info.event.extendedProps?.detailObj?.ticketStatus;
  const colorStatus = info.event.extendedProps?.detailObj?.colorStatus;
  const rowID = info.event.extendedProps?.detailObj?.rowId;

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

  return {
    html: `
      <div class="event-card" style="border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); background-color: ${bgColor}; margin: 1px 0; height: auto; display: flex; flex-direction: column; width: 100%; transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div style="background-color: ${statusBarColor}; height: 4px; width: 100%;"></div>
        
        <div style="padding: 6px; text-align: left; flex: 1; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <div style="font-size: 12px; color: #666;">#${rowID}</div>
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
            <a href="${info.event?.url}" style="color: #6658dd; text-decoration: none; font-size: 12px;">View All</a>
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
