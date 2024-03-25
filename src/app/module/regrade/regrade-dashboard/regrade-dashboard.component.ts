import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-regrade-dashboard',
  templateUrl: './regrade-dashboard.component.html',
  styleUrls: ['./regrade-dashboard.component.scss'],
})
export class RegradeDashboardComponent implements OnInit {
  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search',
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh',
    },
    {
      iconcode: 'mdi-plus',
      title: 'New Regrade',
      label:'New Regrade'
    },
  ];

  regrades: any;

  showLoader = false;

  regreateList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search',
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh',
    },
  ];


  
  pagination: any = {
    SerachText: '',
    PageNumber: 1,
    RowOfPage: 10,
    LocationId: this.commonService.getProbablyNumberFromLocalStorage('locId'),
    first: 0,
  }

  currentPage = 1;
  pageSize = 100;
  first = 0;
  last = 0;
  pageTotal = 0;
  isLoading = false;
  subMaterialList: any;
  subMaterialLoader: boolean = false;
  searchSubMaterialInput: any = '';

  visibleNewRegrade: boolean = false;
  ShowmodelRegrate: boolean = false;
  poupRegrate = false;
  selectedSubMaterial: any;
  currentRegradedMaterialRowID: any = 0;
  newRegradedMaterialName: any;
  newMaterialStock: any;
  currentRegradedMaterialName: any;
  currentMaterialStock: any;
  stockAfterRegrade: number = 0;
  defaultSelectedMaterial: any;
  newSelectedMaterial: any;
  materialList: any;
  orgName: any;
  locId: any;
  metarialObj:any = [];
  popupAction = 'edit';

  stockQuanity: number = 0;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getAllRegrades(this.pagination);
  }


  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first;
    let pagObj = {
      PageNumber: this.currentPage,
      RowOfPage: event.rows,
    }
    this.pageSize = event.rows;
    this.pagination = { ...this.pagination, ...pagObj };
    this.getAllRegrades(this.pagination);
  }

  
  getAllRegrades(pagination: any) {
    this.isLoading = true;
    console.log(this.pagination);
    this.commonService.GetAllRegrades(pagination)
      .subscribe(data => {
        console.log('GetAllRegrades :: ');
        console.log(data.body.data);
        this.regrades = data.body.data;
        this.pageTotal = data?.body?.totalRecord | 6;
        this.last = data?.body?.totalIndex | 1;
      },
        (err: any) => {
          this.isLoading = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  getSubMaterials() {
    this.subMaterialLoader = true;

    const paramObject = {
      SearchText: this.searchSubMaterialInput,
      LocationId: this.locId
    };
    this.commonService.getSubMaterials(paramObject)
      .subscribe(data => {
          console.log('getSubMaterials :: ');
          console.log(data);
          this.subMaterialList = data.body.data;
          this.defaultSelectedMaterial = this.subMaterialList[0].rowId;
          // alert(this.defaultSelectedMaterial);
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.subMaterialLoader = false;
        },
        () => {
          this.subMaterialLoader = false;
        }
      );
  }
  

  getSubMaterialById(regradeId: any, subMaterialId: any) {
    this.subMaterialLoader = true;

    const paramObject = {
      SearchText: this.searchSubMaterialInput,
      LocationId: this.locId
    };
    this.commonService.getSubMaterials(paramObject)
      .subscribe(data => {
          console.log('getSubMaterials :: ');
          console.log(data);
          this.subMaterialList = data.body.data;
          const subMaterial = data.body.data.filter((item:any) => item.rowId == subMaterialId)[0]
          
          console.log('subMaterial :: ');
          console.log(subMaterial);
          this.showRegrateDeatilModel(subMaterial);
          this.GetRegradedMaterialsById(regradeId);
          // this.defaultSelectedMaterial = this.subMaterialList[0].rowId;
          // alert(this.defaultSelectedMaterial);
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.subMaterialLoader = false;
        },
        () => {
          this.subMaterialLoader = false;
        }
      );
  }

  getAllGroupMaterial() {
    this.materialList =  JSON.parse(JSON.stringify(this.subMaterialList)); //{ ...this.subMaterialList };
    this.materialList = this.materialList.filter((subMaterial:any) => subMaterial.rowId != this.currentRegradedMaterialRowID);
    
    console.log('materialList :: ');
    console.log(this.materialList);
    this.newSelectedMaterial = this.materialList[0].rowId;
  }
  
  showDialog() {
    this.visibleNewRegrade = true;    
    this.metarialObj = [];
    this.getSubMaterials();
  }

  regradeDetails(regradeId: any, shipoutId: any, action: string) {
    this.popupAction = action;
    // alert(action + ' action Triggered :: ' + shipoutId + ' :: ' + regradeId)
    this.getSubMaterialById(regradeId, shipoutId);
  }

  deleteDetails(shipoutId: any) {
    alert('Delete action Triggered')
  }


  existingMaterialList(materialName: any, stockQuanity: any) {
    this.metarialObj.push({name:materialName,quanitity:stockQuanity})
    console.log(this.metarialObj);
  }

  
  GetRegradedMaterialsById(id: any) {
     this.isLoading = true;
     const param = {RegradedID : id};
     console.log(this.pagination);
     this.commonService.GetRegradedMaterialsById(param)
       .subscribe(data => {
          console.log('GetRegradedMaterialsById :: ');
          console.log(data.body.data);
          // Iterate through the object
          this.metarialObj = [];
          data.body.data.forEach((item: any) => {
            this.existingMaterialList(item.materialName, item.net);
          });
       },
         (err: any) => {
           this.isLoading = false;
           // this.errorMsg = 'Error occured';
         },
         () => {
           this.isLoading = false;
         }
       );
  }

  showRegrateDeatilModel(subMaterial: any){
    this.currentRegradedMaterialRowID = subMaterial.rowId;
    this.newRegradedMaterialName = subMaterial.materialName;
    this.newMaterialStock = subMaterial.net;
    this.poupRegrate =  true;
    this.getAllGroupMaterial();
  }
  hideRegrateDeatilModel(){
    this.poupRegrate =  false;
  }

  hideModel() {
    this.ShowmodelRegrate = false;
  }


  addMetarial() {
   const _name = this.materialList.filter((item:any)=>item.rowId==this.newSelectedMaterial)[0];
   this.metarialObj.push({name:_name.materialName,quanitity:this.stockQuanity})
    console.log(this.metarialObj);
  }
  removeQuantty(index:number){

    this.metarialObj.splice(index,1);
  }

  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.showDialog();
        break;
      default:
        break;
    }
  }

  getSubMaterialAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.showDialog();
        break;
        case 'mdi-refresh':
          this.searchSubMaterialInput = '';
          this.showDialog();
          break;
      default:
        break;
    }
  }

}
