import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Pagination } from 'src/app/core/interfaces/common-interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.scss']
})
export class TicketDashboardComponent implements OnInit {

  selectedTickets: any;
 

  actionList = [{
    iconcode:'mdi-magnify',
    title:'Search'
  },
  {
    iconcode:'mdi-refresh',
    title:'Refresh'
  },
  {
    iconcode:'mdi-ticket',
    title:'New Ticket'
  }
  
  ];
  
  newTicketList = [{
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode:'mdi-account',
      title:'New Customer'
    }  
  ];

  mergeTicketlist = [{
    iconcode:'mdi-magnify',
    title:'Search'
  },
  {
    iconcode:'mdi-refresh',
    title:'Refresh'
  }
  
  ];

  ticketsTypes =  [
    {name: 'ALL', code: 'ALL'},
    {name: 'OPEN', code: 'OPEN'},
    {name: 'Partially Paid', code: 'Partially Paid'},
    {name: 'ON HOLD', code: 'ON HOLD'},
    {name: 'PAID', code: 'PAID'},
    {name: 'VOIDED', code: 'VOIDED'}
  ];

  
  defaultSelectedTicketsTypes =  [
    {name: 'OPEN', code: 'OPEN'},
    {name: 'Partially Paid', code: 'Partially Paid'},
    {name: 'ON HOLD', code: 'ON HOLD'}
  ];
  
  tickets: any;
  childTickets: any;
  ticketsTransactions: any;
  sellerTickets: any;
  sellers: any;
  selectedSellerTickets: any;

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


  pagination: any = {
    SerachText: '',
    SearchOrder: 'TicketId',
    Status: this.defaultSelectedTicketsTypes.reduce((acc:any, cur:any) => ((acc.push(cur.name)), acc), []).join(','),
    PageNumber: 1,
    RowOfPage: 10,
    LocationId: this.commonService.getProbablyNumberFromLocalStorage('locId'),
    first : 0, 
  }

  currentPage = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  pageTotal = 0;
  tiketSelectedObj: any;
  currentRole: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService,
    private stroarge:StorageService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.currentRole = this.authService.userCurrentRole();

    // ['Administrator','Scale','Cashier']
    if(['Administrator','Cashier'].includes(this.currentRole)){
      this.actionList.unshift(
        {
          iconcode:'mdi-merge',
          title:'Merge Ticket and Pay'
        })
    }

