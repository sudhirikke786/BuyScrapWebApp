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

  selectedTickets: any;

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

  
  defaultSelectedTicketsTypes =  [
    {name: 'Open', code: 'Open'}
  ];
  
  tickets: any;

  visible: boolean = false;
  ticketvisible: boolean = false;
  orgName: any;
  locId: any;

  pagination: any = {
    SerachText: '',
    SearchOrder: 'TicketId',
    Status: 'ALL',
    PageNumber: 1,
    RowOfPage: 100,
    LocationId: 1
  }
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.selectedTickets = this.defaultSelectedTicketsTypes;
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
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
          this.tickets = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  showMergeDialog(){
    this.ticketvisible = true;
  }

  AddMergeDialog(){
    this.visible = true;
  }

  searchTickets() {
    console.log('selectedTickets :: ' + JSON.stringify(this.selectedTickets));
    let selectedStatus = '';
    this.selectedTickets.forEach(function(item: any) {
      selectedStatus += item.name + ',';
    });
    selectedStatus = selectedStatus.substring(0,selectedStatus.length-1);
    this.pagination.Status = selectedStatus;
    this.getAllTicketsDetails(this.pagination);
  }

  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchTickets();
        break;
      case 'mdi-refresh':
        this.showMergeDialog();
        break;
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
