import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {

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
    this.getInventoryReport();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() - 1);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getInventoryReport() {   

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      MaterialID:0,
      SubMaterialID:0
    }

    this.commonService.getInventoryReport(param)
      .subscribe(data => {
          console.log('getInventoryReport :: ');
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
        this.getInventoryReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getInventoryReport();
        break;
      default:
        break;
    }  
  }

}
