import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService,ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';

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
  type: any;
  isWebcam = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
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
    this.createSellerForm();
  }

  createSellerForm() {

    this.sellerForm = this.fb.group({
       firstName : [],
       sellerType:[this.sellerType],
       middleName : [],
       lastName : [],
       fullName: [],
       dob : [],
       profilePic : [],
       streetAddress : [],
       city : [],
       state : [],
       zipCode : [],
       idnumber : [],
       expiryDate : [],
       class : [],
       gender : [''],
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
       emailId : [],
       cellNumber : []
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
          // this.errorMsg = 'Error occured';
        }
      );

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

  uploadPicture(selectionType:any) {
    this.isWebcam = true;
    this.type =  selectionType
    this.cameraVisible = true;
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
    this.isWebcam = false
  } 

  handleImage(imageUrl: string) {
    // alert(imageUrl);
    this.imageUrl = imageUrl;
  }
  
  SaveImage() {
    
    const requestObj = {
      base64Data: this.imageUrl.split(';base64,')[1],
      organisationName: this.orgName,
      locationName: this.locationName,
      imagetype: parseInt(this.type)
    };
    
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
    this.cameraVisible = false;
  }
  changeSellerType() {
    if (this.sellerForm.get('sellerType')?.value) {
      this.sellerType = this.sellerForm.get('sellerType')?.value;
    } else {
      this.sellerType = 'Personal';
    }
  }




}
