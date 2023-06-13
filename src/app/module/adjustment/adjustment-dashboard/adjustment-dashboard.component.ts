import { Component } from '@angular/core';

@Component({
  selector: 'app-adjustment-dashboard',
  templateUrl: './adjustment-dashboard.component.html',
  styleUrls: ['./adjustment-dashboard.component.scss']
})
export class AdjustmentDashboardComponent {

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
      title:'Add Adjustment'
    }
  ];


  visible: boolean = false;
  bulkvisible:boolean = false;
  headerTitle: any = 'Add Adjustment';
 
   showDialog(title?:any){
     this.headerTitle = title ?? this.headerTitle;
     this.visible = true;
   }
   showBulkDialog(){
     this.bulkvisible = true;
   }
 
   getAction(actionCode:any){
 
     switch (actionCode?.iconcode) {
       case 'mdi-plus':
         this.showDialog('Add Adjustment');
         break;
       case 'mdi-currency-usd':
        this.showBulkDialog();
         break;
       default:
         break;
     }

   }
 
}
