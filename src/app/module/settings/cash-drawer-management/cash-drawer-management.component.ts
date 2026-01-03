import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService,ConfirmationService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cash-drawer-management',
  templateUrl: './cash-drawer-management.component.html',
  styleUrls: ['./cash-drawer-management.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CashDrawerManagementComponent implements OnInit {

  orgName: any;
  cashDrawerName: string = '';
  selectedDrawer: any = null; 
  logInUserId: any; 
  locId: any;
  admins: any[] = [];  
  cashDrawersList: any[] = [];
  showAssignDialog: boolean = false;
  selectedCashDrawer: any = null;
  selectedUsers: number[] = []; 




  constructor(
    public commonService: CommonService, 
    private messageService: MessageService,
    private stroarge:StorageService,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.GetCashDrawers();
  }

  saveCashDrawer() {
    if (!this.cashDrawerName || this.cashDrawerName.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter Cash Drawer name' });
      return;
    }

    const submitObj = {
      rowId: this.selectedDrawer ? this.selectedDrawer.rowId : 0,
      createdBy: this.logInUserId,
      createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      updatedBy: this.logInUserId,
      updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      locID: this.locId,
      drawerName: this.cashDrawerName
    };

    this.commonService.InsertMultipleCashDrawers(submitObj).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cash Drawer saved successfully!' });
        this.resetCashDrawer();
        this.GetCashDrawers(); 
      },
      error: (err: any) => {
        console.error('Error saving drawer', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      }
    });
  }
  resetCashDrawer() {
    this.cashDrawerName = '';
    this.selectedDrawer = null;
  }
   editCashDrawer(drawer: any) {
    this.selectedDrawer = drawer;
    this.cashDrawerName = drawer.drawerName;
  }

  GetCashDrawers() {
    const paramObj = {
      LocationId: this.locId
    }
    this.commonService.GetAllCashDrawers(paramObj).subscribe({
      next: (res: any) => {
        this.cashDrawersList = res?.body?.data || [];
      },
      error: (err: any) => {
        console.error('Error fetching cash drawers:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cash drawers' });
      }
    });
  }

  deleteCashDrawer(drawer: any) {
    if (!drawer?.rowId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid drawer ID' });
      return;
    }

    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure you want to delete Cash Drawer "${drawer.drawerName}"?`,
      acceptLabel: 'Yes',
      rejectLabel: 'Cancel',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const requestObj = { 
          RowID: drawer.rowId,
          IsActive: false
        };
        this.commonService.DeleteCashDrawerbyId(requestObj).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cash Drawer deleted successfully!' });
            this.GetCashDrawers(); 
          },
          error: (err: any) => {
            console.error('Error deleting drawer:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete cash drawer' });
          }
        });
      },
      reject: () => {
        return false;
      },
    });
  }


  assignCashier(drawer: any) {
    this.selectedCashDrawer = drawer;
    this.getAllUsers(drawer.rowId);    
    this.selectedUsers = [];
    this.showAssignDialog = true;
  }

  toggleUserSelection(user: any, checked: boolean) {
    if (checked) {
      if (!this.selectedUsers.includes(user.rowId)) {
        this.selectedUsers.push(user.rowId);
      }
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== user.rowId);
    }
  }

  saveAssignCashier() {
    if (!this.selectedCashDrawer || !this.selectedCashDrawer.rowId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No Cash Drawer selected' });
      return;
    }
    const requests = this.admins.map(user => {
      const isChecked = this.selectedUsers.includes(user.rowId);
      const requestObj = {
        rowId: 0, 
        createdBy: this.logInUserId,
        createdDate:  this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate:  this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        locID: this.locId,
        drawerID: this.selectedCashDrawer.rowId, 
        userID: user.rowId,
        isActive: isChecked ? true : false   
      };
      return this.commonService.InsertUpdateUSerCashDrawers(requestObj);
    });
    requests.forEach(req$ => {
      req$.subscribe({
        next: () => {
        },
        error: (err) => {
          console.error('Error updating assignment:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update one or more assignments' });
        }
      });
    });
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cashier assigned successfully!' });
    this.GetCashDrawers();
    this.showAssignDialog = false;
  }

  cancelAssignCashier() {
    this.showAssignDialog = false;
  }


  getAllUsers(drawerId: number) {
    const reqObj = {
      LocationId: this.locId,
      UserID:0,
      RoleId:2,
      DrawerID: drawerId
    };

    this.commonService.GetAllUsers(reqObj).subscribe(
      (res: any) => {
       this.admins =  res?.body?.data || [];

        this.selectedUsers = this.admins
          .filter(user => user.isAssigned === true || user.isAssigned === 1)
          .map(user => user.rowId);

        this.showAssignDialog = true;
      },
      (err: any) => {
        console.error('Error fetching users:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
      }
    );
  }

}
