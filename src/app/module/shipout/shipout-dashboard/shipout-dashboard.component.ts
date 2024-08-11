import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ShipOut } from 'src/app/core/model/ship-out.model';

import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { DataService } from 'src/app/core/services/data.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-shipout-dashboard',
  templateUrl: './shipout-dashboard.component.html',
  styleUrls: ['./shipout-dashboard.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ShipoutDashboardComponent implements OnInit {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode:'mdi-plus',
      title:'New Ship Out',
      label:'New Ship Out',
    }
  ];

   newButtonList = [
    {
      iconcode:'mdi-magnify',
      title:'Search',
      label:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh',
      label:'Refresh'
    },
    {
      iconcode:'mdi-account',
      title:'New Customer',
      label:'New Customer',
    }
  ];


  

  shipouts: any;
  sellers: any;

  visible = false;
  newDriverScreenVisible=  false;
  selectedSeller: any;
  orgName: any;
  locId: any;
  logInUserId: any;

  showLoader =  false;

  serachText = '';
  searchSellerInput = '';

  carrier = '';
  truck = '';
  make = '';
  model = '';
  driverName = '';
  trailer1 = '';
  trailer2 = '';
  container = '';
  seal = '';
  booking = '';
  vesselvoyage = '';
  chassis = '';
  reference = '';
  packslip = '';
  note = '';
  showPageLoader: boolean = false;

  pagination: any = {
    SerachText: this.serachText,
    PageNumber: 1,
    RowOfPage: 100,
    LocationId: this.commonService.getProbablyNumberFromLocalStorage('locId'),
    first: 0,
  }
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private stroarge: StorageService,
    private messageService:MessageService,
    private confirmationService: ConfirmationService,
    public dataService: DataService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    
    this.getAllShipOutDetails(this.pagination);
  }

  getAllShipOutDetails(pagination: any = this.pagination) {   
    pagination.SerachText = this.serachText;
    this.showLoader = true;

    this.commonService.getAllShipOutDetails(pagination)
      .subscribe(data => {
        this.showLoader = false;
          console.log('getAllShipOutDetails :: ');
          console.log(data);
          this.shipouts = data.body.data;
        },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.showLoader = false;
        }
      );
  }
  
  getAllsellersDetails() {

    this.showPageLoader = true;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SellerType: 'Business',
      SerachText: this.searchSellerInput.replace(/ /g, "%")
    };
    this.commonService.getAllsellersDetails(paramObject)
      .subscribe(data => {
        this.showPageLoader = false;

          console.log('getAllsellersDetails :: ');
          console.log(data);
          this.sellers = data.body.data;
        },
        (err: any) => {
          this.showPageLoader = false;

          // this.errorMsg = 'Error occured';
        }
      );
  }

  refreshSellerData() {
    this.searchSellerInput = '';
    this.getAllsellersDetails();
  }

  addNewSeller() {
    this.router.navigateByUrl(`${this.orgName}/sellers-buyers/add-seller`)
  }

  showDialog() {    
    this.visible =  true;
    this.getAllsellersDetails();
  }

  showCustomerModel(seller: any){
    // alert(sellerId);
    this.newDriverScreenVisible = true;
    this.selectedSeller = seller;
  }

  saveDriverInfo() {
    this.newDriverScreenVisible = false;
    
    const newShipOut = new ShipOut();     
    newShipOut.rowId = 0;
    newShipOut.createdBy = this.logInUserId;
    newShipOut.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newShipOut.updatedBy = this.logInUserId;
    newShipOut.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newShipOut.customerId = parseFloat(this.selectedSeller.rowId);
    newShipOut.locID = this.locId;
    newShipOut.customerName = this.selectedSeller?.fullName || '';
    newShipOut.streetAddress = this.selectedSeller?.streetAddress || '';
    newShipOut.from = '';
    newShipOut.fromAddress = '';
    newShipOut.carrier = this.carrier;
    newShipOut.truck = this.truck;
    newShipOut.make = this.make;
    newShipOut.model = this.model;
    newShipOut.driverName = this.driverName;
    // newShipOut.trailer1 = this.trailer1;
    // newShipOut.trailer2 = this.trailer2;
    // newShipOut.container = this.container;
    // newShipOut.seal = this.seal;
    // newShipOut.booking = this.booking;
    // newShipOut.vessels = this.vesselvoyage;
    // newShipOut.chasis = this.chassis;
    // newShipOut.packSlip = this.packslip;
    // newShipOut.reference = this.reference;
    newShipOut.note = this.note;
    newShipOut.shipoutmaterial = [];

    this.dataService.setNewShipOut(newShipOut);
    
    this.router.navigateByUrl(`/${this.orgName}/ship-out/detail/new/new`);

  }

  closeDriver(){
    this.newDriverScreenVisible = false;
  }

  showDetails(shipoutId: any) {
    this.router.navigateByUrl(`${this.orgName}/ship-out/detail/${shipoutId}/show`);
  }

  editDetails(shipoutId: any) {
    this.router.navigateByUrl(`${this.orgName}/ship-out/detail/${shipoutId}/edit`);
  }

  deleteDetails(shipoutId: any) {
    alert('Delete action Triggered')
  }



  confirmationMessage(shipoutId:any) {
    const reqOob = {
      RowID:shipoutId,
      Status:true
    }
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure want to delete ' + shipoutId  ,
      accept: () => {
        this.commonService.UpdateShipOutStatus(reqOob).subscribe(() =>{
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ship Out Record Deleted Successfully' });
          this.getAllShipOutDetails(this.pagination);

        },(error) =>{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something Wen\'t wrong' });
        })
      },
      reject: () => {       
        return false;
      },
    });
  }


  getSellerAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getAllsellersDetails();
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

  getShipOutAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getAllShipOutDetails(this.pagination);
        break;
      case 'mdi-refresh':
        this.serachText = '';
        this.getAllShipOutDetails(this.pagination);
        break;
      case 'mdi-plus':
        this.showDialog();
        break;
      default:
        break;
    }
  
  }

}
