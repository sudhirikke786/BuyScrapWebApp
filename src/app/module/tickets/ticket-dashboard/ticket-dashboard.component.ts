import { Component, OnInit, ViewChild,HostListener  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Pagination } from 'src/app/core/interfaces/common-interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DataService } from 'src/app/core/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CashDrawerTransaction } from 'src/app/core/model/cash-drawer-transaction.model';
import { driver } from 'src/app/core/model/driver.model';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class TicketDashboardComponent implements OnInit {
  sellerTicketsloader: boolean = false;

  selectedTickets: any;


  actionList = [{
    iconcode: 'mdi-magnify',
    title: 'Search'
  }, {
    iconcode: 'mdi-refresh',
    title: 'Refresh', 
  },
  {
    iconcode: 'mdi-ticket',
    title: 'New Ticket',
    label:'New Ticket'
  },
  
 
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

  mergeTicketlist = [{
    iconcode: 'mdi-magnify',
    title: 'Search'
  },
  {
    iconcode: 'mdi-refresh',
    title: 'Refresh'
  }

  ];

  ticketsTypes = [
    { name: 'ALL', code: 'ALL' , },
    { name: 'OPEN', code: 'OPEN' },
    { name: 'Partially Paid', code: 'Partially Paid' },
    { name: 'ON HOLD', code: 'ON HOLD' },
    { name: 'PAID', code: 'PAID' },
    { name: 'VOIDED', code: 'VOIDED' }
  ];


  defaultSelectedTicketsTypes = [
    { name: 'OPEN', code: 'OPEN' },
    { name: 'Partially Paid', code: 'Partially Paid' },
    { name: 'ON HOLD', code: 'ON HOLD' }
  ];

  tickets: any;
  childTickets: any;
  ticketsTransactions: any;
  sellerTickets: any;
  sellers: any;
  selectedSellerId: any;
  selectedSellerName: any;
  selectedSellerTickets: any;
  selectedSellerTicketsPaidAmount = 0;
  voidCashAmount = 0;

  dialogPopupVisible: boolean = false;
  newTicketVisible: boolean = false;
  ticketvisible: boolean = false;
  mergeTicketVisible: boolean = false;
  paymentVisible: boolean = false;

  cashSectionVisible: boolean = true;
  checkSectionVisible: boolean = false;
  electronicPaymentSectionVisible: boolean = false;

  searchSellerInput: any = '';

  payAmount: any;
  checkNumber: any;
  paymentType: any;
  checkDate: any;

  orgName: any;
  locId: any;
  logInUserId: any;

  maxItem = 2;
  parentTicketIDVisible = false;
  isParentTicketVisible = false;
  parentTicketId = '';
  isParent = false;
  searchOrder = 'All';
  serachText = '';

  showVoid = false;
  showOpen = false;
  showPartially = false;
  showVoidDialogBox = false;
  voidReason: any = '';
  isVoidOrRestore: any = '';
  

  /**Print out Variable */
  ticketId: any;
  customerId: any;
  isBuniessUser = false;
  activeSection: string = '';

  totalAmount: any;
  selectedPayAmount: number = 0;
  remainingAmount: number = 0;
  totalHoldAmount: number = 0;
  selectedCheckDate: any;
  ePaymentType: string = '';
  systemInfo: any;
  isReceiptPrint = false;

  transactionPaymentType: any = [];

  holdticketObj: any = [];
  isHoldTrue: boolean = false;

  selectedHoldAmount = 'Pay Total Amount';

  fileDataObj: any;
  showDownload = false;
  showLoaderReport = false;
  pdfViwerTitle = 'Ticket Receipt';
  

  pagination: any = {
    SerachText: '',
    SearchOrder: 'TicketId',
    Status: this.defaultSelectedTicketsTypes.reduce((acc: any, cur: any) => ((acc.push(cur.name)), acc), []).join(','),
    PageNumber: 1,
    RowOfPage: 10,
    LocationId: this.commonService.getProbablyNumberFromLocalStorage('locId'),
    first: 0,
  }

  currentPage = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  pageTotal = 0;
  tiketSelectedObj: any;
  currentRole: any;
  isLoading = false;
  childTicketsLoader: boolean = false;
  sellerLoader: boolean = false;
  
  alertVisible = false;
  alertMessage: any;

  addSellerPopupVisible = false;
  sellerForm!: FormGroup;
  sellerType: string = 'Personal';
  
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';

  showImage = false;
  showImageHeader = 'Show image';
  selectedImageUrl: any;

  checkVisible =  false;
  driverDetails!: driver;
  newDriverScreenVisible = false;
  checkTabView: boolean = false;

  

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private stroarge: StorageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private dataService: DataService,
    private helperService: HelperService,
    private messageService: MessageService,
    public commonService: CommonService) {
     // this.setPageSize();
      // this.route.params.subscribe((res) =>{
      //   this.pagination = {
      //     SerachText: '',
      //     SearchOrder: 'TicketId',
      //     Status: this.defaultSelectedTicketsTypes.reduce((acc: any, cur: any) => ((acc.push(cur.name)), acc), []).join(','),
      //     PageNumber: 1,
      //     RowOfPage: 10,
      //     LocationId: this.commonService.getProbablyNumberFromLocalStorage('locId'),
      //     first: 0,
      //   }
      //   this.getAllTicketsDetails(this.pagination);
      // })

     }

  ngOnInit() {
    this.currentRole = this.authService.userCurrentRole();
    this.checkTabView = this.helperService.isTab();
    ['Administrator','Scale','Cashier']
    if (['Administrator', 'Cashier'].includes(this.currentRole)) {
      let actionButton = [{
        iconcode: 'mdi-merge',
        label:'Merge Ticket',
        title: 'Merge Ticket and Pay'
      }]
      this.actionList = [...this.actionList,...actionButton];
    }

    const isFilter = localStorage.getItem('filterObj');
    if(isFilter){
      this.selectedTickets =  JSON.parse(isFilter);
    }else{
      this.selectedTickets = this.defaultSelectedTicketsTypes;
    }
    

    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      const isElectronic = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'iselectronicpayment')[0];
      this.systemInfo = isElectronic?.values;
    }

    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    const result = this.selectedTickets.reduce((acc: any, cur: any) => ((acc.push(cur.name)), acc), []).join(',');
    this.pagination.Status = result;
    
    const ticketPagination = localStorage.getItem('ticketPagination');
    if(ticketPagination){
      // this.currentPage = 5;      
      // this.first = 40;   
      // this.last = 49;
      this.pagination =  JSON.parse(ticketPagination);
      this.first = (this.pagination?.PageNumber - 1) * this.pagination?.RowOfPage || 0;   
      this.last = (this.pagination?.PageNumber * this.pagination?.RowOfPage) -1 || 9; 
      this.pageSize = this.pagination?.RowOfPage || 10;
    }else{
      this.pagination.Status = result;
    }
    this.getAllTicketsDetails(this.pagination);

    this.sellerForm = this.fb.group({
      firstName : ['',Validators.required],
      sellerType:[this.sellerType],
      middleName : [''],
      lastName : ['']
    });

    this.driverDetails = new driver();
  }


  onPageChange(event: any) {
    console.log(event);
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first;
    let pagObj = {
      PageNumber: this.currentPage,
      RowOfPage: event.rows,
    }
    this.pageSize = event.rows;
    this.pagination = { ...this.pagination, ...pagObj };
    this.getAllTicketsDetails(this.pagination);
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event:any) {
  //   this.setPageSize();
  // }

  // private setPageSize() {
  //   if (window.innerWidth >= 1200 && window.innerWidth < 1500) {
  //     this.pageSize = 25; // Large device
  //   }else if (window.innerWidth > 1500 && window.innerWidth < 3000) {
  //     this.pageSize = 100; // Medium device
  //   } else if (window.innerWidth >= 768) {
  //     this.pageSize = 10; // Medium device
  //   } else {
  //     this.pageSize = 10; // Small device
  //   }
  // }


  /**
   * Get the data by calling WebAPI to fetch the details for organization login
   */
  getAllTicketsDetails(pagination: Pagination) {
    this.isLoading = true;
    console.log(this.pagination);
    this.commonService.getAllTicketsDetails(pagination)
      .subscribe(data => {
        localStorage.setItem("filterObj",JSON.stringify(this.selectedTickets));        
        localStorage.setItem("ticketPagination",JSON.stringify(pagination));
        console.log('getAllTicketsDetails :: ');
        console.log(data);
        this.tickets = data.body.data.map((item:any) => {
          item.statusClass = this.getColor(item.status, item.isParent);
          return item;
        });
        this.pageTotal = data?.body?.totalRecord
        this.last = data?.body?.totalIndex;

      },
        (err: any) => {
          this.isLoading = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.isLoading = false;
        }
      );
  }


  getColor(type: any, isParent: boolean) {

    // .text-primary

    // .text-secondary

    // .text-success

    // .text-danger

    // .text-warning

    // .text-info

    // { name: 'ALL', code: 'ALL' },
    // { name: 'OPEN', code: 'OPEN' },
    // { name: 'Partially Paid', code: 'Partially Paid' },
    // { name: 'ON HOLD', code: 'ON HOLD' },
    // { name: 'PAID', code: 'PAID' },
    // { name: 'VOIDED', code: 'VOIDED' }


    let statusClassName = 'text-dark'
    switch (type.toLowerCase()) {
      case 'void':
        statusClassName = 'text-dark'
        break;
      case 'paid':
        statusClassName = 'text-info'
        break;
      case 'voided':
        statusClassName = 'text-dark'
        break;
      case 'open':
        statusClassName = 'text-primary'
        break;
      case 'on hold':
        statusClassName = 'text-danger'
        break;
      case 'balance owed':
          statusClassName = 'text-warning'
        break;
      case 'partially paid':
        if (isParent) {
          statusClassName = 'text-dark';
        } else {
          statusClassName = 'text-info';
        }
        break;
      default:
        statusClassName = 'text-dark'
        break;
    }
    return statusClassName;

  }

  showVoideCancelCopy(ticketData: any) {
    this.tiketSelectedObj = ticketData;
    this.ticketId = ticketData.rowId;
    this.parentTicketId = ticketData.parentTicketID;
    this.isParent = ticketData.isParent;
    if (this.parentTicketId) {
      this.parentTicketIDVisible = true;
      this.isParentTicketVisible = false;
    } else if (this.isParent) {
      this.getAllTicketsByParentID(ticketData.rowId);
      this.parentTicketIDVisible = false;
      this.isParentTicketVisible = true;
    } else {
      this.showVoid = true;

    }

  }

  showVoideForPartiallyPaid(ticketData: any) {
    this.tiketSelectedObj = ticketData;
    this.showVoid = true;
  }

  showVoidCancel() {
    console.log(this.tiketSelectedObj);
    this.isVoidOrRestore = 'Void';
    this.getTicketTransactions();
  }

  showRestoreTicket(ticketData: any) {
    console.log("Restore Ticket :: " + ticketData);
    this.tiketSelectedObj = ticketData;
    this.isVoidOrRestore = 'Restore';
    this.getTicketTransactions();
  }

  getTicketTransactions() {
    this.voidCashAmount = 0;
    this.showVoidDialogBox = true;
    const param = {
      TicketId: this.tiketSelectedObj?.rowId
    };
    this.getAllTicketsTransactionsByTicketId(param);
  }

  getAllTicketsTransactionsByTicketId(paramObj: any) {
    console.log(paramObj);
    this.commonService.getAllTicketsTransactionsByTicketId(paramObj)
      .subscribe(data => {
        console.log('getAllTicketsTransactionsByTicketId :: ');
        console.log(data);
        if (data.body.data.length > 0) {
          this.ticketsTransactions = data.body.data;
          // this.ticketsTransactions.filter((item: any) => item.type == 'Cash');
          this.voidCashAmount = this.ticketsTransactions.filter((item: any) => item.type == 'Cash').reduce(function (sum: any, item: any) {
            return sum + item.amount;
          }, 0);
          this.showPartially = true;
          this.showOpen = false;
        } else {
          this.showPartially = false;
          this.showOpen = true;
        }
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  showVoidCopy() {
    console.log(this.tiketSelectedObj);
    this.isVoidOrRestore = 'VoidCopy';
    this.getTicketTransactions();
  }

  voidCopyTicket() {
    const datePipe = new DatePipe('en-US');
    console.log("Void Ticket :: " + this.voidReason);

    console.log(this.tiketSelectedObj);

    this.tiketSelectedObj['VoidReason'] = this.voidReason;
    this.tiketSelectedObj['VoidFlag'] = true;
    this.tiketSelectedObj['VoidBy'] = this.logInUserId;
    this.tiketSelectedObj['CreatedBy'] = this.logInUserId;
    this.tiketSelectedObj['UpdatedBy'] = this.logInUserId;
    this.tiketSelectedObj['VoidDate'] = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    this.tiketSelectedObj['CreatedDate'] = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    this.tiketSelectedObj['UpdatedDate'] = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    this.tiketSelectedObj['Status'] = 'VOIDED';

    console.log("Final ticketData :: " + JSON.stringify(this.tiketSelectedObj));

    this.commonService.voidCopyTickets(this.tiketSelectedObj).subscribe(data => {
      console.log(data);
      this.addVoidedCashAmount();
      this.refreshData();
      this.voidReason = '';
      this.showOpen = false;
      this.showPartially = false;
      this.showVoidDialogBox = false;
      this.showVoid = false;
    }, (error: any) => {
      console.log(error);
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });

  }

  voidTicket() {
    const datePipe = new DatePipe('en-US');
    console.log("Void Ticket :: " + this.voidReason);

    console.log(this.tiketSelectedObj);

    this.tiketSelectedObj['VoidReason'] = this.voidReason;
    this.tiketSelectedObj['VoidFlag'] = true;
    this.tiketSelectedObj['VoidBy'] = this.logInUserId;
    this.tiketSelectedObj['VoidDate'] = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    this.tiketSelectedObj['Status'] = 'VOIDED';

    console.log("Final ticketData :: " + JSON.stringify(this.tiketSelectedObj));

    this.commonService.insertUpdateTickets(this.tiketSelectedObj).subscribe(data => {
      console.log(data); 
      this.addVoidedCashAmount();
      this.refreshData();
      this.voidReason = '';
      this.showOpen = false;
      this.showPartially = false;
      this.showVoidDialogBox = false;
      this.showVoid = false;
    }, (error: any) => {
      console.log(error);
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });

  }

  restoreTicket() {
    const datePipe = new DatePipe('en-US');

    this.tiketSelectedObj['VoidReason'] = this.voidReason;
    this.tiketSelectedObj['CreatedBy'] = this.logInUserId;
    this.tiketSelectedObj['CreatedDate'] = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');

    console.log("Restore ticketData :: " + JSON.stringify(this.tiketSelectedObj));

    this.commonService.RestoreVoidTickets(this.tiketSelectedObj).subscribe(data => {
      console.log(data);
      this.refreshData();
      this.voidReason = '';
      this.showOpen = false;
      this.showPartially = false;
      this.showVoidDialogBox = false;
      this.showVoid = false;
    }, (error: any) => {
      console.log(error);
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  refreshData() {
    // this.parentTicketIDVisible = true;
    this.isParentTicketVisible = false;
    this.selectedTickets = this.defaultSelectedTicketsTypes;
    this.serachText = '';
    this.searchOrder = 'All';
    const result = this.selectedTickets.reduce((acc: any, cur: any) => ((acc.push(cur.name)), acc), []).join(',');
    this.pagination.Status = result;
    this.pagination.SerachText = this.serachText,
    this.pagination.SearchOrder = this.searchOrder,
    this.getAllTicketsDetails(this.pagination);
  }
  

  addVoidedCashAmount() {
    const datePipe = new DatePipe('en-US');
    // POST call
    const newCashDrawerTransaction = new CashDrawerTransaction();     
    newCashDrawerTransaction.rowId = 0;
    newCashDrawerTransaction.createdBy = this.logInUserId;
    newCashDrawerTransaction.createdDate = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newCashDrawerTransaction.updatedBy = this.logInUserId;
    newCashDrawerTransaction.updatedDate = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newCashDrawerTransaction.amount = parseFloat(this.voidCashAmount.toString().replace(/,/g,''));
    newCashDrawerTransaction.reason = "Void Ticket number = " + this.tiketSelectedObj.rowId;
    newCashDrawerTransaction.locID = this.locId;
    newCashDrawerTransaction.type = "IN";      
    
    console.log("Final CashDrawerTransaction :: " + JSON.stringify(newCashDrawerTransaction));
    
    this.commonService.insertUpdateCashDrawerTransactions(newCashDrawerTransaction).subscribe(data =>{    
      console.log(data); 
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'Cash Drawer Transaction updated successfully' });
      
      // Update values
      const paramObject = {
        LocationId: this.locId
      };
      this.getCashDrawerAmountAndPaidTicketCount(paramObject);
    },(error: any) =>{  
      console.log(error);  
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  showMergeDialog() {
    this.dialogPopupVisible = true;
    this.newTicketVisible = false;
    this.ticketvisible = true;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
  }

  addNewTicket() {
    this.dialogPopupVisible = true;
    this.newTicketVisible = true;
    this.ticketvisible = false;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
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

  searchTickets() {
    console.log('selectedTickets :: ' + JSON.stringify(this.selectedTickets));
    const result = this.selectedTickets.reduce((acc: any, cur: any) => ((acc.push(cur.name)), acc), []).join(',');
    this.pagination.Status = result;
    this.pagination.SerachText = this.serachText,
      this.pagination.SearchOrder = this.searchOrder,
      this.pagination.currentPage = 1;

    this.getAllTicketsDetails(this.pagination);
  }

  addRemoveStatus(event: any) {
    console.log('Change Multiselect :: ');
    console.log(JSON.stringify(event));
    if (event.itemValue.name === 'ALL') {
      if (event.originalEvent) {
        this.selectedTickets = this.ticketsTypes;
      } else {
        this.selectedTickets = this.defaultSelectedTicketsTypes;
      }
    } else {
      // TO DO:: check item is selected or deselected by looking at no.of item in event.value
      // if less than 6, then remove item with All and bind remaining with this.selectedTickets
      
    }
    this.pagination.PageNumber = 1;
    this.searchTickets();
  }

  closeChildTicketMessage() {
    this.parentTicketIDVisible = false;
    this.router.navigateByUrl(`/${this.orgName}/home/detail/${this.ticketId}/${this.customerId}/${this.isBuniessUser}`);
  }

  clickOnSeller(sellerId: any, sellerFullname: any, sellerType: any) {
    this.selectedSellerName = sellerFullname;
    this.selectedSellerId = sellerId;
    if (this.newTicketVisible == true) {
      if (sellerType == 'Business') {
        this.newDriverScreenVisible = true;
      } else {
        this.router.navigateByUrl(`/${this.orgName}/home/detail/new/${sellerId}/false`);
      }
    } else if (this.ticketvisible == true) {
      this.mergeTicketVisible = true;
      this.getAllTicketsBySellerId(sellerId);
    }

  }

  saveDriverInfo() {
    // alert(JSON.stringify(this.driverDetails) + " :: " + this.newTicketVisible);    
    this.newDriverScreenVisible = false;
    this.dataService.setNewDriverDetail(this.driverDetails);
    this.driverDetails = new driver();
    if (this.newTicketVisible == true) {
      this.router.navigateByUrl(`/${this.orgName}/home/detail/new/${this.selectedSellerId}/true`);
    }
  }
  

  showTicketDetails(ticketData: any) {
    this.parentTicketId = ticketData.parentTicketID;
    this.tiketSelectedObj = ticketData;
    this.ticketId = ticketData.rowId;
    this.isParent = ticketData.isParent;
    this.customerId = ticketData.customerId;
    this.isBuniessUser = (ticketData.driverName && ticketData.driverName != '') ? true : false;
    if (this.parentTicketId) {
      this.parentTicketIDVisible = true;
      this.isParentTicketVisible = false;
    } else if (this.isParent) {
      this.getAllTicketsByParentID(ticketData.rowId);
      this.parentTicketIDVisible = false;
      this.isParentTicketVisible = true;
    } else {
      this.parentTicketIDVisible = false;
      this.router.navigateByUrl(`/${this.orgName}/home/detail/${this.ticketId}/${this.customerId}/${this.isBuniessUser}`);
    }

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

 
  getAllTicketsByParentID(parentTicketID: string) {


    this.childTicketsLoader = true;

    const paramObject = {
      TicketID: parentTicketID
    };
    this.commonService.getAllTicketsByParentID(paramObject)
      .subscribe(data => {
        console.log('getAllTicketsByParentID :: ');
        console.log(data);
        this.childTickets = data.body.data;
      },
        (err: any) => {
          this.childTicketsLoader = false;

          // this.errorMsg = 'Error occured';
        },
        () => {
          this.childTicketsLoader = false;
        }
      );
  }

  getAllTicketsBySellerId(sellerId: any) {
    this.sellerTicketsloader = true;
    const paramObj: any = {
      SellerId: sellerId,
      LocationId: this.locId
    }
    this.commonService.getAllTicketsBySellerId(paramObj)
      .subscribe(data => {
        console.log('getAllTicketsBySellerId :: ');
        console.log(data);
        this.sellerTickets = data.body.data;
        this.sellerTickets = this.sellerTickets.filter((obj: any) => {
          return obj.status === 'OPEN' || 
          (obj.status === 'Partially Paid' && obj.isParent != true ) ;
        }).sort((a: any, b: any) => (a.title > b.title) ? 1 : -1);
      },
        (err: any) => {
          this.sellerTicketsloader = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.sellerTicketsloader = false;
        }
      );
  }

  closeMergeAndPayTickets() {
    this.mergeTicketVisible = false;
  }

  mergeAndPaySelectedTickets() {
    if ((!this.selectedSellerTickets) || (this.selectedSellerTickets && this.selectedSellerTickets.length <= 1)) {
      this.messageAlert('Please select more than one ticket to merge!!!')
      return;
    }
    
    this.holdticketObj = null;
    this.holdticketObj = this.selectedSellerTickets.filter((obj: any) => {
      return obj.isHold === true
    });
    this.isHoldTrue = (this.holdticketObj.length > 0) ? true : false;

    var totalbalanceAmount = this.selectedSellerTickets.reduce((totalAmount: any, item: any) => totalAmount + item.amount, 0);
        
    const totalActualAmount = this.selectedSellerTickets.reduce(function (sum: any, tickets: any) {
      return sum + (tickets.isAdjusmentSet ? tickets.amount * -1 : tickets.amount);
    }, 0);

    this.ticketId = this.selectedSellerTickets.map((item: any) => item.ticketId).join(',');

    this.totalAmount = Math.round(totalbalanceAmount);

    // this.mergeTicketVisible = false;
    // this.paymentVisible = true;
    this.showPayment(false);
  }


  closePaymentPopup() {
    console.log('close');
    this.paymentVisible = false;
    this.transactionPaymentType = [];
  }

  

  showPayment(isReceiptPrint: boolean) {
    this.isReceiptPrint = isReceiptPrint;
    this.paymentVisible = true;

    
    this.selectedSellerTicketsPaidAmount = this.selectedSellerTickets.reduce(function (sum: any, tickets: any) {
      return sum + tickets.paidAmount;
    }, 0);

    this.selectedPayAmount = this.remainingAmount = this.payAmount = this.totalAmount - this.selectedSellerTicketsPaidAmount;
    this.showSection('Cash');
  }


  showSection(paymentType: string) {
    this.activeSection = paymentType;

    setTimeout(() => {
      this.selectedCheckDate = new Date().toISOString().split('T')[0];
    }, 10)
    this.checkNumber = '';
    this.ePaymentType = '';

    if (this.isHoldTrue) {
      this.totalHoldAmount = this.holdticketObj.reduce((acc: any, curr: any) => acc + curr.amount, 0);
    }
    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        if (this.totalHoldAmount >= this.payAmount && (this.totalHoldAmount != 0 || this.payAmount != 0)) {
          this.errorAlert(`Hold amount ( $${this.totalHoldAmount} ) is equal or more than total pay amount ( $${this.payAmount} )`);
          this.payAmount = 0;
        } else {
          this.payAmount = this.totalAmount - this.selectedSellerTicketsPaidAmount - this.totalHoldAmount;
        }
        break;
      case 'Hold All Amount':
        this.payAmount = 0;
        break;
    }
  }


  isInputValid(input: any): boolean {
    const numberFloatRegex: RegExp = /^-?\d+(\.\d+)?$/;
    return numberFloatRegex.test(input);
  }

  addTransction() {

    if (this.selectedPayAmount <= 0) {
 
      this.messageAlert('Please Enter Amount')
      return;
    }

    if (!this.isInputValid(this.selectedPayAmount)) {
      this.messageAlert('Add valid input')
      return;
    }

    const checkPrice = this.checkTotalAmount();

    if (checkPrice) {
      this.messageAlert('adding amount is greter than total amount')
      return;
    }
    
    if (this.activeSection == 'Check') {
      if (this.checkNumber.length == 0) {
        this.messageAlert('Enter Check Number')
        return;
      }
      this.proceedWithAddTransaction();
    } else if (this.activeSection == 'Electronic Payment') {
      if (this.ePaymentType?.length == 0) {
        this.messageAlert('Enter Electronic Payment Type')
        return;
      }
      this.proceedWithAddTransaction();
    } else if (this.activeSection == 'Cash') {
      let text = 'You selected as Cash as payment mode, please confirm?';
      this.confirmationMessage(text, 'cashTransaction', null);
    }
  }

  
  confirmationMessage(msg: any, triggerPoint: any, additionData: any) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: msg,
      accept: () => {
        if (triggerPoint == 'cashTransaction') {
          this.proceedWithAddTransaction();
        } else if (triggerPoint == 'payAndSave') {
          this.proceedPayAndSave(additionData);
        }
      },
      reject: () => {       
        return false;
      },
    });
  }

  proceedWithAddTransaction() {
    const findItemExist = this.transactionPaymentType.findIndex((item: any) => item.typeofPayment?.toLowerCase() == this.activeSection?.toLowerCase())
    
    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        const total = this.getTotal();
        const eligiblePayAmount = this.totalAmount - total - this.totalHoldAmount;
        if (this.selectedPayAmount > eligiblePayAmount) {
          this.messageAlert('Exclude hold item amount');  
          this.selectedPayAmount = eligiblePayAmount;
          return;
        }
        break;
      case 'Hold All Amount':
        this.messageAlert('You have selected option as "Hold All Amount"!!!')
        this.selectedPayAmount = 0;
        return;
        break;
    }

    if (findItemExist > -1) {

      this.transactionPaymentType[findItemExist] = {
        typeofPayment: this.activeSection,
        typeofAmount: this.selectedPayAmount,
        paymentType: this.getType()
      }

    } else {


      this.transactionPaymentType.push({
        typeofPayment: this.activeSection,
        typeofAmount: this.selectedPayAmount,
        paymentType: this.getType()
      })

    }

    const checkPrice2 = this.checkTotalAmount();
    if (checkPrice2) {
      // TO DO: Needs to write a logic to remove latest added transaction based on activeSection 
      this.transactionPaymentType.splice(this.transactionPaymentType.length - 1, 1);
      this.messageAlert('adding amount is greter than total amount')
      return false;
    }

    this.remainingAmount = this.totalAmount - this.selectedSellerTicketsPaidAmount - this.getTotal();
    this.selectedPayAmount = this.remainingAmount;


  }

  getType() {
    let str = '';
    if (this.activeSection == 'Cash') {
      str = ''
    }

    str = this.activeSection == 'Check' ? this.checkNumber : this.ePaymentType;
    return str;
  }

  checkTotalAmount() {
    let checkError = false;
    if (Number(this.payAmount) > Number(this.totalAmount)) {
      checkError = true;

    } else {
      const total = this.getTotal();
      if (Number(total) > Number(this.totalAmount)) {
        checkError = true;
      }
    }
    return checkError;

  }

  removeItem(i: number) {
    this.transactionPaymentType.splice(i, 1);
        
    this.remainingAmount = this.totalAmount - this.selectedSellerTicketsPaidAmount - this.getTotal();
    this.selectedPayAmount = this.remainingAmount;
  }


  getTotal(): number {
    return this.transactionPaymentType.reduce((sum: number, curr: any) => {
      return sum = sum + Number(curr.typeofAmount)
    }, 0)
  }

  get isDisabled(): boolean {
    return (this.getTotal() < this.totalAmount);
  }


  errorAlert(msg:any){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  messageAlert(msg:any) {    
    this.alertVisible = true;
    this.alertMessage = msg;
  }

  payAndSave(activeSection: string) {
    if (this.transactionPaymentType.length > 1) {      
      let text = 'You selected multiple payment mode please confirm ?';      
      this.confirmationMessage(text, 'payAndSave', activeSection);
    } else if (this.transactionPaymentType.length == 1) {
      this.proceedPayAndSave(activeSection);
    }
  }

  proceedPayAndSave(activeSection: string) {

    const payAmout = this.getTotal();

    if (payAmout == 0 && this.selectedPayAmount> 0) {
      console.log('directly click on Pay Tiket button');
      this.transactionPaymentType.push({
        typeofPayment: this.activeSection,
        typeofAmount: this.selectedPayAmount,
        paymentType: this.getType()
      });
    } 
      
    this.payAmount = this.getTotal();

    if (!this.payAmount) {    
      this.messageAlert('Enter Amount')
      return
    }
    if (this.payAmount > 0 && parseFloat(this.payAmount.toString()) > (parseFloat(this.totalAmount.toString()) - this.selectedSellerTicketsPaidAmount)) {
      this.messageAlert('Please enter valid amount!!!')
      return;
    }

    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        const eligiblePayAmount = this.totalAmount - this.selectedSellerTicketsPaidAmount - this.totalHoldAmount;
        if (this.payAmount > eligiblePayAmount) {
          this.messageAlert('Exclude hold item amount')
          this.payAmount = eligiblePayAmount;
          return;
        }
        break;
      case 'Hold All Amount':
        this.messageAlert('You have selected option as "Hold All Amount"!!!');
        this.payAmount = 0;
        return;
        break;
    }

    let msg = '';

    if (this.activeSection == 'Check') {
      if (this.checkNumber.length == 0) {
        this.messageAlert('Enter Check Number')
        return;
      }
    } else if (this.activeSection == 'Electronic Payment') {
      if (this.ePaymentType?.length == 0) {
        this.messageAlert('Enter Electronic Payment Type')
        return;
      }
    } else {
      msg = 'You selected as Cash as payment mode, please confirm?';
      this.messageAlert(msg);
    }

    this.saveTransactionData(activeSection);
  }

  saveTransactionData(activeSection: any) {
    let isCheckPrint = false;
    let isCheckTransaction = false;
    let payTransactionObj: any = [];
    let checkAmount = 0;
    let checkNumber = '';

    const ticketId = (this.ticketId.toString().indexOf(',') > -1) ? 0 : this.ticketId;

    this.transactionPaymentType.map((item: any) => {

      if (item.typeofPayment == 'Cash') {  

        payTransactionObj.push({
          localRowId: 1,
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketId: parseInt(ticketId),
          type: item.typeofPayment,
          amount: parseFloat(item.typeofAmount),
          checkNumber: '',
          barCode: '',
          guid: '',
          dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
        });

      } else if (item.typeofPayment == 'Check') {

        isCheckTransaction = true;
        checkAmount = parseFloat(item.typeofAmount);
        checkNumber = item.paymentType;

        payTransactionObj.push({
          localRowId: 2,
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketId: parseInt(ticketId),
          type: item.typeofPayment,
          amount: checkAmount,
          checkNumber: checkNumber,
          barCode: '',
          guid: '',
          dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
        });

      } else if (item.typeofPayment == 'Electronic Payment') {
        
        payTransactionObj.push({
          localRowId: 3,
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketId: parseInt(ticketId),
          type: item.typeofPayment,
          amount: parseFloat(item.typeofAmount),
          checkNumber: item.paymentType,
          barCode: '',
          guid: '',
          dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
        });
      }

      return item
    })

    if (isCheckTransaction) {
      isCheckPrint = true;
    }

    if(this.ticketId.toString().indexOf(',') > -1) {
      this.saveMergeTicketDetails(payTransactionObj, isCheckPrint);
    } else {
      this.savePaymentTransation(payTransactionObj, isCheckPrint);
    }
    this.paymentVisible = false;
    // this.saveConfirmVisible = false; // TO DO

  }

  savePaymentTransation(payTransactionObj: any, isCheckPrint: boolean) {
    console.log('payTransactionObj');
    console.log(payTransactionObj);
    console.log('this.transactionPaymentType');
    console.log(this.transactionPaymentType);

    const transactionObj = {
      tickettransaction : {
        localRowId: 0,
        rowId: 0,
        createdBy: this.logInUserId,
        createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        ticketId: this.ticketId,
        type: this.transactionPaymentType[0]?.typeofPayment,
        amount: 0,
        checkNumber: '',
        barCode: '',
        guid: '',
        dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
      },
      lstickettransaction : payTransactionObj
    };

    this.commonService.insertTicketTransactions(transactionObj).subscribe(data => {      
      this.printTicket(this.ticketId, isCheckPrint);
    }, (error: any) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }


  saveMergeTicketDetails(payTransactionObj: any, isCheckPrint: boolean) {

    const newTicket = {
      rowId: 0,
      userID: this.logInUserId,
      date: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      ticketId: this.ticketId,
      type: this.transactionPaymentType[0]?.typeofPayment,
      amount: 0,
      checkNumber: '',
      checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      customerID: this.selectedSellerId,
      locID: this.locId,
      lstTTicketTransactionDTO: payTransactionObj
    };

    console.log("New Merge ticketData :: " + JSON.stringify(newTicket));

    this.commonService.insertUpdateMergeTickets(newTicket).subscribe((data: any) => {
      console.log(data);
      const ticketId = data.body.insertedRow;
      this.messageAlert('Tickets merged successfully');
      this.mergeTicketVisible = false;
      this.dialogPopupVisible = false;
      this.printTicket(ticketId, isCheckPrint);
    }, (error: any) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  printTicket(ticketId: any, isCheckPrint: boolean) {  
    let isReceiptPrint = this.isReceiptPrint;  
    if (this.isReceiptPrint) {      
      let text = "Do you want to print receipt?";
      if (confirm(text) != true) {
        isReceiptPrint = false;
      }
    }
    const paramObject = {
      LocationId: this.locId
    };
    this.getCashDrawerAmountAndPaidTicketCount(paramObject);
    if (isReceiptPrint) {
      this.generateSingleTicketReport(ticketId);
    } else {      
      this.checkPrintAction(isCheckPrint, ticketId);
    }
  }
  
  private checkPrintAction(isCheckPrint: boolean, ticketId: any) {
    if (isCheckPrint) {
      this.messageAlert('Please insert Check into Printer!!!');

      const checkPaymentTransaction = this.transactionPaymentType.filter((item: any) => item.typeofPayment == 'Check');
      const checkAmount = checkPaymentTransaction[0]?.typeofAmount;
      const customerFullName = this.selectedSellerName;

      // const selectedTicketDetail = this.tickets.filter((item:any) => item.rowId == this.ticketId);
      // const customerFullName = selectedTicketDetail[0].customerName;
      // TO DO :: Open Pdf viewer          
      this.showDownload = true;
      this.pdfViwerTitle = 'Check For Print';
      this.generateCheckPrintReport(ticketId, checkAmount, customerFullName);
      // this.router.navigateByUrl(`${this.orgName}/home`);
    } else {
      this.closePdfReport();
    }
  }

  getCashDrawerAmountAndPaidTicketCount(paramObject: any) {
    this.commonService.getCashDrawerAmountAndPaidTicketCount(paramObject)
      .subscribe((data: any) => {
          console.log('getCashDrawerAmountAndPaidTicketCount :: ');
          console.log(data);
          // this.dataService.cashDrawerAmountAndPaidTicketCount(data);
          const cashDrawerBalanceAmount = data.body.cashDrawerbalance;
          const paidTicketCount = data.body.paidTicketCount;
          this.dataService.setCashDrawerAmountDTO(cashDrawerBalanceAmount);
          this.dataService.setPaidCount(paidTicketCount);
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  payRemainder() {
    const selectedTicketDetail = this.tickets.filter((item:any) => item.rowId == this.ticketId);
    this.totalAmount = selectedTicketDetail.reduce((totalAmount: any, item: any) => totalAmount + item.balanceAmount, 0);
    // this.totalAmount = selectedTicketDetail[0].balanceAmount;
    
    this.paymentVisible = true;    

    this.selectedPayAmount = this.remainingAmount = this.payAmount = this.totalAmount - this.selectedSellerTicketsPaidAmount;
    this.showSection('Cash');
  }

  closePdfReport() {
    this.isParentTicketVisible = false;
    this.parentTicketIDVisible = false;
    this.getAllTicketsDetails(this.pagination);    
  }



  generateCheckPrintReport(ticketId: any, checkAmount: any, customerFullName: any) {
    this.showLoaderReport = true;
    this.showDownload = true;

    let amount = checkAmount;

    var num = amount.toString().split(".");
    let  doller = this.convertNumberToWords(num[0]);
    let cent = '';
    if (num.length>1) {
      cent = this.convertNumberToWords(num[1])
    }
    let amountInWord = ((doller.length==0? 'Zero ' : doller) + 'DOLLARS AND ' + (cent.length==0? 'Zero' : cent) + ' CENTS ONLY').toUpperCase()
    console.info(amountInWord);
    
    // const selectedTicketDetail = this.tickets.filter((item:any) => item.rowId == this.ticketId);
    // const customerFullName = selectedTicketDetail[0].customerName;       

    const param = {
      TicketId: ticketId,
      FullName: customerFullName.toUpperCase(),
      PrintDate: this.formatDate(new Date()),
      CheckDate: this.formatDate(this.selectedCheckDate),
      CheckAmount: (Math.round(checkAmount*100)/100).toFixed(2),
      AmountInWord: amountInWord
    }

    this.commonService.getCheckPrintReport(param)
      .subscribe(data => {
        this.showLoaderReport = false;
        console.log('getCheckPrintReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.pdfViwerTitle = 'Check For Print';
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  generateSingleTicketReport(ticketId: any) {
    const param = {
      TicketId: ticketId,
      LocationId: this.locId,
      Type: localStorage.getItem('defaultPrintSize')
    }
    this.showLoaderReport = false;
    this.showDownload = false;

    this.commonService.getMergeTransactionsTicketReceipt(param)
      .subscribe(data => {
        console.log('generateSingleTicketReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;
        this.showDownload = false;
       
        this.pdfViwerTitle = 'Ticket Receipt :: #' + ticketId;

        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj, this.pdfViwerTitle)
        }else{
        this.loadAndPrintBase64Pdf(this.fileDataObj)
        }


      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  loadAndPrintBase64Pdf(base64Data: string): void {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    iframe.src = blobUrl;

    iframe.onload = () => {
       iframe.contentWindow?.print();
    };
  }

  formatDate(dateStr: any) {
    const d = new Date(dateStr);
    return (d.getMonth() + 1).toString().padStart(2, '0') + '/' + d.getDate().toString().padStart(2, '0') + '/' + d.getFullYear();
  }
  
  convertNumberToWords(amount: any) {
    var words = new Array();
    words[0] = 'Zero';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j] as any);
                    n_array[i] = 0;
                }
            }
        }
      let  value;
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }

  print() {
  }

  processCash() {
    this.cashSectionVisible = true;
    this.checkSectionVisible = false;
    this.electronicPaymentSectionVisible = false;
  }

  processCheck() {
    this.cashSectionVisible = false;
    this.checkSectionVisible = true;
    this.electronicPaymentSectionVisible = false;

  }

  processElectronicPayment() {
    this.cashSectionVisible = false;
    this.checkSectionVisible = false;
    this.electronicPaymentSectionVisible = true;
  }

  payTickets() {

  }


  /** Seller pop up actions start */

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

  onSubmit() {
    const reqObj = {
      ...this.sellerForm.value,
      ...{ 
        rowId: 0,
        locID: this.locId,
        createdBy: this.logInUserId,
        createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
      }
    }
    console.log(reqObj);
    this.commonService.addSeller(reqObj).subscribe(data =>{
      console.log(data);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller updated Successfully' });
        const sellerFullname = reqObj.firstName + (reqObj.middleName != '' ? ' ' + reqObj.middleName : '') 
        + (reqObj.lastName != '' ? ' ' + reqObj.lastName : '') ;
           
        this.addSellerPopupVisible = false;
        this.sellerForm.patchValue({
          firstName: '',
          middleName: '',
          lastName: ''
        });
        this.clickOnSeller(data.body.insertedRow, sellerFullname, this.sellerType);
      },(error: any) =>{
      console.log(error);
    })

  }

  changeSellerType() {
    if (this.sellerType == 'Personal') {
      this.sellerType = 'Business';
    } else {
      this.sellerType = 'Personal';
    }
  }

  onRightClick(event: any) {
    return false;   // Add return false
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

  /** Seller pop up actions end */


  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchTickets();
        break;
      case 'mdi-refresh':
        this.refreshData();
        break;
      case 'mdi-ticket':
        this.addNewTicket();
        break;
      case 'mdi-merge':
        this.showMergeDialog();
        break;
      default:
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

  

}
