import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../core/interfaces/common-interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from '../core/services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class UserLoginComponent implements OnInit {

  loginForm!: FormGroup
  consentForm!: FormGroup;
  
  organizationName: any;  
  OrgId: any;
  logInUserId: any;

  locations: any;
  selectedLocation: any;
  errorMsg: any;
  user: User = {
    userName: '',
    password: '',
    locID: 1,
    locationName: '',
    macID: '',    
    isActive: true,
    isConfirm: true
  };
  locationId: number = 1;
  inputType: string  = 'password';
  isSubmit: boolean = false;
  isShow = false;
  currencyCode: string  = 'USD';

  showPrivacy = false;
  isMandatoryConsentAccepted = false;
  latestPublishDate: any;
  acceptanceDate: any;
  displayWarningDialog = false;
  displayUserConsent = false;
  showPrivacyConsent = false;
  consentAgree = true;
  warningMessage = '';
  submitted  =  false;
  registrationForm!: FormGroup;
  userData: any;

  byPassConsent: boolean = false;
  consetInfo: any;
  consetData: any;
  
  consentLoading = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http:HttpClient,
              private localService:StorageService,
              private fb:FormBuilder,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private commonService: CommonService) { }

  ngOnInit() {
    this.user.macID = "defaultMacId"

    const userObjectExist = this.localService.getLocalStorage('userObj');
    if(userObjectExist){
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    }
    this.getIPAddress();
    this.getConsetInfo();

    this.OrgId = this.commonService.getProbablyNumberFromLocalStorage('orgId');
    this.logInUserId = 1;

    this.route.params.subscribe((param)=>{ 
      this.organizationName = param["orgName"];
      this.getOrgLocation();
    });
    if(userObjectExist){
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    }
    this.getGetOrganisationConsent();
  

    this.loginForm = this.fb.group({
      userName: '',
      password: '',
      locID: null,
      locationName: '',
      isActive: true,
      isConfirm: true
    });

    this.consentForm = this.fb.group({
      consent1: [false, Validators.requiredTrue],
      consent2: [false, Validators.requiredTrue],
      consent3: [false]
    });
  
    this.consentForm.statusChanges.subscribe(() => {
      this.updateSubmitButtonState();
    });

  }

  // Check if the button should be enabled
  isSubmitEnabled(): boolean {
    return this.consentForm.get('consent1')?.value && this.consentForm.get('consent2')?.value;
  }

  updateSubmitButtonState() {
    const isEnabled = this.isSubmitEnabled();
    // Logic to enable/disable the button
    // You might not need this method if you bind directly to `isSubmitEnabled()` in the template
  }

  onSubmit() {
    if (this.consentForm.valid) {
      // Handle form submission
      alert('valid form')
    }
  }
  
  
  btnClick(): void {
  
  //  this.localService.setLocalStorage('locId', this.locationId); 
    this.validateUser();
    
    // this.router.navigateByUrl(`/${this.organizationName}/home`);
  };

  changeInput() {
    this.inputType = this.inputType == 'password' ? 'text' : 'password';
  }

  backToOrgLogin() {
    localStorage.clear();
    this.router.navigateByUrl(`/organization-login`);
  }
  
  getIPAddress(){
    this.http.get("https://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.user.macID = '131312236';
    });
  }
  
  getGetOrganisationConsent(){
    
    // if (this.organizationName.toLowerCase() != 'prodtest') {
    //   this.isMandatoryConsentAccepted = true;
    //   this.byPassConsent = true;
    //   this.latestPublishDate = '08/17/2024';       
    // } else {      
      this.commonService.GetOrganisationConsent({OrganisationName:this.organizationName}).subscribe((res) =>{
        this.isMandatoryConsentAccepted = res?.body?.data?.isMandatoryConsentAccepted ==  true ? true :  false;
        this.byPassConsent = res?.body?.data?.byPassConsent;      
        this.latestPublishDate = res?.body?.data?.latestPublishDate;        
        this.acceptanceDate = res?.body?.data?.acceptanceDate;   
      })   
    // }


  }

  /**
   * Get the data by calling WebAPI to fetch the details for organization login
   */
  getOrgLocation() {
    this.isShow = true;
    this.commonService.getOrgLocation()
      .subscribe(data => {
        this.isShow = false;
          console.log('getOrgLocation :: ');
          console.log(data);
          this.locations = data.body.data;
          this.selectedLocation = this.locations[0];
          this.locationId =  this.locations[0].rowId;
          this.user.locID = this.locations[0].rowId;
          this.user.locationName = this.locations[0].locationName;
          this.loginForm.patchValue(this.user)
        },
        (err: any) => {
          this.isShow = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  changeLocationChange(locationId: any) {
    // alert(locationId);
    this.selectedLocation = this.locations.filter((item:any) => item.rowId == locationId)[0];
    // alert(JSON.stringify(this.selectedLocation));
  }
  
  validateUser() { 
    this.isSubmit =  false;
    if(this.loginForm.invalid){
      this.isSubmit =  true;
      return false;
    }    
    const req = {...this.loginForm.value,locID:Number(this.loginForm.value.locID)};
    this.commonService.validateUserCredentials(req).subscribe((data) => {
          if (data?.body.token!='' && data?.body.userdto.userName) {
            this.logInUserId = data?.body.userdto.rowId;
            this.displayOrganisationConsent(data);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials or No user found.' });
          }          
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Invalid User Credentials' });
        
          this.errorMsg = 'Error occured';
        }
      );
  }

  private displayOrganisationConsent(data: any) {
    // Convert the string to a Date object
    let date = new Date(this.latestPublishDate);

    // Add 10 days to the date
    date.setDate(date.getDate() + 5);

    // Format the new date back to 'MM/dd/yyyy'
    const latestAcceptanceDate = this.FormatDate(date);

    console.log(latestAcceptanceDate); // Outputs: 08/27/2024
    this.userData = data;
        
    if (!this.isMandatoryConsentAccepted) {      
      if (data?.body.userdto.role == 'Administrator') {
        // display waring window to Scale & Cashier to intimate Administrator
        // OnClick or OnCancel of pop-up window we will allow user to redirect on Home page 
        // till 10 days after Publish date        
        this.displayUserConsent = true;
        // TO DO : API call to get consent data
        // https://api.buyscrapapp.com/Consent/GetConsentDetails
      } else if (!this.byPassConsent) {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Your access is restricted. Please contact the Administrator to accept the updated Privacy Policy and End User License Agreement to regain access.' });
        return;
      } else {
        // display waring window to Scale & Cashier to intimate Administrator
        // OnClick or OnCancel of pop-up window we will allow user to redirect on Home page
        // till 10 days after Publish date       
        this.displayUserConsent = false;
        this.warningMessage = "As per the new policy changes, the Administrator needs to accept the Privacy Policy and End User License Agreement by " + latestAcceptanceDate + ". Otherwise, the user will not be able to log in after " + latestAcceptanceDate + ".";
        this.displayWarningDialog = true;
      } 
    } else {
      this.redirectToHomePage(data);
    }
  }


  showConsentModal(consetInfo:any){
    this.consetData = consetInfo.htmlContent
    this.showPrivacyConsent=true
  }


  getConsetInfo(){


    this.consentLoading = true;

    this.commonService.GetConsentDetails({}).subscribe((res) =>{

      this.consentLoading = false;

      this.consetInfo = res.body.data;
        console.log(this.consetInfo);
    },(error) =>{
      this.consentLoading = false;

    })
  }

  agreeConsents() {    
    this.displayUserConsent = false;   
    this.consentAgree = true;
    // this.redirectToHomePage(this.userData);
  }

  insertConsentdetail() {
    let consentIds = '';
    if (this.consentForm.value.consent1) {
      consentIds += this.consetInfo[0].rowId + ',';
    } else {
      this.displayOrganisationConsent(this.userData);
      return;
    }
    if (this.consentForm.value.consent2) {
      consentIds += this.consetInfo[1].rowId + ',';
    } else {
      this.displayOrganisationConsent(this.userData);
      return;
    }
    if (this.consentForm.value.consent3) {
      consentIds += this.consetInfo[2].rowId + ',';
    }
    if (consentIds.endsWith(",")) {
      consentIds = consentIds.slice(0, -1);
    }    
    
    const datePipe = new DatePipe('en-US');

    const reqgObj = {
      "rowId": 0,
      "consentIds":consentIds,
      "organisationId": this.OrgId,
      "isAccepted": true,
      "consentGivenDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      "consentGivenBy": this.logInUserId
    }
    this.commonService.insertConsentdetail(reqgObj).subscribe((res) =>{      
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    },
    (err: any) => {
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    });
    
  }

  closeWarningDialog() {
    //alert('close');
    this.warningMessage = "";      
    this.displayWarningDialog = false;
    this.redirectToHomePage(this.userData);
  }

  closeDialog() {
    //alert('close');   
    this.consentAgree = false;
    this.displayUserConsent = false;   
    this.redirectToHomePage(this.userData);
  }

  private FormatDate(date: Date) {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    let yyyy = date.getFullYear();

    const latestAcceptanceDate = mm + '/' + dd + '/' + yyyy;
    return latestAcceptanceDate;
  }

  redirectToHomePage(data: any) {    
    // // Convert the string to a Date object
    // let date = new Date(this.acceptanceDate);

    // // Format the new date back to 'MM/dd/yyyy'
    // const latestAcceptanceDate = this.FormatDate(date);
    
    // let todayDate = new Date();
    // const today = this.FormatDate(todayDate);

    if (data?.body.userdto.role != 'Administrator' && !this.byPassConsent && !this.isMandatoryConsentAccepted) {
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'Your access is restricted. Please contact the Administrator to accept the updated Privacy Policy and End User License Agreement to regain access.' });
      return;
    }

    //Local setting efore redirecting to home page
    this.localService.setLocalStorage('locId',Number(this.loginForm.value.locID)); 
    const locationName = this.loginForm.value.locationName;
    localStorage.setItem('locationName',locationName);
    localStorage.setItem('currencyCode',this.selectedLocation?.currencyCode || 'USD'); 
    this.localService.setLocalStorage('userObj', data?.body);

    let reqObj = {
      Key:'',
      ManageByStore:true
    }
    this.commonService.GetSystemPreferencesValue(reqObj).subscribe((systemInfo) => {      
      console.log(systemInfo?.body?.data);
      if (systemInfo?.body?.data) {
        this.localService.setLocalStorage('systemInfo', systemInfo?.body?.data);
      }
      
      if (this.consentForm.value.consent1 && this.consentForm.value.consent2 && this.consentAgree) {      
        this.insertConsentdetail();
      } else {
        if (this.isMandatoryConsentAccepted || this.byPassConsent) {
          this.router.navigateByUrl(`/${this.organizationName}/home`);
        } else {
          this.insertConsentdetail();
        }
      }
    },
    (err: any) => {
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    });

  }
   

  

}
