import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-material-report',
  templateUrl: './material-report.component.html',
  styleUrls: ['./material-report.component.scss']
})
export class MaterialReportComponent implements OnInit {

  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search'
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh'
    },
    {
      iconcode: 'mdi-download',
      title: 'Download'
    }
  ];

  newButtonList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search'
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh'
    }
  ];

  reportData: any;
  orgName: any;
  locId: any;
  fromDate: any;
  toDate: any;
  fileDataObj: any;
  showDownload = false;
  showLoader = false;
  isReportShow = false;
  numberFormat: string = '1.2-2';
  currencySymbol: string = 'USD';
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.setDefaultDate();
    this.getMaterialReport();
  }

  setDefaultDate() {
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getMaterialReport() {
    this.showLoader =  true;
    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }

    this.commonService.getMaterialReport(param)
      .subscribe(data => {
        console.log('getMaterialReport :: ');
        console.log(data);
        this.reportData = data.body.data;
      },
        (err: any) => {
          this.showLoader =  false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.showLoader =  false;
        }
      );
  }

  generateMaterialReport() {
   this.isReportShow = true;
    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
    this.showDownload =  true;
    this.commonService.generateMaterialReport(param)
      .subscribe(data => {
        console.log('generateMaterialReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = false;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.showDownload =  false
        },
        () => {
          this.showDownload =  false
        }
      );
  }


  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getMaterialReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getMaterialReport();
        break;
      case 'mdi-download':
        this.generateMaterialReport();
        break;
      default:
        break;
    }
  }

}

