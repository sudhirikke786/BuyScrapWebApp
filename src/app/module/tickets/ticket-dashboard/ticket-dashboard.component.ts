import { Component } from '@angular/core';

@Component({
  selector: 'app-ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.scss']
})
export class TicketDashboardComponent {

  selectedTickets = [];
  orgName = 'abc';

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
      id: '462',
      dateCreated: '04/05/2023',
      status: 'OPEN',
      ticketAmount: '855.000',
      seller: 'Alex Junior',
      dateClosed: '--/--/----'
    },
    {
      id: '463',
      dateCreated: '05/05/2023',
      status: 'Partially Paid',
      ticketAmount: '955.000',
      seller: 'Jon Jones',
      dateClosed: '--/--/----'
    },
    {
      id: '468',
      dateCreated: '07/05/2023',
      status: 'OPEN',
      ticketAmount: '555.000',
      seller: 'George Foreman',
      dateClosed: '--/--/----'
    },
    {
      id: '500',
      dateCreated: '08/05/2023',
      status: 'OPEN',
      ticketAmount: '155.000',
      seller: 'Mike Hussey',
      dateClosed: '--/--/----'
    },
    {
      id: '512',
      dateCreated: '09/05/2023',
      status: 'Partially Paid',
      ticketAmount: '255.000',
      seller: 'Alexander',
      dateClosed: '--/--/----'
    },
    {
      id: '551',
      dateCreated: '10/05/2023',
      status: 'Partially Paid',
      ticketAmount: '355.000',
      seller: 'Robert Whittaker',
      dateClosed: '--/--/----'
    },
    {
      id: '389',
      dateCreated: '12/05/2023',
      status: 'OPEN',
      ticketAmount: '525.000',
      seller: 'Dos Santos',
      dateClosed: '--/--/----'
    },
    {
      id: '402',
      dateCreated: '16/05/2023',
      status: 'OPEN',
      ticketAmount: '689.000',
      seller: 'Floyd M',
      dateClosed: '--/--/----'
    },
    {
      id: '408',
      dateCreated: '19/05/2023',
      status: 'OPEN',
      ticketAmount: '358.000',
      seller: 'Manny P',
      dateClosed: '--/--/----'
    },
    {
      id: '205',
      dateCreated: '25/05/2023',
      status: 'OPEN',
      ticketAmount: '454.000',
      seller: 'Mike Tyson',
      dateClosed: '--/--/----'
    },
    {
      id: '423',
      dateCreated: '26/05/2023',
      status: 'OPEN',
      ticketAmount: '689.000',
      seller: 'Floyd M',
      dateClosed: '--/--/----'
    },
    {
      id: '428',
      dateCreated: '27/05/2023',
      status: 'OPEN',
      ticketAmount: '358.000',
      seller: 'Manny P',
      dateClosed: '--/--/----'
    },
    {
      id: '439',
      dateCreated: '28/05/2023',
      status: 'OPEN',
      ticketAmount: '454.000',
      seller: 'Mike Tyson',
      dateClosed: '--/--/----'
    }
  ];

  visible: boolean = false;
  ticketvisible: boolean = false;


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
