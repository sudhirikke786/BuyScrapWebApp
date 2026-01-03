import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-system-perf',
  templateUrl: './system-perf.component.html',
  styleUrls: ['./system-perf.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class SystemPerfComponent implements OnInit {
 
  visible = false;
  systemPerfForm !:FormGroup;
  editObj: any;
  copyObj: any;
  logInUserId: any;
  searchValue = '';
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

  isBooleanField(item: any): boolean {
    return item.type === 'Bool';
  }

  isNumericField(item: any): boolean {
    return item.type === 'Int' || item.type === 'Number';
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
    let reqObj = {
      Key:'',
      ManageByStore:true
    }
    this.commonService.GetSystemPreferencesValue(reqObj).subscribe((res) =>{
      this.systemPerObj = res?.body?.data.map((item:any) => {
        if (item.type === 'Bool') {
          item.isChecked = item.values == 'True' ? true : false;
        }
        item.originalValue = item.values;

        return item
      });
      this.copyObj = res?.body?.data.map;
      // To remove and add system info setting
      if (res?.body?.data) {
        localStorage.removeItem('systemInfo');
        this.stroarge.setLocalStorage('systemInfo', res?.body?.data);
      }
    },(error)=>{

    })
  }

  saveNumericValue(item: any, rowIndex: number) {
    if (item.values === item.originalValue) {
      return; 
    }

    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure you want to change ${item.keys} from "${item.originalValue}" to "${item.values}"?`,
      accept: () => {
        this.saveForm(item, undefined, item.values);
      },
      reject: () => {
        item.values = item.originalValue;
      }
    });
  }




  showConfirmation(pos:any,rowIndex:number,type:any) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure you want to change ${type.keys} value?`,
      accept: () => {
        // Action to take when the user clicks "Yes" or "OK"
        this.saveForm(type,pos?.checked);
     
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



  saveForm(type?:any,ischecked=false, numericValue?: any){
    const datePipe = new DatePipe('en-US');
    let valueToSave: string;

    if (type.type === 'Bool') {
      valueToSave = ischecked ? 'True' : 'False';
    } else {
      valueToSave = numericValue?.toString() || type.values;
    }

    const sysInfo = {
      "createdBy": this.logInUserId,
      "updatedBy": this.logInUserId,
      "createdDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "updatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "rowId": this.editObj?.rowId || type.rowId,
      "keys":type.keys,
      "values":valueToSave
    }

   // const reqObj = {...sysInfo,...obj};

    this.commonService.InsertUpdateSystemPreferences(sysInfo).subscribe((res) =>{
      const index = this.systemPerObj.findIndex((item: any) => item.rowId === type.rowId);
      if (index !== -1) {
        this.systemPerObj[index].originalValue = valueToSave;
        this.systemPerObj[index].values = valueToSave; 
        
        if (type.type === 'Bool') {
          this.systemPerObj[index].isChecked = ischecked;
        }
      }
      this.getSystemPreferencesValue();
      this.visible = false;
      // alert('updated')
      //this.msgService.showSuccess('Successfully Updated')
    },(error)=>{
      
      //this.msgService.showError(error)
    })

  }


}
