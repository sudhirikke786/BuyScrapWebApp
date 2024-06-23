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
  wHeiht: any;
  wWidth: any;
  wHeight: any;
  defulatFontSize = 100;

  locations :any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService,
    private stroarge:StorageService,
    private messageService: MessageService,
    private authService:AuthService,
    public commonService: CommonService) { 

      
      const _userRole =  this.authService.userCurrentRole();

      this.locationId = Number(localStorage.getItem("locId"));

      if(_userRole){
        this.currentRole  = _userRole;
        console.log(this.currentRole);
      }


    }

    getOrgLocation() {
     
      this.commonService.getOrgLocation()
        .subscribe(data => {
    
            console.log('getOrgLocation :: ');
            console.log(data);
            this.locations = data.body.data;
   
          },
          (err: any) => {
         
            // this.errorMsg = 'Error occured';
          }
        );
    }
    
 

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');

     this.currentSize()
     this.getOrgLocation();
    
    this.userFullName = this.stroarge.getLocalStorage('userObj').userdto?.firstName;
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.mobileName = this.userFullName?.split(" ").map((name :any) => name.charAt(0).toUpperCase()).join("");

    const paramObject = {
      LocationId: this.locId
    };
    this.getCashDrawerAmountAndPaidTicketCount(paramObject);
    this.getCashdrawerdetails(paramObject);
      this.dataService.getCashDrawerAmountDTO().subscribe((amount:any) =>{
        this.cashDrawerBalanceAmount = amount;
     });
    this.getCashDrawerAmountDTO(paramObject);
  }


  changeLocation($event:any){
    localStorage.setItem("locId",$event.target.value);
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

    if (this.previousDayCDBalanceAmount == totalAmount) {      
      this.cashdrawerdetail.totalAmount = totalAmount;
      this.cashdrawerdetail.notMatchedAmount = totalAmount - this.cashDrawerBalanceAmount;
      this.cashdrawerdetail.notMatchedAmountReason = '';
      this.cashdrawerdetail.action = 'Open';
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
    this.closeRegisterWithDiffernceVisible = true;
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

    this.cashdrawerdetail.totalAmount = parseFloat(this.differntOpeningAmount.toString().replace(/,/g,''));
    this.cashdrawerdetail.notMatchedAmount = parseFloat(this.differntOpeningAmount.toString().replace(/,/g,'')) - this.cashDrawerBalanceAmount;
    this.cashdrawerdetail.notMatchedAmountReason = this.closeRegisterWithDiffernceExplaination;
    this.cashdrawerdetail.action = 'Open';
    // POST call
    this.saveRegister(this.cashdrawerdetail);
    this.closeRegisterWithDiffernceExplaination = '';
    this.differntOpeningAmount = 0;    
    this.closeRegisterWithDiffernceVisible = false;
  }

  backToUserLogin() {
    document.querySelectorAll('iframe').forEach(
      function(elem: any){
        elem.parentNode.removeChild(elem);
    });
    const orgName = localStorage.getItem('orgName');
    localStorage.removeItem('userObj');
    localStorage.removeItem('locId');
    this.router.navigateByUrl(`${orgName}/user-login`);
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
