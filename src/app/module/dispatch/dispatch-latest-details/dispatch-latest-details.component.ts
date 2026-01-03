import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StorageService } from 'src/app/core/services/storage.service';
import { HelperService } from 'src/app/core/services/helper.service';
import { AuthService } from 'src/app/core/services/auth.service';


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
  addressID:number=0;
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
  currencyCode: string = '';
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
  isLoading = false;
  contactName: string = '';
  contactNumber: string = '';
  pickUpTime: string = '';

  currentRole: any;

  ticketRowID: number = 0;
  sellerID: any;
  rowId: any;
  isCompleted:boolean=false;
  CurrencyCode: any;
  CurrencySymbol: any;
  showConfirmLeavePopup: boolean = false;
  pendingNavigationUrl: string | null = null;


  currentDate: any;

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
    "dropOffBox": "", 
    "boxPickUp": "", 
    "notes": "",
    "dispatchTypeID":0,
    "dispatchType": "--Select--",
    "DropOffRowId": 0,
    "BoxPickupRowId": 0,
  };

  allContainerType :any = [];
  admins: any;
  driverList:any[] =[];
  editItemObj: any = { };
  isContainerValid: boolean = true;
  newSubContainers: any[] = [];
  editSubContainers: any[] = [];
  isNewItemBulk: boolean = false;
  isEditItemBulk: boolean = false;
  defaultCurrencyCode: string = '';
  newItemHasSubContainers: boolean = false;
  editItemHasSubContainers: boolean = false;
  newSubContainersDropOff:any[] = [];
  newSubContainersPickup:any[] = [];
  editSubContainersDropOff:any[] = [];
  editSubContainersPickup:any[] = [];

  showLoaderReport = false;
  isReportShow = false;
  currentDispatchId: number=0;
  fileDataObj: any;
  adminAdvertisement!:  string | null;
  showDownload = false;
  pickupID: any;

