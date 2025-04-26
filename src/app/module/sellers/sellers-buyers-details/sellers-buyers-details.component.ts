import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';

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

  
  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.route.params.subscribe((param)=>{
      this.sellerId = param["sellerId"];
      this.getSellerById();      
      this.getAllTicketsBySellerId();
    });
    this.route.queryParams.subscribe(params => {
      const view = params['view'];
      if (view === 'grid') {
        this.backUrl = `/${this.orgName}/sellers-buyers/grid`;
      } else {
        this.backUrl = `/${this.orgName}/sellers-buyers`;
      }
    });
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
