import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Inout } from 'src/app/core/model/inout.model';

import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { DataService } from 'src/app/core/services/data.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-inout-dashboard',
  templateUrl: './inout-dashboard.component.html',
  styleUrls: ['./inout-dashboard.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class InoutDashboardComponent implements OnInit {

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
      title:'New In-Out',
      label:'New In-Out',
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
    }
  ];


  

  inouts: any;
  locations: any;

  visible = false;
  newDriverScreenVisible=  false;
  selectedLocation: any;
  orgName: any;
  locId: any;
  logInUserId: any;

  showLoader =  false;

  serachText = '';
  searchLocationInput = '';

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
    
    this.getAllInoutDetails(this.pagination);
  }

  getAllInoutDetails(pagination: any = this.pagination) {   
    pagination.SerachText = this.serachText;
    this.showLoader = true;

    this.commonService.getAllInoutDetails(pagination)
      .subscribe(data => {
        this.showLoader = false;
          console.log('getAllInoutDetails :: ');
          console.log(data);
          this.inouts = data.body.data;
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
  
  getAllLocatoins() {

    this.showPageLoader = true;
    const paramObject = {
      SerachText: this.searchLocationInput.replace(/ /g, "%")
    };
    this.commonService.GetAllLocatoins(paramObject)
      .subscribe(data => {
        this.showPageLoader = false;

          console.log('getAllLocatoins :: ');
          console.log(data);
          this.locations = data.body.data;
        },
        (err: any) => {
          this.showPageLoader = false;

          // this.errorMsg = 'Error occured';
        }
      );
  }

  refreshLocationData() {
    this.searchLocationInput = '';
    this.getAllLocatoins();
  }

  showDialog() {    
    this.visible =  true;
    this.getAllLocatoins();
  }

  showCustomerModel(location: any){
    // alert(locationId);
    this.newDriverScreenVisible = true;
    this.selectedLocation = location;
  }

  saveDriverInfo() {
    this.newDriverScreenVisible = false;
    
    const newInout = new Inout();     
    newInout.rowId = 0;
    newInout.createdBy = this.logInUserId;
    newInout.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newInout.updatedBy = this.logInUserId;
    newInout.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    newInout.locID = this.locId;
    newInout.locIn = this.selectedLocation?.rowId;
    newInout.locOut = this.locId;
    newInout.locationName = this.selectedLocation?.locationName;
    newInout.carrier = this.carrier;
    newInout.truck = this.truck;
    newInout.make = this.make;
    newInout.model = this.model;
    newInout.driverName = this.driverName;
    // newInout.trailer1 = this.trailer1;
    // newInout.trailer2 = this.trailer2;
    // newInout.container = this.container;
    // newInout.seal = this.seal;
    // newInout.booking = this.booking;
    // newInout.vessels = this.vesselvoyage;
    // newInout.chasis = this.chassis;
    // newInout.packSlip = this.packslip;
    // newInout.reference = this.reference;
    newInout.note = this.note;
    newInout.status = 'Out';
    newInout.outwordDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    

    this.dataService.setNewInout(newInout);
    
    this.router.navigateByUrl(`/${this.orgName}/inout/detail/new/new`);

  }

  closeDriver(){
    this.newDriverScreenVisible = false;
  }

  showDetails(inoutId: any) {
    this.router.navigateByUrl(`${this.orgName}/inout/detail/${inoutId}/show`);
  }

  editDetails(inoutId: any) {
    this.router.navigateByUrl(`${this.orgName}/inout/detail/${inoutId}/edit`);
  }

  deleteDetails(inoutId: any) {
    alert('Delete action Triggered')
  }



  confirmationMessage(inoutId:any) {
    const reqObj = {
      RowID: inoutId,
      Status: true
    }
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure want to delete selected Inout Number #' + inoutId + ' ?' ,
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      accept: () => {
        this.commonService.UpdateInoutStatus(reqObj).subscribe(() =>{
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'In-Out Record Deleted Successfully' });
          this.getAllInoutDetails(this.pagination);

        },(error) =>{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something Wen\'t wrong' });
        })
      },
      reject: () => {       
        return false;
      },
    });
  }


  getLocationAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getAllLocatoins();
        break;
      case 'mdi-refresh':
        this.refreshLocationData();
        break;
      default:
        break;
    }
  }

  getInoutAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getAllInoutDetails(this.pagination);
        break;
      case 'mdi-refresh':
        this.serachText = '';
        this.getAllInoutDetails(this.pagination);
        break;
      case 'mdi-plus':
        this.showDialog();
        break;
      default:
        break;
    }
  
  }

}
