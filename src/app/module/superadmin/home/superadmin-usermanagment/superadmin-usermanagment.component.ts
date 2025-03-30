import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { DatePipe } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';

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
  selector: 'app-superadmin-usermanagment',
  templateUrl: './superadmin-usermanagment.component.html',
  styleUrls: ['./superadmin-usermanagment.component.css'],
  providers: [MessageService,ConfirmationService]
})

export class SuperadminUsermanagmentComponent implements OnInit{

  userForm!:FormGroup;

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    { iconcode: 'mdi-arrow-left', 
    title: 'Back' ,label:'Back'},
    {
      iconcode:'mdi-plus',
      title:'Add New User',
      label:'Add New User'
    },
  ];

  orgName: any;
  locationId: any;
  admins : any[] = [];
  filteredAdmins: any[] = [];
  searchName:string ='';
  isSubmit: boolean = false;
  title: string='Add User';
  editObj: any;
  visible = false;
  roleList:any = [];
  logInUserId: any;
  locId: any;
  constructor(
    private stroarge:StorageService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService:ConfirmationService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.createUserForm();
    this.getAllUsersRoles();
    this.title = 'Add User';
    this.route.queryParams.subscribe(params => {
      this.locationId = params['locationId'];

      if (this.locationId) {
        this.getAllUsers();
      }
    });
   
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
    },{ 
      validator: ConfirmedValidator('password', 'confirmPassword')
    })
  }
  getAllUsers(){
    const reqObj = {
      LocationId: this.locationId,
      UserID:0,
      RoleID:1
    }
    this.commonService.GetAllUsers(reqObj).subscribe((res) =>{
      this.admins =  res?.body?.data as any[];
      this.filteredAdmins = [...this.admins];
     
    })
  }

  searchByName() {
    console.log('Search Clicked:', this.searchName);
    if (this.searchName.trim() === '') {
      this.filteredAdmins = [...this.admins]; 
    } else {
      this.filteredAdmins = this.admins.filter(admin =>
        admin.firstName?.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }
  }

  back(){
    console.log('Back clicked');
    this.router.navigate(['/superadmin/home/superadmin-loc']); 
  }
  getAdminAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchByName();
        break;
      case 'mdi-refresh':
        this.getAllUsers();
        this.searchName='';
        break;
        case 'mdi-arrow-left':
          this.back();
          break;
     
    }
  
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

  submitForm() {
    const datePipe = new DatePipe('en-US');
    console.log('Form submitted:', this.userForm);
    this.isSubmit = true;
  
    if (this.userForm.valid) {
      this.isSubmit = false;
      const maxRoleID = this.admins.map((item:any) => Number(item?.rowId))
      console.log(maxRoleID);

      const req = {
        "createdBy": 0,
        "createdDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        "updatedBy": 0,
        "updatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        "tempOTP": "1234",
        "isActive": true,
        "macID": "",
        "rowId": this.editObj?.rowId ?? 0,
        "roleId": Number(this.userForm.value.roleId),
        "role":this.roleList.filter((item:any) => item.roleId == this.userForm.value.roleId)[0],
        "locID":Number(this.locationId),
        "isConfirm": true,
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

  get f(){
    return this.userForm.controls;
  }

  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.showModel();
        break;
       case 'mdi-magnify':
        this.searchByName();
        break;
      case 'mdi-refresh':
        this.getAllUsers();
        this.searchName='';
        break;
        case 'mdi-arrow-left':
          this.back();
          break;
      default:
        break;
    }
  }

  confirmDelete(userObj: any) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete this user?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteUser(userObj); 
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
 

  getAllUsersRoles(){
    this.commonService.GetAllUsersRoles({}).subscribe((res) =>{
      this.roleList =  res?.body?.data;
    })
  }

}
