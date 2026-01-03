import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-material-report',
  templateUrl: './material-report.component.html',
  styleUrls: ['./material-report.component.scss']
})
export class MaterialReportComponent implements OnInit {
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
    // }
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
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';
  currentRole:any;
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
    this.checkTabView = this.helperService.isTab();

    this.getMaterialReport();
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
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

  generateMaterialReport(reportType? : string | null) {

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      ReportType: reportType,
      Advertising: this.adminAdvertisement
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showDownload = true;
    }
    
    this.commonService.generateMaterialReport(param)
      .subscribe(data => {
        console.log('generateMaterialReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = false;

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Material Report "+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Material Report "+this.toDate, reportType);
        }

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
        this.getMaterialReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getMaterialReport();
        break;
      // case 'mdi-download':
      //   this.generateMaterialReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.generateMaterialReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generateMaterialReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generateMaterialReport('Word');
        break;
        case 'mdi-xml':
          this.generateMaterialReport('XML');
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

