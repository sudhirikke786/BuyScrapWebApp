import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService,ConfirmationService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-scale-machine',
  templateUrl: './scale-machine.component.html',
  styleUrls: ['./scale-machine.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ScaleMachineComponent implements OnInit{

  orgName: any;
  rewardName: string = '';
  selectedReward: any = null; 
  logInUserId: any; 
  locId: any;
  admins: any[] = [];  
  scaleList: any[] = [];
  showAssignDialog: boolean = false;
  selectedCashDrawer: any = null;
  selectedUsers: number[] = []; 
  coupenAmount:any;
  eligibalAmount:any;
  Description:  string = '';

  showAddRewardDialog: boolean = false;
  isEditMode: boolean = false;
rewardDTO = {
  RowID: 0,
  ScaleName: '',
  Description: ''
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
    this.GetAllScales();
  }

  openAddRewardDialog() {
    this.rewardDTO = {  RowID: 0,ScaleName: '',Description: '' }; 
    this.showAddRewardDialog = true;
  }
  cancelReward() {
    this.showAddRewardDialog = false;
  }
  addReward() {
    this.isEditMode = false;
    this.rewardDTO = {
      RowID: 0,
      ScaleName: '',
      Description: ''
    };
    this.showAddRewardDialog = true;
  }

  editScale(reward: any) {
    this.isEditMode = true;
    this.rewardDTO = {
      RowID: reward.rowId,  
      ScaleName: reward.scaleName,
      Description: reward.description
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
      ScaleName: this.rewardDTO.ScaleName,
      Description: this.rewardDTO.Description,
      LocID: this.locId,
      IsActive: false
    };

    this.commonService.InsertUpdateScales(submitObj).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Scale saved successfully!' });
        this.showAddRewardDialog = false;
        this.GetAllScales();
      },
      error: (err: any) => {
        console.error('Error saving scale', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      }
      
    });
  }
  resetCashDrawer() {
    this.rewardName = '';
    this.selectedReward = null;
  }
  

  GetAllScales() {
    const paramObj = {
     
    }
    this.commonService.GetAllScales(paramObj).subscribe({
      next: (res: any) => {
        this.scaleList = res?.body?.data || [];
      },
      error: (err: any) => {
        console.error('Error fetching Scale:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Scale' });
      }
    });
  }

  deleteScale(reward: any) {
    if (!reward?.rowId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Scale ID' });
      return;
    }

    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure you want to delete scale `,
      acceptLabel: 'Yes',
      rejectLabel: 'Cancel',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const requestObj = { 
          RowID: reward.rowId,
          IsActive: false
        };
        this.commonService.DeleteScalebyId(requestObj).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Scale deleted successfully!' });
            this.GetAllScales(); 
          },
          error: (err: any) => {
            console.error('Error deleting Scale:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Scale' });
          }
        });
      },
      reject: () => {
        return false;
      },
    });
  }


    

}

