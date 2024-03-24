import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-reports-dashboard',
  templateUrl: './reports-dashboard.component.html',
  styleUrls: ['./reports-dashboard.component.scss']
})
export class ReportsDashboardComponent implements OnInit {
  
  orgName: any;
  locId: any;
  subScriptionType: any;
  showPlan = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    
      public dtService:DataService,
 
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.subScriptionType = this.dtService.getActivePlan();

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
  }

}
