import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService } from 'primeng/api';

    
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
  providers: [MessageService]
})
export class AdminDashboardComponent implements OnInit {


  userForm!:FormGroup;
  patternMsg:any = RegexPattern;



  actionList = [
    {
      iconcode:'mdi-plus',
      title:'Add New User'
    },
    {
      iconcode:'mdi-map-marker',
      title:'Location Management'
    }
  ];

  roleList:any = [];
  admins = []
  
  

  visible = false;
 
  orgName: any;
  locId: any;
  isSubmit: boolean = false;
  title: string='Add User';
  editObj: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.createUserForm()
    this.title = 'Add User';
    this.getAllUsers();
    this.getAllUsersRoles();
  }

  showModel(adminObj?:any,openBy = 'add'){
    this.visible =  true;
   
    if(adminObj && openBy!='add'){
      this.title = 'Edit User';
      this.editObj = adminObj;
      this.userForm.patchValue(adminObj);
    }else{
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
    },{ 
      validator: ConfirmedValidator('password', 'confirmPassword')
    })

    // this.userForm.valueChanges.subscribe(() => {
    //   this.userForm.updateValueAndValidity();
    // });
  }

  submitForm() {
    console.log('Form submitted:', this.userForm);
    this.isSubmit = true;
  
    if (this.userForm.valid) {
      this.isSubmit = false;
      const maxRoleID = this.admins.map((item:any) => Number(item?.rowId))
      console.log(maxRoleID);
      const req = {
        "createdBy": 1,
        "createdDate": "2023-06-29T01:55:08.541Z",
        "updatedBy": 1,
        "updatedDate": "2023-06-29T01:55:08.541Z",
        "tempOTP": "1234",
        "isActive": true,
        "macID": "",
        "rowId": this.editObj?.rowId ?? 0,
        "roleId": Number(this.userForm.value.roleId),
        "role":this.roleList.filter((item:any) => item.roleId == this.userForm.value.roleId)[0],
        "locID":this.locId,
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

  deletUser(userObj:any){
    this.commonService.DeleteUserDTO(userObj).subscribe((res:any) =>{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete User Successfully' });
      this.getAllUsers();
    })
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
    const reqObj = {
      LocationId: this.locId,
      UserID:0
    }
    this.commonService.GetAllUsers(reqObj).subscribe((res) =>{
      this.admins =  res?.body?.data;

     
    })
  }

  get f(){
    return this.userForm.controls;
  }

  getAllUsersRoles(){
    this.commonService.GetAllUsersRoles({}).subscribe((res) =>{
      this.roleList =  res?.body?.data;
    })
  }

}
