import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService,ConfirmationService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';

    
export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class AdminDashboardComponent implements OnInit {


  userForm!:FormGroup;
  patternMsg:any = RegexPattern;

  assignShiftDialog: boolean = false;
  selectedUser: any;
  ShiftStartTime: string = '';
  ShiftEndTime: string = '';
  assignedShifts: any[] = [];
  editIndex: number | null = null;
  originalShift: any = null;
  currentShiftData: any = null; 
  ShiftName: string = '';
  isLoading = false;



  actionList = [
    {
      iconcode:'mdi-plus',
      title:'Add New User',
      label:'Add New User'
    },
    {
      iconcode:'mdi-map-marker',
      title:'Location Management',
      label:'Location Management'
    }
  ];

  roleList:any = [];
  admins = []
  
  

  visible = false;
 
  orgName: any;
  locId: any;
  logInUserId: any;
  isSubmit: boolean = false;
  title: string='Add User';
  editObj: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService:ConfirmationService,
    private stroarge:StorageService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.createUserForm()
    this.title = 'Add User';
    this.getAllUsers();
    this.getAllUsersRoles();
  }

  showModel(adminObj?:any,openBy = 'add'){
    this.visible =  true;
    this.title = 'Add User';
    if(adminObj && openBy!='add'){
      this.title = 'Edit User';
      this.editObj = adminObj;
      this.userForm.patchValue(adminObj);
    }else{
      this.title = 'Add User';
      this.userForm.reset();
    }
   
  }

  createUserForm(){
    this.userForm =  this.fb.group({    
        roleId:['',Validators.required] ,
        userName: ['',Validators.required],
        password: ['',Validators.required],
        confirmPassword:['',Validators.required],
        firstName: ['',[Validators.required,Validators.pattern(RegexPattern.alphabetPattern[0])]],
        lastName: ['',Validators.required],
        mobileNumber:['',Validators.required],
        emailID: ['',Validators.required],
        isShiftUser: [false],
        isGeoLocationEnable: [false],
    },{ 
      validator: ConfirmedValidator('password', 'confirmPassword')
    })

    // this.userForm.valueChanges.subscribe(() => {
    //   this.userForm.updateValueAndValidity();
    // });
  }

  onRoleChange(event: Event): void {
    const selectedRole = (event.target as HTMLSelectElement).value;

    if (selectedRole === '4') {
      this.userForm.get('firstName')?.enable();
      this.userForm.get('lastName')?.enable();
      this.userForm.get('userName')?.disable();
      this.userForm.get('password')?.disable();
      this.userForm.get('confirmPassword')?.disable();
      this.userForm.get('mobileNumber')?.disable();
      this.userForm.get('emailID')?.disable();
    } else {
      this.userForm.get('firstName')?.enable();
      this.userForm.get('lastName')?.enable();
      this.userForm.get('userName')?.enable();
      this.userForm.get('password')?.enable();
      this.userForm.get('confirmPassword')?.enable();
      this.userForm.get('mobileNumber')?.enable();
      this.userForm.get('emailID')?.enable();
    }

    if (selectedRole === '1') {
      this.userForm.get('isShiftUser')?.setValue(false);
      this.userForm.get('isShiftUser')?.disable();
    } else {
      this.userForm.get('isShiftUser')?.enable();
    }
  }

  submitForm() {
    const datePipe = new DatePipe('en-US');
    console.log('Form submitted:', this.userForm);
    this.isSubmit = true;
  
    if (this.userForm.valid) {
      this.isSubmit = false;
      const maxRoleID = this.admins.map((item:any) => Number(item?.rowId))
      console.log(maxRoleID);

      const req = {
        "createdBy": this.logInUserId,
        "createdDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        "updatedBy": this.logInUserId,
        "updatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        "tempOTP": "1234",
        "isActive": true,
        "macID": "",
        "rowId": this.editObj?.rowId ?? 0,
        "roleId": Number(this.userForm.value.roleId),
        "role":this.roleList.filter((item:any) => item.roleId == this.userForm.value.roleId)[0],
        "locID":this.locId,
        "isConfirm": true,
        "isShiftUser": !!this.userForm.value.isShiftUser,
        "isGeoLocationEnable": !!this.userForm.value.isGeoLocationEnable
      }
      const userObj = {...this.userForm.value,...req}

      this.commonService.InsertUpdateUserDTO(userObj).subscribe((res) =>{
        let msg = 'Add User'
        if(this.title == 'Edit User'){
          msg = 'Update User';
        }
        this.messageService.add({ severity: 'success', summary: 'success', detail: `${msg} Successfully` });
        this.visible = false;
        this.getAllUsers();
      },(error)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

      })

      console.log('Form submitted:', this.userForm.value);
    } else {
      console.log('Form is invalid.');
    }
  }

  // deletUser(userObj:any){
  //   this.commonService.DeleteUserDTO(userObj).subscribe((res:any) =>{
  //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete User Successfully' });
  //     this.getAllUsers();
  //   })
  // }
  confirmDelete(userObj: any) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete this user?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteUser(userObj); // Call the delete method if confirmed
        },
        reject: () => {
            this.messageService.add({
                severity: 'info',
                summary: 'Cancelled',
                detail: 'User deletion cancelled',
            });
        }
    });
}

