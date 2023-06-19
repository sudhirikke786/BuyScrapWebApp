import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CommonService } from '../core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { Organization } from '../core/interfaces/common-interfaces';

@Component({
  selector: 'app-organization-login',
  templateUrl: './organization-login.component.html',
  styleUrls: ['./organization-login.component.scss']
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
    alert(JSON.stringify(this.org) + " :: " + this.isChecked);
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
          if (data.body.organisationName) {
            const orgName = data.body.organisationName;
            if (this.isChecked) {
              localStorage.setItem('orgName',orgName)
            } else {
              localStorage.clear();
            }
            this.router.navigateByUrl(`${orgName}/user-login`);
          } else {
            alert('Invalid organisation');
          }
        },
        (err: any) => {
          this.errorMsg = 'Error occured';
        }
      );
  }

  
}
