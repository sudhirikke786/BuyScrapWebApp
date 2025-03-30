import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
@Component({
  selector: 'app-syspref',
  templateUrl: './syspref.component.html',
  styleUrls: ['./syspref.component.css'],
  providers: [MessageService]
})
export class SysprefComponent implements OnInit{
  systemPreferences: any = {};
  sysPrefModalVisible = false; // Control modal visibility
  locationPageHeader = "System Preferences";
  locationButtonContent = "Save";

  selectedSysPrefEntity = {
    keys: '',
    values: '',
    rowId:0
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
    this.getSystemPreferences();
  }

  getSystemPreferences() {
    const paramObj = {

    };
    this.commonService.GetSystemPreferencesValue(paramObj).subscribe(
      (data) => {
        this.systemPreferences = data.body.data; 
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
    this.selectedSysPrefEntity = { keys: '', values: '' ,rowId:0};
    this.errorMsgVisibility = false;
    this.errorMsg = '';
  }
  openDialog() {
    this.sysPrefModalVisible = true;
  }

  editSysPref(systemPreference: any) {
    this.selectedSysPrefEntity = { ...systemPreference }; 
    this.sysPrefModalVisible = true;
  }
  

  // In your component
saveSysPref() {
  // Validation
  if (!this.selectedSysPrefEntity.keys || !this.selectedSysPrefEntity.values) {
    this.errorMsg = 'Both Key and Value are required!';
    this.errorMsgVisibility = true;
    return;
  }
  console.log('checking rowid',this.selectedSysPrefEntity.rowId )
  const requestObj = {
    RowId: this.selectedSysPrefEntity.rowId || 0, 
    Keys: this.selectedSysPrefEntity.keys,
    Values: this.selectedSysPrefEntity.values,
    CreatedBy: 1,
    UpdatedBy: 1,
    CreatedDate: new Date().toISOString(),
    UpdatedDate: new Date().toISOString()
  };

  this.commonService.InsertUpdateSystemPreferences(requestObj).subscribe({
    next: (response) => {
      if (response.body) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Saved successfully'
        });
        this.getSystemPreferences();
        this.sysPrefModalVisible = false;
        this.resetForm();
      }
    },
    error: (error) => {
      this.errorMsg = error.error?.message || 'Error saving system preference';
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
