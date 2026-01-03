import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent {
  organizationName: any;
  currentRole:any;

  constructor(private route:ActivatedRoute,private authService: AuthService) { }

  ngOnInit() {
    this.currentRole = this.authService.userCurrentRole();
    this.route.params.subscribe((param)=>{ 
      this.organizationName = param["orgName"];
    });
    

  }

  
  
}
