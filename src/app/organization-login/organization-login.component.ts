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
    //   const orgName = 'abc';
    //   this.router.navigateByUrl(`${orgName}/user-login`);
  };

  /**
   * Get the data by calling WebAPI to fetch the details for organization login
   */
  validateOrganization() {

    const requestObj = {
      organisationName: this.org.orgName,
      orgKey: 'vvzHznEnIic='
    };
    // const requestObj = {
    //   organisationName: 'ProdTest',
    //   orgKey: 'vvzHznEnIic='
    // };
    // this.http.post<any>('https://localhost:44385/Organisations/ValidateCredentials', requestObj).subscribe(data => {
    //   console.log('data :: ');
    //   console.log(data);
    //   const orgName = 'abc';
    //   this.router.navigateByUrl(`${orgName}/user-login`);
    // });

    this.commonService.validateOrgCredentials(requestObj)
      .subscribe(data => {
          console.log('data :: ');
          console.log(data);
          if (data.body.data.organisationName) {
            const orgName = data.body.data.organisationName;
            if (this.isChecked) {
              localStorage.setItem('orgName',orgName)
            } else {
              localStorage.clear();
            }
            this.router.navigateByUrl(`${orgName}/user-login`);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });

          }
        },
        (err: any) => {
          alert('1111');
          
          this.messageService.add({ severity: 'success', summary: 'Error', detail: 'Message Content' });
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: err });

          
        }
      );
  }

  
}
