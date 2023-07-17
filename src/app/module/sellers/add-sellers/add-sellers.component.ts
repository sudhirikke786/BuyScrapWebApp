import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RowGroupHeader } from 'primeng/table';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-add-sellers',
  templateUrl: './add-sellers.component.html',
  styleUrls: ['./add-sellers.component.scss']
})
export class AddSellersComponent implements OnInit {

  orgName: any;
  locId = 1;
  editItemVisible = false;
  imageUrl: any;
  sellerForm!: FormGroup;
  sellerId: any = 0;

  idscanImage:any;
  idsignatureImage:any;
  idfaceShotImage:any;
  fingerPrints:any;
  type: any;
  isWebcam = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commonService: CommonService) { 


      this.route.params.subscribe((param)=>{
        this.sellerId = param["sellerId"];
        this.getSellerById();      
      });
      
    }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.createSellerForm();
  }

  createSellerForm() {

    this.sellerForm = this.fb.group({
       firstName : [],
       sellerType:[],
       middleName : [],
       lastName : [],
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
       locID : [this.locId],
       role : [],
       userName : [],
       dealerType : [''],
       vehicleModel : [],
       emailId : [],
       cellNumber : []
    })


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
    const _dob = dateObject.toISOString();

    const reqObj = {...{"idscanImage": "https://prodbuyscrapapp.s3-us-west-1.amazonaws.com/CalWest Recycling/Hayward California/ID/2a876e28-a70c-4f97-b6b7-cba51bf6f40a.jpeg",
    "idsignatureImage": "https://prodbuyscrapapp.s3-us-west-1.amazonaws.com/CalWest Recycling/Hayward California/Signature/2048474f-ff79-4413-a38b-0ba601b6e9c7.png",
    "idfaceShotImage": "https://prodbuyscrapapp.s3-us-west-1.amazonaws.com/CalWest Recycling/Hayward California/Face/1e719c79-9da4-4f35-91b3-d3332e3a6b47.jpeg",
    "fingerPrints": "https://prodbuyscrapapp.s3-us-west-1.amazonaws.com/CalWest Recycling/Hayward California/FingurePrint/add101ae-7dc7-4fc8-b488-09d41138fbe1.png",
    "driverLicenseNumber": "GH54E45",
    "drivingLicenseExpiryDate": "2003-07-03T03:13:18.659Z"},...this.sellerForm.value,...{dob:_dob, rowId: parseInt(this.sellerId), createdBy: 2, updatedBy: 2}}
    console.log(reqObj);
    this.commonService.addSeller(reqObj).subscribe(data =>{
      console.log("insert");
    },(error: any) =>{
      console.log(error);
    })
    console.log(this.sellerForm.value);

  }

  editSellerForm(obj:any) {
    let _dob = new Date(obj.dob);
    //const dob = date.toLocaleDateString().substring(0,10)

    this.sellerForm.patchValue({
     firstName: obj.firstName,
     middleName: obj.middleName,
     lastName: obj.lastName,
     dob: _dob,
     profilePic: obj.profilePic,
     streetAddress: obj.streetAddress,
     city: obj.city,
     state: obj.state,
     zipCode: obj.zipCode,
     idnumber: obj.idnumber,
     expiryDate: obj.expiryDate,
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

    })

  }


  uploadPicture(selectionType:any) {

    this.isWebcam = true;
    this.type =  selectionType
    this.editItemVisible = true;
  }

  cancel() {
    this.isWebcam = false
  }
 

  handleImage(imageUrl: string) {
    if(this.type=='1') {
      this.idscanImage = imageUrl;
    }else if(this.type=="2"){
      this.idsignatureImage = imageUrl;
    }else if(this.type=="3"){
      this.idfaceShotImage = imageUrl;
    }else {
      this.fingerPrints = imageUrl;
    }
    console.log(this.idscanImage,this.idsignatureImage,this.idfaceShotImage,this.fingerPrints)

  }
  

}
