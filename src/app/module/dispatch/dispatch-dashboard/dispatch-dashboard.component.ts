import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonService } from 'src/app/core/services/common.service';
import { DispatchModule } from '../dispatch.module';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-dispatch-dashboard',
  templateUrl: './dispatch-dashboard.component.html',
  styleUrls: ['./dispatch-dashboard.component.scss']
})
export class DispatchDashboardComponent implements OnInit {
  locId!: string | number | null;
  currentIndex: any;
  checkOBj: any;
  orgName!: string | null;
  showLoader = false;
  isConfirmModel = false;

  dispatchRes = [
    
  ];

  actionList = [
    { iconcode: 'mdi-magnify', title: 'Search' },
    { iconcode: 'mdi-refresh', title: 'Refresh' },
    { iconcode: 'mdi-calendar', title: 'Calendar View', label: 'Calendar View' },
    { iconcode: 'mdi-plus', title: 'Sellers', label: 'New Appointment' }
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
    label:'New Customer'
  }
  ];

  tickets: any;
  sellers: any;
  selectedSellerId: any;
  selectedSellerName: any;
  selectedSellerTickets: any;

  dialogPopupVisible: boolean = false;
  newTicketVisible: boolean = false;
  ticketvisible: boolean = false;

  checkSectionVisible: boolean = false;

  searchSellerInput: any = '';

  checkNumber: any;
  paymentType: any;

  logInUserId: any;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [
      { title: 'Event 1', date: '2024-07-16' },
      { title: 'Event 2', date: '2024-07-17' }
    ]
  };

  currentPage = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  pageTotal = 0;
  tiketSelectedObj: any;
  currentRole: any;
  isLoading = false;
  sellerLoader: boolean = false;
  
  alertVisible = false;
  alertMessage: any;

  addSellerPopupVisible = false;
  sellerForm!: FormGroup;
  sellerType: string = 'Personal';
  
  showImage = false;
  showImageHeader = 'Show image';
  selectedImageUrl: any;

  checkVisible =  false;
  newDriverScreenVisible = false;
  checkTabView: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
   // private datePipe: DatePipe
   private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');

    this.getAllCODTickets();
  }

  getAllCODTickets() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SerachText: ''
    };
    this.showLoader = true;

    this.commonService.GetAllPickUpDetails(paramObject).subscribe(
      
      (data: any) => {
        //console.log('API Response:', data); 
        console.log('getAllCODTickets :: ', data);
        if (data && data.body && data.body.data) {
          this.dispatchRes = data.body.data.map((item: any) => {
            return {
              rowId: item.rowID,       
              pickUpDate: item.pickUpDate,
              customerName: item.customerName,
              sellerName: item.sellerName,
              sellerID:item.sellerID,
              charges: item.charges,
              selected: item.closedDate ? true : false
            };
          });
        } else {
          console.error('No data found or incorrect response structure.');
        }
      },
      (err: any) => {
        this.showLoader = false;
        console.error('Error fetching COD tickets:', err);
      },
      () => {
        this.showLoader = false;
      }
    );
    this.sellerForm = this.fb.group({
      firstName : ['',Validators.required],
      sellerType:[this.sellerType],
      middleName : [''],
      lastName : ['']
    });
  }
  clickOnSeller(sellerId: string | number, sellerName: string,sellerAddress: string) {
   
    this.router.navigate([`/${this.orgName}/dispatch/dispatch-detail`,'new',sellerId,'add']);
  }
  

  setChecked(item: any, rowIndex: any): void {
    this.currentIndex = rowIndex;
    this.checkOBj = item;
    this.confirm1();
  }

  confirm1() {
    this.isConfirmModel = true;
  }

  onCheckboxChange(item: any) {
    console.log('Checkbox state changed for item:', item);
    this.confirm1();
  }

  toggleAllSelection() {

    console.log('Toggle All Selection invoked');
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

  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        console.log('Search action triggered');
        break;
      case 'mdi-refresh':
        this.getAllCODTickets(); 
        break;
      case 'mdi-calendar':
        this.showDialog();
        break;
      case 'mdi-plus':
        this.openAddUpdateEvent();
        break;
      default:
        console.warn('Unknown action triggered');
        break;
    }
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
  }


  showDialog(){
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
 changeSellerType() {
    if (this.sellerType == 'Personal') {
      this.sellerType = 'Business';
    } else {
      this.sellerType = 'Personal';
    }
  }


}
