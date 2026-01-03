import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';


@Component({
  selector: 'app-sellers-buyers-details',
  templateUrl: './sellers-buyers-details.component.html',
  styleUrls: ['./sellers-buyers-details.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SellersBuyersDetailsComponent implements OnInit {

  orgName: any;
  locId: any;
  sellerId: any;
  seller: any;
  tickets: any;
  isBuniessUser = false;

  sellerLoader = false;
  backUrl: string = '';

  showAdvances: boolean = false;
  advances: any[] = [];

  ticketsCurrentPage: number = 1;
  ticketsPageSize: number = 10;
  ticketsFirst: number = 0;
  ticketsTotal: number = 0;

  advancesCurrentPage: number = 1;
  advancesPageSize: number = 10;
  advancesFirst: number = 0;
  advancesTotal: number = 0;

  IsCustomerAdvanceEnabled: boolean = false;

  
  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private messageService: MessageService,
    private stroarge:StorageService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.route.params.subscribe((param)=>{
      this.sellerId = param["sellerId"];
      this.getSellerById();      
      this.getAllTicketsBySellerId();
    });

    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      const iscustomeradvance = _dataObj.filter((item: any) => item?.keys?.toLowerCase() === 'iscustomeradvance')[0];
      this.IsCustomerAdvanceEnabled = (iscustomeradvance?.values.toLowerCase() === 'true');
    }

    this.route.queryParams.subscribe(params => {
   
        this.backUrl = `/${this.orgName}/sellers-buyers`;
    });
    this.TicketsPagination();
    this.AdvancesPagination();
  }
  
  TicketsPagination() {
    const storedPagination = localStorage.getItem('ticketsSellerPaginationData');
    if (storedPagination) {
      const parsedData = JSON.parse(storedPagination);
      this.ticketsCurrentPage = parsedData.currentPage || 1;
      this.ticketsPageSize = parsedData.pageSize || 10;
      this.ticketsFirst = parsedData.first || 0;
    } else {
      this.ticketsPageSize = 10;
      this.ticketsCurrentPage = 1;
      this.ticketsFirst = 0;
    }
  }

  saveTicketsPagination() {
    const paginationData = {
      currentPage: this.ticketsCurrentPage,
      pageSize: this.ticketsPageSize,
      first: this.ticketsFirst
    };
    localStorage.setItem('ticketsSellerPaginationData', JSON.stringify(paginationData));
  }

  onTicketsPageChange(event: any) {
    this.ticketsCurrentPage = event.first / event.rows + 1;
    this.ticketsFirst = event.first;
    this.ticketsPageSize = event.rows;
    
    this.saveTicketsPagination();
    
  }

  AdvancesPagination() {
    const storedPagination = localStorage.getItem('advancesPaginationData');
    if (storedPagination) {
      const parsedData = JSON.parse(storedPagination);
      this.advancesCurrentPage = parsedData.currentPage || 1;
      this.advancesPageSize = parsedData.pageSize || 10;
      this.advancesFirst = parsedData.first || 0;
    } else {
      this.advancesPageSize = 10;
      this.advancesCurrentPage = 1;
      this.advancesFirst = 0;
    }
  }

  saveAdvancesPagination() {
    const paginationData = {
      currentPage: this.advancesCurrentPage,
      pageSize: this.advancesPageSize,
      first: this.advancesFirst
    };
    localStorage.setItem('advancesPaginationData', JSON.stringify(paginationData));
  }

  onAdvancesPageChange(event: any) {
    this.advancesCurrentPage = event.first / event.rows + 1;
    this.advancesFirst = event.first;
    this.advancesPageSize = event.rows;
    
    this.saveAdvancesPagination();
    
  }
  
  getSellerById() {
    this.sellerLoader = true;
    
    const paramObject = {
      ID: this.sellerId,
      LocationId: this.locId
    };
    this.commonService.getSellerById(paramObject)
      .subscribe(data => {
          console.log('getSellerById :: ');
          console.log(data);
          this.seller = data.body.data;
          this.isBuniessUser = this.seller.sellerType ? true : false;
        },
        (err: any) => {
          this.sellerLoader = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  toggleAdvancesView() {
    this.showAdvances = !this.showAdvances;
    
    this.GetCustomerAdvances();
  }

  GetCustomerAdvances() {
    const paramObj = {
      customerId: this.sellerId 
    };

    this.commonService.GetCustomerAdvance(paramObj).subscribe(
      (data: any) => {
        console.log(data);
        this.advances = data.body.data;
        this.advancesTotal = this.advances.length; 
          
          this.saveAdvancesPagination();
      },
      (err: any) => {
        console.error('Error loading customer advances:', err);
      },
      () => {
        console.log('GetCustomerAdvance API call completed');
      }
    );
  }

  getAllTicketsBySellerId() {   
    this.sellerLoader = true;
 
    const paramObj: any = {
      SellerId: this.sellerId,
      LocationId: this.locId
    }
    this.commonService.getAllTicketsBySellerId(paramObj)
      .subscribe(data => {
          console.log('getAllTicketsBySellerId :: ');
          console.log(data);
          this.tickets = data.body.data;
          this.ticketsTotal = this.tickets.length; // For client-side pagination
          
          this.saveTicketsPagination();
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.sellerLoader = false;
        },
        () =>{
          this.sellerLoader = false;
        }
      );
  }


  sendMaterialPriseList() {   
    this.sellerLoader = true;
 
    const paramObj: any = {
      SellerId: this.sellerId,
      LocationId: this.locId
    }
    this.commonService.sendMaterialPriseList(paramObj)
      .subscribe(data => {
          console.log('sendMaterialPriseList :: ');
          console.log(data);
          this.tickets = data.body.data;
          if (data.body?.success) { 
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Price list sent successfully' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.body?.message || 'Failed to send price list' });
          }
        
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.sellerLoader = false;
        },
        () =>{
          this.sellerLoader = false;
        }
      );
  }

  showTicketDetails(ticketData: any) {   
      this.router.navigateByUrl(`/${this.orgName}/home/detail/${ticketData.rowId}/${ticketData.customerId}/${this.isBuniessUser}?type=seller`);
  }

}
