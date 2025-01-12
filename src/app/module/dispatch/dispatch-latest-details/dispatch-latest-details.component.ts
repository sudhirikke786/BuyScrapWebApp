import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';
import { HelperService } from 'src/app/core/services/helper.service';

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
  addressId:Number=0;
  locId:any;
  logInUserId: any;
  locationName: any;
  checkTabView: boolean = false;
  isEditModeOn= false;
  dispatchObj:any;
  dispatchTypes:any;
  dispatchMaterialObj = 'undefined';
  backUrl:any;
  type:any;
  pickupdate:any;
  currencySymbol: string = 'USD';
  numberFormat: string = '1.3-3';
  editingIndex:any = null;
  minDate! :string;
  dispatch:any;
  dispatchMaterial:any;
  driversName:any;
  customer:any;
  driveruserObj:any;
  addresses: any[] = [];
  isBusiness: boolean = false;
  notes:any;
  // Array to store invoice items
  invoiceObj: Array<any> = [];
  
  // New item model
  newItem: any ={
    "localRowId": 0,
    "rowID": 0,
    "materialName": "",
    "pickUpID": 0,
    "isDeleted": false,
    "containerID": 0,
    "containerType": "-- None --",
    "containerSize": "",
    "containerName": "",
    "noofShippingUnits": 0,
    "charges": 0,
    "liveLeadEQ": "string",
    "dropoffbox": "",
    "boxpickup": "",
    "notes": ""
  };

  allContainerType :any = [];
  admins: any;
  driverList:any[] =[];
  editItemObj: any = { };


