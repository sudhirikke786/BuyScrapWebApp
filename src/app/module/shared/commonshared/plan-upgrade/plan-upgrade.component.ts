import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plan-upgrade',
  templateUrl: './plan-upgrade.component.html',
  styleUrls: ['./plan-upgrade.component.css']
})
export class PlanUpgradeComponent {

  @Input() message =  'Upgrade To plus Version Required ';

}
