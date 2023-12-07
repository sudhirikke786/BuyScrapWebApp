import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-system-perf',
  templateUrl: './system-perf.component.html',
  styleUrls: ['./system-perf.component.scss']
})
export class SystemPerfComponent implements OnInit {
 
  visible = false;
  systemPerfForm !:FormGroup;
  editObj: any;
  copyObj: any;
  logInUserId: any;
  searchValue = '';
  constructor(public commonService: CommonService,
    private stroarge:StorageService,
    private formBuilder: FormBuilder){

  }

  

  editSystem(sysObj:any){
    this.createForm();
    this.editObj = sysObj;
    this.visible = true;
    this.systemPerfForm.patchValue(sysObj)
  }


  createForm(){
   
    this.systemPerfForm = this.formBuilder.group({
      keys:[],
      values:[],
    });

  }
  
  ngOnInit(): void {
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.getSystemPreferencesValue();
  }

  refershSettings(){
    this.getSystemPreferencesValue();
  }

  systemPerObj = [];

  searchBox() {
    if(this.searchValue.length ===0){
      this.systemPerObj = this.copyObj;
    }else{
      this.systemPerObj = this.copyObj.filter((item:any) => {
       const result =  item.keys.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()) || item.values.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase());
       return result;
      })
    }
  }


  getSystemPreferencesValue(){
    let reqObj = {
      Key:'',
      ManageByStore:true
    }
    this.commonService.GetSystemPreferencesValue(reqObj).subscribe((res) =>{
      this.systemPerObj = res?.body?.data;
      this.copyObj = res?.body?.data;
    
    },(error)=>{

    })
  }



  saveForm(){
    const datePipe = new DatePipe('en-US');

    const obj = this.systemPerfForm.value;
    const sysInfo = {
      "createdBy": this.logInUserId,
      "updatedBy": this.logInUserId,
      "createdDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "updatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "rowId": this.editObj?.rowId,
    }

    const reqObj = {...sysInfo,...obj};

    this.commonService.InsertUpdateSystemPreferences(reqObj).subscribe((res) =>{
      this.getSystemPreferencesValue();
      this.visible = false;
      // alert('updated')
      //this.msgService.showSuccess('Successfully Updated')
    },(error)=>{
      
      //this.msgService.showError(error)
    })

  }


}
