import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-currency-setting',
  templateUrl: './currency-setting.component.html',
  styleUrls: ['./currency-setting.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CurrencySettingComponent implements OnInit {

  selectedCurrency: any = null;
  selectedModule: any = null;
  currencyMappingList: any[] = [];
  currencies: any[] = [];
  modules: any[] = [];

  orgName: any;
  locId: any;
  logInUserId: any;


  editIndex: number = -1;
  editingEntry: any = null;
  selectedCurrencyIndex: number = -1;


  constructor(private route: ActivatedRoute,
      private router: Router,
      private fb:FormBuilder,
      private messageService: MessageService,
      private stroarge:StorageService,
      public commonService: CommonService,
      private datePipe: DatePipe,
      private confirmationService: ConfirmationService
      ) { }

  ngOnInit() {
     this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.getAllCurrencies();
    this.getAllModules();
    this.getAllCurrencyModule();
  }
  addUpdateCurrency() {
    if (!this.selectedCurrency || !this.selectedModule) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please select both Currency and Module' });
      return;
    }

    const currencyObj = this.currencies.find(c => c.rowID === this.selectedCurrency);
    const moduleObj = this.modules.find(m => m.rowID === this.selectedModule);

    const requestObj = {
     rowID: this.editingEntry?.rowID ?? 0,
      currencyID: currencyObj.rowID,
      moduleID: moduleObj.rowID,
      selectedCurrency: currencyObj.currencyCode,
      currencySymbol: currencyObj.currency,
      selectedModule: moduleObj.moduleName,
      locID: this.locId, 
      createdBy: this.logInUserId, 
      createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      updatedBy: this.logInUserId,
      updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
    };

    this.commonService.InsertUpdateCurrencyModule(requestObj).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved successfully' });
        this.getAllCurrencyModule();
        this.resetForm(); 
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Save failed' });
      }
    });
  }


  editCurrency(entry: any) {
    this.editingEntry = entry;

    this.selectedCurrency = entry.currencyID;
    this.selectedModule = entry.moduleID;
  }

  resetForm() {
    this.editingEntry = null;
    this.selectedCurrency = null;
    this.selectedModule = null;
  }

  deleteCurrency(entry: any, index: number){
    this.selectedCurrency = entry;
    this.selectedCurrencyIndex = index;

    this.confirmationService.confirm({
      key: 'deleteCurrencyDialog',
      message: `Are you sure you want to delete the currency "${entry.selectedCurrency}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => this.confirmDeleteCurrency(),
      reject: () => {
      }
    });
  }

  confirmDeleteCurrency(){
    const requestObj = {
      RowID: this.selectedCurrency.rowID
    };

    this.commonService.DeleteCurrencyModuleById(requestObj).subscribe({
      next: (res: any) => {
        this.currencyMappingList.splice(this.selectedCurrencyIndex, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Currency deleted successfully'
        });
        this.getAllCurrencyModule();

        if (this.editIndex === this.selectedCurrencyIndex) {
          this.resetForm();
        }

        this.selectedCurrency = null;
        this.selectedCurrencyIndex = -1;
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete currency'
        });
      }
    });
  }
  getAllCurrencies() {
    const params = { 
      CurrencyID: 0 
    }; 
    this.commonService.getAllCurrency(params).subscribe({
      next: (response: any) => {
        this.currencies = response?.body?.data 
        console.log('Currencies loaded:', this.currencies);
      },
      error: (error) => {
        console.error('Error loading currencies:', error);
      }
    });
  }

  getAllModules() {
    this.commonService.GetAllModule({}).subscribe({
      next: (response: any) => {
        if (response?.body?.data) {
          this.modules = response.body.data;
          console.log('Modules loaded:', this.modules);
        }
      },
      error: (error) => {
        console.error('Error loading modules:', error);
      }
    });
  }

  getAllCurrencyModule() {
    const requestObj = {
      locId: this.locId
    };
   this.commonService.GetAllCurrencyModule(requestObj).subscribe({ 
      next: (response: any) => {
        if (response?.body?.data) {
          this.currencyMappingList = response.body.data;
          console.log('Currency module mappings loaded:', this.currencyMappingList);
        } else {
          this.currencyMappingList = [];
        }
      },
      error: (error) => {
        console.error('Error loading currency module mappings:', error);
        this.currencyMappingList = [];
      }
    });
  }
}
