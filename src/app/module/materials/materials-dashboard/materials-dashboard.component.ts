import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-materials-dashboard',
  templateUrl: './materials-dashboard.component.html',
  styleUrls: ['./materials-dashboard.component.scss']
})
export class MaterialsDashboardComponent implements OnInit {

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
    this.getAllGroupMaterial();
  }

  getAllGroupMaterial() {
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.getAllGroupMaterial(paramObject)
      .subscribe(data => {
          console.log('getAllGroupMaterial :: ');
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

  showDialog(materialId?: any){
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
