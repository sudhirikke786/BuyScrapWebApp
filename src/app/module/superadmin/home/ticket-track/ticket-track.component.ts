import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/core/services/helper.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-ticket-track',
  templateUrl: './ticket-track.component.html',
  styleUrls: ['./ticket-track.component.css']
})
export class TicketTrackComponent implements OnInit{
  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    { iconcode: 'mdi-arrow-left', 
    title: 'Back' }, 
		

  ];

  orgName: any;
  locId: any;
  fromDate: any;
  toDate: any;  
  reportData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private helperService: HelperService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    const today = new Date();
    this.fromDate = this.formatDate(today);
    this.toDate = this.formatDate(today);
  
  }
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];  
  }
  getDailyTicketsReport() {   

    const param = {
      LocationId: 0,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
    this.commonService.getDailyTicketsReport(param)
      .subscribe(data => {
          console.log('getDailyTicketsReport :: ');
          console.log(data);
          this.reportData = data.body.data;
        }
      );
  }

  
  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getDailyTicketsReport();
        break;
      case 'mdi-refresh':
        const today = new Date();
        this.fromDate = this.formatDate(today);
        this.toDate = this.formatDate(today);
        this.getDailyTicketsReport();
        break;
       
      default:
        break;
    }  
  }
  back(){
    console.log('Back clicked');
    this.router.navigate(['/superadmin/home/superadmin-loc']); 
  }

}
