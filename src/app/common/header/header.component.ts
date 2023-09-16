import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CashDrawer } from 'src/app/core/model/cash-drawer.model';
import { CommonService } from 'src/app/core/services/common.service';
import { DataService } from 'src/app/core/services/data.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  orgName: any;
  locId: any;
  cashDrawerbalance: number = 0.00;
  paidTicketCount: number = 0;
  userFullName: any;
  isReopenRegister: boolean = false;
  cashdrawerdetail: CashDrawer = new CashDrawer();
  totalAmount: number = 0.00;
  cashDrawerBalanceAmount: number = 0.00;
  closeRegisterWithDiffernceVisible = false;
  closeRegisterWithDiffernceExplaination = '';
  differntOpeningAmount: number = 0.00;
  mobileName: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private stroarge:StorageService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    
    this.userFullName = this.stroarge.getLocalStorage('userObj').userdto?.firstName;
    this.mobileName = this.userFullName?.split(" ").map((name :any) => name.charAt(0).toUpperCase()).join("");

    const paramObject = {
      LocationId: this.locId
    };
    this.getCashDrawerAmountAndPaidTicketCount(paramObject);
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
          this.totalAmount = (this.cashdrawerdetail.dollar1 + (this.cashdrawerdetail.dollar5 * 5) + (this.cashdrawerdetail.dollar10 * 10) +
                            (this.cashdrawerdetail.dollar20 * 20) + (this.cashdrawerdetail.dollar50 * 50) + (this.cashdrawerdetail.dollar100 * 100) + 
                            (this.cashdrawerdetail.cent1 * .01) + (this.cashdrawerdetail.cent5 * .05) + (this.cashdrawerdetail.cent10 * .1) + 
                            (this.cashdrawerdetail.cent25 * .25));
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
          if (data.body.data.status === 'CLOSED') {
            this.isReopenRegister = true;
          } else {
            this.isReopenRegister = false;
          }
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  approvePreviousdayBalance() {
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
      this.cashdrawerdetail.action = 'Open';
      // POST call
      this.saveRegister(this.cashdrawerdetail);
    } else {
      alert('Total Amount is not matched with Cash Drawer Balance');
    }
    
  }
  
  openWithDifferentAmount() {
    // alert('implementation pending .... !!!');
    this.closeRegisterWithDiffernceVisible = true;
  }

  hideCloseRegister(){
    this.isReopenRegister = false;
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
      alert('Cash Drawer Detail saved successfully');
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      
      this.hideCloseRegister();
    },(error: any) =>{  
      console.log(error);  
      alert('Error!!! Cash Drawer Detail not saved..');
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  saveRegisterWithDiffernceAmount() {
    
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

    
    const closingTotalAmount = ((this.cashdrawerdetail.dollar1 * 1) + (this.cashdrawerdetail.dollar5 * 5) + (this.cashdrawerdetail.dollar10 * 10) +
                                (this.cashdrawerdetail.dollar20 * 20) + (this.cashdrawerdetail.dollar50 * 50) + (this.cashdrawerdetail.dollar100 * 100) + 
                                (this.cashdrawerdetail.cent1 * .01) + (this.cashdrawerdetail.cent5 * .05) + (this.cashdrawerdetail.cent10 * .1) + 
                                (this.cashdrawerdetail.cent25 * .25));

    this.cashdrawerdetail.totalAmount = parseFloat(this.differntOpeningAmount.toString());
    this.cashdrawerdetail.notMatchedAmount = parseFloat(this.differntOpeningAmount.toString()) - this.cashDrawerBalanceAmount;
    this.cashdrawerdetail.notMatchedAmountReason = this.closeRegisterWithDiffernceExplaination;
    this.cashdrawerdetail.action = 'Open';
    // POST call
    this.saveRegister(this.cashdrawerdetail);
    this.closeRegisterWithDiffernceExplaination = '';
    this.differntOpeningAmount = 0;    
    this.closeRegisterWithDiffernceVisible = false;
  }

  backToUserLogin() {
    const orgName = localStorage.getItem('orgName');
    localStorage.removeItem('userObj');
    localStorage.removeItem('locId');
    this.router.navigateByUrl(`${orgName}/user-login`);
  }
  
  // showHidePanel(){
  //   const htmlAttr = document.querySelector('html');
  //   if(htmlAttr){
  //     const _datasidenav = htmlAttr.getAttribute('data-sidenav-size');
  //     if(_datasidenav=='condensed'){
  //       // sidebar-enable
  //       //
  //       htmlAttr.setAttribute('data-sidenav-size', 'default');
  //       htmlAttr.classList.add('menuitem-active')
  //     }else{
  //       htmlAttr.setAttribute('data-sidenav-size', 'condensed');
  //       htmlAttr.classList.add('menuitem-active sidebar-enable')
  //     }
  //   }
  
  // }
   
}
