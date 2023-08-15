import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { CommonService } from 'src/app/core/services/common.service';


    
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
  styleUrls: ['./admin-dashboard.component.scss']
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

  admins = [
    {
      firstName: 'Alex',
      lastName: 'Junior',
      username: 'alexj',
      userPermission: 'Administrator'
    },
    {
      firstName: 'Sanket',
      lastName: 'Yoshi',
      username: 'sankety',
      userPermission: 'Administrator'
    },
    {
      firstName: 'Scrap',
      lastName: 'User',
      username: 'scrapu',
      userPermission: 'Employee'
    },
    {
      firstName: 'John',
      lastName: 'Junior',
      username: 'johnj',
      userPermission: 'Scale'
    },
    {
      firstName: 'Graeme',
      lastName: 'Smith',
      username: 'graemes',
      userPermission: 'Cashier'
    },
    {
      firstName: 'Allan',
      lastName: 'Border',
      username: 'allanb',
      userPermission: 'Administrator'
    },
    {
      firstName: 'Mark',
      lastName: 'Junior',
      username: 'markj',
      userPermission: 'Administrator'
    }	
  ];
  

  visible = false;
 
  orgName: any;
  locId: any;
  isSubmit: boolean = false;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.createUserForm()
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
  }

  showModel(){
    this.visible =  true;
  }

  createUserForm(){
    this.userForm =  this.fb.group({    
        role:['',Validators.required] ,
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
      console.log('Form submitted:', this.userForm.value);
    } else {
      console.log('Form is invalid.');
    }
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
         this.router.navigateByUrl('/abc/admin/admin-location')
       break;
      default:
        break;
    }
  }

  get f(){
    return this.userForm.controls;
  }

}
