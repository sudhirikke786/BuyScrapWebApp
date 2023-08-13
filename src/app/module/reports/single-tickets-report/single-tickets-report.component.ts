import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-single-tickets-report',
  templateUrl: './single-tickets-report.component.html',
  styleUrls: ['./single-tickets-report.component.scss']
})
export class SingleTicketsReportComponent implements OnInit {

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
  ticketNumber: any = 0;
  sellerName: string = '';
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.setDefaultDate();
    this.getSingleTicketReport();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 3);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getSingleTicketReport() {   

    const param = {
      TicketId: this.ticketNumber,
      LocationId: this.locId,
      TicketSettingsId:0,
      FromDate: this.fromDate,
      Todate: this.toDate,
      SellerName: this.sellerName
    }

    this.commonService.getSingleTicketReport(param)
      .subscribe(data => {
          console.log('getSingleTicketReport :: ');
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
        this.getSingleTicketReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getSingleTicketReport();
        break;
      default:
        break;
    }  
  }

}
