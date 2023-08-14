import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';

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
      title:'Add Materials'
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
  bulkvisible:boolean = false;

  orgName: any;
  locId: any;
  defaultMaterialId: any;
  materialList: any;
  subMaterialList: any;
  subMaterialListCopy: any;
  mainMaterialsVisible = true;
  
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    
    this.form = this.formBuilder.group({
      rowId: 0,
      createdBy: 0,
      createdDate: '',
      updatedBy: 0,
      updatedDate: '2023-07-17T10:00:17.557',
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
          this.subMaterialListCopy = { ...this.subMaterialList };
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  search(): void {
    let term = this.searchTerm;
    console.log(' searchTerm :: ' + term);
    this.subMaterialList = this.subMaterialListCopy.filter(function(item: any) {
        console.log(' item :: ' + item);
        return item.materialName.indexOf(term) >= 0;
    }); 
}
  showDialog(materialData?: any){
    if (materialData) {
      this.isEditModeOn = true;
      this.materialData = materialData;
      this.form.patchValue(materialData)
    } else {
      this.isEditModeOn = false;
      this.materialData = null;

      this.form = this.formBuilder.group({
        rowId: 0,
        createdBy: 0,
        createdDate: '',
        updatedBy: 0,
        updatedDate: '2023-07-17T10:00:17.557',
        groupId: this.defaultMaterialId,
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
