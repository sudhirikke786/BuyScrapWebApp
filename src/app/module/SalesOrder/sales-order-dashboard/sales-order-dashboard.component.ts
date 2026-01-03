import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { driver } from 'src/app/core/model/driver.model';
import { DataService } from 'src/app/core/services/data.service';
import { MessageService, ConfirmationService } from 'primeng/api';




@Component({
  selector: 'app-sales-order-dashboard',
  templateUrl: './sales-order-dashboard.component.html',
  styleUrls: ['./sales-order-dashboard.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class SalesOrderDashboardComponent implements OnInit {

  orgName: any;
  locId: any;
  logInUserId: any;
  dialogPopupVisible: boolean = false;
  sellerLoader: boolean = false;
  sellers: any;
  addSellerPopupVisible = false;
  searchSellerInput: any = '';
  defaultSelectedTicketsTypes: any[] = [];
  IsCustomerFacePictureEnabled:boolean = false;
  newDriverScreenVisible = false;
  selectedSellerName: any;
  selectedSellerId: any;
  newTicketVisible: boolean = false;
  currencies: any[] = [];
  selectedCurrencyID: any = null;
  licenseExpiryPopupVisible: boolean = false;
  selectedSellerForLicenseUpdate: any = null;
  SalesOrderHeader: string = 'Sales Order Details';
    driverDetails!: driver;
    salesOrders: any[] = [];
    isBusinessUser: boolean = false;
    selectedRowId: number = 0;
    salesOrderSearchText: string = '';
    showLoader =  false;


    pagination: any = {
    SerachText: '',
    SearchOrder: 'TicketId',
    Status: this.defaultSelectedTicketsTypes.reduce((acc: any, cur: any) => ((acc.push(cur.name)), acc), []).join(','),
    PageNumber: 1,
    RowOfPage: 10,
    LocationId: this.commonService.getProbablyNumberFromLocalStorage('locId'),
    first: 0,
  }

actionList = [
  { iconcode: 'mdi-magnify', title: 'Search', label: 'Search' },
  { iconcode: 'mdi-refresh', title: 'Refresh', label: 'Refresh' },
  { iconcode: 'mdi-ticket', title: 'New Sales Orders', label: 'New Sales Orders' }
];

 newTicketList = [{
    iconcode: 'mdi-magnify',
    title: 'Search',
    label: 'Search'
  },
  {
    iconcode: 'mdi-refresh',
    title: 'Refresh',
    label: 'Refresh'
  },
  {
    iconcode: 'mdi-account',
    title: 'New Customer',
    label:'New Customer'
  }
  ];



  constructor(
    public commonService: CommonService, 
    private stroarge: StorageService,
      private router: Router,
    private dataService: DataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) 
  { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
      console.log('Sales Order Action List:', this.actionList);
          const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');

       const isCustomerFacePicture = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'iscustomerfacepicture');
      this.IsCustomerFacePictureEnabled = String(isCustomerFacePicture?.values).toLowerCase() === 'true';

          this.driverDetails = new driver();
          this.getAllSalesOrders();

  }

   addNewTicket() {
    this.dialogPopupVisible = true;
    this.newTicketVisible = true;
    // this.ticketvisible = false;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
       SellerType: 'Business'
    };
    this.getAllsellersDetails(paramObject);
    // this.getDefaultCurrencyForTicket();
  }

   getAllsellersDetails(paramObject: any) {
    this.sellerLoader = true;
    this.commonService.getAllsellersDetails(paramObject)
      .subscribe(data => {
        console.log('getAllsellersDetails :: ');
        console.log(data);
        this.sellers = data.body.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.sellerLoader = false;
        },
        () => {
          this.sellerLoader = false;
        }
      );
  }

   onKeydown(event: KeyboardEvent, searchValue: string): void {
    // Check for specific key events, e.g., Enter key
    if (event.key === 'Enter') {
      this.searchSeller()
      // Add your search logic here
    }

    // Optionally handle other keys
    // if (event.key === 'ArrowDown') {
    //   console.log('ArrowDown key pressed');
    // }
  }

   searchSeller() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%")
    };

    this.pagination = {
      SerachText: '',
      SearchOrder: 'TicketId',
      Status: this.defaultSelectedTicketsTypes.reduce((acc: any, cur: any) => ((acc.push(cur.name)), acc), []).join(','),
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.commonService.getProbablyNumberFromLocalStorage('locId'),
      first: 0,
    }
    this.getAllsellersDetails(paramObject);

  }

  refreshSellerData() {
    this.searchSellerInput = '';
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };

    this.pagination = {
      SerachText: '',
      SearchOrder: 'TicketId',
      Status: this.defaultSelectedTicketsTypes.reduce((acc: any, cur: any) => ((acc.push(cur.name)), acc), []).join(','),
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.commonService.getProbablyNumberFromLocalStorage('locId'),
      first: 0,
    }
    this.getAllsellersDetails(paramObject);
  }

  addNewSeller() {
    // this.router.navigateByUrl(`${this.orgName}/sellers-buyers/add-seller`);
    this.addSellerPopupVisible = true;
  }

  clickOnSeller(sellerId: any, sellerFullname: any, sellerType: any) {
    this.selectedSellerName = sellerFullname;
    this.selectedSellerId = sellerId;
    const selectedSeller = this.sellers.find((s:any) => s.rowId === sellerId);
    
     const selectedCurrencyObj = this.currencies.find(c => c.rowID === this.selectedCurrencyID);
     const currencyCode = selectedCurrencyObj?.currencyCode ?? '';
     const currencySymbol = selectedCurrencyObj?.currency ?? '';
    if (this.newTicketVisible == true) {
      if (sellerType == 'Business') {
        this.newDriverScreenVisible = true;
      } else {
        if (sellerType === 'Personal' && selectedSeller && selectedSeller.isLicenseExpiry === true) {
          this.selectedSellerForLicenseUpdate = selectedSeller;
          this.licenseExpiryPopupVisible = true;
          return;
        }
  this.router.navigate([`/${this.orgName}/sales-order/salesOrderdetail`, 'new', sellerId, 'false']);        
        }
    }

  }

    saveDriverInfo() {
    // alert(JSON.stringify(this.driverDetails) + " :: " + this.newTicketVisible);    
    this.newDriverScreenVisible = false;
    this.dataService.setNewDriverDetail(this.driverDetails);
    this.driverDetails = new driver();
     const selectedCurrencyObj = this.currencies.find(c => c.rowID === this.selectedCurrencyID);
     const currencyCode = selectedCurrencyObj?.currencyCode ?? '';
     const currencySymbol = selectedCurrencyObj?.currency ?? '';
    if (this.newTicketVisible == true) {
      // this.router.navigateByUrl(`/${this.orgName}/home/detail/new/${this.selectedSellerId}/true?currencyCode=${currencyCode}&currencySymbol=${currencySymbol}`);
     
      // this.router.navigate([`/${this.orgName}/home/salesOrderdetail/new/${this.selectedSellerId}/true`],{ queryParams: {currencyCode:'',currencySymbol:''} } );
        this.router.navigate([`/${this.orgName}/sales-order/salesOrderdetail`, 'new', this.selectedSellerId, 'false']);        

      
    }
  }



    getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
         this.searchSalesOrders();
        break;
      case 'mdi-refresh':
        this.refreshSalesOrders();
        break;
      case 'mdi-ticket':
        this.addNewTicket();
        break;
    }


  }

    getSellerAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchSeller();
        break;
      case 'mdi-refresh':
        this.refreshSellerData();
        break;
      case 'mdi-account':
        this.addNewSeller();
        break;
      default:
        break;
    }


  }

  getAllSalesOrders(searchText: string = '') {
    // this.isLoading = true;
    this.showLoader = true;
    const paramObject = {
      LocID: this.locId,
      SearchText: searchText.trim()  
    };
    this.commonService.GetAllSalesOrders(paramObject).subscribe({
      next: (res: any) => {
                this.showLoader = false;
        this.salesOrders = res.body.data; 
        // this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching sales orders', err);
        // this.isLoading = false;
        this.showLoader = false;
      }
    });
  }

  searchSalesOrders(): void {
    console.log('Initiating Sales Order search for:', this.salesOrderSearchText);
    this.getAllSalesOrders(this.salesOrderSearchText); 
  }

  refreshSalesOrders(): void {
    console.log('Initiating Sales Order refresh (clearing search and reloading all).');
    this.salesOrderSearchText = '';
    this.getAllSalesOrders(''); 
  }

  EditSalesOrder(salesOrder: any) {
    this.router.navigateByUrl(`/${this.orgName}/sales-order/salesOrderdetail/${salesOrder.rowID}/${salesOrder.customerID}/${salesOrder.isBuniessUser}`);
  }

  ViewShipout(salesOrder: any) {
    console.log('Clicked View Ship for RowID:', salesOrder.rowID);
    this.router.navigateByUrl(`/${this.orgName}/sales-order/salesOrderdetail/${salesOrder.rowID}/${salesOrder.customerID}/${salesOrder.isBuniessUser}?type=viewship`);
  }

  deleteSalesOrder(rowID: number) {
      console.log('Clicked Delete for RowID:', rowID);
    this.selectedRowId = rowID; 
    this.confirmationService.confirm({
      key: 'deleteDialog', 
      accept: () => this.confirmDeleteSalesOrder(),
      reject: () => this.cancelDeleteSalesOrder(),
    });
  }

  confirmDeleteSalesOrder(): void {
    const requestObj = {
      RowID: this.selectedRowId,
    };

    this.commonService.DeleteSalesOrderbyId(requestObj).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted Successfully',
          detail: `Sales Order with ID ${this.selectedRowId} has been deleted.`,
        });
        this.getAllSalesOrders();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to delete Sales Order with ID ${this.selectedRowId}.`,
        });
      }
    );
  }

  cancelDeleteSalesOrder(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelled',
      detail: 'Delete operation was cancelled.',
    });
  }
}