constructor(private route: ActivatedRoute, private router:Router,
  private messageService: MessageService,
  private stroarge:StorageService,
  public helperService:HelperService,
  public commonService: CommonService) {
    this.addresses = [];

      // Load existing addresses from localStorage
      const storedAddresses = localStorage.getItem('addresses');
      if (storedAddresses) {
        this.addresses = JSON.parse(storedAddresses);
      }
      
   }

  ngOnInit() {    
 
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.checkTabView = this.helperService.isTab();
    this.minDate =  this.formateDate();

    this.route.params.subscribe((param) => {
      this.invoiceId = param["rowId"];
      this.sellerId = param["sellerID"];
      this.type = param["type"];
    });


   
    this.GetAllDispatchTypes();
    this.GetAllContainer();
    this.getAllUsers();

  
     this.getSellerById();
     if( this.type=='show' || this.type=='edit'  ){
      this.GetAllPickUpDetailsByID();
      this.GetAllPickUpMaterialByID();
     }
    // 
    
    this.backUrl = `/${this.orgName}/dispatch`;
   // this.fetchSellerAddresses();


   
  }

  edit(){
    this.type = 'edit';
  }

  startEditing(index: number, item: any): void {
    this.editingIndex = index;
    this.editItemObj = { ...item }; // Create a copy to avoid directly modifying the original
  }
  
  saveEdit(index: number): void {
    if (this.editingIndex !== null) {
      this.invoiceObj[index] = { ...this.editItemObj }; // Save the updated values
      this.editingIndex = null;
    }
  }
  

  cancelEdit(): void {
    this.editingIndex = null; // Exit edit mode without saving
    this.editItemObj = {
   
    };
  }




  // Add new item to the list
  addNewItem() {

      const item = {
        "localRowId": 0,
        "rowID": 0,
        "materialName": "",
        "pickUpID": 0,
        "isDeleted": false,
        "containerID": 0,
        "containerType": "-- None --",
        "containerSize": "",
        "containerName": "",
        "noofShippingUnits": 0,
        "charges": 0,
        "liveLeadEQ": "string",
        "dropoffbox": "",
        "boxpickup": "",
        "notes": ""
      }
      this.invoiceObj.push({...item ,...this.newItem}); // Add a copy of the new item
     
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
      this.newItem.containerType && (this.newItem.dropOffBox || this.newItem.boxpickup) 
    );
  }

  // Reset new item fields
  resetNewItem() {
    this.newItem = {
      containerType: '-- None --',
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
    this.commonService.getSellerById(paramObject).subscribe(
      (data) => {
        console.log('getSellerById Response:', data);
        this.customer = data.body.data;
        console.log('idscanImage:', this.customer.idscanImage);

        this.isBusiness = this.customer?.sellerType === 'Business';
  
        if (this.isBusiness) {
          this.fetchSellerAddresses();
        } else {
          this.addresses = [this.customer.streetAddress];
        }
      },
      (err: any) => {
        console.error('Error fetching seller details:', err);
      }
    );
  }

  fetchSellerAddresses() {
    if (this.sellerId) {
      const paramObj = {
        SellerId: this.sellerId
      };
  
      this.commonService.GetAddressesByID(paramObj).subscribe(
        (response) => {
          this.addresses = response.body.data || [];
          localStorage.setItem('addresses', JSON.stringify(this.addresses));
          if (this.addresses.length > 0) {
            this.addressId = this.addresses[0].rowId;
          }
        },
        (error) => {
          console.error('Error fetching addresses:', error);
          this.addresses = [];
          localStorage.removeItem('addresses');
        }
      );
    } 
  }

  setDateToInput(isoDateString:any) {
    // Convert the ISO string to a Date object
    const dateObject = new Date(isoDateString);

    // Extract the date in YYYY-MM-DD format
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');

    // Combine to get the formatted date
    const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
    
  }

  GetAllPickUpDetailsByID() {
    const paramObject = {
     RowID: Number(this.invoiceId)
    };
    this.commonService.GetAllPickUpDetailsByID(paramObject)
      .subscribe(data => {
     
        this.dispatchObj = data.body.data;
        this.dispatchMaterial = this.dispatchObj?.dispatchType;
        this.pickupdate =  this.setDateToInput(this.dispatchObj.pickUpDate) ;
        this.driversName = this.dispatchObj.driverID;
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
      .subscribe((data:any) => {
       
        this.invoiceObj = data.body.data.map((item:any) =>{
          let obj : any = {};
          obj.rowID= item.rowID;
          obj.materialName= item.materialName;
          obj.pickUpID = item.pickUpID;
          obj.isDeleted = false;
          obj.containerID = item.containerID;
          obj.containerSize = item.containerSize;
          obj.containerName = item.containerName;
          obj.noofShippingUnits = item.noofShippingUnits;
          obj.charges = item.charges;
          obj.liveLeadEQ = "";
          obj.dropoffbox = item.dropOffBox;
          obj.boxpickup = item.boxPickUp;
          obj.notes = item.notes
          obj.fullName =  item.fullName;
          obj.notes = item.notes;
        
          return {...obj,...item};
         
        });
        console.log(this.invoiceObj)
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
      item.dropOffBox = item.dropoffbox;
      item.boxPickUp =item.boxpickup ;
      let selectedContainerType = this.allContainerType.filter((item1:any) => item1.containerType === item.containerType);
      item.containerID = selectedContainerType.length > 0 ? selectedContainerType[0].rowId : 0;
      return item;
    })

    if(!this.dispatchMaterial){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select Type' });
      return
    }
    if(!this.pickupdate){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select Pickup Date' });
      return
    }
    const submitObj = {
      "rowID": this.dispatchObj?.rowID ?? 0,
      "ticketID": 0,
      "sellerID": parseInt(this.sellerId),
      "addressID":this.addressId,
      "pickUpAddress": "string",
      "pickUpDate":new Date(this.pickupdate).toISOString(),
      "charges": this.invoiceObj.reduce((acc,curr) => acc + curr.charges,0),
      "locID": this.locId,
      "isDeleted": false,
      "typeID": 1,
      "type": this.dispatchMaterial,
      "driverID":this.driversName ? Number(this.driversName) : 0 ,
      "closedDate": "2024-12-01T14:41:32.385Z",
      "vehicalNo": "",
      "route": "",
      "carrierName": "",
      "driverName": this.driversName ? this.driverList.filter((item) => item.rowId == Number(this.driversName))[0].firstName : '',
      "createdBy": 0,
      "createdDate": "2024-12-01T14:41:32.385Z",
      "updatedBy": 0,
      "updatedDate": "2024-12-01T14:41:32.385Z",
      "lstTPickUpMaterialDTO": containerObj
    }

    this.commonService.InsertUpdatePickup(submitObj).subscribe((res) =>{

      this.messageService.add({ severity: 'success', summary: 'success', detail: 'Dispatch Order Successfully' });
      this.router.navigate([this.backUrl]);
    
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
    // const hh = String(now.getHours()).padStart(2, '0');
    // const mi = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; 
  }



  getAllUsers(){
    const reqObj = {
      LocationId: this.locId,
      UserID:0
    }
    this.commonService.GetAllUsers(reqObj).subscribe((res) =>{
      this.driverList =  res?.body?.data.filter((item:any) =>item.role.toLowerCase() == 'driver');
     
    })
  }

  

}