    this.selectedTickets = this.defaultSelectedTicketsTypes;
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    const result = this.selectedTickets.reduce((acc:any, cur:any) => ((acc.push(cur.name)), acc), []).join(',');
    this.pagination.Status = result;
    this.getAllTicketsDetails(this.pagination);
  }


  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first ;
    let pagObj = {
      PageNumber: this.currentPage,
      RowOfPage: event.rows,
    }
    this.pagination = {...this.pagination,...pagObj};
    this.getAllTicketsDetails(this.pagination);
  }


  /**
   * Get the data by calling WebAPI to fetch the details for organization login
   */
  getAllTicketsDetails(pagination: Pagination) {
    console.log(this.pagination);
    this.commonService.getAllTicketsDetails(pagination)
      .subscribe(data => {
          console.log('getAllTicketsDetails :: ');
          console.log(data);
          this.tickets = data.body.data;
          this.pageTotal =  data?.body?.totalRecord
          this.last = data?.body?.totalIndex;
       
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  showVoideCancelCopy(ticketData:any){
    this.tiketSelectedObj = ticketData;
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
      this.showVoid =  true;

    }

  }

  showVoideForPartiallyPaid(ticketData:any){
    this.tiketSelectedObj = ticketData;
    this.showVoid =  true;
  }

  showVoidCancel(){
    console.log(this.tiketSelectedObj);
    this.isVoidOrRestore = 'Void';
    this.getTicketTransactions();
  }

  showRestoreTicket(ticketData:any) {
    console.log("Restore Ticket :: " + ticketData);
    this.tiketSelectedObj = ticketData;
    this.isVoidOrRestore = 'Restore';
    this.getTicketTransactions();
  }

  getTicketTransactions() {
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

  showVoidCopy(){

  }

  voidTicket() {
    const datePipe = new DatePipe('en-US');
    // alert(this.voidReason);
    console.log("Void Ticket :: " + this.voidReason);
    
    console.log(this.tiketSelectedObj);

    this.tiketSelectedObj['VoidReason'] = this.voidReason;
    this.tiketSelectedObj['VoidFlag'] = true;
    this.tiketSelectedObj['VoidBy'] = this.logInUserId;
    this.tiketSelectedObj['VoidDate'] = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    this.tiketSelectedObj['Status'] = 'VOIDED';
    
    console.log("Final ticketData :: " + JSON.stringify(this.tiketSelectedObj));
    
    this.commonService.insertUpdateTickets(this.tiketSelectedObj).subscribe(data =>{    
      console.log(data);
      this.refreshData();
      this.voidReason = '';
      this.showOpen = false;
      this.showPartially = false;
      this.showVoidDialogBox = false;
    },(error: any) =>{  
      console.log(error);  
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
    
  }

  restoreTicket() {    
    const datePipe = new DatePipe('en-US');
    // alert('Restore Ticket :: ' + this.voidReason);

    this.tiketSelectedObj['VoidReason'] = this.voidReason;
    this.tiketSelectedObj['CreatedBy'] = this.logInUserId;
    this.tiketSelectedObj['CreatedDate'] = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    
    console.log("Restore ticketData :: " + JSON.stringify(this.tiketSelectedObj));
    
    this.commonService.RestoreVoidTickets(this.tiketSelectedObj).subscribe(data =>{    
      console.log(data);
      this.refreshData();
      this.voidReason = '';
      this.showOpen = false;
      this.showPartially = false;
      this.showVoidDialogBox = false;
    },(error: any) =>{  
      console.log(error);  
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  refreshData() {    
    this.selectedTickets = this.defaultSelectedTicketsTypes;
    this.serachText = '';
    this.searchOrder = 'All';
    const result = this.selectedTickets.reduce((acc:any, cur:any) => ((acc.push(cur.name)), acc), []).join(',');
    this.pagination.Status = result;
    this.pagination.SerachText = this.serachText,
    this.pagination.SearchOrder = this.searchOrder,
    this.getAllTicketsDetails(this.pagination);
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
    this.commonService.getAllsellersDetails(paramObject)
      .subscribe(data => {
          console.log('getAllsellersDetails :: ');
          console.log(data);
          this.sellers = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  searchTickets() {
    console.log('selectedTickets :: ' + JSON.stringify(this.selectedTickets));
    const result = this.selectedTickets.reduce((acc:any, cur:any) => ((acc.push(cur.name)), acc), []).join(',');
    this.pagination.Status = result;
    this.pagination.SerachText = this.serachText,
    this.pagination.SearchOrder = this.searchOrder,
    this.pagination.currentPage = 1;

    this.getAllTicketsDetails(this.pagination);
  }

  addRemoveStatus(event: any) {
    console.log('Change Multiselect :: ');
    console.log(event);
    if (event.itemValue.name === 'ALL') {
      if (event.originalEvent) {
        this.selectedTickets = this.ticketsTypes;
      } else {
        this.selectedTickets = this.defaultSelectedTicketsTypes;
      }
    }
    this.searchTickets();
  }

  closeChildTicketMessage() {
    this.parentTicketIDVisible = false;
  }

  clickOnSeller(sellerId: any) {    
    if (this.newTicketVisible == true) {      
      this.router.navigateByUrl(`/${this.orgName}/home/detail/new/${sellerId}`);
    } else if (this.ticketvisible == true) {
      this.mergeTicketVisible = true;
      this.getAllTicketsBySellerId(sellerId);
    }

  }
  // routerLink = "/{{orgName}}/home/detail/{{ticket.rowId}}/{{ticket.customerId}}" 

  showTicketDetails(ticketData: any) {
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
      this.parentTicketIDVisible = false;
      this.router.navigateByUrl(`/${this.orgName}/home/detail/${ticketData.rowId}/${ticketData.customerId}`);
    }

  }

  getAllTicketsByParentID(parentTicketID: string) {
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
          // this.errorMsg = 'Error occured';
        }
      );
  }

  getAllTicketsBySellerId(sellerId: any) {    
    const paramObj: any = {
      SellerId: sellerId,
      LocationId: this.locId
    }
    this.commonService.getAllTicketsBySellerId(paramObj)
      .subscribe(data => {
          console.log('getAllTicketsBySellerId :: ');
          console.log(data);
          this.sellerTickets = data.body.data;
          this.sellerTickets = this.sellerTickets.filter( (obj: any) => {
              return obj.status === 'OPEN';   
          }).sort((a:any, b:any) => (a.title > b.title) ? 1 : -1);
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  closeMergeAndPayTickets() {    
    this.mergeTicketVisible = false;
  }

  mergeAndPaySelectedTickets() {    
    // this.mergeTicketVisible = false;
    this.paymentVisible = true;
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
      RowOfPage: 10,
      LocationId: this.locId,
      SerachText: this.searchSellerInput
    };
    this.getAllsellersDetails(paramObject);

  }

  refreshSellerData() {
    this.searchSellerInput = '';
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
  }

  addNewSeller() {    
    this.router.navigateByUrl(`${this.orgName}/sellers-buyers/add-seller`)
  }  
  
  onRightClick(event: any) {
    // alert('333333333333' + JSON.stringify(ticket));
    // Your code here
    // alert('1111111111111');
    return false;   // Add return false
 }
  /** Seller pop up actions end */


  getAction(actionCode:any){

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

  getSellerAction(actionCode:any){

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
