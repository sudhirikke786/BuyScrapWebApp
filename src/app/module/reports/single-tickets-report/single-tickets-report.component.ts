import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-single-tickets-report',
  templateUrl: './single-tickets-report.component.html',
  styleUrls: ['./single-tickets-report.component.scss']
})
export class SingleTicketsReportComponent implements OnInit {

  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search',
      isDisable:false,
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh',
      isDisable:false,
    },
    // {
    //   iconcode: 'mdi-download',
    //   title: 'Download',
    //   isDisable:true,
    // }
    {
      iconcode: 'mdi-file-pdf-box',
      title: 'Download PDF',
      isDisable: true
    },
    {
      iconcode: 'mdi-file-excel-box',
      title: 'Download Excel',
      isDisable: true
    },
    {
      iconcode: 'mdi-file-word-box',
      title: 'Download Word',
      isDisable: true
    },
    {
      iconcode: 'mdi-xml',
      title: 'Download XML',
      isDisable: true
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
  fileDataObj: any;
  showDownload = false;
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
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.checkTabView = this.helperService.isTab();
    this.setDefaultDate();
    this.getSingleTicketReport();
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 3);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getSingleTicketReport() {

    const param = {
      TicketId: this.ticketNumber || 0,
      LocationId: this.locId,
      TicketSettingsId: 0,
      FromDate: this.fromDate,
      Todate: this.toDate,
      SellerName: this.sellerName
    }
    this.showLoader = true;
    this.commonService.getSingleTicketReport(param)
      .subscribe(data => {
        console.log('getSingleTicketReport :: ');
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

  generateSingleTicketReport(reportType? : string | null) {

    const param = {
      TicketId:this.customerObj.rowId,
      LocationId: this.locId,
      Type: 'A4Size',
      ReportType: reportType,
      Advertising: this.adminAdvertisement
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showLoaderReport = true;
    }

    this.commonService.generateSingleTicketReport(param, this.customerObj.isParent)
      .subscribe(data => {
        console.log('generateSingleTicketReport :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"SingleTicket Report "+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"SingleTicket Report "+this.toDate, reportType);
        }

       
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }




  onRowSelect(event: any) {
    // Handle row selection
    this.customerObj = event?.data;
    console.log('Selected Row:', event?.data);
    this.actionList =  this.actionList.map((item) => {
      if(item.iconcode=='mdi-download' || item.iconcode=='mdi-file-pdf-box' || item.iconcode=='mdi-file-excel-box' || item.iconcode=='mdi-file-word-box' || item.iconcode == 'mdi-xml'){
        item.isDisable = false;
      }
      return item
    })
  }
  onRowUnselect(event: any) {
    // Handle row selection
    //this.customerObj = event?.data;
    console.log('Selected Row:', event?.data);
    this.actionList =  this.actionList.map((item) => {
      if(item.iconcode=='mdi-download' || item.iconcode=='mdi-file-pdf-box' || item.iconcode=='mdi-file-excel-box' || item.iconcode=='mdi-file-word-box' || item.iconcode == 'mdi-xml'){
        item.isDisable = true;
      }
      return item
    })
  }

  setActionsByRole() {
    const allActions = [
      { iconcode: 'mdi-magnify', title: 'Search',isDisable: false  },
      { iconcode: 'mdi-refresh', title: 'Refresh',isDisable: false  },
      { iconcode: 'mdi-file-pdf-box', title: 'PDF',isDisable: true  },
      { iconcode: 'mdi-file-excel-box', title: 'Excel',isDisable: true  },
      { iconcode: 'mdi-file-word-box', title: 'Word',isDisable: true  },
      {iconcode: 'mdi-xml',title:'XML',isDisable:true}
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
        this.getSingleTicketReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getSingleTicketReport();
        break;
      // case 'mdi-download':
      //   this.generateSingleTicketReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.generateSingleTicketReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generateSingleTicketReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generateSingleTicketReport('Word');
        break;
        case 'mdi-xml':
          this.generateSingleTicketReport('XML');
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
