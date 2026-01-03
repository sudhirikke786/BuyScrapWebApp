import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';
@Component({
  selector: 'app-ship-out-report',
  templateUrl: './ship-out-report.component.html',
  styleUrls: ['./ship-out-report.component.css']
})
export class ShipOutReportComponent implements OnInit {

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
  shipOutId:any;
  orgName: any;
  locId: any;
  fromDate: any;
  toDate: any;
  ticketNumber: any = '';
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
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.checkTabView = this.helperService.isTab();
    this.setDefaultDate();
    this.getShipOutReport();
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

  getShipOutReport() {

    const param = {
     
      Entername: this.sellerName,
      FromDate: this.fromDate,
      Todate: this.toDate,
      ShipOutID: this.ticketNumber || 0,
      LocationId: this.locId,
      
    }
    this.showLoader = true;
    this.commonService.getShipOutReport(param)
      .subscribe(data => {
        console.log('getShipOutReport :: ');
        console.log(data);
        this.reportData = data.body.data;
        if (this.sellerName) {
          this.reportData = this.reportData.filter((item: any) =>
            item.customerName.toLowerCase().includes(this.sellerName.toLowerCase())  
          );
        }
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

  getShipOutReportByID(reportType? : string | null) {

    const param = {
      ShipOutId: this.customerObj.rowId,
      LocationId: this.locId,
      ReportType: reportType,
      Advertising: this.adminAdvertisement
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showLoaderReport = true;
    }

    this.commonService.getShipOutReportByID(param)
      .subscribe(data => {
        console.log('getShipOutReportByID :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Shipout Report "+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Shipout Report "+this.toDate, reportType);
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
      if(item.iconcode=='mdi-download' || item.iconcode=='mdi-file-pdf-box' || item.iconcode=='mdi-file-excel-box' || item.iconcode=='mdi-file-word-box' || item.iconcode=='mdi-xml'){
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
      if(item.iconcode=='mdi-download' || item.iconcode=='mdi-file-pdf-box' || item.iconcode=='mdi-file-excel-box' || item.iconcode=='mdi-file-word-box' || item.iconcode=='mdi-xml'){
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
      {iconcode: 'mdi-xml',title:'XML',isDisable: true}
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
        this.getShipOutReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getShipOutReport();
        break;
      // case 'mdi-download':
      //   this.getShipOutReportByID();
      //   break;
      case 'mdi-file-pdf-box':
        this.getShipOutReportByID('PDF');
      break;
      case 'mdi-file-excel-box':
        this.getShipOutReportByID('Excel');
        break;
      case 'mdi-file-word-box':
        this.getShipOutReportByID('Word');
        break;
        case 'mdi-xml':
          this.getShipOutReportByID('XML');
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
