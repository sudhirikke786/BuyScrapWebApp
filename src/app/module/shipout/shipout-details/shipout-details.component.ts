import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { TicketItem } from 'src/app/core/model/ticket-item.model';
import { Ticket } from 'src/app/core/model/ticket.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { ShipOut } from 'src/app/core/model/ship-out.model';
import { DataService } from 'src/app/core/services/data.service';
import { MaterialCalculatorComponent } from '../../shared/commonshared/material-calculator/material-calculator.component';
import { HelperService } from 'src/app/core/services/helper.service';
 
@Component({
  selector: 'app-shipout-details',
  templateUrl: './shipout-details.component.html',
  styleUrls: ['./shipout-details.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ShipoutDetailsComponent implements OnInit {
  [x: string]: any;
  @ViewChild('htmlData') htmlData!: ElementRef;


  @ViewChild('searchMaterialInput' , { static: false }) searchMaterialInput!: ElementRef;

  @ViewChild('searchsubMaterialInput' , { static: false }) searchsubMaterialInput!: ElementRef;


  copyMaterialData:any[]  = [];
  copySubMaterialData:any[]  = [];
  
  showCalculator = false;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;

  currentRoute: string = '';

  
  cheight= '50vh';

  sidebarVisible1 = false;

  ticketObj:any = [];
  orgName: any;
  sellerId: any;
  customer:any;
  addressId:number=0;
  type:any;
  shipoutId: any;
  shipoutAction: any;
  locId: any;
  logInUserId: any;
  locationName: any;
  addresses: any[] = [];
  isBusiness: boolean = false;


  ticketData:any = {};
  shipOutDetails: any;
  user: any;
  totalNoOfMaterial: any;
  totalGross: any;
  totalPrice:any;
  totalTare: any;
  totalNet: any;


  isEditModeOn = false;
  materialList: any;
  subMaterialList: any;
  mainMaterialsVisible = true;
  changeItemMaterialsVisible = true;
  selectedMaterial = '';
  editItemCloseImageCapture = false;
  
  webcamImage: WebcamImage | undefined;
  imageUrl: any;
  isChangeItemOn = false;

  
  itemRowId: number = 0;
  itemLocalRowId: number = 0;
  itemGroupName: string = '';
  itemMaterialName: string = '';
  itemMaterialId: number = 0;
  itemGross: any;
  itemTare: any;
  itemNet: number = 0;
  itemAvailableNet: number = 0;
  itemMaterialPrice: number = 0;
  itemImagePath: string = 'assets/images/custom/id_scan.png';
  itemDefaultImagePath: string = 'assets/images/custom/id_scan.png';
  materialNote: any = null;
  itemCodNote: any = null;
  itemLeveloperationPerform: string = '';
  localRowIdCounter: number = 0;


  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;

  selectedRowObj: any;
  isReceiptPrint = true;
  isNewShipOut = false;

  fileDataObj: any;
  showDownload = false;
  showLoaderReport = false;
  isLoading = false;
  checkTabView: boolean = false;
  @ViewChild(MaterialCalculatorComponent) materialCalculatorComponent!: MaterialCalculatorComponent;
 
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private stroarge:StorageService,
    public dataService: DataService,
    public helperService:HelperService,
    private commonService: CommonService) { 
      this.currentRoute = this.route.snapshot.url.join('/');

     }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.checkTabView = this.helperService.isTab();
    this.route.url.subscribe(url => {
      this.currentRoute = url.join('/');
    });

    console.log(this.currentRoute);
	
    this.route.params.subscribe((param)=>{
      this.shipoutId = param["shipOutId"];
      this.shipoutAction = param["action"];
      // this.sellerId = param["customerId"];
      this.type = param["type"];


      console.log(this.sellerId);

      this.route.queryParams.subscribe(params => {
        console.log('Query Params:', params); 
        this.customerId = params['customerId'];
        console.log('Extracted Customer ID:', this.customerId);

       // console.log(this.customerId); 
       this.sellerId = this.customerId;

      });

       if (this.customerId) {
        localStorage.setItem('customerId', this.customerId); 
        console.log('Stored customerId:', this.customerId);
      } else {
        console.error('customerId is missing in query params.');
      }

      if (!this.customerId) {
        this.customerId = localStorage.getItem('customerId');
        console.log('Fallback customerId from localStorage:', this.customerId);
      }

      if (this.shipoutAction == 'edit') {
        this.editTicketDetails();
      }
      if (parseInt(this.shipoutId)) {
        this.getShipOutDetailsByID();
        this.isNewShipOut = false;
      }
      else {
        this.shipOutDetails = this.dataService.getNewShipOut();
        this.getAllUsers(this.logInUserId);
        this.isNewShipOut = true;
      }
      this.processDataBasedOnTicketId();
    });
    this.getSellerById();


    
  }

  
  private processDataBasedOnTicketId() {
    if (parseInt(this.shipoutId)) {
      this.getShipOutMaterialbyID();
      // this.getAllTicketsDetails();
    } else {
      this.shipoutId = 0;
      this.ticketData['createdDate'] = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      this.ticketData['status'] = 'NEW SHIP OUT';

      this.ticketObj = [];

      this.totalNoOfMaterial = 0;
      this.totalGross = 0;
      this.totalPrice = 0;
      this.totalTare = 0;
      this.totalNet = 0;
      this.editTicketDetails();
    }
  }

  // getAllTicketsDetails() {
  //   this.isLoading = true;
  //   const paramObject = {
  //     LocationId: this.locId,
  //     SerachText: this.shipoutId,
  //     SearchOrder: 'TicketId', 
  //     PageNumber: 1, 
  //     RowOfPage: 10
  //   };
  //   this.commonService.getAllTicketsDetails(paramObject)
  //     .subscribe(data => {
  //         console.log('getAllTicketsDetails for shipoutId :: ');
  //         console.log(data);
  //         this.ticketData = data.body.data[0];
  //         this.totalRecords =  data.totalRecords;
  //         const userId = data.body.data[0].createdBy;
       
  //         this.getAllUsers(userId);
  //       },
  //       (err: any) => {
  //         this.isLoading = false;
  //         // this.errorMsg = 'Error occured';
  //       },
  //       () => {
  //         this.isLoading = false;
  //       }
  //     );
  // }

  getAllUsers(userId: any){
    const reqObj = {
      LocationId: this.locId,
      UserID: parseInt(userId)
    }
    this.commonService.GetAllUsers(reqObj).subscribe((res) =>{
      this.user =  res?.body?.data[0];     
    })
  }
  
  getSellerById() {
    this.isLoading = true;
    console.log('customerId in getSellerById:', this.customerId); 
    const paramObject = {
      ID: this.customerId,
      LocationId: Number(this.locId)
    };
    this.commonService.getSellerById(paramObject).subscribe(
      (data) => {
        console.log('getSellerById :: ');
        console.log(data);
        this.customer = data.body.data;
        //alert(JSON.stringify(this.customer));
        this.customer.fullName = this.customer?.fullName || this.customer?.firstName;
        //alert(JSON.stringify(this.customer));
        this.isBuniessUser = this.customer.sellerType ==  "Business" ? true : false;
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
    console.log('customerId in fetchSellerAddresses:', this.customerId);
    if (this.customerId) {
      const paramObj = {
        SellerId: this.customerId
      };
      console.log(this.customerId);
  
      this.commonService.GetAddressesByID(paramObj).subscribe(
        (response) => {
          this.addresses = response.body.data || [];
          localStorage.setItem('addresses', JSON.stringify(this.addresses));
          if (this.addresses.length > 0) {
            this.addressId = parseInt(this.addresses[0].rowId);
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


  searchMaterial(searchTerm:any){

    const inputParms =  searchTerm?.target?.value?.toLowerCase();
    if(inputParms){
      this.materialList = this.copyMaterialData.filter((item:any) => item?.groupName?.toLowerCase().includes(inputParms))
    }else{
      this.materialList = this.copyMaterialData 
    }

  }


  searchSubMaterial(searchTerm:any){

    const inputParms =  searchTerm?.target?.value?.toLowerCase();
    if(inputParms){
      this.subMaterialList = this.copySubMaterialData.filter((item:any) => item?.materialName?.toLowerCase().includes(inputParms))
    }else{
      this.subMaterialList = this.copySubMaterialData 
    }

  }

    
  getShipOutDetailsByID() {
    this.isLoading = true;

    const paramObject = {
      rowId: this.shipoutId,
      LocID: this.locId
    };
    this.commonService.getShipOutDetailsByID(paramObject)
      .subscribe(data => {
          console.log('getShipOutDetailsByID :: ');
          console.log(data);
          this.shipOutDetails = data.body.data; 
          if (this.shipOutDetails.addressID === 0) {
            this.addressName = this.customer?.streetAddress || 'N/A';
            this.selectedBusinessAddressID = 0; 
          } else {
            this.selectedBusinessAddressID = this.shipOutDetails.addressID;
            this.addressName = this.getAddressName(this.shipOutDetails.addressID);
          }

          this.shipOutDetails.shipoutmaterial = null; 
          const userId = data.body.data.createdBy;
          this.getAllUsers(userId);

          this.customerID = data.body.data.customerID; 
          localStorage.setItem('customerId', this.customerID);
          this.getSellerById();


          
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
  getAddressName(addressID: number): string {
    const selectedAddress = this.addresses.find(address => address.rowId === addressID);
    return selectedAddress ? selectedAddress.streetAddress : 'N/A';
  }

  getAddressLabel(selectedId: number): string {
    const selectedAddress = this.addresses.find(address => address.rowId === selectedId);
    return selectedAddress ? selectedAddress.streetAddress : 'Address not found';
  }

  
  getShipOutMaterialbyID() {
    const paramObject = {
      ShipOutIDId: this.shipoutId,
      locid: this.locId
    };
    this.commonService.getShipOutMaterialbyID(paramObject)
      .subscribe(data => {
          console.log('getShipOutMaterialbyID :: ');
          console.log(data);
          this.ticketObj = data.body.data;

          this.calculateTotal(this.ticketObj);
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

 

  calculateTotal(tickets: any) {
    this.totalNoOfMaterial = tickets.length;
    this.totalGross = tickets.reduce(function (sum:any, tickets:any) {
      return sum + tickets.gross;
    }, 0);
    this.totalTare = tickets.reduce(function (sum:any, tickets:any) {
      return sum + tickets.tare;
    }, 0);
    this.totalNet = tickets.reduce(function (sum:any, tickets:any) {
      return sum + tickets.net;
    }, 0);
    this.totalPrice = tickets.reduce(function (sum:any, tickets:any) {
      return sum + (tickets.net * tickets.price);
    }, 0);
  }

  editTicketDetails() {
    this.isEditModeOn = true;
    this.getAllGroupMaterial();
  }

  deleteItem(item: number) {    
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to remove material?',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      accept: () => {   
        this.ticketObj.splice(item, 1);    
        console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));    
        this.calculateTotal(this.ticketObj);
      },
      reject: () => {       
        return false;
      },
    });
  }

  getAllGroupMaterial() {
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.getAllGroupMaterial(paramObject)
      .subscribe(data => {
          console.log('getAllGroupMaterial :: ');
          console.log(data);
          this.materialList = data.body.data;
          this.copyMaterialData = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  backToMainMaterials() {
    this.mainMaterialsVisible =  true;
    this.materialList =  this.copyMaterialData
  }

  getSubMaterials(materialId: any, selectedMaterial: any, isChangeItemMode: any) {
    if (isChangeItemMode) {
      this.changeItemMaterialsVisible =  false;
    } else {
      this.mainMaterialsVisible =  false;
    }
    this.selectedMaterial = selectedMaterial;

    const paramObject = {
      MaterialID: materialId,
      LocationId: this.locId
    };
    this.commonService.getAllSubMaterials(paramObject)
      .subscribe(data => {
          console.log('getAllSubMaterials :: ');
          console.log(data);
          this.subMaterialList = data.body.data;
          this.copySubMaterialData = data?.body?.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


  confirmSave() {

    
    // this.totalGross = tickets.reduce(function (sum:any, tickets:any) {
    //   return sum + tickets.gross;
    // }, 0);
    // this.totalTare = tickets.reduce(function (sum:any, tickets:any) {
    //   return sum + tickets.tare;
    // }, 0);
    // this.totalNet = tickets.reduce(function (sum:any, tickets:any) {
    //   return sum + tickets.net;
    // }, 0);
       
    // this.isEditModeOn = false;
    this.shipOutDetails.LocID = this.locId;
    this.shipOutDetails.totalGross = this.totalGross;
    this.shipOutDetails.totalTare = this.totalTare;
    this.shipOutDetails.totalNet = this.totalNet;
    this.shipOutDetails.totalAmount = this.totalPrice;
    this.shipOutDetails.shipoutmaterial = this.ticketObj;
    // this.shipOutDetails.customerId = parseFloat(this.sellerId);
    this.shipOutDetails.customerId = this.customerId ? parseFloat(this.customerId) : null;
    this.shipOutDetails.addressID= Number(this.addressId);
    
    
    console.log("Final shipOutDetails :: " + JSON.stringify(this.shipOutDetails));
    
    this.commonService.insertShipOutDTO(this.shipOutDetails).subscribe(data =>{
      if (parseInt(this.shipoutId)) {
        this.isNewShipOut = false;
      } else {
        this.isNewShipOut = true;
      }
      console.log(data); 
      this.shipoutId = data.body;

    
      
      if (this.isReceiptPrint) {
        this.generateShipOutReport();
      }
    },(error: any) =>{  
      console.log(error);  
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
    // setTimeout(this.cancelEditTicket, 2000);
    // this.cancelEditTicket();
    // this.router.navigateByUrl(`${this.orgName}/home`);
  }

  cancelEditTicket() {
   
    
    if (this.shipoutId && this.shipoutId != 0) {
      console.log('11111');
      this.isEditModeOn = false;
      this.editItemCloseImageCapture = false;
      this.processDataBasedOnTicketId();
    } 
    // else {
    //   console.log('222222');
    //   this.router.navigateByUrl(`${this.orgName}/ship-out`);
    // }    
  }

  closePdfReport() {
    this.showDownload = false;    
    this.router.navigateByUrl(`${this.orgName}/ship-out`);
    // if (this.isEditModeOn && this.isNewShipOut) {
    //   this.router.navigateByUrl(`${this.orgName}/ship-out`);
    // }
  }

  addItem(materialId: any, materialName: any, selectedMaterial: string, availableStock: any, scrapPrice: any) {
  
    
    this.editItemCloseImageCapture = true;
    this.imageUrl = null;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemAvailableNet = availableStock;
    this.itemPrice = scrapPrice;
    this.itemLeveloperationPerform = this.itemLeveloperationPerform == '' ? 'Add' : this.itemLeveloperationPerform;
    this.itemCodNote = '';      
    this.itemGross = '';
    this.itemTare = '';
    this.totalPrice = '';
    // this.materialNote = '';
    setTimeout(() =>{
      this.focusChildInput()
    },100);
  }

  focusChildInput() {
    this.materialCalculatorComponent.focusInput();
  }  

  updateExistingItem(materialId: any, materialName: string, selectedMaterial: string, availableStock: any) {
    this.isChangeItemOn = false;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemAvailableNet = availableStock;
    this.itemLeveloperationPerform = 'Edit';
  }

  editItem(rowData: any) {
    this.itemRowId = rowData.rowId;
    this.itemLocalRowId = rowData.localRowId;
    this.itemGroupName = rowData.groupName;
    this.itemMaterialName = rowData.materialName;
    this.itemMaterialId = rowData.materialId;
    this.itemGross = rowData.gross;
    this.itemTare = rowData.tare;
    this.itemNet = isNaN(rowData.net) ?  0 : rowData.net;
    this.itemPrice = rowData.price;

    this.itemAvailableNet = rowData?.availableMaterialStock + this.itemNet;
    this.itemMaterialPrice = rowData?.price;

    this.editItemCloseImageCapture = true;
    this.itemLeveloperationPerform = 'Edit';
    
  }

  calculateNet() {
    const netQty = this.itemGross - this.itemTare
    this.itemNet = isNaN(netQty) ?  0 : netQty;
  }

  clickOnChangeItem() {
    this.isChangeItemOn = true;
  }

  backToChangeItemMainMaterials() {
    this.changeItemMaterialsVisible =  true;
    this.materialList =  this.copyMaterialData;
  }

  calculation(rowData:any){
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemGross = rowData.itemGross;
    this.itemTare = rowData.itemTare;
    const netQty = this.itemGross - this.itemTare
    this.itemNet = isNaN(netQty) ?  0 : netQty;
    this.itemAvailableNet = rowData.itemAvailableNet;
    this.itemPrice = rowData.itemPrice;
    this.materialNote = rowData.materialNote;
    this.updateExistingItemDataResponse();
  }

  changeItem() {
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
  }


  updateExistingItemDataResponse() {

    if (this.itemLeveloperationPerform === 'Add') {
      const net = parseFloat(parseFloat(this.itemGross.toString()).toFixed(3)) - parseFloat(parseFloat(this.itemTare.toString()).toFixed(3));
      let rowData = {
        rowId : 0,
        localRowId : this.localRowIdCounter++,
        groupName : this.itemGroupName,
        materialName : this.itemMaterialName,
        materialId : this.itemMaterialId,
        gross : parseFloat(parseFloat(this.itemGross.toString()).toFixed(3)),
        tare : parseFloat(parseFloat(this.itemTare.toString()).toFixed(3)),
        net : net,
        price : parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3)),
        amount : (net * parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3))),
        note : (this.materialNote || this.materialNote == '' ? this.materialNote : null)
      };   

      this.ticketObj.push(rowData);
      // this.ticketObj = arr;

    } else if (this.itemLeveloperationPerform === 'Edit') {   

      this.ticketObj.forEach((rowData: any) => {
        if (this.itemLocalRowId === rowData.localRowId) {
          console.log("found " + rowData.rowId);     
          // rowData.rowId = this.itemRowId;
          rowData.groupName = this.itemGroupName;
          rowData.materialName = this.itemMaterialName;
          rowData.materialId = this.itemMaterialId;
          rowData.gross = parseFloat(parseFloat(this.itemGross.toString()).toFixed(3));
          rowData.tare = parseFloat(parseFloat(this.itemTare.toString()).toFixed(3));
          rowData.net = rowData.gross - rowData.tare ;
          rowData.price= parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
          rowData.amount= rowData.net * parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
          rowData.note = (this.materialNote || this.materialNote == '' ? this.materialNote : null);
        }
      });
      this.itemLeveloperationPerform = '';

    }

    console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));
    
    this.calculateTotal(this.ticketObj);
    this.backToChangeItemMainMaterials();
    this.backToMainMaterials();
    this.itemGross = '';
    this.itemTare = '';
    this.itemPrice = '';
    this.materialNote = '';

  }

  getPromoStyles(ticket: any) {
    if (ticket.codNote == ''  && ticket.materialNote == '' ) {
      return {
        'border-bottom': '1px solid black'
      };
    } 
    return { 'border-bottom': 'none !important' }
  }
  

  generateShipOutReport() {
    this.isReportShow =true;
    this.showLoaderReport = true;

     const param = {
      ShipOutId: this.shipoutId,
      LocationId: this.locId
    }

    this.commonService.getShipOutReportByID(param)
      .subscribe(data => {
        console.log('getShipOutReportByID :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Shipout Report "+this.shipoutId)
        }

        //this.showDownload = true;
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }


}
