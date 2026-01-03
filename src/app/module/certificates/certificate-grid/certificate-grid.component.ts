import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatePipe } from '@angular/common';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-certificate-grid',
  templateUrl: './certificate-grid.component.html',
  styleUrls: ['./certificate-grid.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CertificateGridComponent implements OnInit {


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

  ticketObj: any = [];
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
  selectedImageType: any = 'ID';
  
  showImageHeader = 'Show image';
  selectedImageUrl: any;
  showImage = false;
  
  fileDataObj: any;
  showDownload = false;
  isReportShow = false;
  isLoading = false;
  checkTabView: boolean = false;

  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';

  pageTotal: number = 0;
  first: number = 0;
  last: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private stroarge:StorageService,
    public helperService:HelperService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.checkTabView = this.helperService.isTab();

    this.route.queryParams.subscribe(params => {
      const searchTerm = params['search'] || '';
      this.getAllCODTickets({
        PageNumber: this.currentPage,
        RowOfPage: this.pageSize,
        LocationId: this.locId,
        SearchText: searchTerm 
      });
    });

    const storedPagination = localStorage.getItem('certificatesPaginationData_grid');
    if (storedPagination) {
      const paginationData = JSON.parse(storedPagination);
      this.currentPage = paginationData.PageNumber || 1;
      this.pageSize = paginationData.RowOfPage || 10;
      this.first = paginationData.first || 0;
    } else {
      this.currentPage = 1;
      this.pageSize = 10;
      this.first = 0;
    }
  
    this.getAllCODTickets({
      PageNumber: this.currentPage,
      RowOfPage: this.pageSize,
      LocationId: this.locId
    });
  }


  confirm1() {
    this.isConfirmModel =  true;
  }

  confirmData() {
    const isCodDone = this.checkOBj.selected;
  
    const userObj = {
      UserID:this.logInUserId,
      TicketID:this.checkOBj?.rowId,
      IsCodDone: isCodDone 
    };
  
    this.commonService.CODCloseUpdate(userObj).subscribe(
      (res) => {
        if (res?.body?.data === true) {
          this.messageService.add({ severity: "success", summary: "Success",
            detail: isCodDone
              ? "Ticket is confirmed for COD"
              : "Ticket confirmation for COD is canceled.",
          });
        }
        this.isConfirmModel =  false;
        this.getAllCODTickets(JSON.parse(localStorage.getItem('certificatesPaginationData_grid') || '{}'));
      })
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
    // alert(selectedImageType);
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

  deleteImage(item: any) {
  const index = this.certificatesImages.indexOf(item);
  if (index !== -1) {
    this.certificatesImages.splice(index, 1);
  }
  }



  
  getAllCODTickets(pagObj?: any) {
    const paramObject = {
      PageNumber: pagObj?.PageNumber,
      RowOfPage: pagObj?.RowOfPage,
      LocationId: this.locId,
      SearchText: pagObj?.SearchText || '' 
    };
    this.showLoader = true;
  
    this.commonService.getAllCODTickets(paramObject).subscribe(
      data => {
          
          let filteredData = data.body.data;
        
          if (paramObject.SearchText && !data.body.isSearchApplied) {
            const searchLower = paramObject.SearchText.toLowerCase();
            filteredData = data.body.data.filter((item: any) => {
              const ticketIdMatch = item.ticketId?.toString().includes(paramObject.SearchText);
              const customerNameMatch = item.customerName?.toLowerCase().includes(searchLower);
              
              return ticketIdMatch || customerNameMatch;
            });
          }
          
        this.certificates = filteredData.map((item: any) => {
          item.selected = item?.isCODDone ? true : false;
          return item;
        });
  
        this.pageTotal = data?.body?.totalRecords;
        this.last = data?.body?.totalIndex;
  
        // Store pagination data for grid
        localStorage.setItem('certificatesPaginationData_grid', JSON.stringify({
          PageNumber: this.currentPage,
          RowOfPage: this.pageSize,
          first: this.first
        }));
      },
      err => this.showLoader = false,
      () => this.showLoader = false
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first;
    this.pageSize = event.rows;
  
    let pagObj = {
      PageNumber: this.currentPage,
      RowOfPage: this.pageSize,
      first: this.first,
      LocationId: this.locId
    };
  
    this.getAllCODTickets(pagObj);
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
    this.selectedTicketId = obj?.rowId;
      this.showModel();
      this.certificateLoader = true;
   
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

  showSelectedImage(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    this.showImage = true;
    this.showImageHeader = 'Show Material Image';
  }

  cancelImage() {
    this.showImage = false;
  }

  GetTicketMaterialsDetailsByTicketId() {
    const paramObject = {
      TicketId: this.selectedTicketId,
      locid: this.locId,
      IsCOD: false,
      IsCODDone: false
    };
    this.commonService.GetTicketMaterialsDetailsByTicketId(paramObject)
      .subscribe(data => {
        console.log('GetTicketMaterialsDetailsByTicketId :: ');
        console.log(data);
        this.ticketObj = data.body.data.map((item: any) => {
          item.isSelected = false;
          return item
        });
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }



  // {{BaseURL}}/Materialss/CODCloseUpdate?UserID=1&TicketID=2993
  
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
    this.ivisible =  false;
  }

  showCaptureModel(){
    // this.visible = false;
    this.cvisible = true;
  }

  showItemViewModel() {
    this.GetTicketMaterialsDetailsByTicketId();
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
  

  generateCODReport(id: any) {
    this.isReportShow = true;
    this.showDownload = false;
    const param = {
      LocationId: this.locId,
      TicketId: id
    }

    this.commonService.getCODTicketReceipt(param)
      .subscribe(data => {
        console.log('getCODTicketReceipt :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"COD Receipt Report " + id);
        }

        this.showDownload = true;
      },
        (err: any) => {
          this.showDownload = true;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  closePdfReport() {
    this.showDownload = false;    
    //this.router.navigateByUrl(`${this.orgName}/ship-out`);
  }
  
}

