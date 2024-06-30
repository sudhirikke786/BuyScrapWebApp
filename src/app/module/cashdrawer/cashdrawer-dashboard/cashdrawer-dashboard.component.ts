import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { CashDrawerTransaction } from 'src/app/core/model/cash-drawer-transaction.model';
import { CashDrawer } from 'src/app/core/model/cash-drawer.model';
import { CommonService } from 'src/app/core/services/common.service';
import { DataService } from 'src/app/core/services/data.service';
import { StorageService } from 'src/app/core/services/storage.service';

import { MessageService } from 'primeng/api';
	

@Component({
  selector: 'app-cashdrawer-dashboard',
  templateUrl: './cashdrawer-dashboard.component.html',
  styleUrls: ['./cashdrawer-dashboard.component.scss'],
  providers: [MessageService]
})
export class CashdrawerDashboardComponent implements OnInit {

  amvisible = false;
  addWithdrawMoneyPopupVisible =  false;
  ivisible = false;
  closeRegisterVisible = false;
  closeRegisterWithDiffernceVisible = false;
  closeRegisterWithDiffernceExplaination = '';

  orgName: any;
  locId: any;
  logInUserId: any;
  cashDrawerbalance: number = 0.00;
  paidTicketCount: number = 0;
  
  isReopenRegister: boolean = false;
  cashdrawerdetail: CashDrawer = new CashDrawer();
  cashdrawerClosingdetail: CashDrawer = new CashDrawer();
  cashDrawerPreviousDayBalanceAmount: number = 0.00;
  cashDrawerBalanceAmount: number = 0.00;
  cashDrawerStatus: string = 'OPEN';
  cashDrawerAction: string = '';
  enterAmount: number = 0;
  addReason: string = '';

  fileDataObj: any;
  showDownload = false;
  showLoaderReport = false;
  pdfViwerTitle = 'Cash Drawer Closer Receipt';
  
  numberFormat: string = '1.2-2';
  currencySymbol: string = 'USD';
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private stroarge:StorageService,
    private messageService: MessageService,
    private dataService: DataService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
        
