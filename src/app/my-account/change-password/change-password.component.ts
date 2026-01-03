import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

changeType: 'org' | 'user' = 'org';
isUserChange: boolean = false;

isOrgPassword: boolean = true;
userPassword = {
  
  newPassword: '',
  confirmPassword: ''
};
  orgName: any;
  UserID: any;
  locId: any;
  orgKey: any
  userPass: any;
  userRole: any;
  oldPassword: string = ''; 
  newPassword: string = '';
  confirmPassword: string = '';
  orgDetails: any = {};
  userDetails: any = {};
  showConfirmPassword: boolean = false;
  orgPassword = {
    
    newPassword: '',
    confirmPassword: ''
  };
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.UserID = localStorage.getItem('userRowID');
    if (this.userRole !== 'Administrator') {
      this.isOrgPassword = false; 
    }
    this.userRole = localStorage.getItem('userRole');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.GetOrganisactionPasswordByName();
    this.GetUserPassById();
  }

  GetUserPassById(){
    const paramObj = {
      UserID : this.UserID
    };
    this.commonService.GetUserPassById(paramObj).subscribe(
      (data) => {
        this.userDetails = data.body;
        this.userPass = this.userDetails.unprotectedPassword;
        console.log("User Details");
      }
    )
  }

  updateUserPassword() {

    if (!this.userPassword.newPassword || !this.userPassword.confirmPassword) {
      // alert('Password fields cannot be blank.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Password fields cannot be blank.' });
      return;
    }

    if (this.userPassword.newPassword !== this.userPassword.confirmPassword) {
      // alert('New password and Confirm password do not match.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'New password and Confirm password do not match.' });
      return;
    }
  
    const requestObj = {
      RowId: Number(this.UserID),
      Password: this.userPassword.confirmPassword
      
     
    };
  
    this.commonService.UpdateUserPassword(requestObj).subscribe(
      (res: any) => {
        // alert('Password updated successfully.');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password updated successfully.' });
      },
      (err) => {
        console.error(err);
        // alert('Failed to update password.');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update password.' });
      }
    );
  }
  
  GetOrganisactionPasswordByName(){
  const paramObj = {
    orgName : this.orgName
  };
  this.commonService.GetOrganisactionPasswordByName(paramObj).subscribe(
    (data) => {
      console.log('API response:', data);
      this.orgDetails = data.body;
      if (this.orgDetails && this.orgDetails.unprotectedPassword) {
        this.orgKey = this.orgDetails.unprotectedPassword; 
      }
      
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}


toggleConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}

updateOrganizationPassword() {
  if (!this.orgPassword.newPassword || !this.orgPassword.confirmPassword) {
    alert('Password fields cannot be blank.');
    return;
  }
  if (this.orgPassword.newPassword !== this.orgPassword.confirmPassword) {
    alert('New password and Confirm password do not match.');
    return;
  }

  const requestObj = {
    OrganisationName: this.orgName,
    ConfirmOrgKey: this.orgPassword.confirmPassword
    
   
  };

  this.commonService.UpdateOrganizationPassword(requestObj).subscribe(
    (res: any) => {
      alert('Password updated successfully.');
    },
    (err) => {
      console.error(err);
      alert('Failed to update password.');
    }
  );
}

}
