import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService,ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/core/services/data.service';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HelperService } from 'src/app/core/services/helper.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-sellers',
  templateUrl: './add-sellers.component.html',
  styleUrls: ['./add-sellers.component.scss'],
  providers: [MessageService,ConfirmationService]

})
export class AddSellersComponent implements OnInit {

  orgName: any;
  logInUserId: any;
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
  activeTab: string = 'personal';


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
  checkTabView: boolean = false;

  addresses: any[] = [];
  SellerId:any;
  isEditing: boolean = false;  
  selectedAddressIndex: number | null = null;  

  certificatesList: any[] = [];
  certificateDescription: string = ''; 
  selectedCertificate: any = null;
  isEditMode: boolean = false;


  

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    public dtService:DataService,
    private http:HttpClient,
    private helperService: HelperService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private stroarge: StorageService,
    private commonService: CommonService,
   private datePipe: DatePipe) { 

      this.orgName = localStorage.getItem('orgName');
      this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
      this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
      this.locationName = localStorage.getItem('locationName');
      this.route.params.subscribe((param)=>{
        if (param["sellerId"]) {
          this.sellerId = param["sellerId"];
          this.getSellerById(); 
        } else {
          this.sellerId = 0;
          this.addresses = [];
          localStorage.removeItem('addresses');
        }    
      });
     
      this.addresses = [];

      // Load existing addresses from localStorage
      const storedAddresses = localStorage.getItem('addresses');
      if (storedAddresses) {
        this.addresses = JSON.parse(storedAddresses);
      }




     
    
      
    }

  ngOnInit() {

    this.subScriptionType = this.dtService.getActivePlan();
    this.checkTabView = this.helperService.isTab();

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
       height: [''], 
       hair: [''],   
       weight: [''], 
       eyes: [''],   
       profilePic : [],
       streetAddress : [],
       city : [],
       state : [],
       zipCode : [],
       streetNumber : [],
       streetName : [],
       idnumber : [''],
       contactName : [''],
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
       cellNumber : [''],
       certificateDescription :[]
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
      this.fetchSellerAddresses();
      this.fetchBusinessCertificates();


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
        driverLicenseNumber : res["NUMBER"],
        idnumber : res["NUMBER"],
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
        hair:res["HAIR"],
        eyes:res["EYES"],
        height:res["HGT"],
        weight:res["WGT"],
        class:res["CLASS"]

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
    if (this.sellerForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter EmailID' });
      return;
  }

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
      ...{dob:_dob, rowId: parseInt(this.sellerId),expiryDate:expDate, drivingLicenseExpiryDate:expDate, 
        createdBy: this.logInUserId, 
        updatedBy: this.logInUserId}
    }

    console.log(reqObj);
    this.commonService.addSeller(reqObj).subscribe(data =>{
      if(this.sellerId > 0){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller updated Successfully' });
        setTimeout(() => {
          this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
        }, 1000);
      }else{
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller added Successfully' });
        setTimeout(() => {
          this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
        }, 1000);
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
     height: obj.height, 
     hair: obj.hair,     
     weight: obj.weight, 
     eyes: obj.eyes,     
     profilePic: obj.profilePic,
     streetAddress: obj.streetAddress,
     city: obj.city,
     state: obj.state,
     zipCode: obj.zipCode,
     streetNumber:obj.streetNumber,
     streetName:obj.streetName,
     idnumber: obj.idnumber,
     driverLicenseNumber: obj.driverLicenseNumber,
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
     sellerType: obj.sellerType,
     contactName: obj.contactName,
     certificateDescription:obj.certificateDescription
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
    }else if (selectionType == '10') {
      this.showImageHeader = 'Business Certificate image';
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
    }else if (this.type == '4') {
      this.idfaceShotImage = this.imageUrl;
      requestObj['base64Data'] =  this.imageUrl.split(';base64,')[1];
    } else if(this.type=="5") {
      this.fingerPrints = this.imageUrl;
      requestObj['base64Data'] =  this.imageUrl;      
    } else if (this.type == "10") {
      requestObj['base64Data'] = this.imageUrl.split(';base64,')[1];
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
      } else if (this.type == "10") {
        console.log('Document uploaded successfully!');
    }
      console.log("22222222222222222222222222", this.idscanImage,this.idsignatureImage,this.idfaceShotImage,this.fingerPrints);
    })

    this.imageUrl = null;
    this.cameraVisible = false;
    

    console.log("1111111111111111111111111111", this.idscanImage,this.idsignatureImage,this.idfaceShotImage,this.fingerPrints);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
        this.fileObj = file;
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
            this.imageUrl = e.target.result; // Convert file to Base64
            this.type = '10'; 
            this.SaveImage(); 
        };

        reader.readAsDataURL(file);
    }
  }

  saveCertificate() {
    const description = this.sellerForm.get('certificateDescription')?.value;

    if (!description || !this.imageUrl) {
      alert('Please enter a description and upload an image.');
      return;
    }
    const paramObj: any = {
      RowId: this.isEditMode ? this.selectedCertificate?.RowId : 0,
      LocID: this.locId,
      SellerId: this.sellerId,
      Description: description,
      Images: this.imageUrl,
      CreatedBy: this.logInUserId,
      UpdatedBy: this.logInUserId,
      CreatedDate: new Date().toISOString(),
      UpdatedDate: new Date().toISOString(),
      IsDeleted: false
    };

    this.commonService.InsertBusinessCertificates(paramObj).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditMode ? 'Certificate updated successfully.' : 'Certificate added successfully.'
        });
        this.fetchBusinessCertificates();
        this.resetForm();
      },
      (error: any) => {
        console.error("Error saving certificate:", error);
      }
    );
  }


  fetchBusinessCertificates() {
    const paramObj = {
        SellerId: this.sellerId
      };

      this.commonService.GetBusinessCertificatesByID(paramObj).subscribe(
        (response: any) => {
          this.certificatesList = response.body.data;
        },
        (error: any) => {
          console.error("Error fetching certificate:", error);
        }
      );
    
  }
  
  editCertificate(cert: any) {
    this.isEditMode = true;
    this.selectedCertificate = {
      ...cert, 
      RowId: cert.rowID 
    };

      this.sellerForm.patchValue({
        certificateDescription: cert.description
      });
      this.imageUrl = cert.images; 
  }

  resetForm() {
    this.sellerForm.get('certificateDescription')?.reset();
    this.imageUrl = ''; 
    this.isEditMode = false; 
    this.selectedCertificate = null;

    const fileInput = document.getElementById('certificateFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  confirmDelete(cert: any) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete this user?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.removeCertificate(cert); 
        },
        reject: () => {
            this.messageService.add({
                severity: 'info',
                summary: 'Cancelled',
                detail: 'User deletion cancelled',
            });
        }
    });
  }

  removeCertificate(cert: any) {
    const paramObj = { 
      RowID: cert.rowID 
    };

    this.commonService.DeleteCertificatebyId(paramObj).subscribe(
      (response: any) => {
        this.fetchBusinessCertificates();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Certificate deleted successfully.'
        });
      },
      (error: any) => {
        console.error("Error deleting certificate:", error);
      }
    );
    
  }

  cancelEdit() {
    this.resetForm();
    this.isEditMode = false; 
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
        
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj, this.pdfViwerTitle)
        }

      
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

  fetchSellerAddresses() {
    if (this.sellerId) {
      const paramObj = {
        SellerId: this.sellerId
      };
  
      this.commonService.GetAddressesByID(paramObj).subscribe(
        (response) => {
          this.addresses = response.body.data || [];
          localStorage.setItem('addresses', JSON.stringify(this.addresses));
        },
        (error) => {
          console.error('Error fetching addresses:', error);
          this.addresses = [];
          localStorage.removeItem('addresses');
        }
      );
    } else {
      this.addresses = [];
      localStorage.removeItem('addresses');
    }
  }
  
  addAddress() {
    const sellerId = this.sellerId;
  
    // Check if sellerId exists
    if (!sellerId || sellerId === 0) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning',
        detail: 'Please create the seller first.',
      });
      this.sellerForm.reset();
      return; 
    }
  
    const streetAddress = this.sellerForm.get('streetAddress')?.value;
    const city = this.sellerForm.get('city')?.value;
    const state = this.sellerForm.get('state')?.value;
    const zipCode = this.sellerForm.get('zipCode')?.value;
    const streetNumber = this.sellerForm.get('streetNumber')?.value;
    const streetName = this.sellerForm.get('streetName')?.value;
  
    const paramObj = {
      SellerID: Number(sellerId),
      StreetAddress: streetAddress,
      StreetName: streetName,
      StreetNumber: streetNumber,
      City: city,
      State: state,
      CreatedBy: 1,
      UpdatedBy: 1,
      ZipCode: zipCode
    };
  
    const reqParms = {
      SellerID: Number(sellerId),
      StreetAddress: streetAddress,
      StreetName: streetName,
      StreetNumber: streetNumber,
      City: city,
      State: state,
      CreatedBy: 1,
      UpdatedBy: 1,
      ZipCode: zipCode
    };
  
    this.commonService.InsertMultipleAddress(paramObj, reqParms).subscribe(
      (response) => {
        this.fetchSellerAddresses();
        this.sellerForm.reset();
        console.log('Address added successfully:', response);
        this.messageService.add({
          severity: 'success', 
          summary: 'Success',
          detail: 'Address added successfully.',
        });
        this.addresses.push(paramObj);
        localStorage.setItem('addresses', JSON.stringify(this.addresses));
      },
      (error) => {
        console.error('Error adding address:', error);
      }
    );
  }
  

  editAddress(index: number) {
    this.selectedAddressIndex = index;
    const selectedAddress = this.addresses[index];
    this.isEditing = true;

    // Patch the form with the selected address details
    this.sellerForm.patchValue({
      streetAddress: selectedAddress.streetAddress,
      city: selectedAddress.city,
      state: selectedAddress.state,
      zipCode: selectedAddress.zipCode,
      streetNumber: selectedAddress.streetNumber,
      streetName: selectedAddress.streetName
    });
  }

  updateAddress() {
    if (this.selectedAddressIndex === null) return;  // address to update
    
    const selectedAddress = this.addresses[this.selectedAddressIndex];
    
    const sellerId = this.sellerId;
    const streetAddress = this.sellerForm.get('streetAddress')?.value;
    const city = this.sellerForm.get('city')?.value;
    const state = this.sellerForm.get('state')?.value;
    const zipCode = this.sellerForm.get('zipCode')?.value;
    const streetNumber = this.sellerForm.get('streetNumber')?.value;
    const streetName = this.sellerForm.get('streetName')?.value;
  
    const paramObj = {
      RowID: selectedAddress.rowId,  
      SellerID: Number(sellerId),
      StreetAddress: streetAddress,
      StreetName: streetName,
      StreetNumber: streetNumber,
      City: city,
      State: state,
      CreatedBy: 1, 
      UpdatedBy: 1, 
      ZipCode: zipCode
    };
  
    const reqParms = {
      SellerID: Number(sellerId),
      StreetAddress: streetAddress,
      StreetName: streetName,
      StreetNumber: streetNumber,
      City: city,
      State: state,
      CreatedBy: 1, 
      UpdatedBy: 1, 
      ZipCode: zipCode,
      RowID: selectedAddress.rowId  
    };
  
    this.commonService.InsertMultipleAddress(paramObj, reqParms).subscribe(
      (response) => {
        this.addresses[this.selectedAddressIndex!] = paramObj;  
        localStorage.setItem('addresses', JSON.stringify(this.addresses));  
  
        this.sellerForm.reset();
        this.isEditing = false;
        this.selectedAddressIndex = null; 
  
        console.log('Address updated successfully:', response);
        this.messageService.add({
          severity: 'success', 
          summary: 'Success',
          detail: 'Address Updated successfully.',
        });
        this.fetchSellerAddresses(); 
      },
      (error) => {
        console.error('Error updating address:', error);
      }
    );
  }
  

  deleteAddress(index: number, rowId: number) {
    const params = {
       RowID: rowId 
      };
    
    this.commonService.DeleteAddressbyId(params).subscribe(
      (response) => {
        console.log('Address deleted successfully:', response);
        this.messageService.add({
          severity: 'success', 
          summary: 'Success',
          detail: 'Address deleted successfully.',
        });
        
        this.addresses.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(this.addresses));
        
       
        this.fetchSellerAddresses();
      },
      (error) => {
        console.error('Error deleting address:', error);
      }
    );
  }

  openDatePicker() {
    const dateInput = document.getElementById('birthdate') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker(); 
    }
  }
  openExpiryDatePicker() {
    const dateInput = document.getElementById('expiryDate') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker(); 
    }
  }

}
