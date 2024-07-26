import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-certificates-dashboard',
  templateUrl: './certificates-dashboard.component.html',
  styleUrls: ['./certificates-dashboard.component.scss'],
  providers: [ConfirmationService, MessageService]

  
})
export class CertificatesDashboardComponent implements OnInit {


  showLoader = false;
  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    }
  ];

  visible = false;
  cvisible = false;
  ivisible =  false;

  
  orgName: any;
  locId: any;
  logInUserId: any;
  locationName: any;
  
  certificates: any;
  certificatesImages: any;

  selectedTicketId: any;
  certificateLoader = false;
  selectedProducts:any;
  isShowModel = false;
  checkOBj: any;
  currentIndex: any;
  isConfirmModel: boolean = false;
  certificateDesc:any;
  materialDesc:any;
  imageUrl: any;
  imagePath: any;
  selectedImageType: any = '1';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private stroarge:StorageService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    
    this.getAllCODTickets();
  }


  confirm1() {
  
    this.isConfirmModel =  true;
  }

  confirmData(){
    
    this.saveConfirm();
  }

  saveConfirm(){
    this.isConfirmModel =  false;
  }

  cancelClick(){
      this.certificates[this.currentIndex].selected =  false;
      this.isConfirmModel = false;
  }


  

  handleImage(imageUrl: string) {
    //alert(imageUrl);
    this.imageUrl = imageUrl;
  }

  changeType(selectedImageType: any) {    
    alert(selectedImageType);
    this.selectedImageType = selectedImageType;
  }
  
  SaveImage() {
    
    let  requestObj:any = {    
      organisationName: this.orgName,
      locationName: this.locationName,
      imagetype: 6 //parseInt(this.selectedImageType)
    };
    requestObj['base64Data'] =  this.imageUrl.split(';base64,')[1];

    this.commonService.FileUploadFromWeb(requestObj).subscribe((res:any) =>{
      console.log('Image url path :: {}', res.body.data);
      console.log(res.body.data);
      this.imagePath = res.body.data;
    
      const datePipe = new DatePipe('en-US');

      let newCODImageObject = 
      {
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketID: this.selectedTicketId ,
          codImagePath: this.imagePath
      };
      console.log('this.certificatesImages ::');
      console.log(this.certificatesImages);
      this.certificatesImages.push(newCODImageObject);    
      console.log(this.certificatesImages);
      this.imagePath = null;

    });
    this.imageUrl = null;
    this.cvisible = false;
  }



  
  getAllCODTickets() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.showLoader = true;
    this.commonService.getAllCODTickets(paramObject)
      .subscribe(data => {
          console.log('getAllCODTickets :: ');
          console.log(data);
          this.certificates = data.body.data.map((item:any) => {
            item.selected =  item?.dateClosed ? true : false;
            return item;
          });
          console.log(this.certificates);
        },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () =>  {
          this.showLoader = false;
        }
      );
  }

  setChecked(item: any,rowIndex:any): void {
      this.currentIndex = rowIndex;
      this.checkOBj = item;
      this.confirm1();
    
      
  }

  onCheckboxChange(item: any) {
    // Handle individual checkbox change if needed
    console.log('Checkbox state changed for item:', item);

    this.confirm1();
  }

  toggleAllSelection() {
    
    // Toggle all checkboxes state
   // this.selectAll = !this.selectAll;
  //  this.certificates.forEach((item:any)=> (item.selected = this.selectAll));
  }

  codeAdd(){
    this.showModel();
  }


  getCODImagesbyID(obj:any,type:string){
    if(type=='cod'){
      this.codeAdd()
    }else{
      this.showModel();
    this.certificateLoader = true;
    this.selectedTicketId = obj?.rowId;
    const paramObject = {
      TicketID: this.selectedTicketId
    }
    this.certificatesImages = [];
    this.materialDesc = obj.codDescription;
    this.commonService.GetCODImagesbyID(paramObject)
      .subscribe(data => {
        
          this.certificatesImages = data.body.data;
          
        },
        (err: any) => {
          this.certificateLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.certificateLoader = false;
        }
      );
    }
  }
  
  saveCOD() {

    const lstMaterialsDTOObj = this.certificatesImages.map((item:any) => {
           const obj =  {
              rowId: item.rowId,
              codImagePath: item.codImagePath
            };
            return obj
     });
       
    const requestObj ={
      rowId: 0,      
      userID: Number(this.logInUserId),
      ticketID: Number(this.selectedTicketId),
      codImagePath: '',
      codDescription: this.materialDesc ?? '',
      lstMaterialsDTO: lstMaterialsDTOObj
    }

    this.commonService.MaterialCODImageUpdate(requestObj).subscribe((res) =>{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: "Data Inserted Successfully" });
      this.visible = false;
      this.getAllCODTickets();
      this.certificatesImages = [];
      this.materialDesc = '';
    });

  }

  showModel(){
    this.certificatesImages = [];
    this.materialDesc = '';
    this.visible = true;
  }

  showCaptureModel(){
    // this.visible = false;
    this.cvisible = true;
  }

  showItemViewModel() {
    this.ivisible =  true;
  }

  hideItemViewModel() {
    this.ivisible =  false;
  }



  hideCaptureModel(){
    this.cvisible = false;
  }

  hideModel(){
    this.visible = false;
    this.certificatesImages = [];
    this.materialDesc = '';
  }
  
}
