import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sub-material-report',
  templateUrl: './sub-material-report.component.html',
  styleUrls: ['./sub-material-report.component.scss']
})
export class SubMaterialReportComponent implements OnInit {

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
  materialList: any;
  subMaterialList: any;
  defaultSelectedMaterial: any = 0;
  defaultSelectedSubMaterial: any = 0;
  fileDataObj: any;
  showDownload = false;
  showLoader  = false;
  isReportShow = false;
  showLoaderReport = false;
  checkTabView: boolean = false;
  numberFormat: string = '1.3-3';
  currentRole:any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService:HelperService,
    private commonService: CommonService,
    private authService: AuthService,
  private messageService: MessageService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate();
    this.getAllGroupMaterial();
    this.checkTabView = this.helperService.isTab();
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
   // this.getSubMaterialsReport();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 3);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getSubMaterialsReport() {
    const param = {
      SubMaterialId: this.defaultSelectedSubMaterial,
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
   
    this.showLoader  = true; 
    this.commonService.getSubMaterialsReport(param)
      .subscribe(data => {
        console.log('getSubMaterialsReport :: ');
        console.log(data);
        this.showLoader  = false; 
        this.reportData = data.body.data;
      },
        (err: any) => {
          this.showLoader  = false; 
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.showLoader  = false; 
        }
      );
  }

  generateSubMaterialsReport(reportType? : string | null) {

    if (this.defaultSelectedSubMaterial <= 0) {
      // alert("Please select Sub material to generate report !!!")
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Sub material to generate report !!!' });
      return;
    }

    const param = {
      SubMaterialId: this.defaultSelectedSubMaterial,
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      ReportType: reportType
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showLoaderReport  = true;
    } 

    this.commonService.generateSubMaterialsReport(param)
      .subscribe(data => {
        console.log('generateSubMaterialsReport :: ');
        console.log(data);
        this.showLoaderReport  = false; 
        this.fileDataObj = data.body.data;

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Materials Report "+this.toDate);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Materials Report "+this.toDate, reportType);
        }
       
      },
        (err: any) => {
          this.showLoaderReport  = false; 
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
    if (value.target.value == 0) {
      this.defaultSelectedSubMaterial = 0;
      this.subMaterialList = null;
    } else {
      const selectedMaterialId = value.target.value;
      this.getSubMaterials(selectedMaterialId);
    }
  }

  getSubMaterials(materialId: any) {

    const paramObject = {
      MaterialID: materialId,
      LocationId: this.locId
    };
    this.commonService.getAllSubMaterials(paramObject)
      .subscribe(data => {
        console.log('getAllSubMaterials :: ');
        console.log(data);
        this.subMaterialList = data.body.data;
      },
        (err: any) => {
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
        this.getSubMaterialsReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getSubMaterialsReport();
        break;
      // case 'mdi-download':
      //   this.generateSubMaterialsReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.generateSubMaterialsReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generateSubMaterialsReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generateSubMaterialsReport('Word');
        break;
        case 'mdi-xml':
          this.generateSubMaterialsReport('XML');
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

