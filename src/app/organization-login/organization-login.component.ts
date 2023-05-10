import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-login',
  templateUrl: './organization-login.component.html',
  styleUrls: ['./organization-login.component.scss']
})
export class OrganizationLoginComponent {

  constructor(private router: Router) { }
  
  btnClick(): void {
    
    const orgName = 'abc';
    this.router.navigateByUrl(`${orgName}/user-login`);
  };
}
