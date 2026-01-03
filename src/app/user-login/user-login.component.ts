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
  orgName: any;

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
  consentAgree = false;
  warningMessage = '';
  submitted  =  false;
  registrationForm!: FormGroup;
  userData: any;

  byPassConsent: boolean = false;
  consetInfo: any;
  consetData: any;
  
  consentLoading = false;
 

  timeZones: any[] = [];
  currency:any [] = [];
  selectedTimeZone: any = null;
  selectedCurrency:any = null;
  showTimezonePopup: boolean = false;
  IsLocationSet: boolean = false;

  showCashDrawerSelection: boolean = false;
  availableCashDrawers: any[] = [];
  selectedCashDrawer: any = null;
  MultiCashDrawerEnabled: boolean = false;
  MultiScaleEnabled: boolean = false;

  showScaleSelection: boolean = false;
  availableScales: any[] = [];
  selectedScaleMachine: any = null;
   isLoading: boolean = false;  
  constructor(private route: ActivatedRoute,
              private router: Router,
              private http:HttpClient,
              private localService:StorageService,
              private fb:FormBuilder,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private commonService: CommonService,
            private stroarge:StorageService) { }

  ngOnInit() {
    this.user.macID = "defaultMacId"
    this.orgName = localStorage.getItem('orgName');
    const userObjectExist = this.localService.getLocalStorage('userObj');
   
    if(userObjectExist){
      this.redirectToHome();
      // this.router.navigateByUrl(`/${this.organizationName}/home`);
    }
    this.getIPAddress();
    this.getConsetInfo();

    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {

      const MultiCashDrawerEnabled = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'ismulticashdrawersupport');
      this.MultiCashDrawerEnabled = String(MultiCashDrawerEnabled?.values).toLowerCase() === 'true';

      const MultiScaleEnabled = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'ismultiplescale'); 
      this.MultiScaleEnabled = String(MultiScaleEnabled?.values).toLowerCase() === 'true';
    }

    this.OrgId = this.commonService.getProbablyNumberFromLocalStorage('orgId');
    this.logInUserId = 1;

    this.route.params.subscribe((param)=>{ 
      this.organizationName = param["orgName"];
      this.getOrgLocation();
    });
    if(userObjectExist){      
      this.redirectToHome();
      // this.router.navigateByUrl(`/${this.organizationName}/home`);
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
  getAllScales() {
    this.showScaleSelection = true;  
    this.commonService.GetAllScales({}).subscribe({
      next: (res: any) => {
        this.availableScales = res?.body?.data || [];
      },
      error: (err: any) => {
        console.error('Error fetching scales:', err);
      }
    });
  }

  confirmScaleSelection() {
    if (this.selectedScaleMachine) {
      localStorage.setItem('selectedScaleMachine', JSON.stringify(this.selectedScaleMachine));
      
    }

    this.showScaleSelection = false;
    this.router.navigateByUrl(`/${this.organizationName}/home`);
  }

  cancelScaleSelection() {
    this.showScaleSelection = false;
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
      //alert('valid form')
    }
  }
  
  
  btnClick(): void {
    this.validateUser();
  };

  changeInput() {
    this.inputType = this.inputType == 'password' ? 'text' : 'password';
  }

  backToOrgLogin() {
    const materialCam = localStorage.getItem('metarialCamera');
    const defaultCam = localStorage.getItem('defualtCamera');

    localStorage.clear();

    if (materialCam) localStorage.setItem('metarialCamera', materialCam);
    if (defaultCam) localStorage.setItem('defualtCamera', defaultCam);

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
          // this.selectedLocation = this.locations[0];
          // this.locationId =  this.locations[0].rowId;
          // this.user.locID = this.locations[0].rowId;
          // this.user.locationName = this.locations[0].locationName;
          // this.loginForm.patchValue(this.user)
          const savedLocId = Number(localStorage.getItem('locId'));
          this.selectedLocation = this.locations.find((loc: any) => loc.rowId === savedLocId) || this.locations[0];

          this.locationId = this.selectedLocation.rowId;
          this.user.locID = this.selectedLocation.rowId;
          this.user.locationName = this.selectedLocation.locationName;
          this.loginForm.patchValue(this.user);

          localStorage.setItem('isLocationSet', this.selectedLocation.isLocationSet.toString());
          localStorage.setItem('cashPaymentLimit', this.selectedLocation.cashPaymentLimit?.toString() ?? '0');
          localStorage.setItem('checkOnlyPayment', this.selectedLocation.checkOnlyPayment?.toString() ?? 'false');

        },
        (err: any) => {
          this.isShow = false;
          this.backToOrgLogin();
          // this.errorMsg = 'Error occured';
        }
      );
  }

  changeLocationChange(locationId: any) {
    // alert(locationId);
    this.selectedLocation = this.locations.filter((item:any) => item.rowId == locationId)[0];
      
    this.loginForm.patchValue({
        locationName: this.selectedLocation.locationName
    });   
    // alert(JSON.stringify(this.selectedLocation));
    localStorage.setItem('isLocationSet', this.selectedLocation.isLocationSet.toString());
    localStorage.setItem('cashPaymentLimit', this.selectedLocation.cashPaymentLimit?.toString() ?? '0');
    localStorage.setItem('checkOnlyPayment', this.selectedLocation.checkOnlyPayment?.toString() ?? 'false');

  }
  
  validateUser() { 
    this.isSubmit =  false;
     this.isLoading = true; 
    if(this.loginForm.invalid){
      this.isSubmit =  true;
      this.isLoading = false;
      return false;
    }    
    const req = {...this.loginForm.value,locID:Number(this.loginForm.value.locID)};
    this.commonService.validateUserCredentials(req).subscribe((data) => {
    this.isLoading = false; 
          if (data?.body?.issuccess === false) {
            const errorMessage = data.body.message || 'Login failed';
            this.messageService.add({ severity: 'error', summary: 'Access Denied', detail: errorMessage });
            return;
          }
          if (data?.body.token!='' && data?.body.userdto.userName) {
            this.logInUserId = data?.body.userdto.rowId;
            localStorage.setItem('isLocationSet', this.selectedLocation.isLocationSet.toString());
            localStorage.setItem('userRowID', data?.body.userdto.rowId);
            localStorage.setItem('userRole', data?.body.userdto.role);
            
            this.displayOrganisationConsent(data);
            this.updateLatestLoginDate();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials or No user found.' });
          }          
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Invalid User Credentials' });
        
          this.errorMsg = 'Error occured';
          this.isLoading = false; 
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

  updateLatestLoginDate(){
    const orgName = this.orgName
    const requestObj = { OrgName: orgName };
    this.commonService.UpdateLastLoginDate(null,requestObj).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        const adminAd = response?.body?.adminAdvertisement || '';
      localStorage.setItem('adminAdvertisement', adminAd);
      },
      (error) => {
        console.error('API Error:', error);
        alert('Error updating user data!');
      }
    );
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
      this.redirectToHome();    
      // this.router.navigateByUrl(`/${this.organizationName}/home`);
    },
    (err: any) => {
      this.redirectToHome();
      // this.router.navigateByUrl(`/${this.organizationName}/home`);
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
    localStorage.setItem('cashPaymentLimit', this.selectedLocation?.cashPaymentLimit?.toString() ?? '0');
    localStorage.setItem('checkOnlyPayment', this.selectedLocation?.checkOnlyPayment?.toString() ?? 'false');

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
          this.redirectToHome();
          // this.router.navigateByUrl(`/${this.organizationName}/home`);
        } else {
          this.insertConsentdetail();
        }
      }
    },
    (err: any) => {
      this.redirectToHome();
      // this.router.navigateByUrl(`/${this.organizationName}/home`);
    });

  }
   

  getAllCurrency() {
    const params = { currencyId: 0 }; 
    this.commonService.getAllCurrency(params).subscribe({
      next: (response: any) => {
        this.currency = response?.body?.data || response?.data || [];
        console.log('Currency loaded:', this.currency);
      },
      error: (error) => {
        console.error('Error loading time zones:', error);
      }
    });
  }

  
  getTimeZones() {
    const params = { TimeZoneID: 0 }; 
    this.commonService.getAllTimeZones(params).subscribe({
      next: (response: any) => {
        this.timeZones = response?.body?.data || response?.data || [];
        console.log('TimeZones loaded:', this.timeZones);
      },
      error: (error) => {
        console.error('Error loading time zones:', error);
      }
    });
  }


  
  
  saveTimezone() {
    const selectedTimezone = this.timeZones.find(tz => tz.rowID === this.selectedTimeZone);
    const selectedCurrency = this.currency.find(c => c.rowID === this.selectedCurrency);
   
    if (selectedTimezone) {
      const requestObj = null; 
      
      const postParams = {
        locationId: this.selectedLocation.rowId,
        timeZone: selectedTimezone.timeZoneID,
        currency:  selectedCurrency.currency,
        currencyCode: selectedCurrency.currencyCode
      };
    
      this.commonService.UpdateLocationTimeZone(requestObj, postParams).subscribe({
        next: (response: any) => {
          console.log('Timezone updated successfully:', response);
          localStorage.setItem('isTimezoneSelected', 'true');
          this.IsLocationSet = true;
          console.log('IsLocationSet after update:', this.IsLocationSet);
          localStorage.setItem('currencyCode', selectedCurrency?.currencyCode || 'USD');

          this.showTimezonePopup = false;
          this.router.navigateByUrl(`/${this.organizationName}/home`);
        },
        error: (error) => {
          console.error('Error updating timezone:', error);
          // this.router.navigateByUrl(`/${this.organizationName}/home`);
           this.checkRoleAndProceed();
        }
      });
    }
  }

  

  redirectToHome(): void {    
    const isLocationSet = localStorage.getItem('isLocationSet');    
    this.getTimeZones();
    this.getAllCurrency();
    if (isLocationSet !== 'true') {
      this.showTimezonePopup = true;
    } else {
      this.showTimezonePopup = false;
      // this.router.navigateByUrl(`/${this.organizationName}/home`);
      this.checkRoleAndProceed();
    }
  }


  checkRoleAndProceed() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'Scale' && this.MultiScaleEnabled) {    
      this.getAllScales();
      return;
    }
    if (this.MultiCashDrawerEnabled) {
      if (userRole === 'Cashier') {
        this.showCashDrawerSelectionPopup();
      }
     else if (userRole === 'Administrator') {
        // For Admin, check if a drawer is already selected. If not, set a default.
        const existingDrawerId = localStorage.getItem('selectedCashDrawerId');
        if (!existingDrawerId) {
          this.setDefaultCashDrawerForAdmin();
        } else {
          this.router.navigateByUrl(`/${this.organizationName}/home`);
        }
      } else {
        this.router.navigateByUrl(`/${this.organizationName}/home`);
      }
    } else {
      const existingDrawerId = localStorage.getItem('selectedCashDrawerId');

      if (!existingDrawerId) {
        const defaultDrawer = {
          rowId: 1,
          drawerName: 'Default Drawer'
        };
        localStorage.setItem('selectedCashDrawer', JSON.stringify(defaultDrawer));
        localStorage.setItem('selectedCashDrawerId', '1');
      }

      this.router.navigateByUrl(`/${this.organizationName}/home`);
    }
  }

  setDefaultCashDrawerForAdmin() {
    const locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    const paramObj = {
      locID: locId
    };

    this.commonService.GetAllCashDrawers(paramObj).subscribe({
      next: (res: any) => {
        const cashDrawers = res?.body?.data || [];
        if (cashDrawers.length > 0) {
          const firstDrawer = cashDrawers[0];
          console.log(`Setting default drawer for Admin to: ${firstDrawer.drawerName} (ID: ${firstDrawer.rowId})`);
          
          localStorage.setItem('selectedCashDrawerId', firstDrawer.rowId.toString());
        } else {
          console.warn('No cash drawers found for this location.');
        }
        this.router.navigateByUrl(`/${this.organizationName}/home`);
      },
      error: (err: any) => {
        console.error('Failed to fetch cash drawers to set a default for admin.', err);
        this.router.navigateByUrl(`/${this.organizationName}/home`);
      }
    });
  }

   showCashDrawerSelectionPopup() {
    // this.logInUserId = localStorage.getItem('userRowID'); 
    this.GetCashDrawerByUserID();
    this.showCashDrawerSelection = true;
  }

  GetCashDrawerByUserID() {
      const paramObj = {
        userID: this.logInUserId,
        locID: this.commonService.getProbablyNumberFromLocalStorage('locId')
      };

      this.commonService.GetCashDrawerByUserID(paramObj).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data) {
            this.availableCashDrawers = response.body.data;

            if (this.availableCashDrawers.length === 1) {
              // If there's only one drawer, auto-select it 
              this.selectedCashDrawer = this.availableCashDrawers[0];
              console.log('Only one cash drawer found. Auto-selecting:', this.selectedCashDrawer);
              this.confirmCashDrawerSelection(); 
            } else if (this.availableCashDrawers.length > 1) {
              // If there are multiple drawers, show the popup for selection.
              const defaultDrawer = this.availableCashDrawers.find(drawer => drawer.isDefault);
              if (defaultDrawer) {
                this.selectedCashDrawer = defaultDrawer;
              } else {
                // Pre-select the first one if no default is set
                this.selectedCashDrawer = this.availableCashDrawers[0];
              }
              this.showCashDrawerSelection = true;
            } else {
              // No cash drawers are assigned to this user.
              this.messageService.add({ severity: 'warn', summary: 'No Cash Drawer', detail: 'No cash drawer is assigned to your account. Proceeding without one.' });
              this.router.navigateByUrl(`/${this.organizationName}/home`);
            }
          } else {
            this.messageService.add({ severity: 'warn', summary: 'No Cash Drawer', detail: 'No cash drawer is assigned to your account.' });
            this.router.navigateByUrl(`/${this.organizationName}/home`);
          }
        },
        (error: any) => {
          console.error('Error loading cash drawers:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load cash drawers.' });
          this.router.navigateByUrl(`/${this.organizationName}/home`);
        }
      );
    }

   confirmCashDrawerSelection() {
    if (!this.selectedCashDrawer) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please select a cash drawer'});
      return;
    }

    console.log('Selected Cash Drawer:', this.selectedCashDrawer);  
    localStorage.setItem('selectedCashDrawer', JSON.stringify(this.selectedCashDrawer)); 
    this.showCashDrawerSelection = false;
    this.router.navigateByUrl(`/${this.organizationName}/home`);
  }

  cancelCashDrawerSelection() {
    this.showCashDrawerSelection = false;
    this.router.navigateByUrl(`/${this.organizationName}/home`);
  }


}
