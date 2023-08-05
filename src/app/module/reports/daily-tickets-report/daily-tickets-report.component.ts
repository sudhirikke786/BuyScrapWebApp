import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-daily-tickets-report',
  templateUrl: './daily-tickets-report.component.html',
  styleUrls: ['./daily-tickets-report.component.scss']
})
export class DailyTicketsReportComponent implements OnInit {

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
    this.getDailyTicketsReport();
  }

  getDailyTicketsReport() {   

    const param = {
      LocationId: this.locId,
      FromDate: '04-08-2022',
      Todate: '04-08-2023'
    }

    this.commonService.getDailyTicketsReport(param)
      .subscribe(data => {
          console.log('getDailyTicketsReport :: ');
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
        this.getDailyTicketsReport();
        break;
      case 'mdi-refresh':
        this.getDailyTicketsReport();
        break;
      default:
        break;
    }  
  }

}

