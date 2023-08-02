import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageServiceService } from 'src/app/core/services/message-service.service';

@Component({
  selector: 'app-ticket-settings',
  templateUrl: './ticket-settings.component.html',
  styleUrls: ['./ticket-settings.component.scss']
})
export class TicketSettingsComponent implements OnInit {
  ticketForm!: FormGroup;
  logo:any;
  constructor(private formBuilder: FormBuilder,
    private commonService:CommonService,
   ){

  }

  ngOnInit(){
    this.createForm();
    this.getAllTicketDetails();
  }

  getAllTicketDetails(){

    let reqObj = {
      LocationId: 1,
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

    const obj = this.ticketForm.value;
    const userInfo = {
      "createdBy": 1,
      "updatedBy": 7,
      "createdDate": "2021-04-05T14:26:56.84",
      "updatedDate": "2023-06-20T08:44:05.543",
      "rowId": 1,
    }

    const reqObj = {...userInfo,...obj};

    this.commonService.InsertUpdateTicketSettings(reqObj).subscribe((res) =>{
    //  alert('updated')
      //this.msgService.showSuccess('Successfully Updated')
    },(error)=>{
      
      //this.msgService.showError(error)
    })

  }

}
