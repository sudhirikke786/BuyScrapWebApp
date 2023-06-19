import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/core/interfaces/common-interfaces';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.scss']
})
export class TicketDashboardComponent implements OnInit {

  selectedTickets = [];
  orgName = localStorage.getItem('orgName');

  actionList = [{
    iconcode:'mdi-magnify',
    title:'Search'
  },
  {
    iconcode:'mdi-refresh',
    title:'Refresh'
  },
  {
    iconcode:'mdi-ticket',
    title:'New Ticket'
  },
  {
    iconcode:'mdi-merge',
    title:'Merge Ticket and Pay'
  },
  
  ]
  

  newTicketList = [{
    iconcode:'mdi-magnify',
    title:'Search'
  },
  {
    iconcode:'mdi-refresh',
    title:'Refresh'
  },
  {
    iconcode:'mdi-account',
    title:'New Customer'
  }
  
  ]

  mergeTicketlist = [{
    iconcode:'mdi-magnify',
    title:'Search'
  },
  {
    iconcode:'mdi-refresh',
    title:'Refresh'
  }
  
  ]

  ticketsTypes =  [
    {name: 'All', code: 'All'},
    {name: 'Open', code: 'Open'},
    {name: 'Partially Paid', code: 'Partially Paid'},
    {name: 'On Hold', code: 'On Hold'},
    {name: 'Paid', code: 'Paid'},
    {name: 'Voided', code: 'Voided'}
  ];
  
  tickets = [
    {
      rowId: '462',
      createdDate: '04/05/2023',
      status: 'OPEN',
      ticketAmount: '855.000',
      customerName: 'Alex Junior',
      dateClosed: '--/--/----'
    },
    {
      rowId: '463',
      createdDate: '05/05/2023',
      status: 'Partially Paid',
      ticketAmount: '955.000',
      customerName: 'Jon Jones',
      dateClosed: '--/--/----'
    },
    {
      rowId: '468',
      createdDate: '07/05/2023',
      status: 'OPEN',
      ticketAmount: '555.000',
      customerName: 'George Foreman',
      dateClosed: '--/--/----'
    },
    {
      rowId: '500',
      createdDate: '08/05/2023',
      status: 'OPEN',
      ticketAmount: '155.000',
      customerName: 'Mike Hussey',
      dateClosed: '--/--/----'
    },
    {
      rowId: '512',
      createdDate: '09/05/2023',
      status: 'Partially Paid',
      ticketAmount: '255.000',
      customerName: 'Alexander',
      dateClosed: '--/--/----'
    },
    {
      rowId: '551',
      createdDate: '10/05/2023',
      status: 'Partially Paid',
      ticketAmount: '355.000',
      customerName: 'Robert Whittaker',
      dateClosed: '--/--/----'
    },
    {
      rowId: '389',
      createdDate: '12/05/2023',
      status: 'OPEN',
      ticketAmount: '525.000',
      customerName: 'Dos Santos',
      dateClosed: '--/--/----'
    },
    {
      rowId: '402',
      createdDate: '16/05/2023',
      status: 'OPEN',
      ticketAmount: '689.000',
      customerName: 'Floyd M',
      dateClosed: '--/--/----'
    },
    {
      rowId: '408',
      createdDate: '19/05/2023',
      status: 'OPEN',
      ticketAmount: '358.000',
      customerName: 'Manny P',
      dateClosed: '--/--/----'
    },
    {
      rowId: '205',
      createdDate: '25/05/2023',
      status: 'OPEN',
      ticketAmount: '454.000',
      customerName: 'Mike Tyson',
      dateClosed: '--/--/----'
    },
    {
      rowId: '423',
      createdDate: '26/05/2023',
      status: 'OPEN',
      ticketAmount: '689.000',
      customerName: 'Floyd M',
      dateClosed: '--/--/----'
    },
    {
      rowId: '428',
      createdDate: '27/05/2023',
      status: 'OPEN',
      ticketAmount: '358.000',
      customerName: 'Manny P',
      dateClosed: '--/--/----'
    },
    {
      rowId: '439',
      createdDate: '28/05/2023',
      status: 'OPEN',
      ticketAmount: '454.000',
      customerName: 'Mike Tyson',
      dateClosed: '--/--/----'
    }
  ];

  visible: boolean = false;
  ticketvisible: boolean = false;
  organizationName: any;

  pagination: Pagination = {
    Status: 'ALL',
    PageNumber: 1,
    RowOfPage: 1000,
    LocationId: 1
  }
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.organizationName = 'prodTest';
    this.getAllTicketsDetails(this.pagination);
  }

  /**
   * Get the data by calling WebAPI to fetch the details for organization login
   */
  getAllTicketsDetails(pagination: Pagination) {
    this.commonService.getAllTicketsDetails(pagination)
      .subscribe(data => {
          console.log('getAllTicketsDetails :: ');
          console.log(data);
          this.tickets = data.body;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  showMergeDialog(){
    this.visible = true;
  }

  AddMergeDialog(){
    this.ticketvisible = true;
  }

  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-ticket':
        this.AddMergeDialog();
        break;
      case 'mdi-merge':
        this.showMergeDialog();
        break;
      default:
        break;
    }

  
  }

}
