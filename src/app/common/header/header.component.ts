import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  locId: any;
  cashDrawerbalance: number = 0.00;
  paidTicketCount: number = 0;
  userFullName: any;
  isReopenRegister: boolean = false;
  cashdrawerdetail: any;
  totalAmount: number = 0.00;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.locId = 1;
    
    this.userFullName = localStorage.getItem('userFullName');

    const paramObject = {
      LocationId: this.locId
    };
    this.getCashDrawerAmountAndPaidTicketCount(paramObject);
    this.getCashdrawerdetails(paramObject);
    this.getCashDrawerAmountDTO(paramObject);
  }
  
  getCashDrawerAmountAndPaidTicketCount(paramObject: any) {
    alert('Sudhir');
    this.commonService.getCashDrawerAmountAndPaidTicketCount(paramObject)
      .subscribe((data: any) => {
          console.log('getCashDrawerAmountAndPaidTicketCount :: ');
          console.log(data);
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
        alert('Ikke');
          console.log('getCashDrawerAmountDTO :: ');
          console.log(data);
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
    this.isReopenRegister = false;
  }
  
  showHidePanel(){
    const htmlAttr = document.querySelector('html');
    if(htmlAttr){
      const _datasidenav = htmlAttr.getAttribute('data-sidenav-size');
      if(_datasidenav=='condensed'){
        // sidebar-enable
        //
        htmlAttr.setAttribute('data-sidenav-size', 'default');
        htmlAttr.classList.add('menuitem-active')
      }else{
        htmlAttr.setAttribute('data-sidenav-size', 'condensed');
        htmlAttr.classList.add('menuitem-active sidebar-enable')
      }
    }
  
  }
   
}
