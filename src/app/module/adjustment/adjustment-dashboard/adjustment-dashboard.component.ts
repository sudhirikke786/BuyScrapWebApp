import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

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

  showLoader = false;

  visible: boolean = false;
  headerTitle: any = 'Add Adjustment';

  isEditModeOn = false;
  adjustmentData: any;
  datePipe: DatePipe = new DatePipe('en-US');

  orgName: any;
  logInUserId: any;
  locId: any;
  adjustmentList: any;
  currentRole:any;
  form: FormGroup = this.formBuilder.group({
    rowId: 0,
    adjustmentName: ['', Validators.required],
    description: '',
    isEnable: false,
    createdBy: 0,
    createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
    updatedBy: 0,
    updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
    locID: 0
  });
  
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService:AuthService,
    private stroarge:StorageService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);

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
      createdBy: this.logInUserId,
      createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      updatedBy: this.logInUserId,
      updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      locID: this.locId
    });

    this.GetAllAdjustmentType();
  }

  GetAllAdjustmentType() {
    this.showLoader = true;
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
          this.showLoader = false;
        },
        () => {
          this.showLoader = false;
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
        createdBy: this.logInUserId,
        createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
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
