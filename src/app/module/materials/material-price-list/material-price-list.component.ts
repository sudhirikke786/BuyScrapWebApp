import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { HelperService } from 'src/app/core/services/helper.service';

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
  isLoading = false;
  fileDataObj: any;
  showDownload = false;
  showLoaderReport = false;
  isReportShow = false;
  checkTabView: boolean = false;
  isBlankPriceChecked: boolean = false; 
 

  constructor(
    private commonService: CommonService,
    private router: Router, 
    private stroarge:StorageService,
    public helperService:HelperService,

  ) {}

  ngOnInit(): void {
    this.fetchMaterialPriceList();
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
   
  }

  fetchMaterialPriceList(): void {
    this.isLoading = true;
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
        this.isLoading = false; 
        this.error = 'Failed to load material price list. Please try again.';
        console.error('Error fetching material price list:', error);
      },
      complete: () => {
        this.isLoading = false; 
      },
    });
  }

  openReportPopup() {
    this.isReportShow =true;
    this.showLoaderReport = true;

    const param = {
   
      LocationId: this.locId,
      BlankPrice: this.isBlankPriceChecked
    }

    this.commonService.getMaterialPricelistReport(param)
      .subscribe(data => {
        console.log('getMaterialPricelistReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;

        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Material Price List " );
        }
      },
        (err: any) => {
          this.showLoaderReport = false;
        }
      );
  }


  

  
  getGroupKeys(): string[] {
    return Object.keys(this.groupedData);
  }

  btnBack(): void {
    this.router.navigate(['materials']);
  }
}
