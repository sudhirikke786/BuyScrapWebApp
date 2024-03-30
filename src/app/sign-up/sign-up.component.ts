import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [MessageService]
})
export class SignUpComponent implements OnInit,AfterViewInit, OnDestroy {

  showImage = false;

  registrationForm!: FormGroup;


  planObj:any;
  extraMOnthlyobj:any;
  organizationPlanDetails:any; 
  selectedPlan: any;
  showLoder = false;
  sendDisabled = false;
  otpDisabled = false;
  showOtp =  false;
  otpVerified = false;
  buttonText = 'Send Otp';
  constructor(
    private commonService: CommonService, 
    private messageService: MessageService,
    private formBuilder :FormBuilder
    ){

  }

  
  ngAfterViewInit(): void {
    const ds : any = document.querySelector('body');
    if(ds){
      ds.classList.remove('fix-body');
    }   
  }

  ngOnInit(): void {
    this.getSubscription();
    this.getRegistrationForm();
  }

  

  getRegistrationForm(){

    this.registrationForm = this.formBuilder.group({
      OrganisationName: ['', Validators.required],
      EmailID: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
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
      GetReference: ['', Validators.required],
      PrivacyPolicy: [false, Validators.requiredTrue],
      TermsAndCondition: [false, Validators.requiredTrue],
      Communications: [false]
    });

  }


  getSubscription(){
 
      this.showLoder = true;
  
       this.commonService.getAllSubscriptionPlan({SubscriptionPlanID: 0}).subscribe((res) => {
          this.showLoder = false;
         this.planObj = res.body.data.map((res:any) => {
          res.planDesc =  this.addCrossMark(res?.planHighlights);
          res.isselected =  false;
          return res;
        });

       },(error)=>{
        this.showLoder = false;
       },() =>{
        this.showLoder = false;
       })
  
   
  
  
      
 
  
    

  }

  getSelected(res:any,index:number){

    
    this.planObj[index].isselected =  !this.planObj[index].isselected;
    
    this.planObj.map((obj:any, i:number) => {
      obj.isselected = i === index;
      return obj
    });
    console.log(this.planObj);

    res.isselected = true;
   this.selectedPlan = res;
    
   

  }

  addCrossMark(descp:any) {
    const obj = descp?.split('||');

    const resp = obj.map((res:any) =>{
      const crossReplace = res.replace('(X)','');
      let obj =   {
        isCross : res.includes('(X)') ?  true : false,
        planDesc : crossReplace,
       }
       return obj
    })
    return resp;

   
   }

  ngOnDestroy(): void {

    const ds : any = document.querySelector('body');
    if(ds){
      ds.classList.add('fix-body');
    }


  }

  addRegister(){
    this.showImage = true;
  }

  cancelImage(){
    this.showImage = false;
  }

  makePayment(){   
    console.log(this.registrationForm.value) 
    console.log(this.selectedPlan);
    alert(JSON.stringify(this.selectedPlan));

    // const reqObj = {
    //   amount: 1
    // };

    // this.commonService.paySubscriptionFee(reqObj).subscribe(session =>{
    //   console.log("session details :: ");
    //   console.log(session);
    //   this.commonService.redirectToCheckout(session.body);
    //   // this.htmlToAdd = session;

    //   // window.location.href = session;
    //   // return session;
    // },(error: any) =>{
    //   console.log(error);
    // })
  }

  sendOtp(){


    this.sendDisabled = true;
    this.showOtp =  false;
    this.commonService.sendOTPEmail({
      EmailID:this.registrationForm.controls.EmailID.value
    }).subscribe((res) => {
      this.showOtp =  true;
      this.sendDisabled = false;
      this.buttonText = 'Resend Otp';
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'Otp send successfully on email box' });

    },(error) =>{
      this.showOtp =  true;
      this.sendDisabled = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!!!' });
    })
   // 


  }

  verifyOtp(){

    this.otpDisabled = true;
    this.otpVerified = false;
    this.commonService.VerifyOTP({
      EmailId:this.registrationForm?.controls?.EmailID?.value,
      OTP:""+this.registrationForm?.controls?.otp?.value
    }).subscribe((res) => {
      this.otpVerified = true;
      this.otpDisabled = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Otp verified successfully' });

    },(error) =>{
      this.otpVerified = false;
      this.otpDisabled = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Otp Invalid' });
    })


  }





}
