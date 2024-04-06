import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';


export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('OrgKey');
  const confirmPassword = control.get('ConfirmOrgKey');

  return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [MessageService]
})
export class SignUpComponent implements OnInit, AfterViewInit, OnDestroy {

  showImage = false;

  registrationForm!: FormGroup;


  planObj: any;
  extraMOnthlyobj: any;
  organizationPlanDetails: any;
  selectedPlan: any;
  showLoder = false;
  sendDisabled = false;
  otpDisabled = false;
  showOtp = false;
  otpVerified = false;
  buttonText = 'Send Otp';
  selectedTimePeriod: any;

  stateList: any = [];
  countryList: any = [];
  cityList:any = [];


  bstateList: any = [];
  bcountryList: any = [];
  bcityList = [];

  submitted  =  false;


  countryState: any;
  countryId: any;
  cityID: any;


  constructor(
    private commonService: CommonService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {

  


  }




  ngAfterViewInit(): void {
    const ds: any = document.querySelector('body');
    if (ds) {
      ds.classList.remove('fix-body');
    }
  }

  ngOnInit(): void {
    this.getSubscription();
    this.getAllCountry();

    this.getRegistrationForm();
  }



  getAllCountry(){
    this.commonService.getAllCountry({CountryID:0}).subscribe((res) => {
      this.countryList = res.body.data;
      console.log(this.countryList)
    })
  }


//   {{BaseURL}}/Master/GetAllCountry?CountryID=0
// {{BaseURL}}/Master/GetAllState?CountryID=1&StateID=0 
// {{BaseURL}}/Master/GetAllCity?CountryID=1&StateID=1&CityID=0


  getState($event:any){
    this.countryId = $event?.target.value;
    this.commonService.getAllState({CountryID:$event?.target.value,StateID:0 }).subscribe((res) => {
      this.stateList = res.body.data;
    })
  }






  getCity($event:any) {

    this.cityID =  $event.target.value;

    this.commonService.getAllCity({CountryID:this.countryId,StateID:$event?.target.value,CityID:0}).subscribe((res) => {
      this.cityList = res.body.data;
    })

  }

  getBCity() {
    const cityName: any = this.registrationForm.controls.BillingStateID.value;
    this.cityList = this.countryState[cityName];
  }



  getRegistrationForm() {

    this.registrationForm = this.formBuilder.group({
      OrganisationName: ['', Validators.required],
      EmailID: ['', [Validators.required, Validators.email]],
      otp: [''],
      OrgKey: ['', Validators.required],

      ConfirmOrgKey: ['', Validators.required],
      ContactFirstName: ['', Validators.required],
      ContactLastName: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      JobTitle: ['', Validators.required],
      BusinessAddress: ['', Validators.required],
      CountryID: ['', Validators.required],
      StateID: ['', Validators.required],
      CityID: ['', Validators.required],
      ZipCode: ['', Validators.required],
      Sameaddress: [false],
      BillingBusinessAddress: [''],
      BillingCountryID: [''],
      BillingStateID: [''],
      BillingCityID: [''],
      BillingZipCode: [''],
      // inputUOM: ['', Validators.required],
      // currency: ['', Validators.required],
      // Recaptcha: [null, Validators.required],
      GetReference: ['web'],
      PrivacyPolicy: [false, Validators.requiredTrue],
      TermsAndCondition: [false, Validators.requiredTrue],
      Communications: [false]
    }, {
      validator: passwordMatchValidator // Apply the custom validator
    });

  }


  saveAsSameAddress(event: any) {

    const regForm = this.registrationForm.value;
    console.log(regForm);

    this.registrationForm.patchValue({
      BillingBusinessAddress: regForm.BusinessAddress,
      BillingCountryID: regForm.CountryID,
      BillingStateID: regForm.StateID,
      BillingCityID: regForm.CityID,
      BillingZipCode: regForm.ZipCode,
    })

    console.log(regForm);



  }





  getSubscription() {

    this.showLoder = true;

    this.commonService.getAllSubscriptionPlan({ SubscriptionPlanID: 0 }).subscribe((res) => {
      this.showLoder = false;
      this.planObj = res.body.data.map((res: any) => {
        const planType = this.getPlanType(res);;
        res.planDesc = this.addCrossMark(res?.planHighlights);
        res.planDetails = this.radiogetSelectedObj(res);
        res.isselected = false;
        return { ...res, ...planType };
      });

      console.log(this.planObj);

    }, (error) => {
      this.showLoder = false;
    }, () => {
      this.showLoder = false;
    })









  }

  getPlanType(res: any) {
    let pType = {
      IsFreeVersion: false,
      IsLightVersion: false,
      IsProVersion: false,
    };
    if (res.planTitle.includes('Free')) {
      pType.IsFreeVersion = true;
    } else if (res.planTitle.includes('Lite')) {
      pType.IsLightVersion = true;
    } else if (res.planTitle.includes('Plus')) {
      pType.IsProVersion = true;
    }
    return pType;



  }


  radiogetSelectedObj(res: any) {
    return [{
      amount: res?.planCostMonthly,
      type: 'Monthly',
      isSelcted: true
    }, {
      amount: res?.planCostYearly,
      type: 'Yearly',
      isSelcted: false
    }]



  }

  getSelectedPlan(planName: any, type: number) {
    if (type == 1) {
      planName[0]['isSelcted'] = true;
      planName[1]['isSelcted'] = false;
    } else {
      planName[0]['isSelcted'] = false;
      planName[1]['isSelcted'] = true;
    }

    //this.selectedTimePeriod  = planName
  }

  getSelected(res: any, index: number) {


    this.planObj[index].isselected = !this.planObj[index].isselected;

    this.planObj.map((obj: any, i: number) => {
      obj.isselected = i === index;
      return obj
    });


    res.isselected = true;
    let selectedCart = res;
    selectedCart.cartItem =
      this.selectedPlan = res;
    console.log(this.selectedPlan);


  }

  addCrossMark(descp: any) {
    const obj = descp?.split('||');

    const resp = obj.map((res: any) => {
      const crossReplace = res.replace('(X)', '');
      let obj = {
        isCross: res.includes('(X)') ? true : false,
        planDesc: crossReplace,
      }
      return obj
    })
    return resp;


  }




  ngOnDestroy(): void {

    const ds: any = document.querySelector('body');
    if (ds) {
      ds.classList.add('fix-body');
    }


  }

  addRegister() {
    this.registrationForm.reset();
    this.showImage = true;
  }

  cancelImage() {
    this.showImage = false;
  }

  makePayment() {
    this.submitted  = true

    if(!this.otpVerified){
      alert("Verify the OTP");
      return;
    }
    if(this.registrationForm.invalid){
      return;
    }
    const req = this.registrationForm.value;

    const ReqObj = {
      "RowId" : 0,
      "OrganisationName" : req.OrganisationName,
      "OrganisationDisplayName" :  req.OrganisationName,
      "OrgKey" : req.OrgKey,
      "EmailID" :  req.EmailID,
      "ContactFirstName" : req.ContactFirstName,
      "ContactLastName" :  req.ContactLastName,
      "PhoneNumber" : req.PhoneNumber,
      "JobTitle" : req.JobTitle,
      "BusinessAddress" : req.BusinessAddress,
      "CountryID" : 1,
      "StateID" : 2,
      "CityID" : 3,
      "ZipCode" : req.ZipCode,
      "Sameaddress" : req.Sameaddress,
      "BillingBusinessAddress" :req.BillingBusinessAddress,
      "BillingCountryID" : 1,
      "BillingStateID" : 2,
      "BillingCityID" : 3,
      "BillingZipCode" : req.BillingZipCode,
      "GetReference" : req.GetReference,
      "ServerName" : "",
      "DatabaseName" : "TestOrg",
      "UserName" : "",
      "Password" : "",
      "IsReportOnly" : false,
      "IsShowSafety" : false,
      "IsLocationCompliance" : false,
      "IsLightVersion" : this.selectedPlan.IsLightVersion,
      "IsProVersion" : this.selectedPlan.IsProVersion,
      "IsProPlusVersion" : false,
      "IsFreeVersion" : this.selectedPlan.IsFreeVersion,
      "SubscriptionEndDate" : "2024-04-30T03:47:54.367Z",
      "IsRecursive" : true,
      "RecursiveType" : 1, /*1- Monthly, 2- Yearly, 0- Daily, 9 - else*/
      "IsActive" : false,
      "TotalUsers" : this.planObj?.defaultUserCount || 0,
      "TotalTickets" : this.planObj?.defaultUserCount || 0,
      "TotalLocations" : 1,
      "CreatedBy" : null,
      "CreatedDate" : "2024-03-30T03:47:54.367Z",
      "UpdatedBy" : null,
      "UpdatedDate" : "2024-03-30T03:47:54.367Z"
  }

  this.commonService.createOrganisationViaWeb(ReqObj).subscribe((res) =>{
    console.log('successs');
  },(error) =>{
    console.log(error)
  })

  }

  sendOtp() {


    this.sendDisabled = true;
    this.showOtp = false;
    this.commonService.sendOTPEmail({
      EmailID: this.registrationForm.controls.EmailID.value
    }).subscribe((res) => {
      this.showOtp = true;
      this.sendDisabled = false;
      this.buttonText = 'Resend Otp';
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'Otp send successfully on email box' });

    }, (error) => {
      this.showOtp = true;
      this.sendDisabled = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!!!' });
    })
    // 


  }

  verifyOtp() {

    this.otpDisabled = true;
    this.otpVerified = false;
    this.commonService.VerifyOTP({
      EmailId: this.registrationForm?.controls?.EmailID?.value,
      OTP: "" + this.registrationForm?.controls?.otp?.value
    }).subscribe((res) => {
      this.otpVerified = true;
      this.otpDisabled = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Otp verified successfully' });

    }, (error) => {
      this.otpVerified = false;
      this.otpDisabled = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Otp Invalid' });
    })


  }





}
