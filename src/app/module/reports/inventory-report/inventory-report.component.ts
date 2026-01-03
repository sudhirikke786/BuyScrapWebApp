import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {
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
  materialList: any;
  subMaterialList: any;
  defaultSelectedMaterial: any = 0;
  defaultSelectedSubMaterial: any = 0;
  fileDataObj: any;
  showDownload = false;
  showLoader = false;
  isReportShow = false;
  showLoaderReport = false;
  numberFormat: string = '1.3-3';
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
    this.getAllGroupMaterial();
    this.checkTabView = this.helperService.isTab();
    this.getInventoryReport();
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
  }

  setDefaultDate() {
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  
  getInventoryReport() {

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      MaterialID: this.defaultSelectedMaterial,
      SubMaterialID: this.defaultSelectedSubMaterial
    }
    this.showLoader = true;
    this.commonService.getInventoryReport(param)
      .subscribe(data => {
        console.log('getInventoryReport :: ');
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

  generateInventoryReport(reportType? : string | null) {

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      MaterialID: this.defaultSelectedMaterial,
      SubMaterialID: this.defaultSelectedSubMaterial,
      ReportType: reportType,
      Advertising: this.adminAdvertisement
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showLoaderReport = true;
    }

    this.commonService.generateInventoryReport(param)
      .subscribe(data => {
        console.log('generateInventoryReport :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;
        // if(this.checkTabView) {
        //   this.helperService.downloadBase64Pdf(this.fileDataObj,"Payment Report")
        // }

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Inventory Report "+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Inventory Report "+this.toDate, reportType);
        }
       
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  getAllGroupMaterial() {
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.getAllGroupMaterial(paramObject)
      .subscribe(data => {
        console.log('getAllGroupMaterial :: ');
        console.log(data);
        this.materialList = data.body.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  onMaterialChange(value: any) {
    if (this.defaultSelectedMaterial == 0) {
      this.defaultSelectedSubMaterial = 0;
      this.subMaterialList = null;
    } else {
      const selectedMaterialId = this.defaultSelectedMaterial;
      this.getSubMaterials(selectedMaterialId);
    }
    this.getInventoryReport();
  }

  getSubMaterials(materialId: any) {

    const paramObject = {
      MaterialID: materialId,
      LocationId: this.locId
    };
    this.showLoader = true;
    this.commonService.getAllSubMaterials(paramObject)
      .subscribe(data => {
        console.log('getAllSubMaterials :: ');
        console.log(data);
        this.subMaterialList = data.body.data;
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

  setActionsByRole() {
    const allActions = [
      { iconcode: 'mdi-magnify', title: 'Search' },
      { iconcode: 'mdi-refresh', title: 'Refresh' },
      { iconcode: 'mdi-file-pdf-box', title: 'PDF'},
      { iconcode: 'mdi-file-excel-box', title: 'Excel'},
      { iconcode: 'mdi-file-word-box', title: 'Word'} ,
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
        this.getInventoryReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getInventoryReport();
        break;
      // case 'mdi-download':
      //   this.generateInventoryReport();      
      //   break;
      case 'mdi-file-pdf-box':
        this.generateInventoryReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generateInventoryReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generateInventoryReport('Word');
        break;
        case 'mdi-xml':
          this.generateInventoryReport('XML');
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
