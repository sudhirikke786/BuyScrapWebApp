import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-material-report',
  templateUrl: './material-report.component.html',
  styleUrls: ['./material-report.component.scss']
})
export class MaterialReportComponent implements OnInit {

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
    this.getMaterialReport();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() - 1);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getMaterialReport() {   

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }

    this.commonService.getMaterialReport(param)
      .subscribe(data => {
          console.log('getMaterialReport :: ');
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
        this.getMaterialReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getMaterialReport();
        break;
      default:
        break;
    }  
  }

}

