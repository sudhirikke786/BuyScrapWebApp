import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService } from 'primeng/api';
import { ConfirmedValidator } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-location-management',
  templateUrl: './admin-location-management.component.html',
  styleUrls: ['./admin-location-management.component.scss'],
  providers: [MessageService]
})
export class AdminLocationManagementComponent implements OnInit {


  visible: boolean  =  false;

  location  = [];
  locationVisble: boolean = false;
  addlocationVisble: boolean = false;

  orgName: any;
  locId: any;
  locationObj: any;
  locObj: any;
  actionType = 'Add Location'
  editObj:any;
  roleList:any = [];
   locationForm!: FormGroup;
   loading = false;
   userForm!: FormGroup<any>;
  isSubmit: boolean = false;
  patternMsg:any = RegexPattern;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb:FormBuilder,
    private messageService: MessageService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.getLocations();
    this.getAllLocatoins();
    this.creatLocation();
    this.getAllUsersRoles();
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
  }

 

  addpoupOpen(){
    this.actionType = 'Add';
    this.creatLocation();
    this.showLocationModel();

  }

  editPopupOpen(obj?:any){
    this.editObj =  obj;
    this.showLocationModel();
    this.actionType = 'Edit';
    console.log(obj)
    setTimeout(()=>{
      this.locationForm.patchValue({...obj});
    },100)
  

  }

  showLocationModel(){
    this.locationVisble =  true;
  }

  hideLocationModel(){
    this.locationVisble =  false;
  }

  get f(){
    return this.userForm.controls;
  }

  showUserModel(obj:any){
    this.editObj =  obj;
    this.createUserForm(); 
    this.visible =  true;
   
  }

  hideUserModel(){
    this.visible =  false;
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

  getLocations(){
    this.commonService.GetLocations({RowId:1}).subscribe((res) =>{
      this.locationObj =  res?.body?.data;
    })
  }

  getAllLocatoins(){
    this.loading = true;
    this.commonService.GetAllLocatoins({}).subscribe((res) =>{
      this.loading = false;
      this.locObj =  res?.body?.data;
      console.log(this.locObj)
    },(error) =>{
      this.loading = false;
    })
  }

  creatLocation(){
    this.locationForm = this.fb.group({
      locationName:[''],
      employeeCount:[''],
      ticketLimit:['',],
      userCount:[''],
      availableTickets:[''],
    })

  }
  submitLocation(){

    const formObj =  this.locationForm.value;
    const reqObj = {
      "rowId": this.actionType == 'Add' ? 0 : this.editObj?.rowId,
      "createdBy": 6,
      "createdDate": "2023-08-12T22:04:31.3",
      "updatedBy": 6,
      "updatedDate": "2023-08-12T22:04:31.3",
      "locationName":formObj.locationName,
      "isActive": true,
      "userCount":formObj.userCount,
      "employeeCount": formObj.employeeCount,
      "isCashierAdded": false,
      "ticketLimit": formObj.ticketLimit,
      "availableTickets": formObj.availableTickets,
      "isHeadOffice": false,
      "adminID": 0
    }

    this.commonService.InsertUpdateLocationDTO(reqObj).subscribe((res) =>{
      
      this.messageService.add({ severity: 'success', summary: 'success', detail: `${this.actionType} Location Successfully` });
       this.getAllLocatoins();
       this.hideLocationModel();
    })
  }


  submitForm() {
    console.log('Form submitted:', this.userForm);
    this.isSubmit = true;
  
    if (this.userForm.valid) {
      this.isSubmit = false;
    
      
      const req = {
        "createdBy": 1,
        "createdDate": "2023-06-29T01:55:08.541Z",
        "updatedBy": 1,
        "updatedDate": "2023-06-29T01:55:08.541Z",
        "tempOTP": "1234",
        "isActive": true,
        "macID": "",
        "rowId": 0,
        "roleId": Number(this.userForm.value.roleId),
        "role":this.roleList.filter((item:any) => item.roleId == this.userForm.value.roleId)[0],
        "locID":this.editObj.rowId,
        "isConfirm": true,
      }
      const userObj = {...this.userForm.value,...req}

      this.commonService.InsertUpdateUserDTO(userObj).subscribe((res) =>{
        let msg = 'Add User'
      
        this.messageService.add({ severity: 'success', summary: 'success', detail: `${msg} Successfully` });
        this.hideUserModel();
        this.getAllLocatoins();
     
      },(error)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

      })

      console.log('Form submitted:', this.userForm.value);
    } else {
      console.log('Form is invalid.');
    }
  }

  getAllUsersRoles(){
    this.commonService.GetAllUsersRoles({}).subscribe((res) =>{
      this.roleList =  res?.body?.data;
    })
  }
  
  

}
