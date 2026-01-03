import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { SellersService } from 'src/app/core/services/sellers.service';
import { HelperService } from 'src/app/core/services/helper.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-sellers-buyers-dashboard',
  templateUrl: './sellers-buyers-dashboard.component.html',
  styleUrls: ['./sellers-buyers-dashboard.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class SellersBuyersDashboardComponent implements OnInit {
  
  orgName: any;
  locId: any;
  datePipe: DatePipe = new DatePipe('en-US');
  logInUserId: any;
  isDeleteConfirmModel: boolean = false;
  selectedSellerForDelete: any;
  sourceSellerToMerge: any;
  targetSellerToMerge: any;
  showRewardDialog: boolean = false;
  rewardList: any[] = [];
  remainingBalance: number = 0;
  redeemedCoupons:number = 0;
  customerId!: number; 
  showImage = false;
  showImageHeader = 'Show image';
  selectedImageUrl: any;

  displayAdvanceDialog: boolean = false;
  advanceAmount: number = 0;
  reason: string = '';
  selectedSeller: any = null;

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search',
      label:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh',
      label:'Refresh'
    },{
      iconcode:'mdi-plus',
      title:'Add Seller',
      label:'Add Seller'

    }
  ];

  sellers: any;
  searchSellerInput: any = '';
  sellerLoader:boolean = false;
  currentPage = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  pageTotal = 0;
  selectedSellerType: string = '';
  IsCustomerAdvanceEnabled: boolean = false;
  IsCustomerFacePictureEnabled:boolean = false;
  IsRewardEnabled: boolean = false;
  isCardView = true;
  isAdvanceReportShow: boolean = false;
  showLoaderAdvanceReport: boolean = false;
  advanceReceiptBase64: any;
  advanceId: any;
  adminAdvertisement!:  string | null;
  activeDrawerId: number = 0; 
  selectedCashDrawer: any = null; 
  paidTicketCount: any;
  cashDrawerBalanceAmount: any;

  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private stroarge:StorageService,
    private messageService: MessageService,
    public commonService: CommonService,
    public sellersService:SellersService,
    public helperService:HelperService,
    public dataService: DataService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');

    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    this.activeDrawerId = localStorage.getItem('selectedCashDrawerId') 
      ? parseInt(localStorage.getItem('selectedCashDrawerId')!, 10) 
      : (this.selectedCashDrawer ? this.selectedCashDrawer.drawerID : 1);
    if (_dataObj) {
      const iscustomeradvance = _dataObj.filter((item: any) => item?.keys?.toLowerCase() === 'iscustomeradvance')[0];
      this.IsCustomerAdvanceEnabled = (iscustomeradvance?.values.toLowerCase() === 'true');

      const isCustomerFacePicture = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'iscustomerfacepicture');
      this.IsCustomerFacePictureEnabled = String(isCustomerFacePicture?.values).toLowerCase() === 'true';
      
      const isRewardEnabled = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'isreedeemcoupen');
      this.IsRewardEnabled = String(isRewardEnabled?.values).toLowerCase() === 'true';
    }

    this.route.queryParams.subscribe(params => {
      this.selectedSellerType = params['sellerType'] || '';
      this.filterSellers(this.selectedSellerType);
    });
  
  
    const storedPagination = localStorage.getItem('sellerPaginationData');
    if (storedPagination) {
      const parsedData = JSON.parse(storedPagination);
      this.currentPage = parsedData.currentPage;
      this.pageSize = parsedData.pageSize;
      this.first = parsedData.first;
    } else {
      this.pageSize = 10;
      this.currentPage = 1;
      this.first = 0;
    }
  
    const paramObject = {
      PageNumber: this.currentPage,
      RowOfPage: this.pageSize,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%"),
      SellerType: this.selectedSellerType
    };
    this.getAllsellersDetails(paramObject);
  }

  applySearch(searchText: string) {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId,
      SerachText: searchText
    };
    this.getAllsellersDetails(paramObject);
  }

  refreshData() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId,
      SerachText: '' 
    };
    this.getAllsellersDetails(paramObject);
  }

  
  getAllsellersDetails(paramObject: any) {
    this.sellerLoader =  true;
    this.commonService.getAllsellersDetails(paramObject)
    .subscribe(data => {
        console.log('getAllsellersDetails :: ');
        console.log(data);
        this.sellers = data.body.data;
        this.pageTotal =  data?.body?.totalRecord
        this.last = data?.body?.totalIndex;
  
        const paginationData = {
          currentPage: paramObject.PageNumber,
          pageSize: paramObject.RowOfPage,
          first: (paramObject.PageNumber - 1) * paramObject.RowOfPage
        };
        localStorage.setItem('sellerPaginationData', JSON.stringify(paginationData));
      },
      (err: any) => {
        // this.errorMsg = 'Error occured';
        this.sellerLoader =  false;
      },
      () =>{
        this.sellerLoader =  false;
      }
    );
  }

  
  filterSellers(sellerType: string) {
    this.selectedSellerType = sellerType;
    this.sellerLoader =  true;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId,
      SerachText: this.searchSellerInput,
      SellerType: this.selectedSellerType
    };
    this.getAllsellersDetails(paramObject); 
  }
  
  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first ;
    let pagObj = {
      PageNumber: this.currentPage,
      RowOfPage: event.rows,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%")
    }
    this.pageSize = event.rows;
    // this.pagination = {...this.pagination,...pagObj};
    this.getAllsellersDetails(pagObj);
  }

  determineViewMode() {
    this.isCardView = true; 
  }

  onToggleChange() {
    if (this.isCardView) {
        this.router.navigate([`/${this.orgName}/sellers-buyers`]);
      } else {
        this.router.navigate([`/${this.orgName}/sellers-buyers`]);
    }
    this.sellerLoader = true;
    const paramObject = {
      PageNumber: this.currentPage,
      RowOfPage: this.pageSize,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%"),
      SellerType: this.selectedSellerType
    };

    this.getAllsellersDetails(paramObject);
  }

  

  /** Seller pop up actions start */

  searchSeller() {
    this.first = 0;
    this.last = 9;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%")
    };
    this.getAllsellersDetails(paramObject);

  }

  refreshSellerData() {
    this.searchSellerInput = '';
    this.first = 0;
    this.last = 9;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%")
    };
    this.getAllsellersDetails(paramObject);
  }

  addNewSeller() {    
    this.router.navigateByUrl(`${this.orgName}/sellers-buyers/add-seller`)
  }  
  /** Seller pop up actions end */


  deleteSeller(seller: any) {
    console.log('Delete action Triggered :: ');
    console.log(seller);

    this.isDeleteConfirmModel =  true;
    this.selectedSellerForDelete = seller;
    
    // this.commonService.addSeller(seller).subscribe(data =>{
    //   alert("Delete Seller successfully")
    //   // if(this.sellerId > 0){
    //   //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller updated Successfully' });
    //   //   this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
    //   // }else{
    //   //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller added Successfully' });
    //   //   this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
    //   // }
     
    // },(error: any) =>{
    //   console.log(error);
    // })

  }  

  
  deleteSellerDetails(seller: any) {
    // console.log('Confirm Delete action Triggered :: ');
    // seller.isDeleted = true;
    
    // seller.updatedBy = this.logInUserId;
    // seller.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    // console.log(seller);

    const reqObject = {
      RowId: seller.rowId
    }

    this.commonService.DeleteSellerbyId(reqObject).subscribe(data =>{
      // alert("Seller deleted Successfully");
      console.log(data);

      
      if(data.body.data){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller deleted Successfully' });
      }else{
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller not deleted. Please contact admin' });
      }

      
      const paramObject = {
        PageNumber: 1,
        RowOfPage: 10,
        LocationId: this.locId,
        SerachText: this.searchSellerInput.replace(/ /g, "%")
      };
      this.getAllsellersDetails(paramObject);
     
    },(error: any) =>{
      console.log(error);
    })

  } 

  confirmData(){
    this.isDeleteConfirmModel =  false;
    this.deleteSellerDetails(this.selectedSellerForDelete);
    // alert("Confirmed Delete !!!");
  }

  cancelClick(){
      this.isDeleteConfirmModel = false;
      // alert("Canceled Delete !!!");
  }

  mergeSellerData(){
      this.isDeleteConfirmModel = false;
      // alert("Merge Tickets & other data with other seller!!! Functionality still in progress!!!");
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Merge Tickets & other data with other seller!!! Functionality still in progress!!!' });
  }

  showSelectedImage(imageUrl: string, selectionType:any) {
    this.selectedImageUrl = imageUrl;
    this.showImage = true;
    if(selectionType=='1') {
      this.showImageHeader = 'Show seller photo';
    } 
  }

  cancelImage() {
    this.showImage = false;
  }

  openAdvancePopup(seller: any){
    this.selectedSeller = seller;
    this.advanceAmount = 0;
    this.reason = '';
    this.displayAdvanceDialog = true;
  }

  closeAdvancePopup(){
    this.displayAdvanceDialog = false;
    this.selectedSeller = null;
  }

  saveAdvance(seller:any) {
    const requestObj = {
      rowID: 0,
      customerID: seller.rowId, 
      advanceAmount: this.advanceAmount,
      reason: this.reason,
      isAdvance: true,
      locID: this.locId,
      createdBy: this.logInUserId,
      createdDate:this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      isActive: true,
      updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      updatedBy: this.logInUserId,
      cashDrawerID: this.activeDrawerId
    };

    this.commonService.InsertCustomerAdvance(requestObj).subscribe({
      next: (res) => {
      const body = res.body;
      const insertedAdvanceId = body?.insertedRow;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Advance Added Successfully' });

        this.closeAdvancePopup();
      const paramObject = {
        PageNumber: 1,
        RowOfPage: 10,
        LocationId: this.locId,
        SerachText: this.searchSellerInput.replace(/ /g, "%")
      };
      this.getAllsellersDetails(paramObject);      
      this.generateCustomerAdvanceReceipt(insertedAdvanceId);
      this.getCashDrawerAmountAndPaidTicketCount();   
    },
      error: (error) => {
        console.error('Error saving advance:', error);
      }
    });
  }


  getCashDrawerAmountAndPaidTicketCount() {
    const paramObject={
      LocationId: this.locId,
      DrawerID: this.activeDrawerId
    }
    this.commonService.getCashDrawerAmountAndPaidTicketCount(paramObject)
    .subscribe((data: any) => {
        console.log('getCashDrawerAmountAndPaidTicketCount :: ');
        console.log(data);
        // this.dataService.cashDrawerAmountAndPaidTicketCount(data);
        this.cashDrawerBalanceAmount = data.body.cashDrawerbalance;
        this.paidTicketCount = data.body.paidTicketCount;
        this.dataService.setCashDrawerAmountDTO(this.cashDrawerBalanceAmount);
        this.dataService.setPaidCount(this.paidTicketCount);
      },
      (err: any) => {
        // this.errorMsg = 'Error occured';
      }
    );
  }
  generateCustomerAdvanceReceipt(advanceId: number) {
    this.isAdvanceReportShow = true;
    this.showLoaderAdvanceReport = true;
    this.advanceId = advanceId;

    const param = {
      LocID: this.locId,
      RowID: advanceId,
      Type: localStorage.getItem("defaultPrintSize"),
      Advertising: this.adminAdvertisement 
    };

    this.commonService.GetCustomerAdvanceReceipt(param).subscribe({
      next: (data: any) => {
        this.showLoaderAdvanceReport = false;

        this.advanceReceiptBase64 = data.body.data;
      },
      error: (err) => {
        this.showLoaderAdvanceReport = false;
        console.error("Error generating advance receipt:", err);
      }
    });
  }
  
  closeAdvancePdfReport() {
    this.isAdvanceReportShow = false;
    this.advanceReceiptBase64 = null;
  }


  GetCustomerRedemptionByID(customerId: number, locationId: number) {
   
    this.customerId = customerId;
    const paramObject = {
      CustomerID: customerId, 
      LocID: this.locId
    };
    this.commonService.GetCustomerRedemptionByID(paramObject)
      .subscribe(data => {
          console.log('GetCustomerRedemptionByID Response:');
          console.log(data);
          this.rewardList  = data.body.data;
          this.remainingBalance = this.rewardList[0].remainingBalance ?? 0;  
          this.redeemedCoupons = this.rewardList[0].redeemedCoupons ?? 0;      
        },
        (err: any) => {
          console.error('Error fetching redemption data', err);
        }
      );
  }

  openRewardDialog(seller: any) {
    this.showRewardDialog = true;
    this.GetCustomerRedemptionByID(seller.rowId, this.locId);
  }


  giveReward(entry: any) {
    if(this.remainingBalance < entry.eligibalAmount){
      this.messageService.add({severity:'warn' , summary:'Not Eligibal',detail:'Not Enoungh balance to redeem this Coupen'});
      return;
    }
    const rewardDto = {
      customerID: this.customerId,      
      coupenID: entry.coupenID,            
      redeemedCoupons: 1,               
      locID: this.locId,                
      createdBy: this.logInUserId       
    };
  
    this.commonService.GiveCoupens(rewardDto).subscribe({
      next: (response) => {
        this.GetCustomerRedemptionByID(this.customerId, this.locId);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Coupen Given Successfully' });

       
           
    },
      error: (error) => {
        console.error('Error saving coupen:', error);
      }
    });

   
  }
  

  getAction(actionCode:any){
    
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchSeller();
        break;
      case 'mdi-refresh':
        this.refreshSellerData();
        break;
      case 'mdi-plus':
        this.addNewSeller();
        break;
      default:
        break;
    }
  
  }
  
}
