import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-container-tracking',
  templateUrl: './container-tracking.component.html',
  styleUrls: ['./container-tracking.component.scss']
})
export class ContainerTrackingComponent implements OnInit{
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
    this.checkTabView = this.helperService.isTab();
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.getAllContainerLocation();
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
  }


  getAllContainerLocation(){
    this.showLoader = true;
    console.log("Container Number:", this.containerName); 
    const param ={
      containerName: this.containerName
    }
    this.commonService.getContainerTrackingReport(param)
      .subscribe(data => {
        console.log('getContainerTrackingReport :: ');
        console.log(data);
        this.reportData = data.body.data;
        if (this.reportData.length > 0) {
          this.actionList =  this.actionList.map((item) => {
            if(item.iconcode=='mdi-download' || item.iconcode=='mdi-file-pdf-box' || item.iconcode=='mdi-file-excel-box' || item.iconcode=='mdi-file-word-box' || item.iconcode=='mdi-xml'){
              item.isDisable = false;
            }
            return item
          })
        }
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


  generateContainerTrackingReport(reportType? : string | null) {
    const param = {
      ContainerName : this.containerName,
      ReportType: reportType,
      Advertising: this.adminAdvertisement
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showDownload = true;
    }

    this.commonService.generateContainerTrackingReport(param)
      .subscribe(data => {
        console.log('generateContainerTrackingReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = false;

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Container Tracking Report"+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Container Tracking Report"+this.toDate, reportType);
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
      { iconcode: 'mdi-magnify', title: 'Search',isDisable: false  },
      { iconcode: 'mdi-refresh', title: 'Refresh',isDisable: false  },
      { iconcode: 'mdi-file-pdf-box', title: 'PDF',isDisable: true  },
      { iconcode: 'mdi-file-excel-box', title: 'Excel',isDisable: true  },
      { iconcode: 'mdi-file-word-box', title: 'Word',isDisable: true  }
      ,
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
        this.getAllContainerLocation();
        break;
      case 'mdi-refresh':
        this.containerName = '';
        this.getAllContainerLocation();
        break;
      // case 'mdi-download':
      //  this.generateContainerTrackingReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.generateContainerTrackingReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generateContainerTrackingReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generateContainerTrackingReport('Word');
        break;
        case 'mdi-xml':
          this.generateContainerTrackingReport('XML');
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


