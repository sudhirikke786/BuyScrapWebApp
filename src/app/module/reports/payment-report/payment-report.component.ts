import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

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
    this.getPaymentReport();
  }

  getPaymentReport() {   

    const param = {
      LocationId: this.locId,
      Type:'Cash and Check',
      FromDate: '04-08-2022',
      Todate: '04-08-2023'
    }

    this.commonService.getPaymentReport(param)
      .subscribe(data => {
          console.log('getPaymentReport :: ');
          console.log(data);
          this.reportData = data.body.data[0].rows;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  typeOf(value: any) {
    return typeof value;
  }

  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getPaymentReport();
        break;
      case 'mdi-refresh':
        this.getPaymentReport();
        break;
      default:
        break;
    }  
  }

}
