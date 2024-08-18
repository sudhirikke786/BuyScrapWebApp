import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService,ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/core/services/data.service';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-sellers',
  templateUrl: './add-sellers.component.html',
  styleUrls: ['./add-sellers.component.scss'],
  providers: [MessageService,ConfirmationService]

})
export class AddSellersComponent implements OnInit {

  orgName: any;
  locId: any;
  locationName: any;
  cameraVisible = false;
  showImage = false;
  showImageHeader = 'Show image';
  selectedImageUrl: any;
  imageUrl: any;
  sellerForm!: FormGroup;
  sellerId: any = 0;
  sellerType: string = 'Personal';

  idscanImage:any = 'assets/images/custom/id_scan.png';
  idsignatureImage:any = 'assets/images/custom/id_signature.png';
  idfaceShotImage:any = 'assets/images/custom/id_face.png';
  fingerPrints:any = 'assets/images/custom/id_fingerprint.png';
  showLoader = false;
  type: any;
  isWebcam = false;

  secugen_lic = "http://webapi.secugen.com";   // webapi.secugen.com
  imagePath: any;
  captureType :any;

  
  fileDataObj: any;
  showDownload = false;
  showLoaderReport = false;
  pdfViwerTitle = 'Seller Info';
  meTarialCamera :any;
  subScriptionType:any;
  showPlan =  false;
  fileObj: any;
  selectedImageType: any = 'ID';

