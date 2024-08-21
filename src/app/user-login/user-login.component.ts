import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../core/interfaces/common-interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from '../core/services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  displayWarningDialog = false;
  displayUserConsent = false;
  showPrivacyConsent = false;
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

    this.commonService.GetOrganisationConsent({OrganisationName:this.organizationName}).subscribe((res) =>{
      this.isMandatoryConsentAccepted = res?.data?.isMandatoryConsentAccepted ==  false ? true :  false;
      this.byPassConsent = true;
    })

    
    if (this.organizationName.toLowerCase() != 'prodtest') {
      this.isMandatoryConsentAccepted = true;
      this.byPassConsent = true;
      this.latestPublishDate = '08/17/2024';       
    } else {
      this.isMandatoryConsentAccepted = false;
      this.byPassConsent = true;
      this.latestPublishDate = '08/17/2024';     
    }


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
        this.getConsetInfo();
        // TO DO : API call to get consent data
        // https://api.buyscrapapp.com/Consent/GetConsentDetails
      } else {
        // display waring window to Scale & Cashier to intimate Administrator
        // OnClick or OnCancel of pop-up window we will allow user to redirect on Home page
        // till 10 days after Publish date 
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

//     consentType
// : 
// "PrivacyPolicy"
// createdDate
// : 
// "2024-08-16T19:58:24.86"
// displayLinkText
// : 
// "Privacy Policy"
// displayTitle
// : 
// "I agree to BuyScrapApp's"
// htmlContent
// : 
// "<div _ngcontent-die-c58=\"\" class=\"row ng-tns-c7-33\"><div _ngcontent-die-c58=\"\" class=\"p-title\"> Effective Date: 17-7-2024 </div><p _ngcontent-die-c58=\"\"> Thank you for using the BuyScrapApp Online Application (\"the App\"). This Privacy Policy outlines how we collect, use, and protect your and your customers’ personal information when you use our services. By using the App, you agree to the terms of this Privacy Policy. </p><ol _ngcontent-die-c58=\"\" class=\"list-group list-group-numbered\"><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Information We Collect</span><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Personal Information:</span> When you sign up for an account or use our services, we may collect personal information such as your name, email address, phone number, and payment information. </li><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Transaction Information:</span> We collect information related to your transactions on the platform, including details of scrap items bought or sold, transaction amounts, and shipping information. </li><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Device Information:</span> We may collect device-specific information such as your device model, operating system, IP address, and browser type. </li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">How We Use Your Information</span><div _ngcontent-die-c58=\"\"><h5 _ngcontent-die-c58=\"\">We use the information we collect for the following purposes:</h5><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\">Facilitating transactions and providing our services.</li><li _ngcontent-die-c58=\"\">Communicating with you about your account, transactions, and updates.</li><li _ngcontent-die-c58=\"\">Improving our services and user experience.</li><li _ngcontent-die-c58=\"\">Complying with legal and regulatory requirements.</li></ul></div></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Types of Information Collected</span><p _ngcontent-die-c58=\"\">In addition to the standard information outlined in our general Privacy Policy, we may collect the following sensitive personal information from users:</p><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Biometric Data:</span> This may include fingerprints, signatures, or other biometric identifiers provided by users for identity verification purposes. </li><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Government ID Copies:</span> Users may be required to submit copies of their government- issued identification documents (e.g., driver's license) for verification purposes. </li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Purpose of Biometric Data and ID Copies</span><p _ngcontent-die-c58=\"\">We collect and use biometric data and ID copies solely for the following purposes:</p><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Identity Verification::</span> Biometric data and ID copies are used to verify the identity of users and prevent fraudulent activities on our platform. </li><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Compliance: </span>We may collect and retain this information to comply with legal and regulatory requirements related to scrap buying and selling. </li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Use and Disclosure of Biometric Data</span><p _ngcontent-die-c58=\"\">We use biometric data only for the specific purposes for which it was collected, such as user authentication and identity verification.</p><p _ngcontent-die-c58=\"\"> We do not disclose biometric data to third parties except as required by law or with explicit user consent. </p></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Sharing of Information</span><p _ngcontent-die-c58=\"\">We may share your information with third parties under the following circumstances:</p><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\">With service providers and partners who assist us in providing and improving our services. </li><li _ngcontent-die-c58=\"\"> With law enforcement or government authorities if required by law or to protect our legal rights. </li><li _ngcontent-die-c58=\"\"> With your consent or as otherwise disclosed at the time of data collection. </li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Data Retention and Security</span><ul _ngcontent-die-c58=\"\"><li _ngcontent-die-c58=\"\"> We retain biometric data and ID copies only for as long as necessary to fulfil the purposes outlined above or as required by law. </li><li _ngcontent-die-c58=\"\"> We implement strict security measures to protect personal information, biometric data and ID copies from unauthorized access, use, or disclosure. This includes separation of data based on organisation by maintaining different database, access controls, and regular security audits. </li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">User Consent</span><p _ngcontent-die-c58=\"\">By using our services and submitting personal information, biometric data or ID copies of your customers, you consent to the collection, use, and retention of this information as described in this Privacy Policy.</p><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Consent for Collection:</span> Before collecting any personal information, biometric data, or ID copies from customers, you will obtain explicit consent from them.</li><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">Withdrawal of Consent:</span> You have the right to withdraw your consent at any time. However, please note that withdrawing consent may impact your ability to use certain features of our services.</li><li _ngcontent-die-c58=\"\"><span _ngcontent-die-c58=\"\" class=\"p-title\">How to Withdraw Consent: </span>To withdraw consent or for any questions regarding the handling of your sensitive</li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Your Rights</span><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\">You have the right to request access to, correction of, or deletion of your customer personal information, biometric data and ID copies.</li><li _ngcontent-die-c58=\"\">To exercise these rights or for any questions regarding the handling of your sensitive information, please contact us using the contact information provided below.</li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Cookies and Tracking&lt;</span><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\"> We use cookies and similar tracking technologies to analyse usage patterns, personalize content, and improve our services. You can manage your cookie preferences through your browser settings.</li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><span _ngcontent-die-c58=\"\" class=\"h-title\">Policy Updates</span><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\">We may update this section of our Privacy Policy to reflect changes in our practices or applicable laws. We will notify you of any material changes to our handling of personal</li><li _ngcontent-die-c58=\"\"> information, biometric data or ID copies or any changes by posting the updated policy on our website or within the App.</li></ul></li><li _ngcontent-die-c58=\"\" class=\"list-group-item\"><p _ngcontent-die-c58=\"\">If you have any questions or concerns about our Privacy Policy or data practices, please contact us at:</p><ul _ngcontent-die-c58=\"\" class=\"info-desc\"><li _ngcontent-die-c58=\"\"> [Your Company Name] </li><li _ngcontent-die-c58=\"\">[Address]</li><li _ngcontent-die-c58=\"\">Email: Contactus@buyscrapapp.com</li><li _ngcontent-die-c58=\"\">510-372-0872</li></ul></li></ol></div>"
// isMandatory
// : 
// true
// publishedDate
// : 
// "2024-08-18T20:05:07.803"
// rowId
// : 
// 1
// version
// : 
// 1
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
    //alert('agree')
    this.displayUserConsent = false;   
    this.displayWarningDialog = false;

    // const reqgObj = {
    //   "rowId": 0,
    //   "consentIds":"1,2",
    //   "organisationId": 1,
    //   "isAccepted": true,
    //   "consentGivenDate": "2024-08-17T18:14:02.693Z",
    //   "consentGivenBy": 1 //loged in user id
    // }
    // this.commonService.insertConsentdetail(reqgObj).subscribe((res) =>{
        //this.redirectToHomePage(this.userData);
    // });
    
  }

  closeWarningDialog() {
    //alert('close');
    this.warningMessage = "";     
    this.displayUserConsent = false;   
    this.displayWarningDialog = false;
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
    // Convert the string to a Date object
    let date = new Date(this.latestPublishDate);

    // Add 5 days to the date
    date.setDate(date.getDate() + 5);

    // Format the new date back to 'MM/dd/yyyy'
    const latestAcceptanceDate = this.FormatDate(date);
    
    let todayDate = new Date();
    const today = this.FormatDate(todayDate);

    if (this.organizationName.toLowerCase() == 'prodtest' && data?.body.userdto.role != 'Administrator' && today >= latestAcceptanceDate) {
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
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    },
    (err: any) => {
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    });

  }
   

  

}
