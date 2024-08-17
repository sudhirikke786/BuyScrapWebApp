import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-printer-price',
  templateUrl: './printer-price.component.html',
  styleUrls: ['./printer-price.component.scss'],
  providers: [MessageService]
})
export class PrinterPriceComponent implements OnInit  {


  org: any = {
    orgName: '',
    password: ''
  };
  isChecked = true;
  oldMaterialkey: string = '';
  materialkey: string = '';
  materialConfirmkey:string = '';
  inputType: string  = 'password';
  logInUserId: any;
  orgName: any;
  locId: any;

  constructor(private router: Router, 
              private http: HttpClient,
              private stroarge:StorageService,
              private messageService: MessageService,
              private commonService: CommonService) { }
  
              
  
  ngOnInit(): void {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    
    this.oldMaterialkey = '';
    this.materialkey = '';
    this.materialConfirmkey = '';
  }

  btnClick() {
    if (this.materialkey == this.materialConfirmkey) {
      this.validateExistingMaterialKey();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Key and confirm key should be same.' });
    }
  }
  
  saveMaterialKey() {
    const datePipe = new DatePipe('en-US');

    const requestObj = {
      "RowId": 1,
      "CreatedBy": this.logInUserId,
      "UpdatedBy": this.logInUserId,
      "CreatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "UpdatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "Key": this.materialkey,
      "LocId": this.locId,
      "Description": '',
      "LocationValue": ''
    }
 
    this.commonService.InsertUpdatePriceKeySettings(requestObj)
      .subscribe(data => {
          console.log('data :: ');
          console.log(data);
          
          this.oldMaterialkey = '';
          this.materialkey = '';
          this.materialConfirmkey = '';
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Material Price Update key successfully' });
      
        },
        (err: any) => {          
          this.messageService.add({ severity: 'success', summary: 'Error', detail: 'Error while updating.' });          
        }
      );
  }
  
  validateExistingMaterialKey() {
    const datePipe = new DatePipe('en-US');

    if (this.oldMaterialkey == '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Provide Existing Key.' });          
      return;
    }
    const requestObj = {
      "Key": this.oldMaterialkey,
      "LocId": this.locId
    }
 
    this.commonService.ValidatePriceKeySettings(requestObj)
      .subscribe(data => {
          console.log('data :: ');
          console.log(data.body.data);
          if (data.body.data) {
            this.saveMaterialKey();
            // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Key validated' });
          } else {          
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Existing Key.' });          
          }
                
        },
        (err: any) => {          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while updating.' });          
        }
      );
  }


  changeInput() {
    this.inputType = this.inputType == 'password' ? 'text' : 'password';
  }

}
