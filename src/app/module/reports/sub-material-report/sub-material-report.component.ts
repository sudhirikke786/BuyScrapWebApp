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
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
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
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.setDefaultDate();
    this.getSubMaterialsReport();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() - 1);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getSubMaterialsReport() {   

    const param = {
      SubMaterialId: 0,
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


  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getSubMaterialsReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getSubMaterialsReport();
        break;
      default:
        break;
    }  
  }

}

