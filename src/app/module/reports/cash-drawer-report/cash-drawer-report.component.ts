import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';
  import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-cash-drawer-report',
  templateUrl: './cash-drawer-report.component.html',
  styleUrls: ['./cash-drawer-report.component.scss']
})
export class CashDrawerReportComponent implements OnInit {
  checkTabView: boolean = false;
  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search'
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh'
    },
    // {
    //   iconcode: 'mdi-download',
    //   title: 'Download'
    // },
    {
      iconcode: 'mdi-file-pdf-box',
      title: 'Download PDF'
    },
    {
      iconcode: 'mdi-file-excel-box',
      title: 'Download Excel'
    },
    {
      iconcode: 'mdi-file-word-box',
      title: 'Download Word'
    },
    {
      iconcode: 'mdi-xml',
      title: 'Download XML'
      
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
  currentRole:any;
  adminAdvertisement!:  string | null;
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';
  activeDrawerId: number | null = null;
  selectedCashDrawer: any = null; 
  cashDrawersList: any[] = [];
  MultiCashDrawerEnabled: boolean = false;



  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService: HelperService,
    private commonService: CommonService,
    private authService: AuthService,
    private stroarge:StorageService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {

      const MultiCashDrawerEnabled = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'ismulticashdrawersupport');
      this.MultiCashDrawerEnabled = String(MultiCashDrawerEnabled?.values).toLowerCase() === 'true';
    }
    const drawerJson = localStorage.getItem('selectedCashDrawer');
      if (drawerJson) {
        this.selectedCashDrawer = JSON.parse(drawerJson);
      }
    this.activeDrawerId = localStorage.getItem('selectedCashDrawerId') 
      ? parseInt(localStorage.getItem('selectedCashDrawerId')!, 10) 
      : (this.selectedCashDrawer ? this.selectedCashDrawer.drawerID : 1);

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.setDefaultDate();
    this.getCashDrawerReport();
    this.checkTabView = this.helperService.isTab();
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
    this.GetCashDrawers();
  }

  setDefaultDate() {
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  
  getCashDrawerReport() {
   
    const param:any = {
      LocId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      //CashDrawerID: this.activeDrawerId
    }
    if (this.activeDrawerId !== null) {
      param.CashDrawerID = this.activeDrawerId;
    }
    this.showLoader = true;
    this.commonService.getCashDrawerReport(param)
      .subscribe(data => {
       
        console.log('getCashDrawerReport :: ');
        console.log(data);
        this.reportData = data.body.data;
      },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.showLoader = false;
        }
      );
  }

  GetCashDrawers() {
    const paramObj = {
      LocationId: this.locId
    };
    this.commonService.GetAllCashDrawers(paramObj).subscribe({
      next: (res: any) => {
        this.cashDrawersList = res?.body?.data || [];
      },
      error: (err: any) => {
        console.error('Error fetching cash drawers:', err);
        
      }
    });
  }
  
// Old Report
  // generateCashDrawerReport(reportType? : string | null) {
  //   const param : any= {
  //     LocId: this.locId,
  //     FromDate: this.fromDate,
  //     Todate: this.toDate,
  //     ReportType: reportType,
  //     Advertising: this.adminAdvertisement,
  //     //CashDrawerID: this.activeDrawerId
  //   }
  //   if (this.activeDrawerId !== null) {
  //     param.CashDrawerID = this.activeDrawerId;
  //   }

  //   if ((reportType && reportType == 'PDF') || !reportType) {
  //     this.isReportShow = true;
  //     this.showDownload = true;
  //   }

  //   this.commonService.generateCashDrawerReport(param)
  //     .subscribe(data => {
  //       console.log('generateCashDrawerReport :: ');
  //       console.log(data);
  //       this.fileDataObj = data.body.data;
  //       this.showDownload = false;

  //       if(this.checkTabView && !reportType) {
  //         this.helperService.downloadBase64Pdf(this.fileDataObj,"Cash Drawer Report"+this.toDate);
  //       } else if (reportType && reportType != 'PDF') {
  //         this.helperService.downloadBase64Report(this.fileDataObj,"Cash Drawer Report"+this.toDate, reportType);
  //       }

  //     },
  //       (err: any) => {
  //         this.showDownload = false;
  //         // this.errorMsg = 'Error occured';
  //       }
  //     );
  // }

//New Report
  generateCashDrawerReport(reportType? : string | null) {
    debugger;
    const param : any= {
      LocId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      ReportType: reportType,
      Advertising: this.adminAdvertisement,
      CashDrawerID: this.activeDrawerId
    }
    if (this.activeDrawerId !== null) {
      param.CashDrawerID = this.activeDrawerId;
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showDownload = true;
    }

    this.commonService.GetCashDrawerCombinedReportData(param)
      .subscribe(data => {
        console.log('generateCashDrawerReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = false;

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Cash Drawer Report"+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Cash Drawer Report"+this.toDate, reportType);
        }

      },
        (err: any) => {
          this.showDownload = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }


  setActionsByRole() {
    const allActions = [
      { iconcode: 'mdi-magnify', title: 'Search' },
      { iconcode: 'mdi-refresh', title: 'Refresh' },
      { iconcode: 'mdi-file-pdf-box', title: 'PDF'},
      { iconcode: 'mdi-file-excel-box', title: 'Excel'},
      { iconcode: 'mdi-file-word-box', title: 'Word'},
      {iconcode: 'mdi-xml',title:'XML'}
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
        this.getCashDrawerReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getCashDrawerReport();
        break;
      // case 'mdi-download':
      //   this.generateCashDrawerReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.generateCashDrawerReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generateCashDrawerReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generateCashDrawerReport('Word');
        break;
        case 'mdi-xml':
          this.generateCashDrawerReport('XML');
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
