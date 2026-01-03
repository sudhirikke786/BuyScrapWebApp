import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';


@Component({
  selector: 'app-advance-report-component',
  templateUrl: './advance-report-component.component.html',
  styleUrls: ['./advance-report-component.component.css']
})
export class AdvanceReportComponentComponent implements OnInit {
  checkTabView: boolean = false;
  paymentTypesList: any[] = [];
  selectedPaymentTypes: string[] = [];
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
      iconcode: 'mdi-file-delimited',
      title: 'Download CSV'
    },
    // {
    //   iconcode:'mdi-download',
    //   title:'Download'
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
  currentRole:any;
  showDownload = false;
  fileUrl: string = '';

  fileDataObj: any;
  showLoader = false;
  isReportShow = false;
  showLoaderReport = false;
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';
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
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.setDefaultDate();
    this.getPaymentReport();
    this.checkTabView = this.helperService.isTab();
   
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
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
    let selectedLabels: string[];

    if (this.selectedPaymentTypes.includes('ALL')) {
      selectedLabels = [''];  // Send blank to get all
    } else {
      selectedLabels = this.paymentTypesList
        .filter(type => this.selectedPaymentTypes.includes(type.value))
        .map(type => type.label);
    }
    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
    this.showLoader  = true;
    this.commonService.getAllAdvanceReport(param)
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

  generatePaymentReport(reportType? : string | null) {
    let selectedLabels: string[];

    if (this.selectedPaymentTypes?.length > 0) {
      selectedLabels = this.paymentTypesList
        .filter(type => this.selectedPaymentTypes.includes(type.value))
        .map(type => type.label);
    } else {
      selectedLabels = [''];
    }

    const param = {
      FromDate: this.fromDate,
      Todate: this.toDate,
      LocationId: this.locId,
      ReportType: reportType,
      Advertising: this.adminAdvertisement
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showLoaderReport = true;
    }

    this.commonService.GetAdvanceReport(param)
      .subscribe(data => {
        console.log('generatePaymentReport :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;
        
        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Advance Report "+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Advance Report "+this.toDate, reportType);
        }
       
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

  setActionsByRole() {
    const allActions = [
      { iconcode: 'mdi-magnify', title: 'Search' },
      { iconcode: 'mdi-refresh', title: 'Refresh' },
      { iconcode: 'mdi-file-pdf-box', title: 'PDF'},
      { iconcode: 'mdi-file-excel-box', title: 'Excel'},
      { iconcode: 'mdi-file-word-box', title: 'Word'},
      {iconcode: 'mdi-xml',title:'XML'}
    ];
  
    const restrictedActions = ['mdi-file-pdf-box', 'mdi-file-excel-box', 'mdi-file-word-box','mdi-file-delimited','mdi-xml'];

    if (this.currentRole === 'Administrator') {
      this.actionList = allActions;
    } else {
      this.actionList = allActions.filter(
        action => !restrictedActions.includes(action.iconcode)
      );
    }
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
      // case 'mdi-download':
      // this.generatePaymentReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.generatePaymentReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generatePaymentReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generatePaymentReport('Word');
        break;
        case 'mdi-xml':
          this.generatePaymentReport('XML');
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

