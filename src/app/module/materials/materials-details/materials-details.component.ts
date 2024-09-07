import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-materials-details',
  templateUrl: './materials-details.component.html',
  styleUrls: ['./materials-details.component.scss']
})
export class MaterialsDetailsComponent implements OnInit {

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
      title:'Add Sub Materials',
      label:'Add Sub Materials'
    }
  ];

  
  isEditModeOn = false;
  materialData: any;
  subMaterials = '';
  searchTerm = '';

  unitOfMeasure =  [
    {name: 'Lb', value: 1},
    {name: 'Kg', value: 2},
    {name: 'Ounce', value: 3},
    {name: 'Gram', value: 4}
  ];
  
  submitted = false;

  form: FormGroup = this.formBuilder.group({
    rowId: 0,
    createdBy: 0,
    createdDate: '',
    updatedBy: 0,
    updatedDate: '',
    groupId: 0,
    description: '',
    materialName: '',
    marketPrice: 0,
    scrapPrice: 0,
    dealerPrice1: 0,
    dealerPrice2: 0,
    dealerPrice3: 0,
    availableStock: 0,
    isEnable: false,
    uomId: 1,
    uom: 'Lb',
    locID: 0,
    isHold: false,
    isCRV: false,
    holdDays: 0
  });

  visible: boolean = false;
  cashVisible: boolean = false;
  bulkvisible:boolean = false;

  showLoader = false;

  orgName: any;
  locId: any;
  logInUserId: any;
  defaultMaterialId: any;
  materialList: any;
  subMaterialList: any;
  subMaterialListCopy: any;
  mainMaterialsVisible = true;
  currentRole:any;
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';
  
  passwordmode = true;
  materialkey: string = '';

  systemPerfForm!:FormGroup;
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService:AuthService,
    private stroarge:StorageService,
    private messageService: MessageService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    
    this.currentRole = this.authService.userCurrentRole();
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    const datePipe = new DatePipe('en-US');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    
    this.form = this.formBuilder.group({
      rowId: 0,
      createdBy: this.logInUserId,
      createdDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      updatedBy: this.logInUserId,
      updatedDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      groupId: 0,
      description: '',
      materialName: '',
      marketPrice: 0,
      scrapPrice: 0,
      dealerPrice1: 0,
      dealerPrice2: 0,
      dealerPrice3: 0,
      availableStock: 0,
      isEnable: false,
      uomId: 1,
      uom: 'Lb',
      locID: this.locId,
      isHold: false,
      isCRV: false,
      holdDays: 0
    });

    this.systemPerfForm = this.formBuilder.group({
      keys:'',
      values:''
      
    })

    this.route.params.subscribe((param)=>{
      if (param['materialId']) {
        this.defaultMaterialId = param['materialId'];
        this.getSubMaterials(param['materialId']);
      } else {
        alert('Required material id')
      }
    });
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

  getSubMaterials(materialId: any) {
    this.showLoader = true;
    this.mainMaterialsVisible =  false;

    const paramObject = {
      MaterialID: materialId,
      LocationId: this.locId
    };
    this.commonService.getAllSubMaterials(paramObject)
      .subscribe(data => {
          console.log('getAllSubMaterials :: ');
          console.log(data);
          this.subMaterialList = data.body.data;
          this.subMaterialListCopy = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.showLoader = false;
        },
        () => {
          this.showLoader = false;
        }
      );
  }

  search(): void {
    let term = this.searchTerm;
    console.log(' searchTerm :: ' + term);
    this.subMaterialList = this.subMaterialListCopy[0].filter(function(item: any) {
        console.log(' item :: ' + item);
        return item.materialName.indexOf(term) >= 0;
    }); 
}

enableCashier(){
  this.cashVisible = true;
 
}

connectToUpdate(){
  this.validateExistingMaterialKey();
  this.cashVisible = false;
}
  
