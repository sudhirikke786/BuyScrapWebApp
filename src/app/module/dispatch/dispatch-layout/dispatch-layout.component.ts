import { Component } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';
import { filter } from 'rxjs/operators';






@Component({
  selector: 'app-dispatch-layout',
  templateUrl: './dispatch-layout.component.html',
  styleUrls: ['./dispatch-layout.component.scss']
})
export class DispatchLayoutComponent {
  orgName!: string | null;
  currentRole: any;
  locId!: string | number | null;
  logInUserId: any;
  isLoading = false;
  showLoader = false;
  sellerForm!: FormGroup;
  sellerType: string = 'Personal';
  dialogPopupVisible: boolean = false;
  newTicketVisible: boolean = false;
  ticketvisible: boolean = false;
  sellerLoader: boolean = false;
  sellers: any;
  searchSellerInput: any = '';
  addSellerPopupVisible = false;

  isDispatchMode = false;

  IsCustomerFacePictureEnabled: boolean = false;
  IsMultiCurrencySupportEnabled: boolean = false;


  searchText: string = '';
  fromDate: string = '';
  toDate: string = '';

  selectedCurrencyID: any = null;
  currencies: any[] = [];

  dispatchRes = [

  ];



  actionList = [
    { iconcode: 'mdi-magnify', title: 'Search' },
    { iconcode: 'mdi-refresh', title: 'Refresh' },
    // { iconcode: 'mdi-calendar', title: 'Calendar View', label: 'Calendar View' },
    { iconcode: 'mdi-plus', title: 'Sellers', label: 'New Dispatch' },
    // { iconcode: 'mdi-add', title: 'Dispatch', label: 'Driver Assign' },
    // { iconcode: 'mdi-map', title: 'Dispatch', label: 'Map' }
  ];

  newTicketList = [{
    iconcode: 'mdi-magnify',
    title: 'Search',
    label: 'Search'
  },
  {
    iconcode: 'mdi-refresh',
    title: 'Refresh',
    label: 'Refresh'
  },
  {
    iconcode: 'mdi-account',
    title: 'New Customer',
    label: 'New Customer'
  }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private stroarge: StorageService,
  ) { }

  ngOnInit() {
    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      const isCustomerFacePicture = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'iscustomerfacepicture');
      this.IsCustomerFacePictureEnabled = String(isCustomerFacePicture?.values).toLowerCase() === 'true';

