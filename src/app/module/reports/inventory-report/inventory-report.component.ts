import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
    {
      iconcode: 'mdi-download',
      title: 'Download'
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

  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService:HelperService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate();
    this.getAllGroupMaterial();
    this.checkTabView = this.helperService.isTab();
    this.getInventoryReport();
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

  generateInventoryReport() {

    this.isReportShow = true;
    this.showLoaderReport = true;

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      MaterialID: this.defaultSelectedMaterial,
      SubMaterialID: this.defaultSelectedSubMaterial
    }

    this.commonService.generateInventoryReport(param)
      .subscribe(data => {
        console.log('generateInventoryReport :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Payment Report")
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


  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getInventoryReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getInventoryReport();
        break;
      case 'mdi-download':
        this.generateInventoryReport();      
        break;
      default:
        break;
    }
  }

}
