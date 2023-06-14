import { Component } from '@angular/core';

@Component({
  selector: 'app-cashdrawer-dashboard',
  templateUrl: './cashdrawer-dashboard.component.html',
  styleUrls: ['./cashdrawer-dashboard.component.scss']
})
export class CashdrawerDashboardComponent {

  amvisible = false;
  pvisible =  false;
  ivisible = false;
  closevisible = false;

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
