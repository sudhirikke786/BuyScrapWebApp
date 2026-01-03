import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-void-ticket-report',
  templateUrl: './void-ticket-report.component.html',
  styleUrls: ['./void-ticket-report.component.scss']
})
export class VoidTicketReportComponent implements OnInit {

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
  showLoader =  false;
  showLoaderReport = false;
  isReportShow = false;
  checkTabView: boolean = false;
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
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.setDefaultDate();
    this.getVoidTicketReport();
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

  getVoidTicketReport() {

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }

    this.showLoader =  true;

    this.commonService.getVoidTicketReport(param)
      .subscribe(data => {
        console.log('getVoidTicketReport :: ');
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

  generateVoidTicketReport(reportType? : string | null) {
    
    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      ReportType: reportType,
      Advertising: this.adminAdvertisement
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showLoaderReport  = true;
    } 

    this.commonService.generateVoidTicketReport(param)
      .subscribe(data => {
        console.log('generateVoidTicketReport :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Void Ticket Report "+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Void Ticket Report "+this.toDate, reportType);
        }
       
      },
        (err: any) => {
          this.showLoaderReport = false;
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
        this.getVoidTicketReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getVoidTicketReport();
        break;
      // case 'mdi-download':
      //   this.generateVoidTicketReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.generateVoidTicketReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generateVoidTicketReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generateVoidTicketReport('Word');
        break;
        case 'mdi-xml':
          this.generateVoidTicketReport('XML');
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
