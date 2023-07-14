import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-cashdrawer-dashboard',
  templateUrl: './cashdrawer-dashboard.component.html',
  styleUrls: ['./cashdrawer-dashboard.component.scss']
})
export class CashdrawerDashboardComponent implements OnInit {

  amvisible = false;
  pvisible =  false;
  ivisible = false;
  closevisible = false;

  orgName: any;
  locId: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
  }

  showAddModel(){
    this.amvisible = true;
  }

  showReopenRegister(){
    this.ivisible = true;
  }

  showPreetyCashModel() {
    this.pvisible =  true;
  }

  closeRegister(){
    this.closevisible = true;
  }

  hideCloseRegister(){
    this.closevisible = false;
  }




}
