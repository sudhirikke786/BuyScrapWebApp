import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.scss']
})
export class SettingsDashboardComponent {


  pvisible = false;
  mpVisible = false;
  cvisible =  false;
  tvisible = false;
  cameravisible = false;

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




}
