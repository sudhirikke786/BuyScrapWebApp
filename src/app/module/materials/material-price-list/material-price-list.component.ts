import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
@Component({
  selector: 'app-material-price-list',
  templateUrl: './material-price-list.component.html',
  styleUrls: ['./material-price-list.component.scss']
})
export class MaterialPriceListComponent implements OnInit {
  orgName: any;
  locId: any;
  logInUserId: any;
  locationName: any;
  materialData: any[] = [];
  groupedData: { [key: string]: any[] } = {};
  error: string | null = null;

  constructor(
    private commonService: CommonService,
    private router: Router, 
    private stroarge:StorageService,

  ) {}

  ngOnInit(): void {
    this.fetchMaterialPriceList();
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
   
  }

  fetchMaterialPriceList(): void {
    this.error = null;

    this.commonService.getMaterialPriceList({}).subscribe({
      next: (data) => {
        if (data) {
          this.materialData = data.body.data;

          this.groupedData = this.materialData.reduce((acc, item) => {
            acc[item.groupName] = acc[item.groupName] || [];
            acc[item.groupName].push(item);
            return acc;
          }, {});
        }
      },
      error: (error) => {
        this.error = 'Failed to load material price list. Please try again.';
        console.error('Error fetching material price list:', error);
      }
    });
  }

  getGroupKeys(): string[] {
    return Object.keys(this.groupedData);
  }

  btnBack(): void {
    this.router.navigate(['materials']);
  }
}
