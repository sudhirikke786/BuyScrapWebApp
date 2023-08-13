import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  materialList: any;
  materialListCopy: any;
  subMaterialList: any;
  mainMaterialsVisible = true;
  defaultSelectedMaterial: any = 1;
  defaultImage = 'assets/images/custom/materials/Default-Scrap-Material.png';
  
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;

    this.form = this.formBuilder.group({
      rowId: 0,
      groupName: ['', Validators.required],
      description: '',
      uomId: 1,
      isEnable: false,
      isCRV: false,
      createdBy: 0,
      createdDate: '',
      updatedBy: 0,
      updatedDate: '2023-07-17T10:00:17.557',
      locID: this.locId
    });

    this.getAllGroupMaterial();
  }

  changeSource(event: any) {      
      event.target.src = this.defaultImage;
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
          // this.errorMsg = 'Error occured';
        }
      );
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
        groupName: ['', Validators.required],
        description: '',
        uomId: 1,
        isEnable: false,
        isCRV: false,
        createdBy: 6,
        createdDate: '2023-07-17T10:00:17.557',
        updatedBy: 6,
        updatedDate: '2023-07-17T10:00:17.557',
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
