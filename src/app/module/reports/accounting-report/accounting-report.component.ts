import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';
 
@Component({
  selector: 'app-accounting-report',
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss']
})
export class AccountingReportComponent implements OnInit {
  

  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search',
      isDisable: false
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh',
      isDisable: false
    },
    // {
    //   iconcode: 'mdi-download',
    //   title: 'Download',
    //   isDisable: false
    // },
    {
      iconcode: 'mdi-file-pdf-box',
      title: 'Download PDF',
      isDisable: false
    },
    {
      iconcode: 'mdi-file-excel-box',
      title: 'Download Excel',
      isDisable: false
    },
    {
      iconcode: 'mdi-file-word-box',
      title: 'Download Word',
      isDisable: false
    },
    {
      iconcode: 'mdi-xml',
      title: 'Download XML',
      isDisable: false
      
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
  ticketNumber: any;
  sellerName: string = '';
  locationName:string='';
  fileDataObj: any;
  showDownload = false;
  containerName:string='';
  currentRole:any;
  showLoader = false;
  showLoaderReport = false;
  isReportShow = false;
  customerObj:any;
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';
  checkTabView: boolean = false;
  adminAdvertisement!:  string | null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService:HelperService,
    private commonService: CommonService,
    private authService: AuthService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.setDefaultDate();
    this.getAccountingReport();
    this.checkTabView = this.helperService.isTab();
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 7);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getAccountingReport() {
    this.showLoader =  true;
    const param = {
      FromDate: this.fromDate,
      Todate: this.toDate,
      LocID: this.locId
    }
   
    this.commonService.getAccountingReport(param)
      .subscribe(data => {
        console.log('getAccountingReport :: ');
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

  getAccountingDataReport(reportType? : string | null) {
    const param = {
      FromDate: this.fromDate,
      Todate: this.toDate,
      LocID: this.locId,
      ReportType: reportType,
      Advertising: this.adminAdvertisement
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showDownload = true;
    }

    this.commonService.getAccountingDataReport(param)
      .subscribe(data => {
        console.log('getAccountingReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = false;
        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Accounting Report"+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Accounting Report"+this.toDate, reportType);
        }
      },
        (err: any) => {
          this.showDownload =  false;

          // this.errorMsg = 'Error occured';
        }
      );
  }

  setActionsByRole() {
    const allActions = [
      { iconcode: 'mdi-magnify', title: 'Search',isDisable: false  },
      { iconcode: 'mdi-refresh', title: 'Refresh',isDisable: false  },
      { iconcode: 'mdi-file-pdf-box', title: 'PDF',isDisable: false  },
      { iconcode: 'mdi-file-excel-box', title: 'Excel',isDisable: false  },
      { iconcode: 'mdi-file-word-box', title: 'Word',isDisable: false  } ,
      {iconcode: 'mdi-xml',title:'XML',isDisable: false}
    ];
  
    const restrictedActions = ['mdi-file-pdf-box', 'mdi-file-excel-box', 'mdi-file-word-box','mdi-xml'];

    if (this.currentRole === 'Administrator') {
      this.actionList = allActions;
    } else {
      this.actionList = allActions.filter(
        action => !restrictedActions.includes(action.iconcode)
      );
    }
  }

  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
       
        this.getAccountingReport();
        break; 
      case 'mdi-refresh':
       
        this.setDefaultDate();
        this.getAccountingReport();
        break;
      // case 'mdi-download':
      //   this.getAccountingDataReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.getAccountingDataReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.getAccountingDataReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.getAccountingDataReport('Word');
        break;
        case 'mdi-xml':
          this.getAccountingDataReport('XML');
          break;
      default:
        break;
    }
  }
  openDatePicker() {
    const dateInput = document.getElementById('fromDate') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker(); 
    }
  }

  openToDatePicker() {
    const dateInput = document.getElementById('toDate') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker(); 
    }
  }
}
