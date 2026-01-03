import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService,ConfirmationService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-redemption-program-component',
  templateUrl: './redemption-program-component.component.html',
  styleUrls: ['./redemption-program-component.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class RedemptionProgramComponentComponent implements OnInit{

  orgName: any;
  rewardName: string = '';
  selectedReward: any = null; 
  logInUserId: any; 
  locId: any;
  admins: any[] = [];  
  cashRewardsList: any[] = [];
  showAssignDialog: boolean = false;
  selectedCashDrawer: any = null;
  selectedUsers: number[] = []; 
  coupenAmount:any;
  eligibalAmount:any;
  coupenDescription:  string = '';

  showAddRewardDialog: boolean = false;
  isEditMode: boolean = false;
rewardDTO = {
  RowID: 0,
  CouponAmount: 0,
  EligibalAmount: 0,
  CoupenDescription: ''
};
  
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
    this.GetAllRewards();
  }

  openAddRewardDialog() {
    this.rewardDTO = {  RowID: 0,CouponAmount: 0, EligibalAmount: 0, CoupenDescription: '' }; 
    this.showAddRewardDialog = true;
  }
  cancelReward() {
    this.showAddRewardDialog = false;
  }
  addReward() {
    this.isEditMode = false;
    this.rewardDTO = {
      RowID: 0,
      CouponAmount: 0,
      EligibalAmount: 0,
      CoupenDescription: ''
    };
    this.showAddRewardDialog = true;
  }

  editReward(reward: any) {
    this.isEditMode = true;
    this.rewardDTO = {
      RowID: reward.rowId,  
      CouponAmount: reward.couponAmount,
      EligibalAmount: reward.eligibalAmount,
      CoupenDescription: reward.coupenDescription
    };
    this.showAddRewardDialog = true;
  }
  saveReward() {

    const submitObj = {
      RowId: this.rewardDTO.RowID,
      CreatedBy: this.logInUserId,
      CreatedDate: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS'),
      UpdatedBy: this.logInUserId,
      UpdatedDate: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS'),
      CouponAmount: this.rewardDTO.CouponAmount,
      EligibalAmount: this.rewardDTO.EligibalAmount,
      CoupenDescription: this.rewardDTO.CoupenDescription,
      LocID: this.locId,
      IsActive: true
    };

    this.commonService.InsertUpdateRewards(submitObj).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reward saved successfully!' });
        this.showAddRewardDialog = false;
        this.GetAllRewards();
      },
      error: (err: any) => {
        console.error('Error saving reward', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      }
      
    });
  }
  resetCashDrawer() {
    this.rewardName = '';
    this.selectedReward = null;
  }
  

  GetAllRewards() {
    const paramObj = {
      LocID: this.locId
    }
    this.commonService.GetAllRewards(paramObj).subscribe({
      next: (res: any) => {
        this.cashRewardsList = res?.body?.data || [];
      },
      error: (err: any) => {
        console.error('Error fetching Rewards:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Rewardss' });
      }
    });
  }

  deleteReward(reward: any) {
    if (!reward?.rowId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Reward ID' });
      return;
    }

    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure you want to delete Reward `,
      acceptLabel: 'Yes',
      rejectLabel: 'Cancel',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const requestObj = { 
          RowID: reward.rowId,
          IsActive: false
        };
        this.commonService.DeleteRewardbyId(requestObj).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reward deleted successfully!' });
            this.GetAllRewards(); 
          },
          error: (err: any) => {
            console.error('Error deleting Reward:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Reward' });
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
   // this.GetCashDrawers();
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

