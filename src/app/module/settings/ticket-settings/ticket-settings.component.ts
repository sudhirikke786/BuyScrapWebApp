import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { CommonService } from 'src/app/core/services/common.service';
import { MessageServiceService } from 'src/app/core/services/message-service.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-ticket-settings',
  templateUrl: './ticket-settings.component.html',
  styleUrls: ['./ticket-settings.component.scss']
})
export class TicketSettingsComponent implements OnInit {
  
@Output() close = new EventEmitter<boolean>();
  ticketForm!: FormGroup;
  logo:any;
  logInUserId: any;
  constructor(private formBuilder: FormBuilder,
    private stroarge:StorageService,
    private commonService:CommonService,
   ){

  }

  ngOnInit(){
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.createForm();
    this.getAllTicketDetails();
  }

  getAllTicketDetails(){

    let reqObj = {
      LocationId: localStorage.getItem('locId')
    }
  
    this.commonService.getAllSettingsTicketDetails(reqObj).subscribe((res) =>{
      const responseObj = res?.body?.data[0];
      if(responseObj)
      this.logo = responseObj.logo;
      this.ticketForm.patchValue(responseObj);
    },(error)=>{

    })
  }

  createForm(){
    this.ticketForm = this.formBuilder.group({
      organizationName: [],
      address: [],
      emailID: [],
      phone: [],
      website:[],
      locID:[],
      field1:[],
      field2:[],
      disclaimer:[],
      codDisclaimer:[],
      advertising:[],
    });
  }

  saveForm(){
    const datePipe = new DatePipe('en-US');

    const obj = this.ticketForm.value;
    const userInfo = {
      "createdBy": this.logInUserId,
      "updatedBy": this.logInUserId,
      "createdDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "updatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "rowId": 1,
    }

    const reqObj = {...userInfo,...obj};

    this.commonService.InsertUpdateTicketSettings(reqObj).subscribe((res) =>{
      alert('Organization Details Successfully Updated');     
      this.close.emit();
      //this.msgService.showSuccess('Successfully Updated')
    },(error)=>{
      
      //this.msgService.showError(error)
    })

  }

}
