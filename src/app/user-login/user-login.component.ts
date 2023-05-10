import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  
  organizationName: any;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((param)=>{ 
      this.organizationName = param["orgName"];
    });
  }
  
  btnClick(): void {
    this.router.navigateByUrl(`/${this.organizationName}/home`);
  };

}
