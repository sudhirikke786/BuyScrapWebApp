import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { CashDrawer } from 'src/app/core/model/cash-drawer.model';
import { CommonService } from 'src/app/core/services/common.service';
import { DataService } from 'src/app/core/services/data.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  	
	providers: [MessageService]
	
})
export class HeaderComponent implements OnInit {

  orgName: any;
  locId: any;
  // cashDrawerbalance: number = 0.00;
  paidTicketCount: number = 0;
  userFullName: any;
  logInUserId: any;
  isReopenRegister: boolean = false;
  cashdrawerdetail: CashDrawer = new CashDrawer();
  totalAmount: number = 0.00;
  cashDrawerBalanceAmount: number = 0.00;
  previousDayCDBalanceAmount: number = 0.00;
  closeRegisterWithDiffernceVisible = false;
  closeRegisterWithDiffernceExplaination = '';
  differntOpeningAmount: number = 0.00;
  mobileName: any;
  currentRole:any;

  locationId :any;
  // cashAmount:any;
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';
  wHeiht: any;
  wWidth: any;
  wHeight: any;
  defulatFontSize = 100;
  isDispatchOnly : boolean = false;
  locations :any;
  locationName!: string | null;
  shouldShowCashDrawerPopup: boolean = false;
  
  strCashDrawerStatus: string = 'OPEN';
  MultiCashDrawerEnabled: boolean = false;
  selectedCashDrawer: any = null; 
  activeDrawerId: any;
  drawerName: string = '';
  isFirstTimeUser: boolean = false;

  
  IsUseCheckTemplateEnabled: boolean = false;
  isPreviousDayOpen: boolean = false;
  
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    public dataService: DataService,
    private stroarge:StorageService,
    private messageService: MessageService,
    private authService:AuthService,
    public commonService: CommonService) { 

      
      const _userRole =  this.authService.userCurrentRole();

    

      if(_userRole){
        this.currentRole  = _userRole;
        console.log(this.currentRole);
      }


    }

   
    
 

  ngOnInit() {
    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      const UseCheckTemplate = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'usechecktemplate');
      this.IsUseCheckTemplateEnabled = String(UseCheckTemplate?.values).toLowerCase() === 'true';

      const MultiCashDrawerEnabled = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'ismulticashdrawersupport');
      this.MultiCashDrawerEnabled = String(MultiCashDrawerEnabled?.values).toLowerCase() === 'true';
    }
        
    this.orgName = localStorage.getItem('orgName');
    this.locationName = localStorage.getItem('locationName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.currentSize()
     
    this.isDispatchOnly = localStorage.getItem('isDispatchOnly') === 'true';
    this.userFullName = this.stroarge.getLocalStorage('userObj').userdto?.firstName;
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.mobileName = this.userFullName?.split(" ").map((name :any) => name.charAt(0).toUpperCase()).join("");

    const drawerJson = localStorage.getItem('selectedCashDrawer');
      if (drawerJson) {
        this.selectedCashDrawer = JSON.parse(drawerJson);
      }

    this.activeDrawerId = localStorage.getItem('selectedCashDrawerId') 
      ? parseInt(localStorage.getItem('selectedCashDrawerId')!, 10) 
      : (this.selectedCashDrawer ? this.selectedCashDrawer.drawerID : 1);

    const cashDrawerOpenedFlag = localStorage.getItem('cashDrawerOpened');

    // if ((this.currentRole === 'Administrator' || this.currentRole === 'Cashier') && !this.isDispatchOnly && cashDrawerOpenedFlag !== 'false') {
    //   this.isReopenRegister = true;
    //   this.shouldShowCashDrawerPopup = true;
    // } else {
    //   this.isReopenRegister = false;
    //   this.shouldShowCashDrawerPopup = false;
    // }
    this.isReopenRegister = false;
    this.shouldShowCashDrawerPopup = false;

    if (this.currentRole !== 'Scale' && this.currentRole !== 'Driver') {
      const paramObject = {
        LocationId: this.locId,
        DrawerID: this.activeDrawerId
      };
      this.getCashDrawerAmountAndPaidTicketCount(paramObject);
      this.getCashdrawerdetails(paramObject);
      // this.getCashDrawerAmountDTO(paramObject);
      
      this.dataService.getCashDrawerAmountDTO().subscribe((amount:any) =>{
        this.cashDrawerBalanceAmount = amount;
      });

      this.dataService.getPaidCount().subscribe((count: any) => {
        this.paidTicketCount = count;
      });
    }
    this.updateCashDrawerStatus();
  }

  private async updateCashDrawerStatus() {
    try {
      const cashDrawerData = await this.commonService.getCashDrawerAmountDTO({
        LocationId: this.locId,
        DrawerID: this.activeDrawerId
      }).toPromise();
  
      if (!cashDrawerData?.body.data) {
        localStorage.setItem('cashDrawerStatus', 'CLOSE');
        return;
      }
      
      const status = cashDrawerData.body.data.status.toUpperCase();
      const updatedDate = new Date(cashDrawerData.body.data.updatedDateOnly);
      // const updatedDate = new Date();
      const today = new Date(cashDrawerData.body.data.locationDateOnly);
      // const today = new Date();
  
      const oldDate = updatedDate.toLocaleDateString('en-CA'); 
      const todayDate = today.toLocaleDateString('en-CA'); 
      
      if ((this.currentRole === 'Administrator' || this.currentRole === 'Cashier') && !this.isDispatchOnly) {
      if (oldDate !== todayDate && status === 'OPEN') {
        this.isPreviousDayOpen = true;  // ★ NEW STATE
        this.shouldShowCashDrawerPopup = true;
        this.isReopenRegister = true;
      } else if (status === 'CLOSE') {
        this.isPreviousDayOpen = false;  // ★ NEW STATE
        this.shouldShowCashDrawerPopup = true;
        this.isReopenRegister = true;
      } }
      else {
        this.isPreviousDayOpen = false;
      }
  
      this.strCashDrawerStatus = status;
      localStorage.setItem('cashDrawerStatus', status);
  
      this.cashDrawerBalanceAmount = cashDrawerData.body.data.balanceAmount;
      this.previousDayCDBalanceAmount = this.cashDrawerBalanceAmount;
    } catch (error) {
      // localStorage.setItem('cashDrawerStatus', 'CLOSE');

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch cash drawer status. Please check your connection or try again'
      });
    }
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
          this.isFirstTimeUser = this.cashdrawerdetail.isFirstTimeUser;
          console.log('getCashdrawerdetails :: ',this.isFirstTimeUser);
          this.drawerName = this.cashdrawerdetail.drawerName;
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
          this.cashDrawerBalanceAmount = data.body.data.balanceAmount;
          this.previousDayCDBalanceAmount = this.cashDrawerBalanceAmount;
          const status = data.body.data.status.toUpperCase();
          localStorage.setItem('cashDrawerStatus', status);

          if (data.body.data.status.toUpperCase() === 'CLOSE') {
            this.isReopenRegister = true;
            this.dataService.setCashDrawerAmountDTO(0);
          } else {
            this.isReopenRegister = false;
            this.dataService.setCashDrawerAmountDTO(this.cashDrawerBalanceAmount);
          }
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to retrieve current cash drawer balance. Please check your connection or try again.'
          });
        }
      );
  }

  approvePreviousdayBalance() {
    // alert(JSON.stringify(this.cashdrawerdetail));    
    if (this.isFirstTimeUser){
      this.messageService.add({
        severity:'warn',
        summary:'Action Required',
        detail:'Please add money from Cash Drawer Section',
        life: 3000
      });
      
    }
    if (this.isPreviousDayOpen) {
      this.cashdrawerdetail.isManualClose = true; // ★ For SP_InsertCashDrawerDetailsAudit
    } else {
      this.cashdrawerdetail.isManualClose = false;
    }
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

    if (this.previousDayCDBalanceAmount == totalAmount) {      
      this.cashdrawerdetail.totalAmount = totalAmount;
      this.cashdrawerdetail.notMatchedAmount = totalAmount - this.cashDrawerBalanceAmount;
      this.cashdrawerdetail.notMatchedAmountReason = '';
      this.cashdrawerdetail.action = 'Open';
      // POST call
      this.strCashDrawerStatus = 'OPEN';
      this.isReopenRegister = false;
      localStorage.setItem('cashDrawerStatus', 'OPEN');
      localStorage.setItem('cashDrawerOpened', 'false');
      this.saveRegister(this.cashdrawerdetail);
    } else {
      this.errorAlert('Total Amount is not matched with Cash Drawer Balance');
    }
    
  }


  errorAlert(msg:any){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  
  successAlert(msg:any){
    this.messageService.add({ severity: 'success', summary: 'success', detail: msg });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?:any) {
    this.wWidth = event.target.innerWidth;
    this.wHeight = event.target.innerHeight;
  }
  currentSize(){
    this.wWidth = window.innerWidth;
    this.wHeight = window.innerHeight;
  }






  openWithDifferentAmount() {
    // alert('implementation pending .... !!!');
    const total = this.calculateDenominationTotal();
    this.differntOpeningAmount = total;
    this.closeRegisterWithDiffernceVisible = true;
    localStorage.setItem('cashDrawerStatus', 'OPEN');
    localStorage.setItem('cashDrawerOpened', 'false');

  }

   skipAndContinue() {
    this.isReopenRegister = false;
    localStorage.setItem('cashDrawerStatus', 'CLOSE');
    localStorage.setItem('cashDrawerOpened', 'false');
  }

  hideCloseRegister(){
    this.isReopenRegister = false;
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
    newCashDrawerdetail.drawerID = this.activeDrawerId;
    newCashDrawerdetail.isManualClose = this.cashdrawerdetail.isManualClose;
    if (this.selectedCashDrawer && this.selectedCashDrawer.drawerID === this.activeDrawerId) {
      newCashDrawerdetail.drawerName = this.selectedCashDrawer.drawerName;
    }
    
    console.log("Final CashDrawerTransaction :: " + JSON.stringify(newCashDrawerdetail));
    
    this.commonService.insertCashDrawerDetails(newCashDrawerdetail).subscribe(data =>{    
      console.log(data); 
      this.successAlert('Cash Drawer Detail saved successfully');      
      this.dataService.setCashDrawerAmountDTO(newCashDrawerdetail.totalAmount);
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      
      this.hideCloseRegister();
    },(error: any) =>{  
      console.log(error);  
      this.errorAlert('Error!!! Cash Drawer Detail not saved..');
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }
  calculateDenominationTotal() {
    let total = 0;
  
    // Bills
    total += (Number(this.cashdrawerdetail.dollar1) || 0) * 1;
    total += (Number(this.cashdrawerdetail.dollar5) || 0) * 5;
    total += (Number(this.cashdrawerdetail.dollar10) || 0) * 10;
    total += (Number(this.cashdrawerdetail.dollar20) || 0) * 20;
    total += (Number(this.cashdrawerdetail.dollar50) || 0) * 50;
    total += (Number(this.cashdrawerdetail.dollar100) || 0) * 100;
  
    // Cents
    total += (Number(this.cashdrawerdetail.cent1) || 0) * 0.01;
    total += (Number(this.cashdrawerdetail.cent5) || 0) * 0.05;
    total += (Number(this.cashdrawerdetail.cent10) || 0) * 0.10;
    total += (Number(this.cashdrawerdetail.cent25) || 0) * 0.25;
  
    return total;
  }
  

  saveRegisterWithDiffernceAmount() {
    debugger;
    if (this.isPreviousDayOpen) {
      this.cashdrawerdetail.isManualClose = true; // ★ For SP_InsertCashDrawerDetailsAudit
    } else {
      this.cashdrawerdetail.isManualClose = false;
    }
    
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

    this.cashdrawerdetail.totalAmount = parseFloat(this.differntOpeningAmount.toString().replace(/,/g,''));
    this.cashdrawerdetail.notMatchedAmount = parseFloat(this.differntOpeningAmount.toString().replace(/,/g,'')) - this.cashDrawerBalanceAmount;
    this.cashdrawerdetail.notMatchedAmountReason = this.closeRegisterWithDiffernceExplaination;
    this.cashdrawerdetail.action = 'Open';
    // POST call
    this.saveRegister(this.cashdrawerdetail);
    this.closeRegisterWithDiffernceExplaination = '';
    this.differntOpeningAmount = 0;    
    this.closeRegisterWithDiffernceVisible = false;
    this.strCashDrawerStatus = 'OPEN';
    
    this.dataService.getCashDrawerAmountDTO().subscribe((amount:any) =>{
      this.cashDrawerBalanceAmount = amount;
    });
  }

  backToUserLogin() {
    const userObjStr = localStorage.getItem('userObj');
    const orgName = localStorage.getItem('orgName');
  let requestObj: any = {};

  if (userObjStr) {
    const userObj = JSON.parse(userObjStr);
    requestObj = {
      Username: userObj.userdto.userName
    };
  }
  this.commonService.UserLogout(requestObj).subscribe({
    next: (res) => {
      console.log('Logout success:', res);

      // Cleanup iframes
      document.querySelectorAll('iframe').forEach((elem: any) => {
        elem.parentNode.removeChild(elem);
      });
    
    localStorage.removeItem('cashDrawerOpened');
    localStorage.removeItem('userObj');
    localStorage.removeItem('locId');
    localStorage.removeItem('locationName');
    localStorage.removeItem('currencyCode');
    localStorage.removeItem('ticketPagination');
    localStorage.removeItem('filterObj');
    localStorage.removeItem('selectedCashDrawer');   
    localStorage.removeItem('selectedCashDrawerId');
    localStorage.removeItem('cashDrawerStatus');
    this.router.navigateByUrl(`${orgName}/user-login`);
  },
  error: (err) => {
    console.error('Logout failed:', err);

    // Even if API fails, still clean up and redirect
    localStorage.clear();
    this.router.navigateByUrl(`${orgName}/user-login`);
  }
});
}

  toggleFullscreen() {
    const element = document.documentElement;

    if (document.fullscreenElement) {
      // If the page is already in fullscreen, exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      // If the page is not in fullscreen, request fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }
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
