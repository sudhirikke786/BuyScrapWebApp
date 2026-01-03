import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
@Component({
  selector: 'app-super-admin-country',
  templateUrl: './super-admin-country.component.html',
  styleUrls: ['./super-admin-country.component.css'],
  providers: [MessageService]
})
export class SuperAdminCountryComponent implements OnInit{
  country: any = {};
  sysPrefModalVisible = false; // Control modal visibility
  locationPageHeader = "System Preferences";
  locationButtonContent = "Save";

  searchText : string ='';
  selectedSysPrefEntity = {
    name: '',
    prefix: '',
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
    this.getAllCountry();
  }

  getAllCountry(searchText:string='',countryID:number = 0) {
    const paramObj = {
      CountryID: countryID,
      SearchText: searchText
    };
    this.commonService.GetAllCountry(paramObj).subscribe(
      (data) => {
        this.country = data.body.data; 
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }
  onDialogHide() {
    this.resetForm();
  }
  private resetForm() {
    this.selectedSysPrefEntity = { name: '', prefix: '' ,rowID:0};
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
    this.getAllCountry(); 
  }

  // In your component
  saveCountry() {
  // Validation
  console.log('Checkinf COuntyrrrr',this.selectedSysPrefEntity)
  if (!this.selectedSysPrefEntity.name || !this.selectedSysPrefEntity.prefix) {
    this.errorMsg = 'Both Name and Preifix are required!';
    this.errorMsgVisibility = true;
    return;
  }
  console.log('checking rowid',this.selectedSysPrefEntity.rowID )
  const requestObj = {
    RowID: this.selectedSysPrefEntity.rowID || 0, 
    Name: this.selectedSysPrefEntity.name,
    Prefix: this.selectedSysPrefEntity.prefix,
    
  };

  this.commonService.InsertUpdateCountry(requestObj).subscribe({
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

