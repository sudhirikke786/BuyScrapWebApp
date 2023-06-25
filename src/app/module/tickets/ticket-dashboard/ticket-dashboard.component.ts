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
  
  tickets: any;

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
