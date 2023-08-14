import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/core/interfaces/common-interfaces';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-shipout-details',
  templateUrl: './shipout-details.component.html',
  styleUrls: ['./shipout-details.component.scss']
})
export class ShipoutDetailsComponent implements OnInit {

  
  orgName: any;
  locId:any;
  shipoutId: any;
  shipout: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.route.params.subscribe((param)=>{
      this.shipoutId = param["shipoutId"];
      this.getShipOutDetailsByID();
    });
  }
  
  getShipOutDetailsByID() {
    const paramObject = {
      RowID: this.shipoutId,
      LocID: this.locId
    };
    this.commonService.getShipOutDetailsByID(paramObject)
      .subscribe(data => {
          console.log('getShipOutDetailsByID :: ');
          console.log(data);
          this.shipout = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

}