constructor(private route: ActivatedRoute, private router:Router,
  private messageService: MessageService,
  private stroarge:StorageService,
  public helperService:HelperService,
  public commonService: CommonService,
  private authService:AuthService
) {
    // this.addresses = [];

    //   // Load existing addresses from localStorage
    //   const storedAddresses = localStorage.getItem('addresses');
    //   if (storedAddresses) {
    //     this.addresses = JSON.parse(storedAddresses);
    //   }
      
   }

  ngOnInit() {    

    this.currentRole = this.authService.userCurrentRole();

 
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.checkTabView = this.helperService.isTab();
    this.minDate =  this.formateDate();
    this.defaultCurrencyCode = localStorage.getItem('currencyCode') || '';    
    this.currentDate = new Date();   
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement'); 

    this.route.params.subscribe((param) => {
      this.invoiceId = param["rowId"];
      this.sellerId = param["sellerID"];
      this.type = param["type"];
    });

    this.route.queryParams.subscribe(params => {
      const view = params['view'];
      if (view === 'calendar') {
        this.backUrl = `/${this.orgName}/dispatch/meeting`;
      } else {
        this.backUrl = `/${this.orgName}/dispatch`;
      }
      this.currencyCode = params['currencyCode'];
      this.currencySymbol = params['currencySymbol'];
      if (this.currencyCode) {
        this.CurrencyCode = this.currencyCode;
      }
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
    
    // this.backUrl = `/${this.orgName}/dispatch`;
   // this.fetchSellerAddresses();


   this.router.events.subscribe(event => {
    if(event instanceof NavigationStart){
      if(this.isEditModeOn && !this.showConfirmLeavePopup){
        this.showConfirmLeavePopup = true;
        this.pendingNavigationUrl = event.url;
        this.router.navigateByUrl(this.router.url, { replaceUrl: true });
      }
    }
  })
   
   
  }

  proceedWithNavigation() {
    this.showConfirmLeavePopup = false;
    this.isEditModeOn = false;
  
    if (this.pendingNavigationUrl) {
      this.router.navigateByUrl(this.pendingNavigationUrl);
      this.pendingNavigationUrl = null;
    }
  }

  cancelNavigation() {
    this.showConfirmLeavePopup = false;
    this.pendingNavigationUrl = null;
  }

  edit(){
    this.type = 'edit';
    this.isEditModeOn = true;
  }

  startEditing(index: number, item: any): void {
    this.editingIndex = index;
    this.editItemObj = { ...item }; // Create a copy to avoid directly modifying the original
    
      console.log('checking edit object',this.editItemObj)

    const selectedContainer = this.allContainerType.find(
      (c: any) => c.containerType === this.editItemObj.containerType
    );

    if (selectedContainer) {
      this.editItemHasSubContainers = false;
      this.GetAllSubContainers(selectedContainer.rowId, 'edit');
    } else {
      this.editItemHasSubContainers = false;
    }
  }


  saveEdit(index: number): void {
    if (this.editingIndex !== null) {
      if (!this.editItemObj.containerType || this.editItemObj.containerType === '-- None --' || this.editItemObj.containerType === 'Select container type') {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please Select Container Type'});
        return;
      }

      if (!this.editItemObj.dispatchTypeID || this.editItemObj.dispatchTypeID === 0) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please Select Dispatch Type'});
        return;
      }

      if (this.editItemHasSubContainers) {
        if (this.editItemObj.dropOffRowId) {
          const selectedDropOff = this.editSubContainersDropOff.find(
            container => container.rowID === this.editItemObj.dropOffRowId
          );
          if (selectedDropOff) {
            this.editItemObj.dropOffBox = selectedDropOff.containerNumber;
          }
        } else {
          this.editItemObj.dropOffBox = '';
        }

        if (this.editItemObj.boxPickupRowId) {
          const selectedPickup = this.editSubContainersPickup.find(
            container => container.rowID === this.editItemObj.boxPickupRowId
          );
          if (selectedPickup) {
            this.editItemObj.boxPickUp = selectedPickup.containerNumber;
          }
        } else {
          this.editItemObj.boxPickUp = '';
        }
      }

      this.invoiceObj[index] = { ...this.editItemObj }; // Save the updated values    
      this.cancelEdit();
      
      console.log('Updated invoice object:', this.invoiceObj[index]);
    }
  }
  

  cancelEdit(): void {
    this.editingIndex = null; // Exit edit mode without saving
    this.editItemObj = {

    };
    
    this.editItemHasSubContainers = false;
    this.editSubContainersDropOff = [];
    this.editSubContainersPickup = [];
  }




  // Add new item to the list
  addNewItem() {
    
    if (!this.newItem.containerType || this.newItem.containerType === '-- None --' || this.newItem.containerType === 'Select container type') {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please Select Container Type'});
      return;
    }

    if (!this.newItem.dispatchTypeID || this.newItem.dispatchTypeID === 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please Select Dispatch Type'});
      return;
    }
    const selectedDispatchType = this.dispatchTypes.find((x:any) => x.rowID == this.newItem.dispatchTypeID);
    console.log("Selected Dispatch Type ID:", this.newItem.dispatchTypeID);
    console.log("New checking",selectedDispatchType);
    if (selectedDispatchType) {
      this.newItem.dispatchType = selectedDispatchType.type;
    } else {
      this.newItem.dispatchType = "--Select--";
    }
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
      "dropOffBox": "", 
      "boxPickUp": "", 
      "DropOffRowId": 0,
      "BoxPickupRowId": 0,
      "notes": "",
      "dispatchTypeID": 0,
      "dispatchType": "--select--"
    }
      console.log("Final Item to Push:", item);
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
      dropOffBox: '',     
      boxPickUp: '',  
      DropOffRowId: 0,
      BoxPickupRowId: 0,
      charges: 0,
      notes: '',
      dispatchType:"--select--",
      dispatchTypeID: 0,
      containerQuantity: 0
    };
    this.newItemHasSubContainers = false;
    this.newSubContainersDropOff = [];
    this.newSubContainersPickup = [];
    this.isNewItemBulk = false;
    this.newSubContainers = []; 
  }




  
  getSellerById() {
    this.isLoading = true
    const paramObject = {
      ID: this.sellerId,
      LocationId: Number(this.locId)
    };
    this.commonService.getSellerById(paramObject).subscribe(
      (data) => {
        console.log('getSellerById Response:', data);
        this.customer = data.body.data;
        this.isBusiness = this.customer?.sellerType === 'Business';
  
        if (this.isBusiness) {
          this.fetchSellerAddresses();
        } else {
          this.addresses = [this.customer.streetAddress];
        }
      },
      (err: any) => {
        this.isLoading = false;
        console.error('Error fetching seller details:', err);
      },
      () => {
        this.isLoading = false;
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
          //localStorage.setItem('addresses', JSON.stringify(this.addresses));
          // if (this.addresses.length > 0) {
          //   this.addressID = this.addresses[0].rowId;
          // }
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
    this.isLoading = true;
    const paramObject = {
     RowID: Number(this.invoiceId)
    };
    this.commonService.GetAllPickUpDetailsByID(paramObject)
      .subscribe(data => {
     
        this.dispatchObj = data.body.data;
        this.dispatchMaterial = this.dispatchObj?.dispatchType;
        this.pickupdate =  this.setDateToInput(this.dispatchObj.pickUpDate) ;
        this.pickUpTime = this.dispatchObj.pickUpTime; 
        this.driversName = this.dispatchObj.driverID;
        this.notes = this.dispatchObj.notes;
        this.contactName = this.dispatchObj.contactName;
        this.contactNumber = this.dispatchObj.contactNumber;
        this.addressID = Number(this.dispatchObj.addressID);
        this.ticketRowID = this.dispatchObj.ticketRowID || 0;
        this.sellerID = this.dispatchObj.sellerID;
        this.rowId = this.dispatchObj.rowID || Number(this.invoiceId);
        this.isCompleted = this.dispatchObj.isCompleted;
        this.CurrencyCode = this.dispatchObj?.currencyCode;  
        this.pickupID = this.dispatchObj.pickupID;  
      },
        (err: any) => {
          this.isLoading = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  GetAllPickUpMaterialByID() {
    this.isLoading = true;
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
          item.dropOffBox = item.dropOffBox; 
          item.boxPickUp = item.boxPickUp; 
          item.dropOffRowId = item.dropOffRowId || item.DropOffRowId || 0;
          item.boxPickupRowId = item.boxPickupRowId || item.BoxPickupRowId || 0;
          obj.fullName =  item.fullName;
          obj.notes = item.notes;
          obj.dispatchTypeID = item.dispatchTypeID;
        
          return {...obj,...item};
         
        });
        console.log(this.invoiceObj)
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
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
      LocationId: this.locId
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

  onContainerTypeChange(item: any, mode: 'new' | 'edit') {
    const selectedContainer = this.allContainerType.find(
      (c: any) => c.containerType === item.containerType
    );

    item.dropOffBox = '';
    item.boxPickUp = '';
    item.DropOffRowId = 0;
    item.BoxPickupRowId = 0;
    item.containerQuantity = selectedContainer ? 1 : 0;

    if (mode === 'new') {
      this.isNewItemBulk = !!(selectedContainer && selectedContainer.isBulk);
      this.newItemHasSubContainers = false;
      this.newSubContainers = [];
    } else { 
      this.isEditItemBulk = !!(selectedContainer && selectedContainer.isBulk);
      this.editItemHasSubContainers = false; 
      this.editSubContainers = []; 
    }
    
    if (selectedContainer) {
      this.GetAllSubContainers(selectedContainer.rowId, mode);
    }
    
    this.validateContainerQuantity(item);
  }

  GetAllSubContainers(containerID: number, mode: 'new' | 'edit') {
    const paramObject = {
      containerID: containerID,
      locID: this.locId
    };
    
    this.commonService.GetAllSubContainersByContainerID(paramObject)
      .subscribe({
        next: (subContainersResponse) => {
          const allSubContainers = subContainersResponse.body?.data || [];

          if (allSubContainers.length === 0) {
            if (mode === 'edit') {
              this.editItemHasSubContainers = false;
            } else {
              this.newItemHasSubContainers = false;
            }
            return;
          }
          this.commonService.GetContainerLocationsById({ containerId: containerID })
            .subscribe({ 
              next: (locationsResponse) => {
                const dispatchedLocations = locationsResponse.body?.data;
                const locationMap = new Map(dispatchedLocations.map((loc: any) => [loc.containerRowId, loc]));

                const dropOffList: any[] = [];
                const boxPickupList: any[] = [];

                for (const subContainer of allSubContainers) {
                  const locationInfo: any = locationMap.get(subContainer.rowID);

                  if (locationInfo) {
                    if (locationInfo.isAtWearhouse) {
                      dropOffList.push(subContainer);
                    } else {
                      boxPickupList.push(subContainer);
                    }
                  } else {
                    dropOffList.push(subContainer);
                  }
                }

                if (mode === 'edit') {
                  if (
                    this.editItemObj?.dropOffRowId &&
                    !dropOffList.some(sc => sc.rowID === this.editItemObj.dropOffRowId)
                  ) {
                    dropOffList.push({
                      rowID: this.editItemObj.dropOffRowId,
                      containerNumber: this.editItemObj.dropOffBox
                    });
                  }

                  if (
                    this.editItemObj?.boxPickupRowId &&
                    !boxPickupList.some(sc => sc.rowID === this.editItemObj.boxPickupRowId)
                  ) {
                    boxPickupList.push({
                      rowID: this.editItemObj.boxPickupRowId,
                      containerNumber: this.editItemObj.boxPickUp
                    });
                  }

                  this.editSubContainersDropOff = dropOffList;
                  this.editSubContainersPickup = boxPickupList;
                  this.editItemHasSubContainers = true;
                } else {
                  this.newSubContainersDropOff = dropOffList;
                  this.newSubContainersPickup = boxPickupList;
                  this.newItemHasSubContainers = true;
                }
              },
              error: (err) => {
                
              }
            });
        },
        error: (err) => {
        
        }
      });
  }

  validateContainerQuantity(item: any) {
    if (!item.containerType || item.containerQuantity === null || item.containerQuantity === undefined) {
      return;
    }

    const selectedContainer = this.allContainerType.find(
      (c: any) => c.containerType === item.containerType
    );

    if (!selectedContainer) {
      return;
    }
    if (selectedContainer.isBulk) {
      const availableCount = selectedContainer.count;

      if (item.containerQuantity > availableCount) {
        this.messageService.add({severity: 'error',summary: 'Invalid Quantity',detail: `Quantity exceeding the limit.`
        });
        item.containerQuantity = availableCount;
      }
    }
  }

  onDropOffChange(item: any, mode: 'new' | 'edit') {
    const containers = mode === 'new' ? this.newSubContainersDropOff : this.editSubContainersDropOff;
    const selectedContainer = containers.find(c => c.rowID === item.DropOffRowId);
    
    if (selectedContainer) {
      item.dropOffBox = selectedContainer.containerNumber; 
    } else {
      item.dropOffBox = '';
    }
  }

  onPickUpChange(item: any, mode: 'new' | 'edit') {
    const containers = mode === 'new' ? this.newSubContainersPickup : this.editSubContainersPickup;
    const selectedContainer = containers.find(c => c.rowID === item.BoxPickupRowId);
    
    if (selectedContainer) {
      item.boxPickUp = selectedContainer.containerNumber; 
    } else {
      item.boxPickUp = '';
    }
  }

  checkContainerAvailability(containerNumber: string, type: string) {
    if (this.dispatchMaterial == 'Exchange') {
      if (type == 'dropoff' && containerNumber == this.newItem.boxPickUp) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Drop-off and Box Pickup cannot have the same container!' 
        });
        this.newItem.dropOffBox = '';
        this.editItemObj.dropOffBox = '';
            return;
        }
      if (type == 'pickup' && containerNumber == this.newItem.dropOffBox) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Drop-off and Box Pickup cannot have the same container!' 
        });
        this.newItem.boxPickUp = '';
        this.editItemObj.boxPickUp = '';
            return;
        }
    }

    // default container quantity to 1 if dropoffbox or boxpickup is entered
    if (containerNumber) {
      if (this.editingIndex !== null && this.editingIndex !== undefined) {
          this.editItemObj.containerQuantity = 1;
      } else {
          this.newItem.containerQuantity = 1;
      }
    }

    const paramObject = {
      Containernumber: containerNumber
    };
  
    this.commonService.GetAllContainerLocations(paramObject)
      .subscribe((data: any) => {
        console.log('API Response:', data); 
        
        const containerData = data.body.data[0];
        
         if (containerData.isAtWearhouse && type == 'pickup') {
            this.newItem.boxPickUp = '';
            this.editItemObj.boxPickUp = '';
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Container is in Warehouse. Not available for Pickup.' 
            });
        } else if (!containerData.isAtWearhouse && type == 'dropoff') {
            this.newItem.dropOffBox = '';
            this.editItemObj.dropOffBox = '';
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Container is at Client Location. Not available for Drop-off.' 
            });
        }
      },
      (err: any) => {
        console.error('API Error:', err); 
      });
  }
  
  getTotalCharges(): number {
    return this.invoiceObj.reduce((total, item) => total + item.charges, 0);
  }
  submitSave(){
    // "pickUpDate": this.datePipe.transform(this.pickupdate, 'YYYY-MM-ddTHH:mm:ss.SSS'),
  
    console.log('saving ',this.invoiceObj)
    const containerObj =  this.invoiceObj.map((item) =>{
      // item.dropOffBox = item.dropoffbox;
      // item.boxPickUp =item.boxpickup ;
      let selectedContainerType = this.allContainerType.filter((item1:any) => item1.containerType === item.containerType);
      item.containerID = selectedContainerType.length > 0 ? selectedContainerType[0].rowId : 0;
      let selectedDispatchType = this.dispatchTypes.find((item2: any) => item2.rowID == item.dispatchTypeID);
      item.dispatchTypeID = selectedDispatchType ? selectedDispatchType.rowID : item.dispatchTypeID;
      item.dispatchType = selectedDispatchType ? selectedDispatchType.type : '--select--';
      console.log('selectedDispatchType',selectedDispatchType)
      
      //item.dispatchTypeID = selectedDispatchType ? Number(selectedDispatchType.rowID) : Number(item.dispatchTypeID) || 0;
      // let selectedDispatchType = this.dispatchTypes.find((item2: any) => item2.rowID === item.dispatchTypeID);
      // item.dispatchTypeID = selectedDispatchType ? selectedDispatchType.rowID : item.dispatchTypeID;

    
  
      return item;     }) ;
  

    // if(!this.dispatchMaterial){
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select Type' });
    //   return
    // }
    if(!this.pickupdate){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select Pickup Date' });
      return
    }
    if(!this.pickUpTime){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select Pickup Time' });
      return
    }
    this.isLoading=true;
    const submitObj = {
      "rowID": this.dispatchObj?.rowID ?? 0,
      "ticketID": 0,
      "sellerID": parseInt(this.sellerId),
      "addressID": Number(this.addressID) || 0,
      "pickUpAddress": "string",
      "pickUpDate":new Date(this.pickupdate).toISOString(),
      "pickUpTime": this.formatTime(this.pickUpTime),
      "charges": this.invoiceObj.reduce((acc,curr) => acc + curr.charges,0),
      "locID": this.locId,
      "isDeleted": false,
      "typeID": 0,
      "type": this.dispatchMaterial,
      "notes": this.notes,
      "driverID":this.driversName ? Number(this.driversName) : 0 ,
      "closedDate": "2024-12-01T14:41:32.385Z",
      "vehicalNo": "",
      "route": "",
      "carrierName": "",
      "driverName": this.driversName ? this.driverList.filter((item) => item.rowId == Number(this.driversName))[0].firstName : '',
      "createdBy": this.logInUserId,
      "createdDate": "2024-12-01T14:41:32.385Z",
      "updatedBy": this.logInUserId,
      "updatedDate": "2024-12-01T14:41:32.385Z",
      "contactName": this.contactName,   
      "contactNumber": this.contactNumber, 
      "currencyCode":this.currencyCode,
      "currencySymbol":this.currencySymbol,
      "lstTPickUpMaterialDTO": containerObj
    }
   
    this.commonService.InsertUpdatePickup(submitObj).subscribe((res) =>{
      console.log('Response Body:', res.body); 

      this.messageService.add({ severity: 'success', summary: 'success', detail: 'Dispatch Order Successfully' });
      this.isEditModeOn = false;
      let savedDispatchId = res.body?.insertedRow; 
      this.invoiceId = savedDispatchId;
      
      if (savedDispatchId && savedDispatchId > 0) {
        this.generateDispatchReport(savedDispatchId);
      }
      // setTimeout(() => {
      //   this.router.navigate([this.backUrl]);
      // }, 1000);
    
    },(error) =>{
       this.isLoading=false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

      console.log("Error")
    },
    () => {
      this.isLoading=false;
    }
    );
  }

  private formatTime(time: string) {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
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

  updateDispatchType(item: any) {
    const selectedType = this.dispatchTypes.find((x:any) => x.rowID == item.dispatchTypeID);
    item.dispatchType = selectedType ? selectedType.type : '--select--';

    if (selectedType) {
    item.dispatchType = selectedType.type;

      if (item.dispatchType === 'Pickup') {
        item.dropOffBox = '';      
        item.DropOffRowId = 0;   
      } 
      else if (item.dispatchType === 'Drop off') {
        item.boxPickUp = '';       
        item.BoxPickupRowId = 0;  
      }
    } else {
    item.dispatchType = '--select--';
    item.dropOffBox = '';
    item.DropOffRowId = 0;
    item.boxPickUp = '';
    item.BoxPickupRowId = 0;
    }
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

  openDatePicker() {
    const dateInput = document.getElementById('birthdate') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker(); 
    }
  }
  openTimeViewer(){
    const timeInput = document.getElementById('time') as HTMLInputElement;
    if(timeInput){
      timeInput.showPicker();
    }
  }

  convertToTicket(sellerID: any, rowId: any, pickupID:any) {
    this.router.navigate([`/${this.orgName}/home/detail/new/${sellerID}/false`], {
      queryParams: { dispatchID: rowId, PickupID:pickupID },
    });
  }

  showTicketclick(ticketRowID: any, sellerID: any) {
    this.router.navigate([`/${this.orgName}/home/detail/${ticketRowID}/${sellerID}/false`]);
  }

  markMaterialAsCompleted(item: any){
    const postParams = {
      materialID: item?.rowID,
      isCompleted: true, 
      completedBy: this.logInUserId,
      locID: this.locId
    };

    this.commonService.UpdateMaterialCompletedStatus(null, postParams).subscribe({
      next: (response) => {
      item.isCompleted = true;        
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'Material Completed Successfully.' });      
      this.GetAllPickUpMaterialByID();

      },
      error: () => {
        console.log('API error while updating status.');
      }
    });
  }

  generateDispatchReport(rowId: any) {
    this.isReportShow =true;
    this.showLoaderReport = true;
    this.currentDispatchId = rowId;

    const param = {
      PickUpID: rowId,
      LocationId: this.locId,
      Advertising: this.adminAdvertisement
    }

    this.commonService.getDispatchReportData(param)
      .subscribe(data => {
        console.log('getDispatchReportData :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;

        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Dispatch Report " + rowId);
        }
      },
        (err: any) => {
          this.showLoaderReport = false;
        }
      );
  }

  closePdfReport() {
    this.showDownload = false;  
    this.backUrl = `/${this.orgName}/dispatch`
    this.router.navigateByUrl(this.backUrl); 

  }
}
