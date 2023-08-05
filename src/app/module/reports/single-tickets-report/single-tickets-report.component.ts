import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-single-tickets-report',
  templateUrl: './single-tickets-report.component.html',
  styleUrls: ['./single-tickets-report.component.scss']
})
export class SingleTicketsReportComponent implements OnInit {

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

   newButtonList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    }
  ];

  reportData: any;
  orgName: any;
  locId: any;  
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.getSingleTicketReport();
  }

  getSingleTicketReport() {   

    const param = {
      TicketId:0,
      LocationId: this.locId,
      TicketSettingsId:0,
      FromDate: '04-08-2022',
      Todate: '04-08-2023',
      SellerName: ''
    }

    this.commonService.getSingleTicketReport(param)
      .subscribe(data => {
          console.log('getSingleTicketReport :: ');
          console.log(data);
          this.reportData = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getSingleTicketReport();
        break;
      case 'mdi-refresh':
        this.getSingleTicketReport();
        break;
      default:
        break;
    }  
  }

}
