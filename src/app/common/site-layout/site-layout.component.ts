import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent {
  organizationName: any;

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((param)=>{ 
      this.organizationName = param["orgName"];
    });
  }
}
