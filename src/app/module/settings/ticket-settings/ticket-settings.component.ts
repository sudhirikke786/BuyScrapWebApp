import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MessageService } from 'primeng/api';
	
@Component({
  selector: 'app-ticket-settings',
  templateUrl: './ticket-settings.component.html',
  styleUrls: ['./ticket-settings.component.scss'],
  providers: [MessageService]
})
export class TicketSettingsComponent implements OnInit {
  
@Output() close = new EventEmitter<boolean>();
  ticketForm!: FormGroup;
  logo:any;
  logInUserId: any;
  orgName: any;
  locationName: any;

  constructor(private formBuilder: FormBuilder,
    private stroarge:StorageService,
    private commonService:CommonService,
    private messageService: MessageService,

   ){

  }

  ngOnInit(){
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.orgName = localStorage.getItem('orgName');
    this.locationName = localStorage.getItem('locationName');
    
    this.createForm();
    this.getAllTicketDetails();
  }


  
  successAlert(msg:any){
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
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
      logo: ''
    });
  }

  saveForm(){
    const datePipe = new DatePipe('en-US');

    const obj = this.ticketForm.value;
    obj.logo = this.logo;
    const userInfo = {
      "createdBy": this.logInUserId,
      "updatedBy": this.logInUserId,
      "createdDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "updatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "rowId": 1,
    }

    const reqObj = {...userInfo,...obj};

    this.commonService.InsertUpdateTicketSettings(reqObj).subscribe((res) =>{
      this.successAlert('Organization Details Successfully Updated');     
      this.close.emit();
      //this.msgService.showSuccess('Successfully Updated')
    },(error)=>{
      
      //this.msgService.showError(error)
    })

  }
  
  onFileChanged(event: any) {
   this.logo = null;
   const file = event.target.files[0];
   console.log('file  :: ' + JSON.stringify(file));
   let reader = new FileReader();
   if (event.target.files && event.target.files[0]) {
     reader.readAsDataURL(file);
     reader.onload =  () => {
       this.logo = reader.result;   
       this.SaveImage();    
      //  this.getPicture.emit(this.logo);
      //  this.userInfo.emit(file);
     }       
   }
 }

 SaveImage() {

   let requestObj: any = {

     organisationName: this.orgName,
     locationName: this.locationName,
     imagetype: 9, // BuisnessLogo
     base64Data: this.logo?.split(';base64,')[1]
   };

   this.commonService.FileUploadFromWeb(requestObj).subscribe((res: any) => {
     console.log('Image url path :: {}', res.body.data);
     console.log(res.body.data);
     this.logo = res.body.data;
   })
 }

}
