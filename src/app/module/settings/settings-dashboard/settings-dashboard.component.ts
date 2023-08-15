import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
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
      this.cameravisible = true;
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




}
