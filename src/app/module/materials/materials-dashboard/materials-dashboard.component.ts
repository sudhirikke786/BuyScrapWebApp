import { Component } from '@angular/core';

@Component({
  selector: 'app-materials-dashboard',
  templateUrl: './materials-dashboard.component.html',
  styleUrls: ['./materials-dashboard.component.scss']
})
export class MaterialsDashboardComponent {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode:'mdi-plus',
      title:'Add Materials'
    },
    {
      iconcode:'mdi-currency-usd',
      title:'Quick Price Update'
    }
  ];

  visible: boolean = false;
 bulkvisible:boolean = false;

  showDialog(){
    this.visible = true;
  }
  showBulkDialog(){
    this.bulkvisible = true;
  }

  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.showDialog();
        break;
      case 'mdi-currency-usd':
       this.showBulkDialog();
        break;
      default:
        break;
    }

  
  }


}
