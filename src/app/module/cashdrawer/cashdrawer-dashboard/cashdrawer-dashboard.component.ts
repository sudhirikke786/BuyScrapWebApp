import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CashDrawerTransaction } from 'src/app/core/model/cash-drawer-transaction.model';
import { CashDrawer } from 'src/app/core/model/cash-drawer.model';
import { CommonService } from 'src/app/core/services/common.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-cashdrawer-dashboard',
  templateUrl: './cashdrawer-dashboard.component.html',
  styleUrls: ['./cashdrawer-dashboard.component.scss']
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
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private dataService: DataService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    
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
          this.cashDrawerbalance = data.body.cashDrawerbalance;
          this.paidTicketCount = data.body.paidTicketCount;
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
          this.cashDrawerPreviousDayBalanceAmount = data.body.data[0].totalAmount;
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
          this.cashDrawerBalanceAmount = data.body.data.amount;
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
    // POST call
    const newCashDrawerTransaction = new CashDrawerTransaction();     
    newCashDrawerTransaction.rowId = 0;
    newCashDrawerTransaction.createdBy = 6;
    newCashDrawerTransaction.createdDate = '2023-07-17T10:00:17.557';
    newCashDrawerTransaction.updatedBy = 6;
    newCashDrawerTransaction.updatedDate = '2023-07-17T10:00:17.557';
    newCashDrawerTransaction.amount = parseFloat(this.enterAmount.toString());
    newCashDrawerTransaction.reason = this.addReason;
    newCashDrawerTransaction.locID = this.locId;
    newCashDrawerTransaction.type = this.cashDrawerAction;      
    
    console.log("Final CashDrawerTransaction :: " + JSON.stringify(newCashDrawerTransaction));
    
    this.commonService.insertUpdateCashDrawerTransactions(newCashDrawerTransaction).subscribe(data =>{    
      console.log(data); 
      alert('Cash Drawer Transaction saved successfully');
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      
      // Update values
      const paramObject = {
        LocationId: this.locId
      };
      // this.getCashdrawerdetails(paramObject);
      this.getCashDrawerAmountDTO(paramObject);

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
      alert('Total Amount is not matched with Cash Drawer Balance');
    }
    
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
      // Redirect to user login page
      const orgName = localStorage.getItem('orgName');
      if (orgName && orgName != '') {
        localStorage.removeItem('userFullName');
        localStorage.removeItem('token');
        this.router.navigateByUrl(`${orgName}/user-login`);
      }
    } else {
      // alert('Total Amount is not matched with Cash Drawer Balance');      
      this.closeRegisterWithDiffernceVisible = true;
      // comment above line & Open pop-up for explaination (in pop up save method do the post call with reason & redirect to user login page)
    }
  }

  saveRegister(newCashDrawerdetail: any) {
    
    newCashDrawerdetail.rowId = 0;
    newCashDrawerdetail.createdBy = 6;
    newCashDrawerdetail.createdDate = '2023-07-17T10:00:17.557';
    newCashDrawerdetail.updatedBy = 6;
    newCashDrawerdetail.updatedDate = '2023-07-17T10:00:17.557';
    newCashDrawerdetail.currentDate = '2023-07-17T10:00:17.557';
    newCashDrawerdetail.locID = this.commonService.getProbablyNumberFromLocalStorage('locId');
    
    console.log("Final CashDrawerTransaction :: " + JSON.stringify(newCashDrawerdetail));
    
    this.commonService.insertCashDrawerDetails(newCashDrawerdetail).subscribe(data =>{    
      console.log(data); 
      // alert('Cash Drawer Detail saved successfully');
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      
      this.hideCloseRegister();
      this.hideReopenRegister();
    },(error: any) =>{  
      console.log(error);  
      alert('Error!!! Cash Drawer Detail not saved..');
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
    // Redirect to user login page
    const orgName = localStorage.getItem('orgName');
    if (orgName && orgName != '') {
      localStorage.removeItem('userFullName');
      localStorage.removeItem('token');
      this.router.navigateByUrl(`${orgName}/user-login`);
    }
  }

}
