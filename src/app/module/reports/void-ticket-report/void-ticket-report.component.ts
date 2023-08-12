import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-void-ticket-report',
  templateUrl: './void-ticket-report.component.html',
  styleUrls: ['./void-ticket-report.component.scss']
})
export class VoidTicketReportComponent implements OnInit {

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
    this.getVoidTicketReport();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() - 1);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getVoidTicketReport() {   

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }

    this.commonService.getVoidTicketReport(param)
      .subscribe(data => {
          console.log('getVoidTicketReport :: ');
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
        this.getVoidTicketReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getVoidTicketReport();
        break;
      default:
        break;
    }  
  }

}
