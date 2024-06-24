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
    },
    {
      iconcode:'mdi-download',
      title:'Download'
    },
    
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

  showDownload = false;
  fileUrl: string = '';

  fileDataObj: any;
  showLoader = false;
  isReportShow = false;
  showLoaderReport = false;
  numberFormat: string = '1.2-2';
  currencySymbol: string = 'USD';
  
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
    let defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() - 2);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    // this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getPaymentReport() {   

    const param = {
      LocationId: this.locId,
      Type: this.paymentType.trim() != '' ? this.paymentType.trim() : 'Cash and Check',
      FromDate: this.fromDate,
      Todate: this.toDate
    }
    this.showLoader  = true;
    this.commonService.getPaymentReport(param)
      .subscribe(data => {
          console.log('getPaymentReport :: ');
          console.log(data);
          this.reportData = data.body.data[0].rows;
        },
        (err: any) => {
          this.showLoader  = false;
          // this.errorMsg = 'Error occured';
        },
        () =>{
          this.showLoader  = false;
        }
      );
  }

  generatePaymentReport() {

    this.isReportShow = true;
    this.showLoaderReport = true;

    const param = {
      LocationId: this.locId,
      Type: this.paymentType.trim() != '' ? this.paymentType.trim() : 'Cash and Check',
      FromDate: this.fromDate,
      Todate: this.toDate
    }

    this.commonService.generatePaymentReport(param)
      .subscribe(data => {
        console.log('generatePaymentReport :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;
       
      },
        (err: any) => {
          this.showLoaderReport = false;
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
        this.showDownload = false;
        this.getPaymentReport();
        break;
      case 'mdi-refresh':
        this.showDownload = false;
        this.setDefaultDate();
        this.getPaymentReport();
        break;
        case 'mdi-download':
        this.generatePaymentReport();
          break;
      default:
        break;
    }  
  }



  downloadFile(){
    // this.commonService.getFileData(`/api/files/${fileId}`).subscribe((fileData: ArrayBuffer) => {
    //   const blob = new Blob([fileData], { type: 'application/pdf' });
    //   this.fileUrl = URL.createObjectURL(blob);
    // });
  }

}
