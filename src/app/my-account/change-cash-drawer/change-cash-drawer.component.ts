import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-change-cash-drawer',
  templateUrl: './change-cash-drawer.component.html',
  styleUrls: ['./change-cash-drawer.component.css']
})
export class ChangeCashDrawerComponent {
  locations :any =  [];  
  selectedLocation: any;
  orgName :any;
  locationId:any;
  locId: any;
  cashDrawersList: any[] = [];
  selectedDrawerId: number | null = null;
  
  logInUserId: number = 0;
  currentRole: any;




  constructor(
    private router:Router,
    private commonService:CommonService,
    private messageService: MessageService,
    private authService: AuthService,
    private stroarge: StorageService
  ){

  }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locationId = Number(localStorage.getItem("locId"));
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    console.log('this.locId', this.locId);
    this.currentRole = this.authService.userCurrentRole();
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);

    if (this.currentRole.toLowerCase() === 'cashier') {
      this.GetCashDrawerByUserID();
    } else {
      this.GetCashDrawers();
    }
    
  }

  GetCashDrawers() {
    const paramObj = {
      LocationId: this.locId
    }
    this.commonService.GetAllCashDrawers(paramObj).subscribe({
      next: (res: any) => {
        this.cashDrawersList = res?.body?.data || [];
        const savedDrawerId = localStorage.getItem('selectedCashDrawerId');       
        if (savedDrawerId) {
          this.selectedDrawerId = Number(savedDrawerId);
        }
      },
      error: (err: any) => {
        console.error('Error fetching cash drawers:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cash drawers' });
      }
    });
  }

  GetCashDrawerByUserID() {
    const paramObj = { 
      userID: this.logInUserId,
      LocID: this.locId
    };
    this.commonService.GetCashDrawerByUserID(paramObj).subscribe({
      next: (response: any) => {
        this.cashDrawersList = response?.body?.data || [];
        const savedDrawerId = localStorage.getItem('selectedCashDrawerId');

        if (savedDrawerId) {
          this.selectedDrawerId = Number(savedDrawerId);
        } 
        else if (this.cashDrawersList.length > 0) {
          this.selectedDrawerId = this.cashDrawersList[0].drawerID;
          localStorage.setItem('selectedCashDrawerId', String(this.selectedDrawerId));
        }
      },
      error: (err: any) => { 

      }
    });
  }



saveCashDrawerSelection() {
  if (!this.selectedDrawerId) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Warning', 
      detail: 'Please select a cash drawer first' 
    });
    return;
  }

  localStorage.removeItem('selectedCashDrawer'); 
    
  localStorage.setItem('selectedCashDrawerId', this.selectedDrawerId.toString());

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cash Drawer selection saved. The page will now reload.' 
    });

    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

}


