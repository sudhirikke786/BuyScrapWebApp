

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-user-perf',
  templateUrl: './user-perf.component.html',
  styleUrls: ['./user-perf.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class UserPerfComponent {


  visible = false;
  systemPerfForm !:FormGroup;
  editObj: any;
  copyObj: any;
  logInUserId: any;
  searchValue = '';
  OriginalsystemPerObj :any = [];

  constructor(public commonService: CommonService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
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

  systemPerObj:any = [];

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


   this.OriginalsystemPerObj = this.stroarge.getLocalStorage('systemInfo');

    if(this.OriginalsystemPerObj ) {
      this.systemPerObj =  this.OriginalsystemPerObj .map((item:any) => {
        item.isChecked = item.values == 'True' ? true : false;
        return item
      });;   
      this.copyObj = this.OriginalsystemPerObj .map((item:any) => {
        item.isChecked = item.values == 'True' ? true : false;
        return item
      }); ;

    }

    // let reqObj = {
    //   Key:'',
    //   ManageByStore:true
    // }
    // this.commonService.GetSystemPreferencesValue(reqObj).subscribe((res) =>{
    //   this.systemPerObj = res?.body?.data.map((item:any) => {
    //     item.isChecked = item.values == 'True' ? true : false;
    //     return item
    //   });
    //   this.copyObj = res?.body?.data.map;
    
    // },(error)=>{

    // })
  }




  showConfirmation(pos:any,rowIndex:number,type:any) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure you want to change ${type.keys} value?`,
      accept: () => {

       const findIndex =   this.stroarge.getLocalStorage('systemInfo').findIndex((item:any) => item.keys == type.keys);
       const findElement =   this.stroarge.getLocalStorage('systemInfo').find((item:any) => item.keys == type.keys);

       findElement.values = pos.checked  ? 'True' : 'False';

      this.OriginalsystemPerObj[findIndex]  = findElement
      localStorage.removeItem('systemInfo');

      this.stroarge.setLocalStorage('systemInfo', this.OriginalsystemPerObj);   
      this.getSystemPreferencesValue();
       
      //values : "True"
       
     
        // Add your logic here
      },
      reject: () => {
        console.log(pos);
        this.systemPerObj[rowIndex].isChecked  =  !pos.checked;
        // Action to take when the user clicks "No" or "Cancel"
        console.log('Rejected');
        // Add your logic here
      },
    });
  }



  saveForm(type?:any,ischecked=false){



  //   const datePipe = new DatePipe('en-US');

  //   const sysInfo = {
  //     "createdBy": this.logInUserId,
  //     "updatedBy": this.logInUserId,
  //     "createdDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
  //     "updatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
  //     "rowId": this.editObj?.rowId || type.rowId,
  //     "keys":type.keys,
  //     "values":ischecked ? 'True' : 'False'
  //   }

  //  // const reqObj = {...sysInfo,...obj};

  //   this.commonService.InsertUpdateSystemPreferences(sysInfo).subscribe((res) =>{
  //     this.getSystemPreferencesValue();
  //     this.visible = false;
  //     // alert('updated')
  //     //this.msgService.showSuccess('Successfully Updated')
  //   },(error)=>{
      
  //     //this.msgService.showError(error)
  //   })

  }

}
