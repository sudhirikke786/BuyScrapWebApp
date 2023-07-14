import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-add-sellers',
  templateUrl: './add-sellers.component.html',
  styleUrls: ['./add-sellers.component.scss']
})
export class AddSellersComponent implements OnInit {

  orgName: any;
  locId: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
  }
  
}
