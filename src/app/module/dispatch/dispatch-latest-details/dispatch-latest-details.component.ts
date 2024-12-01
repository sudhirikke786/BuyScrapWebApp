import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService, ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-dispatch-latest-details',
  templateUrl: './dispatch-latest-details.component.html',
  styleUrls: ['./dispatch-latest-details.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class DispatchLatestDetailsComponent {

  orgName:any;
  invoiceId:any;
  sellerId:any;
  locId:any;
  isEditModeOn= false;
  dispatchObj:any;
  dispatchTypes:any;
  dispatchMaterialObj:any;
  backUrl:any;
  type:any;
  pickupdate:any;
  currencySymbol: string = 'USD';
  numberFormat: string = '1.3-3';
  editingIndex:any = null;
  minDate! :string;
  dispatch:any;
  dispatchMaterial:any;

  customer:any;


  // Array to store invoice items
  invoiceObj: Array<any> = [];
  
  // New item model
  newItem: any = {
          "localRowId": 0,
          "rowID": 0,
          "materialName": "",
          "pickUpID": 0,
          "isDeleted": false,
          "containerID": 0,
          "containerType": "",
          "containerSize": "",
          "containerName": "",
          "noofShippingUnits": 0,
          "charges": 0,
          "liveLeadEQ": "string",
          "dropOffBox": 0,
          "boxPickUp": 0,
          "notes": ""
   };

  allContainerType :any = [];




constructor(private route: ActivatedRoute, 
  private messageService: MessageService,
  public commonService: CommonService) { }

  ngOnInit() {    
 
    this.orgName = localStorage.getItem('orgName');
    this.locId = localStorage.getItem('locId');
    this.minDate =  this.formateDate();

    this.route.params.subscribe((param) => {
      this.invoiceId = param["rowId"];
      this.sellerId = param["sellerID"];
      this.type = param["type"];
    });


   

  
     this.getSellerById();
     if( this.type=='new'){
      this.GetAllPickUpDetailsByID();
     }
    // 
     this.GetAllDispatchTypes();
     this.GetAllPickUpMaterialByID();
     this.GetAllContainer();

    this.backUrl = `/${this.orgName}/dispatch`;


   
  }

  edit(){

  }

  onMaterialChange(materialId:any){
    console.log(materialId);
  }

  // Add new item to the list
  addNewItem() {

    if (this.editingIndex !== null) {
      // Update the existing item
      this.invoiceObj[this.editingIndex] = { ...this.newItem };
      this.editingIndex = null; // Reset the editing index
    }else{
      this.invoiceObj.push({ ...this.newItem}); // Add a copy of the new item
     
    }
    console.log(this.invoiceObj);
    
    this.resetNewItem();
  }

  // Edit existing item
  editItem(index: number) {
    this.editingIndex = index; 
    
     this.newItem = { ...this.invoiceObj[index] }; // Load item into the newItem object
    // this.invoiceObj.splice(index, 1); // Remove from list temporarily
  }

  // Delete item from the list
  deleteItem(index: number) {
    this.invoiceObj.splice(index, 1);
  }

  // Check if the new item is valid
  isValidNewItem(): boolean {
    return (
      this.newItem.containerType &&
      this.newItem.dropoffbox &&
      this.newItem.boxpickup &&
      this.newItem.charges > 0
    );
  }

  // Reset new item fields
  resetNewItem() {
    this.newItem = {
      containerType: '',
      dropoffbox: '',
      boxpickup: '',
      charges: 0,
      notes: ''
    };
  }




  
  getSellerById() {
    const paramObject = {
      ID: this.sellerId,
      LocationId: Number(this.locId)
    };
    this.commonService.getSellerById(paramObject)
      .subscribe(data => {
        console.log('getSellerById :: ');
        console.log(data);
        this.customer = data.body.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  GetAllPickUpDetailsByID() {
    const paramObject = {
     RowID: Number(this.invoiceId)
    };
    this.commonService.GetAllPickUpDetailsByID(paramObject)
      .subscribe(data => {
     
        this.dispatchObj = data.body.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  GetAllPickUpMaterialByID() {
    const paramObject = {
     RowID: Number(this.invoiceId)
    };
    this.commonService.GetAllPickUpMaterialByID(paramObject)
      .subscribe(data => {
     
        this.dispatchMaterialObj = data.body.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  GetAllDispatchTypes() {
    const paramObject = {
     RowID: Number(this.invoiceId)
    };
    this.commonService.GetAllDispatchTypes(paramObject)
      .subscribe(data => {
     
        this.dispatchTypes = data.body.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  GetAllContainer() {
    const paramObject = {
      RowID: Number(this.invoiceId)
     };
     this.commonService.GetAllContainer(paramObject)
       .subscribe(data => {
      
         this.allContainerType = data.body.data;
       },
         (err: any) => {
           // this.errorMsg = 'Error occured';
         }
       );
  }
  getTotalCharges(): number {
    return this.invoiceObj.reduce((total, item) => total + item.charges, 0);
  }
  submitSave(){
    // "pickUpDate": this.datePipe.transform(this.pickupdate, 'YYYY-MM-ddTHH:mm:ss.SSS'),
    const containerObj =  this.invoiceObj.map((item) =>{
      item.containerID = this.allContainerType.filter((item1:any) => item1.containerType === item.containerType)[0].rowId;
      return item;
    })
    const submitObj = {
      "rowID": 0,
      "ticketID": 0,
      "sellerID": this.sellerId,
      "pickUpAddress": "string",
      "pickUpDate":new Date(this.pickupdate).toISOString(),
      "charges": this.invoiceObj.reduce((acc,curr) => acc + curr.charges,0),
      "locID": this.locId,
      "isDeleted": false,
      "typeID": 0,
      "type": this.dispatchMaterial,
      "driverID": 0,
      "closedDate": "2024-12-01T14:41:32.385Z",
      "vehicalNo": "",
      "route": "",
      "carrierName": "",
      "driverName": "",
      "createdBy": 0,
      "createdDate": "2024-12-01T14:41:32.385Z",
      "updatedBy": 0,
      "updatedDate": "2024-12-01T14:41:32.385Z",
      "lstTPickUpMaterialDTO": containerObj
    }

    this.commonService.InsertUpdatePickup(submitObj).subscribe((res) =>{
      console.log("Inserted")
    },(error) =>{

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

      console.log("Error")
    })
  }


  formateDate(){
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`; 
  }

  

}
