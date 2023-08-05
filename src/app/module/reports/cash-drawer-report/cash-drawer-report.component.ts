import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-cash-drawer-report',
  templateUrl: './cash-drawer-report.component.html',
  styleUrls: ['./cash-drawer-report.component.scss']
})
export class CashDrawerReportComponent implements OnInit {

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
    this.getCashDrawerReport();
  }

  getCashDrawerReport() {   

    const param = {
      LocId: this.locId,
      FromDate: '04-08-2022',
      Todate: '04-08-2023'
    }

    this.commonService.getCashDrawerReport(param)
      .subscribe(data => {
          console.log('getCashDrawerReport :: ');
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
        this.getCashDrawerReport();
        break;
      case 'mdi-refresh':
        this.getCashDrawerReport();
        break;
      default:
        break;
    }  
  }

}
