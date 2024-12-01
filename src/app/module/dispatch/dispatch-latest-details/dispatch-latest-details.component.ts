import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';


@Component({
  selector: 'app-dispatch-latest-details',
  templateUrl: './dispatch-latest-details.component.html',
  styleUrls: ['./dispatch-latest-details.component.css']
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

  dispatch:any;
  dispatchMaterial:any;

  customer:any;


  // Array to store invoice items
  invoiceObj: Array<any> = [];
  
  // New item model
  newItem: any = {
          "localRowId": 0,
          "rowID": 0,
          "materialName": "string",
          "pickUpID": 0,
          "isDeleted": true,
          "containerID": 0,
          "containerType": "string",
          "containerSize": "string",
          "containerName": "string",
          "noofShippingUnits": 0,
          "charges": 0,
          "liveLeadEQ": "string",
          "dropOffBox": 0,
          "boxPickUp": 0,
          "notes": ""
   };

  allContainerType :any = [];




constructor(private route: ActivatedRoute, 
   
  public commonService: CommonService) { }

  ngOnInit() {    
 
    this.orgName = localStorage.getItem('orgName');
    this.locId = localStorage.getItem('locId');

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

    this.backUrl = `/${this.orgName}/sellers-buyers`;


   
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

    const submitObj = {
      "rowID": 0,
      "ticketID": 0,
      "sellerID": this.sellerId,
      "pickUpAddress": "string",
      "charges": this.invoiceObj.reduce((acc,curr) => acc + curr.charges,0),
      "locID": this.locId,
      "isDeleted": false,
      "typeID": 0,
      "type": "string",
      "driverID": 0,
      "closedDate": "2024-12-01T14:41:32.385Z",
      "vehicalNo": "string",
      "route": "string",
      "carrierName": "string",
      "driverName": "string",
      "createdBy": 0,
      "createdDate": "2024-12-01T14:41:32.385Z",
      "updatedBy": 0,
      "updatedDate": "2024-12-01T14:41:32.385Z",
      "lstTPickUpMaterialDTO": this.invoiceObj
    }

    this.commonService.InsertUpdatePickup(submitObj).subscribe((res) =>{
      console.log("Inserted")
    },(error) =>{
      console.log("Error")
    })
  }


  

}
