import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  fromDate: any;
  toDate: any;
  paymentType: string = '';
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate();
    this.getPaymentReport();
  }

  setDefaultDate() {
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getPaymentReport() {   

    const param = {
      LocationId: this.locId,
      Type: this.paymentType, // 'Cash and Check',
      FromDate: this.fromDate,
      Todate: this.toDate
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
        this.setDefaultDate();
        this.getPaymentReport();
        break;
      default:
        break;
    }  
  }

}