  loaderShow = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    public dtService:DataService,
    private http:HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService) { 

      this.orgName = localStorage.getItem('orgName');
      this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
      this.locationName = localStorage.getItem('locationName');
      this.route.params.subscribe((param)=>{
        if (param["sellerId"]) {
          this.sellerId = param["sellerId"];
          this.getSellerById(); 
        } else {
          this.sellerId = 0;
        }    
      });




     
    
      
    }

  ngOnInit() {

    this.subScriptionType = this.dtService.getActivePlan();


    this.createSellerForm();

    const mCamera =  localStorage.getItem('defualtCamera') ;
    if(mCamera) {
      this.meTarialCamera = mCamera || null;
    }

  }


  createSellerForm() {

    this.sellerForm = this.fb.group({
       firstName : ['',Validators.required],
       sellerType:[this.sellerType],
       middleName : [''],
       lastName : [''],
       fullName: [''],
       dob : [],
       profilePic : [],
       streetAddress : [],
       city : [],
       state : [],
       zipCode : [],
       idnumber : [''],
       expiryDate : [],
       class : [],
       gender : ['undefind'],
       vehicleColor : [],
       vehicleType : [],
       vehicleName : [],
       licensePlateNumber : [],
       driverLicenseNumber:'',
       locID : [this.locId],
       role : [],
       userName : [],
       dealerType : [''],
       vehicleModel : [],
       emailId : [''],
       cellNumber : ['']
    })

   





  }

  showConfirmation(pos:any) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to delete?',
      accept: () => {
        // Action to take when the user clicks "Yes" or "OK"
        console.log('Confirmed');
        this.removeImage(pos)
        // Add your logic here
      },
      reject: () => {
        // Action to take when the user clicks "No" or "Cancel"
        console.log('Rejected');
        // Add your logic here
      },
    });
  }

  getSellerById() {
    this.showLoader = true;
    const paramObject = {
      ID: this.sellerId,
      LocationId: this.locId
    };
    this.commonService.getSellerById(paramObject)
      .subscribe(data => {
          console.log('getSellerById :: ');
          console.log(data);
          const obj  = data.body.data;
          this.editSellerForm(obj);
        },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.showLoader = false;
        }
      );

  }


  getUserInfo(file:any){

    const formData = new FormData();

    formData.append('File', file);   
    formData.append('DocumentType', this.selectedImageType);  
    this.loaderShow =  true;

    this.commonService.ExtractOCRData(formData).subscribe(res1 => {
      const res:any = res1;

      this.loaderShow =  false;
      if(res){
      const userObj =  {
        driverLicenseNumber : res["ID"],
        lastName: res["LN"],
        firstName : res["FN"],
        middleName:res["MN"],
        streetAddress:res["STREET"],
        city: res["CITY"],
        state:res["STATE"],
        zipCode:res["ZIP"],
        expiryDate: this.formatDate(res["EXP"]),
        dob: this.formatDate(res["DOB"]),
        gender:res["SEX"] == '' ? 'undefind' : res["SEX"] == 'M' ? 'Male' : 'Female',

       }   
       this.sellerForm.patchValue({...userObj})
      }

  
    },(error) =>{
      this.loaderShow =  false;
    });

  }



  getSelData(event:any) {
    // alert(event);
    this.fileObj = event;
   // this.getUserInfo(event)
   
  }


  goBack(){
    this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
  }

  onSubmit() {
    const dateObject = new Date(this.sellerForm?.value?.dob);
    const ExpDate =  new Date(this.sellerForm.value.expiryDate);
    const _dob = dateObject.toISOString();
    const expDate = ExpDate.toISOString();
    const reqObj = {
      ...{
        "idscanImage": this.idscanImage.includes('images/custom/id_scan.png') ? null : this.idscanImage,
        "idsignatureImage": this.idsignatureImage.includes('images/custom/id_signature.png') ? null : this.idsignatureImage,
        "idfaceShotImage": this.idfaceShotImage.includes('images/custom/id_face.png') ? null : this.idfaceShotImage,
        "fingerPrints": this.fingerPrints.includes('images/custom/id_fingerprint.png') ? null : this.fingerPrints,
      },
      ...this.sellerForm.value,
      ...{dob:_dob, rowId: parseInt(this.sellerId),expiryDate:expDate, drivingLicenseExpiryDate:expDate, createdBy: 2, updatedBy: 2}
    }

    console.log(reqObj);
    this.commonService.addSeller(reqObj).subscribe(data =>{
      if(this.sellerId > 0){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller updated Successfully' });
        this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
      }else{
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller added Successfully' });
        this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
      }
     
    },(error: any) =>{
      console.log(error);
    })
    console.log(this.sellerForm.value);

  }

  editSellerForm(obj:any) {



    //const dob = date.toLocaleDateString().substring(0,10)

    this.sellerForm.patchValue({
     firstName: obj.firstName,
     middleName: obj.middleName,
     lastName: obj.lastName,
     fullName: obj.fullName,
     dob: this.formatDate(obj?.dob),
     profilePic: obj.profilePic,
     streetAddress: obj.streetAddress,
     city: obj.city,
     state: obj.state,
     zipCode: obj.zipCode,
     idnumber: obj.idnumber,
     expiryDate: this.formatDate(obj.expiryDate),
     class: obj.class,
     gender: obj.gender,
     vehicleColor: obj.vehicleColor,
     vehicleType: obj.vehicleType,
     vehicleName: obj.vehicleName,
     licensePlateNumber: obj.licensePlateNumber,
     locID: obj.locID,
     role: obj.role,
     userName: obj.userName,
     dealerType: obj.dealerType,
     vehicleModel: obj.vehicleModel,
     emailId: obj.emailId,
     cellNumber: obj.cellNumber,
     sellerType: obj.sellerType
    });

    if(obj.sellerType){
      this.sellerType =  obj.sellerType;
    }
    
    this.idscanImage = obj.idscanImage == '' ? 'assets/images/custom/id_scan.png' : obj.idscanImage;
    this.idsignatureImage = obj.idsignatureImage == '' ? 'assets/images/custom/id_signature.png' : obj.idsignatureImage;
    this.idfaceShotImage = obj.idfaceShotImage == '' ? 'assets/images/custom/id_face.png' : obj.idfaceShotImage;
    this.fingerPrints = obj.fingerPrints == '' ? 'assets/images/custom/id_fingerprint.png' : obj.fingerPrints;

  }

  private formatDate(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  uploadPicture(selectionType:any,capType:any) {
   
    console.log(selectionType)
    this.cameraVisible = !this.cameraVisible;
    this.captureType = '';
    this.type =  selectionType;
    this.captureType = capType;
   
    // if(selectionType == '5'){
    
    

    // }else{
    //   this.cameraVisible = true;
    //   
     
    // }

   
  }



  removeImage(selectionType:any) {
    if(selectionType=='2') {
      this.idscanImage = 'assets/images/custom/id_scan.png';
    } else if(selectionType=="3") {
      this.idsignatureImage = 'assets/images/custom/id_signature.png';
    } else if(selectionType=="4") {
      this.idfaceShotImage = 'assets/images/custom/id_face.png';
    } else if(selectionType=="5") {
      this.fingerPrints = 'assets/images/custom/id_fingerprint.png';
    }
  }

  showSelectedImage(imageUrl: string, selectionType:any) {
    this.selectedImageUrl = imageUrl;
    this.showImage = true;
    if(selectionType=='2') {
      this.showImageHeader = 'Show id image';
    } else if(selectionType=="3") {
      this.showImageHeader = 'Show signature image';
    } else if(selectionType=="4") {
      this.showImageHeader = 'Show face image';
    } else if(selectionType=="5") {
      this.showImageHeader = 'Show fingerprint image';
    }
  }

  cancelImage() {
    this.showImage = false;
    this.isWebcam = false
  }

  cancel() { 
    console.log("close------");
    this.captureType = '';
    this.isWebcam = false
  } 

  handleImage(imageUrl: string) {
    // alert(imageUrl);
    this.imageUrl = imageUrl;
  //  this.fileObj = imgObj;
  }

  changeType(selectedImageType: any) {    
    this.selectedImageType = selectedImageType;
  }
  
  SaveImage() {

    if(this.fileObj && this.type=='2') {
      this.getUserInfo(this.fileObj)
    }
   
    
    let  requestObj:any = {
    
      organisationName: this.orgName,
      locationName: this.locationName,
      imagetype: parseInt(this.type)
    };
    
    if(this.type=='2') {
      this.idscanImage = this.imageUrl;
      requestObj['base64Data'] =  this.imageUrl.split(';base64,')[1];

    } else if(this.type=="3") {
      this.idsignatureImage = this.imageUrl;
      requestObj['base64Data'] =  this.imageUrl.split(';base64,')[1];

    } else if(this.type=="4") {
      this.idfaceShotImage = this.imageUrl;
      requestObj['base64Data'] =  this.imageUrl.split(';base64,')[1];

    } else if(this.type=="5") {
      this.fingerPrints = this.imageUrl;
      requestObj['base64Data'] =  this.imageUrl;
      
    }

   

    
    this.commonService.FileUploadFromWeb(requestObj).subscribe((res:any) =>{
      console.log('Image url path :: {}', res.body.data);
      console.log(res.body.data);
      this.imageUrl = res.body.data;
      if(this.type=='2') {
        this.idscanImage = this.imageUrl;
      } else if(this.type=="3") {
        this.idsignatureImage = this.imageUrl;
      } else if(this.type=="4") {
        this.idfaceShotImage = this.imageUrl;
      } else if(this.type=="5") {
        this.fingerPrints = this.imageUrl;
      }
      console.log("22222222222222222222222222", this.idscanImage,this.idsignatureImage,this.idfaceShotImage,this.fingerPrints);
    })

    this.imageUrl = null;
    this.cameraVisible = false;
    

    console.log("1111111111111111111111111111", this.idscanImage,this.idsignatureImage,this.idfaceShotImage,this.fingerPrints);
  }

  closeImageCapture() {
    this.imageUrl = null;
    this.type = '';
    this.cameraVisible = false;
  }
  changeSellerType() {
    if (this.sellerForm.get('sellerType')?.value) {
      this.sellerType = this.sellerForm.get('sellerType')?.value;
    } else {
      this.sellerType = 'Personal';
    }
  }


  setBiomatric($event:any){
    // alert($event);
    this.imageUrl = $event;
  }

  
  setSignature($event:any){
    // alert($event);
    this.imageUrl= $event;
    this.SaveImage();
  }

  generateSellerInfoReport() {    
    alert('generating report .... !!!');

    this.showDownload = true;
    this.showLoaderReport = true;

    const param = {
      LocationId: this.locId,
      SellerId: this.sellerId
    };

    this.commonService.getSellerInfo(param)
      .subscribe(data => {
        this.showLoaderReport = false;
        console.log('getSellerInfo :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
      
        this.pdfViwerTitle = 'Seller Info';
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  closePdfReport() {
    this.showDownload = false;
  }




}
