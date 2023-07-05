import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-certificates-dashboard',
  templateUrl: './certificates-dashboard.component.html',
  styleUrls: ['./certificates-dashboard.component.scss']
})
export class CertificatesDashboardComponent implements OnInit {

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

  certificates1 = [
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
  
  organizationName: any;
  locId: any;

  
  certificates: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.organizationName = localStorage.getItem('orgName');
    this.locId = 1;
    this.getAllCODTickets();
  }

  
  getAllCODTickets() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.commonService.getAllCODTickets(paramObject)
      .subscribe(data => {
          console.log('getAllCODTickets :: ');
          console.log(data);
          this.certificates = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

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