      const isMultiCurrencySupport = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'ismulticurrencysupport');
      this.IsMultiCurrencySupportEnabled = String(isMultiCurrencySupport?.values).toLowerCase() === 'true';
    }
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    // this.route.params.subscribe((params)=>{
    //   this.sellerID = params["sellerID"];
    //   this.rowID = params["rowID"];
    // });
    this.route.queryParams.subscribe(params => {
      if (params['fromDate'] && params['toDate']) {
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
      } else {
        this.setDefaultDates();
      }
    });
    const userObj = this.stroarge.getLocalStorage('userObj');
    this.currentRole = userObj?.userdto?.role;
    if (this.currentRole === 'Driver' || this.currentRole === 'Scale') {
      this.actionList = this.actionList.filter(action => action.label !== 'New Dispatch' && action.label !== 'Driver Assign' && action.label !== 'Map');
      this.isDispatchMode = true;
    }
    this.navigateToInitialView();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.navigateToInitialView();
      });
    this.getAllCODTickets();
  }

  private setDefaultDates() {
    this.fromDate = this.getDefaultFromDate();
    this.toDate = this.getDefaultToDate();
  }

  private getDefaultFromDate(): string {
    const today = new Date();
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(today.getDate() - 15);
    return this.formatDateForInput(fifteenDaysAgo);
  }

  private getDefaultToDate(): string {
    const today = new Date();
    return this.formatDateForInput(today);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  navigateToInitialView() {
    const currentUrl = this.router.url;
    this.isDispatchMode = currentUrl.includes('dispatch') && !currentUrl.includes('meeting') && !currentUrl.includes('/dispatch-detail');
  }

  onToggleChange() {
    if (this.isDispatchMode) {
      this.router.navigate([`/${this.orgName}/dispatch`]);
    } else {
      this.router.navigate([`/${this.orgName}/dispatch/meeting`]);
    }
  }

  performSearch() {
    let currentParams: any = {};
    this.route.queryParams.subscribe(params => {
      Object.keys(params).forEach(key => {
        currentParams[key] = params[key];
      });
    }).unsubscribe();

    if (this.searchText) {
      currentParams['search'] = this.searchText;
    } else {
      delete currentParams['search'];
    }

    if (this.fromDate && this.toDate) {
      if (new Date(this.fromDate) > new Date(this.toDate)) {
        alert('From Date cannot be greater than To Date');
        return;
      }
      currentParams['fromDate'] = this.fromDate;
      currentParams['toDate'] = this.toDate;
    }

    this.router.navigate([], {
      queryParams: currentParams
    });
  }


  getAllCODTickets() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SerachText: ''
    };
    this.isLoading = true;

    this.commonService.GetAllPickUpDetails(paramObject).subscribe(

      (data: any) => {
        //console.log('API Response:', data); 
        console.log('getAllCODTickets :: ', data);
        if (data && data.body && data.body.data) {
          if (this.currentRole === 'Driver' && this.logInUserId) {
            this.dispatchRes = data.body.data.filter((item: any) => item.driverID === this.logInUserId).map((item: any) => {
              return {
                rowId: item.rowID,
                pickUpDate: item.pickUpDate,
                closedDate: item.closedDate,
                customerName: item.customerName,
                sellerName: item.sellerName,
                sellerID: item.sellerID,
                ticketRowID: item.ticketRowID,
                charges: item.charges,
                isCompleted: item.isCompleted,
                selected: item.closedDate ? true : false,
                ticketId: item.ticketRowID > 0 ? item.ticketRowID : 0,
                sellerAddress: item.streetAddress,
                driverID: item.driverID,
                driverNotes: item.driverNotes
              };
            });
          } else {
            this.dispatchRes = data.body.data.map((item: any) => {
              //console.log('Mapped item:', item.ticketRowID);
              return {
                rowId: item.rowID,
                pickUpDate: item.pickUpDate,
                closedDate: item.closedDate,
                customerName: item.customerName,
                sellerName: item.sellerName,
                sellerID: item.sellerID,
                ticketRowID: item.ticketRowID,
                charges: item.charges,
                isCompleted: item.isCompleted,
                selected: item.closedDate ? true : false,
                ticketId: item.ticketRowID > 0 ? item.ticketRowID : 0,
                sellerAddress: item.streetAddress,
                driverID: item.driverID,
                driverNotes: item.driverNotes
              };
            });
          }
        } else {
          console.error('No data found or incorrect response structure.');
        }
      },
      (err: any) => {
        this.isLoading = false;
        this.showLoader = false;
        console.error('Error fetching COD tickets:', err);
      },
      () => {
        this.isLoading = false;
        this.showLoader = false;
      }
    );
    this.sellerForm = this.fb.group({
      firstName: ['', Validators.required],
      sellerType: [this.sellerType],
      middleName: [''],
      lastName: [''],
      streetAddress: [],
      idnumber: [''],
      cellNumber: [''],
      contactName: ['']

    });
  }

  gotoDriverPage() {
    this.router.navigateByUrl(`/${this.orgName}/dispatch/dispatch-status`)
  }
  openAddUpdateEvent() {
    //alert('Add / Update Event is in Progress');
    this.dialogPopupVisible = true;
    this.newTicketVisible = true;
    this.ticketvisible = false;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
    this.getAllCurrencies();

  }


  showDialog() {
    this.router.navigateByUrl(`/${this.orgName}/dispatch/meeting`)
  }

  getAllsellersDetails(paramObject: any) {
    this.sellerLoader = true;
    this.commonService.getAllsellersDetails(paramObject)
      .subscribe(data => {
        console.log('getAllsellersDetails :: ');
        console.log(data);
        this.sellers = data.body.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.sellerLoader = false;
        },
        () => {
          this.sellerLoader = false;
        }
      );
  }
  getSellerAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchSeller();
        break;
      case 'mdi-refresh':
        this.refreshSellerData();
        break;
      case 'mdi-account':
        this.addNewSeller();
        break;
      default:
        break;
    }

  }
  searchSeller() {
    if (!this.searchSellerInput.trim()) {
      console.warn('Search input is empty, skipping API call');
      return;
    }

    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%")
    };
    this.getAllsellersDetails(paramObject);
  }

  refreshSellerData() {
    this.searchSellerInput = '';
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
  }

  addNewSeller() {
    // this.router.navigateByUrl(${this.orgName}/sellers-buyers/add-seller);
    this.addSellerPopupVisible = true;
  }

  onSubmit() {
    const reqObj = {
      ...this.sellerForm.value,
      ...{
        rowId: 0,
        locID: this.locId,
        createdBy: this.logInUserId,
        createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
      }
    }
    console.log(reqObj);
    this.commonService.addSeller(reqObj).subscribe(data => {
      console.log(data);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller updated Successfully' });
      const sellerFullname = reqObj.firstName + (reqObj.middleName != '' ? ' ' + reqObj.middleName : '')
        + (reqObj.lastName != '' ? ' ' + reqObj.lastName : '');

      this.addSellerPopupVisible = false;
      this.sellerForm.patchValue({
        firstName: '',
        middleName: '',
        lastName: '',
        streetAddress: '',
        idnumber: '',
        cellNumber: '',
        contactName: ''
      });
      this.clickOnSeller(data.body.insertedRow, sellerFullname, this.sellerType);
    }, (error: any) => {
      console.log(error);
    })

  }

  onKeydown(event: KeyboardEvent, searchValue: string): void {
    if (event.key === 'Enter') {
      this.searchSeller()
      // Add your search logic here
    }

    // Optionally handle other keys
    // if (event.key === 'ArrowDown') {
    //   console.log('ArrowDown key pressed');
    // }
  }

  clickOnSeller(sellerId: string | number, sellerName: string, sellerAddress: string) {
    const selectedCurrencyObj = this.currencies.find(c => c.rowID === this.selectedCurrencyID);
    const currencyCode = selectedCurrencyObj?.currencyCode ?? '';
    const currencySymbol = selectedCurrencyObj?.currency ?? '';
    // this.router.navigate([`/${this.orgName}/dispatch/dispatch-detail`,'New',sellerId,'new'], {
    //     queryParams: { currencyCode:currencyCode,currencySymbol:currencySymbol },
    //   });
    if (this.IsMultiCurrencySupportEnabled) {
      this.router.navigate([`/${this.orgName}/dispatch/dispatch-detail`, 'New', sellerId, 'new'], {
        queryParams: { currencyCode: currencyCode, currencySymbol: currencySymbol },
      });
    } else {
      this.router.navigate([`/${this.orgName}/dispatch/dispatch-detail`, 'New', sellerId, 'new'],
        { queryParams: { currencyCode: '', currencySymbol: '' } }
      );
    }

  }

  changeSellerType() {
    if (this.sellerType == 'Personal') {
      this.sellerType = 'Business';
    } else {
      this.sellerType = 'Personal';
    }
  }

  getAllCurrencies() {
    const paramObj = {
      CurrencyID: 0
    };
    this.commonService.getAllCurrency(paramObj).subscribe({
      next: (res: any) => {
        this.currencies = res?.body?.data || [];

        this.getDefaultCurrencyForTicket();
      },
      error: () => {
        this.currencies = [];
      }
    });
  }

  getDefaultCurrencyForTicket() {
    const params = {
      ModuleName: 'Dispatch',
      LocID: this.locId
    };

    this.commonService.GetCurrencyByModule(params).subscribe({
      next: (res: any) => {
        const currencyData = res?.body?.data;
        if (currencyData && currencyData.currencyID) {
          this.selectedCurrencyID = currencyData.currencyID;
        } else {
          this.selectCurrencyFromLocalStorage();
        }
      },
      error: () => {
        this.selectCurrencyFromLocalStorage();
      }
    });
  }

  private selectCurrencyFromLocalStorage() {
    const localCurrencyCode = localStorage.getItem('currencyCode') || 'USD';
    const currency = this.currencies.find(c => c.currencyCode === localCurrencyCode);
    if (currency) {
      this.selectedCurrencyID = currency.rowID;
    }
  }
  openMapView() {
    this.router.navigate([`/${this.orgName}/dispatch/map`]);
  }



  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        console.log('Search action triggered');
        this.performSearch();
        break;
      case 'mdi-refresh':
        this.searchText = '';
        this.router.navigate([], {
          queryParams: { search: null }
        });
        break;
      case 'mdi-calendar':
        // this.showDialog();
        break;
      case 'mdi-plus':
        this.openAddUpdateEvent();
        break;
      case 'mdi-add':
        this.gotoDriverPage();
        break;
      case 'mdi-map':
        this.openMapView();
        break;
      default:
        console.warn('Unknown action triggered');
        break;
    }
  }




}
