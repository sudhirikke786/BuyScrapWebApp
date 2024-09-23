import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-dispatch-dashboard',
  templateUrl: './dispatch-dashboard.component.html',
  styleUrls: ['./dispatch-dashboard.component.scss']
})
export class DispatchDashboardComponent implements OnInit {
  locId!: string | number | null;
  currentIndex: any;
  checkOBj: any;


  constructor( private route:ActivatedRoute,private router:Router, public commonService: CommonService){

  }
  orgName!: string | null;
  showLoader = false;

   calendarOptions : CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [
      { title: 'Event 1', date: '2024-07-16' },
      { title: 'Event 2', date: '2024-07-17' }
    ]
  };


  dispatchRes = [
    {
      ticketID: '463',
      dateCreated: '04/10/2022',
      ticketAmount: '30.00',
      seller: 'Alex Sample Jr.',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '452',
      dateCreated: '04/10/2022',
      ticketAmount: '305.00',
      seller: 'Alexander',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '451',
      dateCreated: '04/10/2022',
      ticketAmount: '300.00',
      seller: 'Mike Hussey',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '455',
      dateCreated: '04/10/2022',
      ticketAmount: '99.00',
      seller: 'Alex Sample Jr.',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '480',
      dateCreated: '04/10/2022',
      ticketAmount: '55.00',
      seller: 'John Travolta',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '440',
      dateCreated: '04/10/2022',
      ticketAmount: '40.00',
      seller: 'Arnold',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '445',
      dateCreated: '04/10/2022',
      ticketAmount: '330.00',
      seller: 'Alex Sample Jr.',
      dateClosed: '04-10-2022'
    }
  ];



  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode:'mdi-calendar',
      title:'Calendar View',
      label:'Calendar View'
    },
    {
      iconcode:'mdi-plus',
      title:'New Appointment',
      label:'New Appointment'
    }
  ];
  isConfirmModel = false;


  


  
  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getAllCODTickets();
  }


  getAllCODTickets() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SerachText:''
    };
    this.showLoader = true;
    this.commonService.GetAllPickUpDetails(paramObject)
      .subscribe(data => {
          console.log('getAllCODTickets :: ');
          console.log(data);
          this.dispatchRes = data.body.data.map((item:any) => {
            item.selected =  item?.dateClosed ? true : false;
            return item;
          });
        
        },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () =>  {
          this.showLoader = false;
        }
      );
  }




  setChecked(item: any,rowIndex:any): void {
    this.currentIndex = rowIndex;
    this.checkOBj = item;
    this.confirm1();
  
    
}

confirm1() {
  
  this.isConfirmModel =  true;
}

onCheckboxChange(item: any) {
  // Handle individual checkbox change if needed
  console.log('Checkbox state changed for item:', item);

  this.confirm1();
}

toggleAllSelection() {
  
  // Toggle all checkboxes state
 // this.selectAll = !this.selectAll;
//  this.certificates.forEach((item:any)=> (item.selected = this.selectAll));
}




  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        break;
      case 'mdi-refresh':
        break;
      case 'mdi-calendar':
        this.showDialog();
        break;
      case 'mdi-plus':
        this.openAddUpdateEvent();
        break;
      default:
        break;
    }

  }

  
  openAddUpdateEvent(){
    alert('Add / Update Event is in Progress')
  }

  showDialog(){
    this.router.navigateByUrl(`/${this.orgName}/dispatch/meeting`)
  }

}
