import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-sellers-buyers-dashboard',
  templateUrl: './sellers-buyers-dashboard.component.html',
  styleUrls: ['./sellers-buyers-dashboard.component.scss'],
  providers: [MessageService]
})
export class SellersBuyersDashboardComponent implements OnInit {
  
  orgName: any;
  locId: any;
  datePipe: DatePipe = new DatePipe('en-US');
  logInUserId: any;
  isDeleteConfirmModel: boolean = false;
  selectedSellerForDelete: any;
  sourceSellerToMerge: any;
  targetSellerToMerge: any;

  showImage = false;
  showImageHeader = 'Show image';
  selectedImageUrl: any;

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },{
      iconcode:'mdi-plus',
      title:'Add Seller',
      label:'Add Seller'

    }
  ];

  sellers: any;
  searchSellerInput: any = '';
  sellerLoader:boolean = false;
  currentPage = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  pageTotal = 0;

  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private stroarge:StorageService,
    private messageService: MessageService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);

    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
  }

  
  getAllsellersDetails(paramObject: any) {
    this.sellerLoader =  true;
    this.commonService.getAllsellersDetails(paramObject)
      .subscribe(data => {
          console.log('getAllsellersDetails :: ');
          console.log(data);
          this.sellers = data.body.data;
          this.pageTotal =  data?.body?.totalRecord
          this.last = data?.body?.totalIndex;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.sellerLoader =  false;
        },
        () =>{
          this.sellerLoader =  false;
        }
      );
  }


  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first ;
    let pagObj = {
      PageNumber: this.currentPage,
      RowOfPage: event.rows,
      LocationId: this.locId
    }
    this.pageSize = event.rows;
   // this.pagination = {...this.pagination,...pagObj};
    this.getAllsellersDetails(pagObj);
  }
  

  /** Seller pop up actions start */

  searchSeller() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%")
    };
    this.getAllsellersDetails(paramObject);

  }

  refreshSellerData() {
    this.searchSellerInput = '';
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
  }

  addNewSeller() {    
    this.router.navigateByUrl(`${this.orgName}/sellers-buyers/add-seller`)
  }  
  /** Seller pop up actions end */


  deleteSeller(seller: any) {
    console.log('Delete action Triggered :: ');
    console.log(seller);

    this.isDeleteConfirmModel =  true;
    this.selectedSellerForDelete = seller;
    
    // this.commonService.addSeller(seller).subscribe(data =>{
    //   alert("Delete Seller successfully")
    //   // if(this.sellerId > 0){
    //   //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller updated Successfully' });
    //   //   this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
    //   // }else{
    //   //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller added Successfully' });
    //   //   this.router.navigateByUrl(`/${this.orgName}/sellers-buyers`);
    //   // }
     
    // },(error: any) =>{
    //   console.log(error);
    // })

  }  

  
  deleteSellerDetails(seller: any) {
    // console.log('Confirm Delete action Triggered :: ');
    // seller.isDeleted = true;
    
    // seller.updatedBy = this.logInUserId;
    // seller.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    // console.log(seller);

    const reqObject = {
      RowId: seller.rowId
    }

    this.commonService.DeleteSellerbyId(reqObject).subscribe(data =>{
      // alert("Seller deleted Successfully");
      console.log(data);

      
      if(data.body.data){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller deleted Successfully' });
      }else{
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller not deleted. Please contact admin' });
      }

      
      const paramObject = {
        PageNumber: 1,
        RowOfPage: 10,
        LocationId: this.locId
      };
      this.getAllsellersDetails(paramObject);
     
    },(error: any) =>{
      console.log(error);
    })

  } 

  confirmData(){
    this.isDeleteConfirmModel =  false;
    this.deleteSellerDetails(this.selectedSellerForDelete);
    // alert("Confirmed Delete !!!");
  }

  cancelClick(){
      this.isDeleteConfirmModel = false;
      alert("Canceled Delete !!!");
  }

  mergeSellerData(){
      this.isDeleteConfirmModel = false;
      alert("Merge Tickets & other data with other seller!!! Functionality still in progress!!!");
  }

  showSelectedImage(imageUrl: string, selectionType:any) {
    this.selectedImageUrl = imageUrl;
    this.showImage = true;
    if(selectionType=='1') {
      this.showImageHeader = 'Show seller photo';
    } 
  }

  cancelImage() {
    this.showImage = false;
  }

  getAction(actionCode:any){
    
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchSeller();
        break;
      case 'mdi-refresh':
        this.refreshSellerData();
        break;
      case 'mdi-plus':
        this.addNewSeller();
        break;
      default:
        break;
    }
  
  }
  
}
