import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';

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
    }
  ];


  visible: boolean = false;
  headerTitle: any = 'Add Adjustment';

  isEditModeOn = false;
  adjustmentData: any;

  orgName: any;
  locId: any;
  adjustmentList: any;
  currentRole:any;
  form: FormGroup = this.formBuilder.group({
    rowId: 0,
    adjustmentName: ['', Validators.required],
    description: '',
    isEnable: false,
    createdBy: 0,
    createdDate: '',
    updatedBy: 0,
    updatedDate: '2023-07-17T10:00:17.557',
    locID: 0
  });
  
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService:AuthService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');

    this.currentRole = this.authService.userCurrentRole();

    if(['Administrator','Cashier'].includes(this.currentRole)){
      this.actionList.unshift(
        {
          iconcode:'mdi-plus',
          title:'Add Adjustment'
        })
    }

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');

    this.form = this.formBuilder.group({
      rowId: 0,
      adjustmentName: ['', Validators.required],
      description: '',
      isEnable: false,
      createdBy: 0,
      createdDate: '',
      updatedBy: 0,
      updatedDate: '2023-07-17T10:00:17.557',
      locID: this.locId
    });

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
          this.adjustmentList = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  showDialog(adjustmentData?: any){
    if (adjustmentData) {
      this.headerTitle = 'Edit Adjustment';
      this.isEditModeOn = true;
      this.adjustmentData = adjustmentData;
      this.form.patchValue(adjustmentData)
    } else {
      this.headerTitle = 'Add Adjustment';
      this.isEditModeOn = false;
      this.adjustmentData = null;

      this.form = this.formBuilder.group({
        rowId: 0,
        adjustmentName: ['', Validators.required],
        description: '',
        isEnable: false,
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

  onSubmit(adjustmentData: any) {
    // alert(JSON.stringify(adjustmentData));
    // alert(JSON.stringify(this.form.value));    
    if (this.form.invalid) {
        return;
    }

    const target = { ...adjustmentData };
    const source = this.form.value;

    const returnedTarget = Object.assign(target, source);
    // alert(JSON.stringify(returnedTarget));
    
    this.commonService.insertUpdateGroupAdjustment(returnedTarget).subscribe(data =>{    
      console.log(data); 

      this.isEditModeOn = false;
      this.adjustmentData = null;
      this.visible = false;      
      alert('Adjustment data Inserted/ updated successfully');
      
      this.GetAllAdjustmentType();
    },(error: any) =>{  
      console.log(error);  
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });

  }
 
  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        break;
      case 'mdi-refresh':
        break;
      case 'mdi-plus':
        this.showDialog();
        break;
      default:
        break;
    }

  }
 
}
