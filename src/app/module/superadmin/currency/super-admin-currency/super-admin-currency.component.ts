import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-super-admin-currency',
  templateUrl: './super-admin-currency.component.html',
  styleUrls: ['./super-admin-currency.component.css']
})
export class SuperAdminCurrencyComponent {
  country: any = {};
  sysPrefModalVisible = false; 
  locationPageHeader = "System Preferences";
  locationButtonContent = "Save";

  searchText : string ='';
  selectedSysPrefEntity = {
    currency: '',
    currencyCode: '',
    rowID:0
  };

  errorMsgVisibility = false;
  errorMsg = '';

  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private fb:FormBuilder,
    private messageService: MessageService,
    private stroarge:StorageService,) { }
    
  ngOnInit() {
    this.getAllCurrency();
  }

  getAllCurrency(searchText:string='',currencyID:number = 0) {
    const paramObj = {
      CurrencyID: currencyID,
      SearchText: searchText
    };
    this.commonService.getAllCurrency(paramObj).subscribe(
      (data) => {
        this.country = data.body.data; 
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  deleteCurrency(country: any) {
    const paramObj = { 
      RowID: country.rowID 
    };

    this.commonService.DeleteCurrencyId(paramObj).subscribe(
      (response: any) => {
        this.getAllCurrency();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Currency deleted successfully.'
        });
      },
      (error: any) => {
        console.error("Error deleting currency:", error);
      }
    );
    
  }

  onDialogHide() {
    this.resetForm();
  }
  private resetForm() {
    this.selectedSysPrefEntity = { currency: '', currencyCode: '' ,rowID:0};
    this.errorMsgVisibility = false;
    this.errorMsg = '';
  }
  openDialog() {
    this.sysPrefModalVisible = true;
  }

  editSysPref(country: any) {
    this.selectedSysPrefEntity = { ...country }; 
    this.sysPrefModalVisible = true;
  }
  showState(country:any){
    console.log("Checking values country",country)
    this.router.navigate(['/superadmin/country/superadmin-state'],{queryParams:{ countryID: country.rowID}});
  }
  refreshCountryList() {
    this.searchText = ''; 
    this.getAllCurrency(); 
  }

  
  saveCountry() {
  
  if (!this.selectedSysPrefEntity.currency || !this.selectedSysPrefEntity.currencyCode) {
    this.errorMsg = 'Both Currency and CurrencyCode are required!';
    this.errorMsgVisibility = true;
    return;
  }
  console.log('checking rowid',this.selectedSysPrefEntity.rowID )
  const requestObj = {
    RowID: this.selectedSysPrefEntity.rowID || 0, 
    Currency: this.selectedSysPrefEntity.currency,
    CurrencyCode: this.selectedSysPrefEntity.currencyCode,
    
  };

  this.commonService.InsertUpdateCurrency(requestObj).subscribe({
    next: (response) => {
      if (response.body) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Saved successfully'
        });
        //this.getSystemPreferences();
        this.refreshCountryList();
        this.sysPrefModalVisible = false;
        this.resetForm();
      }
    },
    error: (error) => {
      this.errorMsg = error.error?.message || 'Error saving Country';
      this.errorMsgVisibility = true;
    }
  });
}
  closeDialog() {
    this.sysPrefModalVisible = false;
  }
 
  back(){
    this.router.navigateByUrl(`/superadmin/home`);
  }
}

