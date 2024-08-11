import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.scss']
})
export class SettingsDashboardComponent implements OnInit {

  pvisible = false;
  mpVisible = false;
  cvisible =  false;
  tvisible = false;
  cameravisible = false;

  orgName: any;
  locId: any;
  systemprefVisible = false;
  currentRole:any;
  userprefVisible = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.currentRole = this.authService.userCurrentRole();

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.cameravisible = false;
  }

  hidePSettingsmodel(){
    this.pvisible = false
  }

  showPSettingsmodel() {
    this.pvisible = true;
  }


  showMpVisible() {
    this.mpVisible = true;
  }
  
  hideMpVisible(){
    this.mpVisible = false;
  }
  cashierModel(){
    this.cvisible = true;
  }

  hideModel(){
    this.cvisible = false;
  }

  tiketModel(){
    this.tvisible = true;
  }

  hidetiketModel(){
    this.tvisible = false;
  }

  scrapModel(){
      this.cameravisible =  true;
  }

  hidescrapModel(){
      this.cameravisible = false;
  }



  showSytemPerf(){
    this.systemprefVisible = true;
  }

  hideSytemPerf(){
    this.systemprefVisible = false;
  }

  showUserPerf(){
    this.userprefVisible = true;
  }

  hideUserPerf(){
    this.userprefVisible = false;
  }


  




}