validateExistingMaterialKey() {
  const datePipe = new DatePipe('en-US');

  const requestObj = {
    "Key": this.materialkey,
    "LocId": this.locId
  }

  this.commonService.ValidatePriceKeySettings(requestObj)
    .subscribe(data => {
        console.log('data :: ');
        console.log(data.body.data);
        if (data.body.data) {
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Key validated' });
          this.enablePriceItem();
        } else {          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Key.' }); 
          this.disablePriceItem();         
        }
              
      },
      (err: any) => {          
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while updating.' });          
      }
    );
}

disablePriceItem(){
  this.form.controls['marketPrice']?.disable();
  this.form.controls['scrapPrice']?.disable();
  this.form.controls['dealerPrice1']?.disable();
  this.form.controls['dealerPrice2']?.disable();
  this.form.controls['dealerPrice3']?.disable();
}

enablePriceItem(){
  this.form.controls['marketPrice']?.enable();
  this.form.controls['scrapPrice']?.enable();
  this.form.controls['dealerPrice1']?.enable();
  this.form.controls['dealerPrice2']?.enable();
  this.form.controls['dealerPrice3']?.enable();
}
  showDialog(materialData?: any){
    if (materialData) {
      this.isEditModeOn = true;
      this.materialData = materialData;
      //scrapPrice,dealerPrice1,dealerPrice2,dealerPrice3
      this.disablePriceItem();
       
    
    
      this.form.patchValue(materialData)
    } else {
      const datePipe = new DatePipe('en-US');
      this.isEditModeOn = false;
      this.materialData = null;

      this.form = this.formBuilder.group({
        rowId: 0,
        createdBy: this.logInUserId,
        createdDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        groupId: parseInt(this.defaultMaterialId),
        description: '',
        materialName: '',
        marketPrice: 0,
        scrapPrice: 0,
        dealerPrice1: 0,
        dealerPrice2: 0,
        dealerPrice3: 0,
        availableStock: 0,
        isEnable: false,
        uomId: 1,
        uom: 'Lb',
        locID: this.locId,
        isHold: false,
        isCRV: false,
        holdDays: 0
      });

    }
    this.visible = true;
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(materialData: any) {
    // alert(JSON.stringify(materialData));
    // alert(JSON.stringify(this.form.value));
    this.submitted = true;
    
    if (this.form.invalid) {
        return;
    }

    const target = { ...materialData };
    const source = this.form.value;

    const returnedTarget = Object.assign(target, source);
    
    returnedTarget.marketPrice = returnedTarget.marketPrice ? parseFloat(returnedTarget.marketPrice) : 0;
    returnedTarget.scrapPrice = returnedTarget.scrapPrice ? parseFloat(returnedTarget.scrapPrice) : 0;
    returnedTarget.dealerPrice1 = returnedTarget.dealerPrice1 ? parseFloat(returnedTarget.dealerPrice1) : 0;
    returnedTarget.dealerPrice2 = returnedTarget.dealerPrice2 ? parseFloat(returnedTarget.dealerPrice2) : 0;
    returnedTarget.dealerPrice3 = returnedTarget.dealerPrice3 ? parseFloat(returnedTarget.dealerPrice3) : 0;
    // alert(JSON.stringify(returnedTarget));
    
    this.commonService.insertUpdateMaterials(returnedTarget).subscribe(data =>{    
      console.log(data); 

      this.isEditModeOn = false;
      this.materialData = null;
      this.visible = false;      
      alert('Sub Material data Inserted/ updated successfully');
      
      this.getSubMaterials(this.defaultMaterialId);
    },(error: any) =>{  
      console.log(error);  
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });

  }

  showBulkDialog(){
    this.bulkvisible = true;
  }


  searchMetarial(inputData:any) : void {
   
    const res = inputData.target.value.trim();
    if(res.length > 0){
      this.subMaterialList = this.subMaterialListCopy.filter((item:any) => {
       const dt = item.materialName.toLocaleLowerCase().includes( res.toLocaleLowerCase());
       return dt;
      })
    }else{
      this.subMaterialList = this.subMaterialListCopy;
    }

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
