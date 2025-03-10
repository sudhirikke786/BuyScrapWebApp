import { Component } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-superadminheader',
  templateUrl: './superadminheader.component.html',
  styleUrls: ['./superadminheader.component.css']
})
export class SuperadminheaderComponent {
  orgName: any;

  constructor(public commonService: CommonService) {
    this.orgName = localStorage.getItem('orgName');
    
  }
}
