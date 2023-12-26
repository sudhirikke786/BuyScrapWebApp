import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';

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
      title:'Add Materials',
      label:'Add Materials'
    },
    {
      iconcode:'mdi-currency-usd',
      title:'Quick Price Update',
      label:'Quick Price Update'
    }
  ];

  showLoader = false;
  isEditModeOn = false;
  materialData: any;

  unitOfMeasure =  [
    {name: 'Lb', value: 1},
    {name: 'Kg', value: 2},
    {name: 'Ounce', value: 3},
    {name: 'Gram', value: 4}
  ];
  
  submitted = false;

  form: FormGroup = this.formBuilder.group({
    rowId: 0,
    groupName: ['', Validators.required],
    description: '',
    uomId: 1,
    isEnable: false,
    isCRV: false
  });


  visible: boolean = false;
  bulkvisible:boolean = false;

  orgName: any;
  locId: any;
  logInUserId: any;
  materialList: any;
  materialListCopy: any;
  subMaterialList: any;
  mainMaterialsVisible = true;
  defaultSelectedMaterial: any = 1;
  defaultImage = 'assets/images/custom/materials/Default-Scrap-Material.png';
  
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private stroarge:StorageService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    const datePipe = new DatePipe('en-US');

    this.form = this.formBuilder.group({
      rowId: 0,
      groupName: ['', Validators.required],
      description: '',
      uomId: 1,
      isEnable: false,
      isCRV: false,
      createdBy: this.logInUserId,
      createdDate: '',
      updatedBy: this.logInUserId,
      updatedDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      locID: this.locId
    });

    this.getAllGroupMaterial();
  }


  searchMetarial(inputData:any){
   
    const res = inputData.target.value.trim();
    if(res.length > 0){
      this.materialList = this.materialListCopy.filter((item:any) => {
       const dt = item.groupName.toLocaleLowerCase().includes( res.toLocaleLowerCase());
       return dt;
      })
    }else{
      this.materialList = this.materialListCopy;
    }

  }

  changeSource(event: any) {      
      event.target.src = this.defaultImage;
  }

  getAllGroupMaterial() {
    this.showLoader = true;
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.getAllGroupMaterial(paramObject)
      .subscribe(data => {
          console.log('getAllGroupMaterial :: ');
          console.log(data);
          this.materialList = data.body.data;
          this.materialList.map((i: any) => { 
            i["imagePath"] = `assets/images/custom/materials/${i["groupName"]?.split(" ")[0]?.split("/")[0]?.toLowerCase()}.jpg`;
          });
          // this.materialList = JSON.parse(JSON.stringify(this.materialList));
          this.materialListCopy = JSON.parse(JSON.stringify(this.materialList)); 
          console.log('materialListCopy :: ');
          console.log(this.materialListCopy); 
          this.defaultSelectedMaterial = this.materialListCopy[0].rowId;
          const $event = {
            target: {
              value: this.defaultSelectedMaterial
            }
          }
          this.onMaterialChange($event);
        },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () =>{
        this.showLoader = false;
        }
      );
  }

  showDialog(materialData?: any){
    if (materialData) {
      this.isEditModeOn = true;
      this.materialData = materialData;
      this.form.patchValue(materialData)
    } else {
      const datePipe = new DatePipe('en-US');
      this.isEditModeOn = false;
      this.materialData = null;

      this.form = this.formBuilder.group({
        rowId: 0,
        groupName: ['', Validators.required],
        description: '',
        uomId: 1,
        isEnable: false,
        isCRV: false,
        createdBy: this.logInUserId,
        createdDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        locID: this.locId
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
    
    this.commonService.insertUpdateGroupMaterials(returnedTarget).subscribe(data =>{    
      console.log(data); 

      this.isEditModeOn = false;
      this.materialData = null;
      this.visible = false;      
      alert('Material data Inserted/ updated successfully');
      
      this.getAllGroupMaterial();
    },(error: any) =>{  
      console.log(error);  
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });

  }

  showBulkDialog(){
    this.bulkvisible = true;
  }
  
  onMaterialChange(value: any) {
    const selectedMaterialId = value.target.value;
    this.getSubMaterials(selectedMaterialId);
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
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
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
