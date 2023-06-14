import { Component } from '@angular/core';

@Component({
  selector: 'app-certificates-dashboard',
  templateUrl: './certificates-dashboard.component.html',
  styleUrls: ['./certificates-dashboard.component.scss']
})
export class CertificatesDashboardComponent {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    }
  ];

  certificates = [
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

  visible = false;
  cvisible = false;
  ivisible =  false;
  showModel(){
    this.visible = true;
  }

  showCaptureModel(){
    this.visible = false;
    this.cvisible = true;
  }

  showItemViewModel() {
    this.ivisible =  true;
  }

  hideItemViewModel() {
    this.ivisible =  false;
  }



  hideCaptureModel(){
    this.cvisible = false;
  }

  hideModel(){
    this.visible = false;
  }
  
}