deleteUser(userObj: any) {
    this.commonService.DeleteUserDTO(userObj).subscribe(
        (res: any) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User deleted successfully',
            });
            this.getAllUsers(); // Refresh user list
        }
    );
}
 
  hideModel() {
    this.visible = false;
  }
  //-location

  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.showModel();
        break;
        case 'mdi-map-marker':
         this.router.navigateByUrl(`${this.orgName}/admin/admin-location`)
       break;
      default:
        break;
    }
  }

  getAllUsers(){
    this.isLoading = true;
    const reqObj = {
      LocationId: this.locId,
      UserID:0
    }
    this.commonService.GetAllUsers(reqObj).subscribe((res) =>{
      this.admins =  res?.body?.data;
    },
      (err: any) => {
        this.isLoading = false;
        console.error('Error fetching seller details:', err);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  get f(){
    return this.userForm.controls;
  }

  getAllUsersRoles(){
    this.commonService.GetAllUsersRoles({}).subscribe((res) =>{
      this.roleList =  res?.body?.data;
    })
  }

  assignShift(user: any) {
    this.selectedUser = user;
    this.assignShiftDialog = true;
    this.assignedShifts = []; 
    this.ShiftStartTime = '';
    this.ShiftEndTime = '';
    this.currentShiftData = null;
    this.GetUserShifts(user.rowId);
  }

  GetUserShifts(userId: number) {
    const paramObj = { UserID: userId };

    this.commonService.GetUserShifts(paramObj).subscribe({
      next: (res) => {
        const shifts = res?.body?.data || [];

        this.assignedShifts = shifts.map((shift: any) => ({
          rowID: shift.rowID,
          startTime: shift.shiftStartTime?.substring(0, 5), 
          endTime: shift.shiftEndTime?.substring(0, 5),
          shiftName: shift.shiftName
        }));
      },
      error: (err) => {
        console.error('Error fetching shifts:', err);
      }
    });
  }

  saveShift() {
    let isEdit = this.editIndex !== null;

    const start = isEdit ? this.assignedShifts[this.editIndex!].startTime : this.ShiftStartTime;
    const end = isEdit ? this.assignedShifts[this.editIndex!].endTime : this.ShiftEndTime;

    const startTime = this.parseTime(start);
    const endTime = this.parseTime(end);

    if (endTime <= startTime) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'End time must be greater than start time'});
      return;
    }

    const shiftData = isEdit ? this.assignedShifts[this.editIndex!] : {
      startTime: this.ShiftStartTime,
      endTime: this.ShiftEndTime,
      shiftName: this.ShiftName,
      rowID: 0
    };

    const requestObj = {
      rowID: shiftData.rowID || 0,
      UserID: this.selectedUser.rowId,
      createdBy: this.logInUserId,
      updatedBy: this.logInUserId,
      shiftName: shiftData.shiftName,
      shiftStartTime: this.formatTime(shiftData.startTime),
      shiftEndTime: this.formatTime(shiftData.endTime),
      isActive: true,
      locID: this.locId
    };

    this.commonService.InsertUpdateUserShifts(requestObj).subscribe({
      next: (response) => {
        if (isEdit) {
          this.assignedShifts[this.editIndex!] = {
            ...shiftData,
            rowID: response.rowID || shiftData.rowID,
            shiftName: requestObj.shiftName
          };
          this.editIndex = null;
          this.originalShift = null;
          this.currentShiftData = null;
        } else {
          this.assignedShifts.push({
            rowID: response.rowID || 0,
            startTime: this.ShiftStartTime,
            endTime: this.ShiftEndTime,
            shiftName: this.ShiftName
          });
          this.ShiftName = '';
          this.ShiftStartTime = '';
          this.ShiftEndTime = '';
        }

        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Shift Saved Successfully' });
      },
      error: (error) => {
        console.error('Error while saving shift:', error);
      }
    });
  }

  parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; 
  }

  DeleteShift(index: number) {
    const shiftToDelete = this.assignedShifts[index];
    
    const requestObj = {
      rowID: shiftToDelete.rowID,
      userID: this.selectedUser.rowId,
      createdBy: this.logInUserId,
      updatedBy: this.logInUserId,
      shiftName: shiftToDelete.shiftName,
      shiftStartTime: shiftToDelete.startTime,
      shiftEndTime: shiftToDelete.endTime,
      isActive: false, 
      locID: this.locId
    };

    this.commonService.DeleteUserShiftDTO(requestObj).subscribe({
      next: (response) => {
        this.assignedShifts.splice(index, 1);
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Shift Deleted Successfully' });
      },
      error: (error) => {
        console.error('Error deleting shift:', error);
      }
    });
  }

  startEdit(index: number) {
    this.editIndex = index;
    this.originalShift = { ...this.assignedShifts[index] };
    this.currentShiftData = { ...this.assignedShifts[index] };
  }

  cancelEdit() {
    if (this.editIndex !== null && this.originalShift) {
      this.assignedShifts[this.editIndex] = { ...this.originalShift };
    }
    this.editIndex = null;
    this.originalShift = null;
    this.currentShiftData = null;
  }

  private formatTime(time: string) {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  }


}
