import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/core/services/helper.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-credential-management',
  templateUrl: './credential-management.component.html',
  styleUrls: ['./credential-management.component.css']
})
export class CredentialManagementComponent implements OnInit{
  reportData: any = {};
  orgName: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private helperService: HelperService,
    private commonService: CommonService) { }

  ngOnInit(){
    this.orgName = localStorage.getItem('orgName');
      const UserData = localStorage.getItem('userData'); 
    if (UserData) {
      this.reportData = JSON.parse(UserData);
    }
  console.log('UserData:', this.reportData);
  }

  saveUserData() {
    this.commonService.InsertUpdateSuperAdminDTO(this.reportData).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        alert('User data updated successfully!');
        localStorage.setItem('userData', JSON.stringify(this.reportData)); 
      },
      (error) => {
        console.error('API Error:', error);
        alert('Error updating user data!');
      }
    );
  }
  
}