    const paramObject = {
      LocationId: this.locId
    };
    // this.getCashDrawerAmountAndPaidTicketCount(paramObject);
    this.getCashdrawerdetails(paramObject);
    this.getCashDrawerAmountDTO(paramObject);

  }
  
  getCashDrawerAmountAndPaidTicketCount(paramObject: any) {
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
  
  getCashdrawerdetails(paramObject: any) {
    this.commonService.getCashdrawerdetails(paramObject)
      .subscribe((data: any) => {
          console.log('getCashdrawerdetails :: ');
          console.log(data);
          // this.dataService.cashDrawerDetail(data);
          this.cashdrawerdetail = data.body.data[0];
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }
  
  getCashDrawerAmountDTO(paramObject: any) {
    this.commonService.getCashDrawerAmountDTO(paramObject)
      .subscribe((data: any) => {
          console.log('getCashDrawerAmountDTO :: ');
          console.log(data);
          // this.dataService.cashDrawerAmountDTO(data);
          this.cashDrawerPreviousDayBalanceAmount = data.body.data.amount;
          this.cashDrawerBalanceAmount = data.body.data.balanceAmount;
          this.dataService.setCashDrawerAmountDTO(this.cashDrawerBalanceAmount);
          this.cashDrawerStatus = data.body.data.status;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  showAddModel(){
    this.addWithdrawMoneyPopupVisible =  true;
    this.cashDrawerAction = 'IN';
  }

  showPreetyCashModel() {
    this.addWithdrawMoneyPopupVisible =  true;
    this.cashDrawerAction = 'OUT';
  }

  hideAddWithdrawMoneyPopup() {
    this.addWithdrawMoneyPopupVisible =  false;
    this.cashDrawerAction = '';
    this.enterAmount = 0;
    this.addReason = '';
  }

  saveAddWithdrawMoneyAction() {
    const datePipe = new DatePipe('en-US');
    // POST call
    const newCashDrawerTransaction = new CashDrawerTransaction();     
    newCashDrawerTransaction.rowId = 0;
    newCashDrawerTransaction.createdBy = this.logInUserId;
    newCashDrawerTransaction.createdDate = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newCashDrawerTransaction.updatedBy = this.logInUserId;
    newCashDrawerTransaction.updatedDate = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newCashDrawerTransaction.amount = parseFloat(this.enterAmount.toString().replace(/,/g,''));
    newCashDrawerTransaction.reason = this.addReason;
    newCashDrawerTransaction.locID = this.locId;
    newCashDrawerTransaction.type = this.cashDrawerAction;      
    
    console.log("Final CashDrawerTransaction :: " + JSON.stringify(newCashDrawerTransaction));
    
    this.commonService.insertUpdateCashDrawerTransactions(newCashDrawerTransaction).subscribe(data =>{    
      console.log(data); 
      this.successAlert('Cash Drawer Transaction saved successfully');
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      
      // Update values
      const paramObject = {
        LocationId: this.locId
      };
      // this.getCashdrawerdetails(paramObject);
      this.getCashDrawerAmountDTO(paramObject);
      this.getCashDrawerAmountAndPaidTicketCount(paramObject);

      this.hideAddWithdrawMoneyPopup();
    },(error: any) =>{  
      console.log(error);  
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  showReopenRegister() {
    const paramObject = {
      LocationId: this.locId
    };
    this.getCashdrawerdetails(paramObject);
    this.isReopenRegister = true;
  }

  hideReopenRegister(){
    this.isReopenRegister = false;
  }

  recalculateRegister() {
    // alert(JSON.stringify(this.cashdrawerdetail));
    

    this.cashdrawerdetail.dollar1 = this.cashdrawerdetail.dollar1 ? parseFloat(this.cashdrawerdetail.dollar1.toString()) : 0;
    this.cashdrawerdetail.dollar5 = this.cashdrawerdetail.dollar5 ? parseFloat(this.cashdrawerdetail.dollar5.toString()) : 0;
    this.cashdrawerdetail.dollar10 = this.cashdrawerdetail.dollar10 ? parseFloat(this.cashdrawerdetail.dollar10.toString()) : 0;
    this.cashdrawerdetail.dollar20 = this.cashdrawerdetail.dollar20 ? parseFloat(this.cashdrawerdetail.dollar20.toString()) : 0;
    this.cashdrawerdetail.dollar50 = this.cashdrawerdetail.dollar50 ? parseFloat(this.cashdrawerdetail.dollar50.toString()) : 0;
    this.cashdrawerdetail.dollar100 = this.cashdrawerdetail.dollar100 ? parseFloat(this.cashdrawerdetail.dollar100.toString()) : 0;
    this.cashdrawerdetail.cent1 = this.cashdrawerdetail.cent1 ? parseFloat(this.cashdrawerdetail.cent1.toString()) : 0;
    this.cashdrawerdetail.cent5 = this.cashdrawerdetail.cent5 ? parseFloat(this.cashdrawerdetail.cent5.toString()) : 0;
    this.cashdrawerdetail.cent10 = this.cashdrawerdetail.cent10 ? parseFloat(this.cashdrawerdetail.cent10.toString()) : 0;
    this.cashdrawerdetail.cent25 = this.cashdrawerdetail.cent25 ? parseFloat(this.cashdrawerdetail.cent25.toString()) : 0;
    this.cashdrawerdetail.totalAmount = this.cashdrawerdetail.totalAmount? parseFloat(this.cashdrawerdetail.totalAmount.toString()) : 0;


    const totalAmount = ((this.cashdrawerdetail.dollar1 * 1) + (this.cashdrawerdetail.dollar5 * 5) + (this.cashdrawerdetail.dollar10 * 10) +
                                (this.cashdrawerdetail.dollar20 * 20) + (this.cashdrawerdetail.dollar50 * 50) + (this.cashdrawerdetail.dollar100 * 100) + 
                                (this.cashdrawerdetail.cent1 * .01) + (this.cashdrawerdetail.cent5 * .05) + (this.cashdrawerdetail.cent10 * .1) + 
                                (this.cashdrawerdetail.cent25 * .25));

    if (this.cashDrawerBalanceAmount == totalAmount) {      
      this.cashdrawerdetail.totalAmount = totalAmount;
      this.cashdrawerdetail.notMatchedAmount = totalAmount - this.cashDrawerBalanceAmount;
      this.cashdrawerdetail.notMatchedAmountReason = '';
      this.cashdrawerdetail.action = 'Recalculate';
      // POST call
      this.saveRegister(this.cashdrawerdetail);
    } else {
      this.errorAlert('Total Amount is not matched with Cash Drawer Balance');
    }
    
  }


  errorAlert(msg:any){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  successAlert(msg:any){
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }


  openCloseRegisterPopup(){    
    this.cashdrawerClosingdetail = new CashDrawer();
    this.closeRegisterVisible = true;
  }

  hideCloseRegister(){
    this.closeRegisterVisible = false;
  }

  closeRegister() {
    // alert(JSON.stringify(this.cashdrawerClosingdetail));

    
    this.cashdrawerClosingdetail.dollar1 = this.cashdrawerClosingdetail.dollar1 ? parseFloat(this.cashdrawerClosingdetail.dollar1.toString()) : 0;
    this.cashdrawerClosingdetail.dollar5 = this.cashdrawerClosingdetail.dollar5 ? parseFloat(this.cashdrawerClosingdetail.dollar5.toString()) : 0;
    this.cashdrawerClosingdetail.dollar10 = this.cashdrawerClosingdetail.dollar10 ? parseFloat(this.cashdrawerClosingdetail.dollar10.toString()) : 0;
    this.cashdrawerClosingdetail.dollar20 = this.cashdrawerClosingdetail.dollar20 ? parseFloat(this.cashdrawerClosingdetail.dollar20.toString()) : 0;
    this.cashdrawerClosingdetail.dollar50 = this.cashdrawerClosingdetail.dollar50 ? parseFloat(this.cashdrawerClosingdetail.dollar50.toString()) : 0;
    this.cashdrawerClosingdetail.dollar100 = this.cashdrawerClosingdetail.dollar100 ? parseFloat(this.cashdrawerClosingdetail.dollar100.toString()) : 0;
    this.cashdrawerClosingdetail.cent1 = this.cashdrawerClosingdetail.cent1 ? parseFloat(this.cashdrawerClosingdetail.cent1.toString()) : 0;
    this.cashdrawerClosingdetail.cent5 = this.cashdrawerClosingdetail.cent5 ? parseFloat(this.cashdrawerClosingdetail.cent5.toString()) : 0;
    this.cashdrawerClosingdetail.cent10 = this.cashdrawerClosingdetail.cent10 ? parseFloat(this.cashdrawerClosingdetail.cent10.toString()) : 0;
    this.cashdrawerClosingdetail.cent25 = this.cashdrawerClosingdetail.cent25 ? parseFloat(this.cashdrawerClosingdetail.cent25.toString()) : 0;
    this.cashdrawerClosingdetail.totalAmount = this.cashdrawerClosingdetail.totalAmount? parseFloat(this.cashdrawerClosingdetail.totalAmount.toString()) : 0;


    const closingTotalAmount = ((this.cashdrawerClosingdetail.dollar1 * 1) + (this.cashdrawerClosingdetail.dollar5 * 5) + (this.cashdrawerClosingdetail.dollar10 * 10) +
                                (this.cashdrawerClosingdetail.dollar20 * 20) + (this.cashdrawerClosingdetail.dollar50 * 50) + (this.cashdrawerClosingdetail.dollar100 * 100) + 
                                (this.cashdrawerClosingdetail.cent1 * .01) + (this.cashdrawerClosingdetail.cent5 * .05) + (this.cashdrawerClosingdetail.cent10 * .1) + 
                                (this.cashdrawerClosingdetail.cent25 * .25));

    if (this.cashDrawerBalanceAmount == closingTotalAmount) {
      
      this.cashdrawerClosingdetail.totalAmount = closingTotalAmount;
      this.cashdrawerClosingdetail.notMatchedAmount = closingTotalAmount - this.cashDrawerBalanceAmount;
      this.cashdrawerClosingdetail.notMatchedAmountReason = '';
      this.cashdrawerClosingdetail.action = 'Close';
      // POST call
      this.saveRegister(this.cashdrawerClosingdetail);
    } else {
      // alert('Total Amount is not matched with Cash Drawer Balance');      
      this.closeRegisterWithDiffernceVisible = true;
      // comment above line & Open pop-up for explaination (in pop up save method do the post call with reason & redirect to user login page)
    }
  }

  saveRegister(newCashDrawerdetail: any) {
    const datePipe = new DatePipe('en-US');
    
    newCashDrawerdetail.rowId = 0;
    newCashDrawerdetail.createdBy = this.logInUserId;
    newCashDrawerdetail.createdDate = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newCashDrawerdetail.updatedBy = this.logInUserId;
    newCashDrawerdetail.updatedDate = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newCashDrawerdetail.currentDate = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newCashDrawerdetail.locID = this.commonService.getProbablyNumberFromLocalStorage('locId');
    
    console.log("Final CashDrawerTransaction :: " + JSON.stringify(newCashDrawerdetail));
    
    this.commonService.insertCashDrawerDetails(newCashDrawerdetail).subscribe(data =>{    
      console.log(data); 
      let text = "Do you want to print receipt?";

      // alert('Cash Drawer Detail saved successfully');
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      this.hideCloseRegister();
      this.hideReopenRegister();
      
      if (confirm(text) == true) {
        this.getCashdrawerReceipt();
      } else {        
        this.closeAndRedirect()
      }
    },(error: any) =>{  
      console.log(error);  
      this.errorAlert('Error!!! Cash Drawer Detail not saved..');
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  saveRegisterWithDiffernceAmount() {
    
    this.cashdrawerClosingdetail.dollar1 = this.cashdrawerClosingdetail.dollar1 ? parseFloat(this.cashdrawerClosingdetail.dollar1.toString()) : 0;
    this.cashdrawerClosingdetail.dollar5 = this.cashdrawerClosingdetail.dollar5 ? parseFloat(this.cashdrawerClosingdetail.dollar5.toString()) : 0;
    this.cashdrawerClosingdetail.dollar10 = this.cashdrawerClosingdetail.dollar10 ? parseFloat(this.cashdrawerClosingdetail.dollar10.toString()) : 0;
    this.cashdrawerClosingdetail.dollar20 = this.cashdrawerClosingdetail.dollar20 ? parseFloat(this.cashdrawerClosingdetail.dollar20.toString()) : 0;
    this.cashdrawerClosingdetail.dollar50 = this.cashdrawerClosingdetail.dollar50 ? parseFloat(this.cashdrawerClosingdetail.dollar50.toString()) : 0;
    this.cashdrawerClosingdetail.dollar100 = this.cashdrawerClosingdetail.dollar100 ? parseFloat(this.cashdrawerClosingdetail.dollar100.toString()) : 0;
    this.cashdrawerClosingdetail.cent1 = this.cashdrawerClosingdetail.cent1 ? parseFloat(this.cashdrawerClosingdetail.cent1.toString()) : 0;
    this.cashdrawerClosingdetail.cent5 = this.cashdrawerClosingdetail.cent5 ? parseFloat(this.cashdrawerClosingdetail.cent5.toString()) : 0;
    this.cashdrawerClosingdetail.cent10 = this.cashdrawerClosingdetail.cent10 ? parseFloat(this.cashdrawerClosingdetail.cent10.toString()) : 0;
    this.cashdrawerClosingdetail.cent25 = this.cashdrawerClosingdetail.cent25 ? parseFloat(this.cashdrawerClosingdetail.cent25.toString()) : 0;
    this.cashdrawerClosingdetail.totalAmount = this.cashdrawerClosingdetail.totalAmount? parseFloat(this.cashdrawerClosingdetail.totalAmount.toString()) : 0;


    const closingTotalAmount = ((this.cashdrawerClosingdetail.dollar1 * 1) + (this.cashdrawerClosingdetail.dollar5 * 5) + (this.cashdrawerClosingdetail.dollar10 * 10) +
                                (this.cashdrawerClosingdetail.dollar20 * 20) + (this.cashdrawerClosingdetail.dollar50 * 50) + (this.cashdrawerClosingdetail.dollar100 * 100) + 
                                (this.cashdrawerClosingdetail.cent1 * .01) + (this.cashdrawerClosingdetail.cent5 * .05) + (this.cashdrawerClosingdetail.cent10 * .1) + 
                                (this.cashdrawerClosingdetail.cent25 * .25));

    this.cashdrawerClosingdetail.totalAmount = closingTotalAmount;
    this.cashdrawerClosingdetail.notMatchedAmount = closingTotalAmount - this.cashDrawerBalanceAmount;
    this.cashdrawerClosingdetail.notMatchedAmountReason = this.closeRegisterWithDiffernceExplaination;
    this.cashdrawerClosingdetail.action = 'Close';
    // POST call
    this.saveRegister(this.cashdrawerClosingdetail);
    this.closeRegisterWithDiffernceExplaination = '';
    this.closeAndRedirect()
  }

  getCashdrawerReceipt() {
    const param = {
      LocationId: this.locId,
      Type: localStorage.getItem('defaultPrintSize')
    }
    this.showDownload = true;
    this.showLoaderReport = true;

    this.commonService.getCashdrawerReceipt(param)
      .subscribe(data => {
        console.log('getCashdrawerReceipt :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  closeAndRedirect() {
    this.showDownload = false;

    // Redirect to user login page
    const orgName = localStorage.getItem('orgName');
    if (orgName && orgName != '') {
      localStorage.removeItem('userFullName');
      localStorage.removeItem('token');
      localStorage.removeItem('userObj');
      localStorage.removeItem('locId');
      this.router.navigateByUrl(`${orgName}/user-login`);
    }
  }

}
