import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plan-upgrade',
  templateUrl: './plan-upgrade.component.html',
  styleUrls: ['./plan-upgrade.component.css']
})
export class PlanUpgradeComponent {

  orgName:any;

  @Input() message =  'Upgrade To plus Version Required ';


  constructor(){
    this.orgName = localStorage.getItem('orgName');
  }

}
