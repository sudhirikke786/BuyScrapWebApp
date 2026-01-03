import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-super-admin-state',
  templateUrl: './super-admin-state.component.html',
  styleUrls: ['./super-admin-state.component.css']
})
export class SuperAdminStateComponent implements OnInit{

  searchText : string ='';
  sysPrefModalVisible = false;
  selectedSysPrefEntity = {
    name: '',
    prefix: '',
    rowID:0,
    countryID:0
  };
  countryID: number = 0;
  states: any[] = [];
  errorMsgVisibility = false;
  errorMsg = '';
  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private fb:FormBuilder,
    private messageService: MessageService,
    private stroarge:StorageService,) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.countryID = +params['countryID'] || 0;
      if (this.countryID > 0) {
        this.getStatesByCountryID();
      }
    });
    this.getAllStates();
    console.log("Checking CountryID",this.countryID)
  }

  onDialogHide() {
    this.resetForm();
  }
  private resetForm() {
    this.selectedSysPrefEntity = { name: '', prefix: '' ,rowID:0,countryID:0};
   
  }
  openDialog() {
    this.sysPrefModalVisible = true;
  }
  editSysPref(states: any) {
    this.selectedSysPrefEntity = { ...states }; 
    this.sysPrefModalVisible = true;
  }
  getStatesByCountryID(): void {
    const requestObj = {
      CountryID: this.countryID,
    };

    this.commonService.getAllStateByCountryID(requestObj).subscribe(
      (data:any) => {
        this.states = data.body.data;
      },
      (error) => {
       
      }
    );
  }
  
  getAllStates(searchText:string='',countryID:number = 0,stateID:number = 0){
    const paramObj = {
      CountryID: countryID,
      stateID: stateID,
      SearchText: searchText
    };

    this.commonService.getAllState(paramObj).subscribe(
      (data:any) => {
        this.states = data.body.data;
      },
      (error) => {
       
      }
    );
  }

  saveState() {
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
      CountryID: this.countryID
      
    };
  
    this.commonService.InsertUpdateState(requestObj).subscribe({
      next: (response) => {
        if (response.body) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Saved successfully'
          });
          //this.getSystemPreferences();
          this.refreshStateList();
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
  refreshStateList(){
    this.searchText = ''; 
    this.getAllStates(); 
  }
  closeDialog() {
    this.sysPrefModalVisible = false;
  }
  showCity(states:any){
    console.log("Checking values state",this.states)
    this.router.navigate(['/superadmin/country/superadmin-city'],{queryParams:{ stateID: states.rowID}});
  }
 
  back(){
    this.router.navigateByUrl(`/superadmin/country`);
  }
}

