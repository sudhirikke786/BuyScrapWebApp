import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

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


  totalCharges: number = 0;
  firstname: string = '';
  isLoading: boolean = false;
  showLoader: boolean = false;
  dispatchRes: any;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private localService:StorageService,

  ) {}



 
  
  orgName!: string | null;


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    customButtons: {
      myCustomButton: {
        text: 'Back',
        click: function () {
          alert('clicked the back button!');
        }
      }
    },
    headerToolbar: {
      left: 'prev,next myCustomButton today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    buttonText: {
      prev: 'Previous',
      next: 'Next'
    },
    events: [],
    eventContent: this.renderEventContent
  };;

  ngOnInit(){
    this.orgName = localStorage.getItem('orgName');
    this.locId = localStorage.getItem('locId');
    this.getAllCODTickets();
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
        description: item.sellerName,
      
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





 
  
 renderEventContent(info: any) {
  const start = new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const end = new Date(info.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return {
    html: `
      <div style="border:1px solid #6658dd; border-left:3px solid #6658dd;padding:5px;">

        <i class="${info.event.extendedProps.icon} me-2"></i>
        <div display: flex; align-items: center;">
          <div style="font-weight: bold;">${info.event.title}</div>
          <div>${start} - ${end}</div>
        </div>
        <div display: flex; align-items: center;">
         <div style="font-weight: bold;">10 -Appointments</div>
         <div style="font-weight: bold;">  <a  class="text-primary">View All</a></div>

        </div>

      </div>`
  }
}

}
