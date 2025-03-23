import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CommonService } from '../core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { Organization } from '../core/interfaces/common-interfaces';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-organization-login',
  templateUrl: './organization-login.component.html',
  styleUrls: ['./organization-login.component.scss'],
  providers: [MessageService]
})
export class OrganizationLoginComponent implements OnInit {

  errorMsg: any;
  org: Organization = {
    orgName: '',
    password: ''
  };
  isChecked = true;
  inputType: string  = 'password';

  constructor(private router: Router, 
              private http: HttpClient,
              private messageService: MessageService,
              private commonService: CommonService) { }

  ngOnInit() {
    const orgName = localStorage.getItem('orgName');
    if (orgName && orgName != '') {
      this.router.navigateByUrl(`${orgName}/user-login`);
    }
  }

  btnClick(): void {
    this.validateOrganization();
  };

  /**
   * Get the data by calling WebAPI to fetch the details for organization login
   */
  // validateOrganization() {

  //   const requestObj = {
  //     organisationName: this.org.orgName,
  //     orgKey: this.org.password
  //   };
 
  //   this.commonService.validateOrgCredentials(requestObj)
  //     .subscribe(data => {
  //         console.log('data :: ');
  //         console.log(data);

         
  //         if (data.body.data.organisationName) {
  //           const orgName = data.body.data.organisationName;
  //           const orgId = data.body.data.rowId;
  //           if (this.isChecked) {
  //             localStorage.setItem('orgName',orgName);
  //             localStorage.setItem('orgId',orgId);
  //           } else {
  //             localStorage.clear();
  //           }
  //           if(this.org.orgName == 'buyscrapadmin'){
  //             this.router.navigateByUrl(`/superadmin/home`);
  //           } else {
  //             this.router.navigateByUrl(`${orgName}/user-login`);
  //           }
  //         } else {
  //           if(this.org.orgName == 'buyscrapadmin'){
  //             localStorage.setItem('orgName','Buyscrapadmin');
  //             this.router.navigateByUrl(`/superadmin/home`);
  //           }
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials or No user found.' });

  //         }
  //       },
  //       (err: any) => {
          
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials.' });
  //         // this.messageService.add({ severity: 'error', summary: 'Error', detail: err });

          
  //       }
  //     );
  // }


  validateOrganization() {
    const requestObj = {
      organisationName: this.org.orgName,
      orgKey: this.org.password
    };
  
    if (this.org.orgName.toLowerCase() === 'sal') {
      
      this.commonService.GetSuperAdminAuthenticate({ 
        UserName: this.org.orgName, 
        Password: this.org.password 
      }).subscribe(response => {
          console.log('SuperAdmin Response:', response);
  
          
          const responseBody = response?.body; 
  
          if (responseBody && responseBody.token) { 
            
            localStorage.setItem('authToken', responseBody.token);
            localStorage.setItem('orgName', 'Buyscrapadmin');
            localStorage.setItem('userName', responseBody.userdto?.userName || 'SuperAdmin');
  
            this.router.navigateByUrl(`/superadmin/home`);
          } else {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Invalid SuperAdmin credentials.' 
            });
          }
        },
        (err: any) => {
          console.error('SuperAdmin Login Error:', err);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Invalid SuperAdmin credentials.' 
          });
        }
      );
  
    } else {
      
      this.commonService.validateOrgCredentials(requestObj)
        .subscribe(data => {
            console.log('Organization Login Response:', data);
  
            if (data?.body?.data?.organisationName) {
              const orgName = data.body.data.organisationName;
              const orgId = data.body.data.rowId;
              if (this.isChecked) {
                localStorage.setItem('orgName', orgName);
                localStorage.setItem('orgId', orgId);
              } else {
                localStorage.clear();
              }
              this.router.navigateByUrl(`${orgName}/user-login`);
            } else {
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Invalid credentials or No user found.' 
              });
            }
          },
          (err: any) => {
            console.error('Org Login Error:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Invalid credentials.' 
            });
          }
        );
    }
  }
  
  
  changeInput() {
    this.inputType = this.inputType == 'password' ? 'text' : 'password';
  }

  
}
