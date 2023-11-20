import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

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

  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate();
    this.getAllGroupMaterial();
    this.getSubMaterialsReport();
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

    this.commonService.getSubMaterialsReport(param)
      .subscribe(data => {
        console.log('getSubMaterialsReport :: ');
        console.log(data);
        this.reportData = data.body.data;
      },
        (err: any) => {
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



  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getSubMaterialsReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getSubMaterialsReport();
        break;
      case 'mdi-download':
        console.log(this.fileDataObj);
        this.showDownload = true;
        break;
      default:
        break;
    }
  }

}

