import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-adjustment-dashboard',
  templateUrl: './adjustment-dashboard.component.html',
  styleUrls: ['./adjustment-dashboard.component.scss']
})
export class AdjustmentDashboardComponent implements OnInit {

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

  orgName: any;
  locId: any;
  materialList: any;
  subMaterialList: any;
  mainMaterialsVisible = true;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.GetAllAdjustmentType();
  }

  GetAllAdjustmentType() {
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.GetAllAdjustmentType(paramObject)
      .subscribe(data => {
          console.log('GetAllAdjustmentType :: ');
          console.log(data);
          this.materialList = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }
  
  editMainMaterial(materialId?: any){
    // alert(materialId);
  }
 
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
