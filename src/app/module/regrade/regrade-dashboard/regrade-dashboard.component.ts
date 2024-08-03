import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService,ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-regrade-dashboard',
  templateUrl: './regrade-dashboard.component.html',
  styleUrls: ['./regrade-dashboard.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class RegradeDashboardComponent implements OnInit {
   lossQuanaty:number = 0;
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
      label: 'New Regrade',
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
  };

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
  regStock!: number;
  currentRegradedMaterialName: any;
  currentMaterialStock: any;
  stockAfterRegrade: number = 0;
  defaultSelectedMaterial: any;
  newSelectedMaterial: any;
  materialList: any;
  orgName: any;
  locId: any;
  metarialObj: any = [];
  popupAction = 'edit';
  pouplossRegrate = false;
  stockQuanity: number = 0;
  selectedRegradeId: number = 0;

  netLoss:any;
  netDescription:any;
  logInUserId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage:StorageService,
    public commonService: CommonService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.storage.getLocalStorage('userObj').userdto?.rowId);

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getAllRegrades(this.pagination);
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first;
    let pagObj = {
      PageNumber: this.currentPage,
      RowOfPage: event.rows,
    };
    this.pageSize = event.rows;
    this.pagination = { ...this.pagination, ...pagObj };
    this.getAllRegrades(this.pagination);
  }

  getAllRegrades(pagination: any) {
    this.isLoading = true;
    console.log(this.pagination);
    this.commonService.GetAllRegrades(pagination).subscribe(
      (data) => {
       
        this.regrades = data.body.data.map((item: any) => { 
          item.formattedText = item.formattedText.replace(/(?:\r\n|\r|\n)/g, '<br>');
          return item;
        } );
        this.pageTotal = data?.body?.totalRecord;
        this.last = data?.body?.totalIndex;
        console.log(this.regrades);
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
      LocationId: this.locId,
    };
    this.commonService.getSubMaterials(paramObject).subscribe(
      (data) => {
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
      LocationId: this.locId,
    };
    this.commonService.getSubMaterials(paramObject).subscribe(
      (data) => {
        console.log('getSubMaterials :: ');
        console.log(data);
        this.subMaterialList = data.body.data;
        const subMaterial = data.body.data.filter(
          (item: any) => item.rowId == subMaterialId
        )[0];

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
    this.materialList = JSON.parse(JSON.stringify(this.subMaterialList)); //{ ...this.subMaterialList };
    this.materialList = this.materialList.filter(
      (subMaterial: any) =>
        subMaterial.rowId != this.currentRegradedMaterialRowID
    );

    console.log('materialList :: ');
    console.log(this.materialList);
    this.newSelectedMaterial = this.materialList[0].rowId;
  }

  showDialog() {
    this.visibleNewRegrade = true;
    this.metarialObj = [];
    this.selectedRegradeId = 0;
    this.getSubMaterials();
  }

  regradeDetails(regradeId: any, shipoutId: any, materialNet: any, lossReason: string, action: string) {
    this.popupAction = action;
    // this.regStock = materialNet;
    // this.netDescription = lossReason;
    this.selectedRegradeId = regradeId;
    // alert(action + ' action Triggered :: ' + shipoutId + ' :: ' + regradeId)
    this.getSubMaterialById(regradeId, shipoutId);
  }

  deleteDetails(shipoutId: any) {



    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure you want to Delete this value?`,
      accept: () => {
        const param = { RowID: shipoutId,Status:true };

        this.commonService.UpdateRegradedStatus(param).subscribe(
          (data) => {
            this.messageService.add({ severity: 'success', summary: 'success', detail: "Deleted Successfully" });
            this.getAllRegrades(this.pagination);
    
        })
      },
      reject: () => {
       
      },
    });

   


   
  }

  existingMaterialList(item:any) {
    // const totalcount = this.metarialObj.reduce((acc: number, curr: any) => {
    //   return (acc = acc + Number(curr.quanitity));
    // }, 0);
    // if (totalcount > this.regStock) {
    //   alert('Regrate items are not more than net ');
    // } else {
      this.metarialObj.push({ name: item.materialName, quanitity: item?.net , materialId: item?.materialId, rowId: item?.rowId,
        materialNet: item.net});
    // }

    console.log(this.metarialObj);
  }

  GetRegradedMaterialsById(id: any) {
   
    const param = { RegradedID: id };
    console.log(this.pagination);
    this.commonService.GetRegradedMaterialsById(param).subscribe(
      (data) => {
        console.log('GetRegradedMaterialsById :: ');
        console.log(data.body.data);
        // Iterate through the object
        this.metarialObj = [];
        data.body.data.forEach((item: any) => {
          this.existingMaterialList(item);
        });
      },
      (err: any) => {
      
        // this.errorMsg = 'Error occured';
      },
      () => {
       
      }
    );
  }

  showRegrateDeatilModel(subMaterial: any) {
    this.currentRegradedMaterialRowID = subMaterial.rowId;
    this.newRegradedMaterialName = subMaterial.materialName;
    this.newMaterialStock = Math.abs(subMaterial.net);
    // this.regStock = Math.abs(subMaterial.net);
    this.poupRegrate = true;
    this.getAllGroupMaterial();
  }
  hideRegrateDeatilModel() {
    this.poupRegrate = false;
  }

  hideModel() {
    this.ShowmodelRegrate = false;
  }

  addMetarial() {
    const _name = this.materialList.filter(
      (item: any) => item.rowId == this.newSelectedMaterial
    )[0];

    const totalcount = this.metarialObj.reduce((acc: number, curr: any) => {
      return acc + Number(curr.quanitity);
    }, 0);
    
    if(this.stockQuanity <= 0 ){
      //alert('Please add the quatity');
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please add the quatity" });
      return;
    }
    if(this.stockQuanity > this.newMaterialStock ){
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Regrate items are not more than current stock" });
      //alert('Regrate items are not more than net ');
      return;
    }
    if ((totalcount + this.stockQuanity) > this.newMaterialStock) {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Regrate items are not more than current stock" });
    } else {

      
      this.metarialObj.push({
        rowId: 0,
        name: _name.materialName,
        quanitity: this.stockQuanity,
        materialId:  _name.rowId,
        materialNet: this.stockQuanity,
      });      
      this.stockQuanity = 0;
    }
    console.log(this.metarialObj);
  }
  removeQuantty(index: number) {
    this.metarialObj.splice(index, 1);
  }

  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.showDialog();
        break;
      case 'mdi-refresh':
        this.getAllRegrades(this.pagination);
        break;
      default:
        break;
    }
  }

  getSubMaterialAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        //this.showDialog(); // TO DO:: New regrade pop-up search
        break;
      case 'mdi-refresh':
        this.searchSubMaterialInput = '';
        //this.showDialog(); // TO DO:: New regrade pop-up refresh
        break;
      default:
        break;
    }
  }

  


  saveRegrate() {
    // this.pouplossRegrate =  true;
    // const totalcount = this.metarialObj.reduce((acc: number, curr: any) => {
    //   return acc + Number(curr.quanitity);
    // }, 0);

    // this.netLoss  = Number(this.regStock) - Number(totalcount)
    
    this.submitRegrate();

  }


  submitRegrate() {

    const requestObj = this.metarialObj.map((item:any) => {

           const obj =  {
                materialId: Number(item.materialId),
                materialNet: Number(item.materialNet) ,
                rowId: item.rowId 
            };
            return obj
     })
       
    const reqParms ={
      rowId: this.selectedRegradeId,
      UserId:this.logInUserId,
      LocID:this.locId,
      MaterialID:this.currentRegradedMaterialRowID,
      // MaterialNet:this.regStock,
      // LossMaterialNet:this.netLoss,
      // LossReason:this.netDescription ?? 'Net Loss',
    }

    this.commonService.InsertUpdateRegradedMaterials(requestObj,reqParms).subscribe((res) =>{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: "Data Inserted Successfully" });
      this.poupRegrate = false;
      this.pouplossRegrate =  false;
      this.visibleNewRegrade =  false;
      this.getAllRegrades(this.pagination);
    //  this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Data Inserted Successfully' });
    });


  }
}
