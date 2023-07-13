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
  subMaterialList: any;
  mainMaterialsVisible = true;
  
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
      updatedDate: Date.now(),
      locID: this.locId
    });

    this.route.params.subscribe((param)=>{
      if (param['materialId']) {
        this.getSubMaterials(param['materialId']);
      } else {
        alert('Required material id')
      }
    });
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
        isCRV: false
      });

    }
    this.visible = true;
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(materialData: any) {
    alert(JSON.stringify(materialData));
    alert(JSON.stringify(this.form.value));
    this.submitted = true;
    
    if (this.form.invalid) {
        return;
    }

    const target = { ...materialData };
    const source = this.form.value;

    const returnedTarget = Object.assign(target, source);
    alert(JSON.stringify(returnedTarget));

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
