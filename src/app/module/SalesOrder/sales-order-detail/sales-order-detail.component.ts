import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';


import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { StorageService } from 'src/app/core/services/storage.service';
import { PriceCalculatorComponent } from '../../shared/commonshared/price-calculator/price-calculator.component';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tick } from '@angular/core/testing';
import { driver } from 'src/app/core/model/driver.model';
import { HelperService } from 'src/app/core/services/helper.service';
import { TemplatePrintService, PrintData } from 'src/app/core/services/template-print.service';
import { SalesOrder } from 'src/app/core/model/sales-order.model';
import { SalesOrderItem } from 'src/app/core/model/sales-order-item.model';
@Component({
  selector: 'app-sales-order-detail',
  templateUrl: './sales-order-detail.component.html',
  styleUrls: ['./sales-order-detail.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class SalesOrderDetailComponent implements OnInit {
  [x: string]: any;
  @ViewChild('htmlData') htmlData!: ElementRef;

  showCalculator = false;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;

  currentRoute: string = '';

  cheight = '50vh';

  isHoldTrue: boolean = false;

  selectedHoldAmount = 'Partial Pay Amount'


  ticketObj: any = [];
  holdticketObj: any = [];
  orgName: any;
  sellerId: any;
  addressId:number=0;
  ticketId: any;
  dispatchID: any;
  currencyCode: string = '';

  locId: any;
  logInUserId: any;
  locationName: any;
  showImage = false;

  ticketData: any = {};
  customer: any;
  user: any;
  addressName: string = ''; // To store personal seller's address
  selectedBusinessAddressID: number = 0;
  totalNoOfMaterial: any;
  totalGross: any;
  totalTare: any;
  totalNet: any;
  totalAmount: any;
  totalAdjustment: any;
  totalActualAmount: any;
  totalRoundingAmount: any = 0;

  isEditModeOn = false;
  materialList: any;
  subMaterialList: any;
  mainMaterialsVisible = true;
  changeItemMaterialsVisible = true;
  selectedMaterial = '';
  editItemVisible = false;
  editItemCloseImageCapture = false;
  modalHeader = '';
  adminAdvertisement!:  string | null;

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
  itemNet: any = 0;
  itemPrice: any;
  itemImagePath: string = 'assets/images/custom/id_scan.png';
  itemDefaultImagePath: string = 'assets/images/custom/id_scan.png';
  materialNote: any = null;
  itemCodNote: any = null;
  itemLeveloperationPerform: string = '';
  localRowIdCounter: number = 0;
  nextItemLocalRowId: number = 1;


  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  isCODRequired = false;
  dCamera:any; 

  ticketsTransactions: any;
  defaultSelectedTicketsTypes = [
    { name: 'OPEN', code: 'OPEN' },
    { name: 'Partially Paid', code: 'Partially Paid' },
    { name: 'ON HOLD', code: 'ON HOLD' }
  ];


  transactionPaymentType: any = [];



  /**Print out Variable */
  activeSection: string = '';

  payAmount: number = 0;
  selectedPayAmount: number = 0;
  remainingAmount: number = 0;
  totalHoldAmount: number = 0;
  selectedCheckDate: any;
  checkNumber: string = '';
  ePaymentType: string = '';


  addEditAdjustmentVisible = false;
  modalAdjustmentHeader = 'Add Adjustment';
  adjustmentList: any;
  adjustmentAmount = '';
  adjustmentNote = '';
  selectedAdjustment = 'Certified Destruction Cost ';
  selectedRowObj: any;
  saveConfirmVisible = false;
  paymentVisible = false;
  isReceiptPrint = false;
  signCaptureType = 'Using Signature Pad';
  signaturePadVisible = false;
  sellerSignatureImagePath: any = null;

  fileDataObj: any;
  showDownload = false;
  showLoaderReport = false;
  pdfViwerTitle = 'Ticket Receipt';
  isCheckPrint = false;
  checkAmount = 0;
  isLoading = false;
  systemInfo: any;
  signPadVisible = false;  
  isRounding = true;
  isEnable = true;
  isVirtual = false;

  alertVisible = false;
  alertMessage: any;
  subScriptionType:any;
  currentRole: any;

  dialogPopupVisible: boolean = false;
  sellerLoader: boolean = false;
  searchSellerInput: any = '';

  addSellerPopupVisible = false;
  sellerForm!: FormGroup;
  sellerType: string = 'Personal';
  
  driverDetails!: driver;
  newDriverScreenVisible = false;
  isBuniessUser = false;
  addresses: any[] = [];
  isBusiness: boolean = false;

  uploadDialogVisible: boolean = false;
  // selectedItemForUpload: TicketItem | null = null;
  ticketImages: string[] = [];
  description: string = '';
  type: number = 0;
  selectedImagesPreview: string[] = [];
  // materialDocumentsList: TicketDocument[] = [];
  ticketMaterialDocumentsList:string[] = [];
  displayDocumentPopup: boolean = false;
  editingIndex: number | null = null;
  existingImageUrl: string | null = null;
  editingRowId: number | null = null;





  confirmZeroAmountVisible: boolean = false;
  isZeroAmountConfirmedPaid = false;

  isScaleMaterialPriceLimit: boolean = false;
  materialPriceLimit: number = 10;
  originalItemPrice: number = 0;
  itemMarketPrice: number  = 0;


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

  backUrl = '';

  printCheckNo!:string;
  checkVisible = false;
  
  showImageHeader = 'Show image';
  selectedImageUrl: any;
  
  numberFormat: string = '1.3-3';
  defaultCurrencyCode: string = 'USD';

  @ViewChild(PriceCalculatorComponent) priceCalculatorComponent!: PriceCalculatorComponent;
  @ViewChild('searchMaterialInput' , { static: false }) searchMaterialInput!: ElementRef;

  @ViewChild('searchsubMaterialInput' , { static: false }) searchsubMaterialInput!: ElementRef;
  copyMaterialData:any[]  = [];
  copySubMaterialData:any[]  = [];
 
  checkTabView: boolean = false;
  uploadingLoader: boolean = false;

  currentAdvanceAmount: number = 0;
  isBusinessOwnerName: boolean = false;
  businessOwnerName: string = '';
  originalCustomerName: string = '';
  itemIsHold: boolean = false;
  cashPaymentLimit: number = 0;
  isCheckOnlyPayment: boolean = false; 

  showConfirmLeavePopup: boolean = false;
  pendingNavigationUrl: string | null = null;

  showHoldConfirmDialog: boolean = false;
  holdConfirmationMessage: string = '';
  isConfirmDialogVisible: boolean = false;
  isViewShip: boolean = false;
  shipOutMaterials: any[] = [];




  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authService: AuthService,
    private messageService: MessageService,
    private stroarge: StorageService,
    private dataService: DataService,
    private helperService:HelperService,    
    private confirmationService: ConfirmationService,
    private templatePrintService: TemplatePrintService,
    public commonService: CommonService) { 
      this.currentRoute = this.route.snapshot.url.join('/');
    }
    
    

  ngOnInit() {
    this.driverDetails = new driver();
    this.checkTabView = this.helperService.isTab();
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.route.url.subscribe(url => {
      this.currentRoute = url.join('/');
    });

    console.log(this.currentRoute);
  
    window.addEventListener('afterprint', this.afterPrintHandler);
    this.currentRole = this.authService.userCurrentRole();

    this.orgName = localStorage.getItem('orgName');
    this.subScriptionType = this.dataService.getActivePlan();


    const mCamera =  localStorage.getItem('metarialCamera') ;
    if(mCamera) {
      this.dCamera = mCamera;
    }


    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.defaultCurrencyCode = localStorage.getItem('currencyCode') || 'USD';
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.route.params.subscribe((param) => {
      this.ticketId = param["ticketId"];
      this.sellerId = param["customerId"];
      this.route.queryParams.subscribe(params => {
        this.dispatchID = params['dispatchID'];
        this.currencyCode = params['currencyCode'];
        this.currencySymbol = params['currencySymbol'];
        this.salesOrderId = Number(param["salesOrderId"]);
        const type = params['type']; 
        this.isViewShip = (type === 'viewship');

      if (this.isViewShip) {
        console.log('ViewShip mode detected');
        this.getShipOutMaterials(this.salesOrderId);
      } else {
        this.getSalesOrderMaterials(this.salesOrderId);
      }

        console.log(this.currencySymbol);
      });
      this.getAllGroupMaterial();
      this.getSellerById();
      this.getSalesOrderById();
      // this.getSalesOrderMaterials(this.salesOrderId);
      this.processDataBasedOnTicketId();  
       // Initialize driver details for new sales order
    this.driverDetails = this.dataService.getNewDriverDetail();
    this.salesOrderData = this.salesOrderData || new SalesOrder();
    this.salesOrderData.carrier = this.driverDetails?.carrier || '';
    this.salesOrderData.driverLicense = this.driverDetails?.driverlicense || '';
    this.salesOrderData.licensePlate = this.driverDetails?.licenseplate || '';
    this.salesOrderData.truck = this.driverDetails?.truck || '';
    this.salesOrderData.make = this.driverDetails?.make || '';
    this.salesOrderData.model = this.driverDetails?.model || '';
    this.salesOrderData.driverName = this.driverDetails?.driverName || '';
    this.salesOrderData.note = this.driverDetails?.note || '';
    this.dataService.setNewDriverDetail(new driver());    
    });

    this.route.queryParams.subscribe(params => {
      const types  = params['type'];
      if(types=='seller'){
        this.backUrl = `/${this.orgName}/sellers-buyers`;
      }else{
        this.backUrl = `/${this.orgName}/home`; 
      }
    });

    this.sellerForm = this.fb.group({
      firstName : ['',Validators.required],
      sellerType:[this.sellerType],
      middleName : [''],
      lastName : ['']
    });

    // this.router.events.subscribe(event => {
    //   if(event instanceof NavigationStart){
    //     if(this.isEditModeOn && !this.showConfirmLeavePopup){
    //       this.showConfirmLeavePopup = true;
    //       this.pendingNavigationUrl = event.url;
    //       this.router.navigateByUrl(this.router.url, { replaceUrl: true });
    //     }
    //   }
    // })

    if (this.currentRoute.includes('detail/new')) {
      this.salesOrderData = new SalesOrder();
      this.salesOrderData.rowID = 0;
      this.salesOrderData.createdBy = this.logInUserId;
      this.salesOrderData.createdDate = new Date(); 
      this.isEditModeOn = true;              
      this.mainMaterialsVisible = true;      
      this.editItemCloseImageCapture = false; 
      this.getAllGroupMaterial();            
    }
    
    // this.routerEventsSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //    this.TicketEditMode(false);
    //   }
    // });
  }
  searchMaterial(searchTerm:any){

    const inputParms =  searchTerm.target.value.toLowerCase();
    if(inputParms){
      this.materialList = this.copyMaterialData.filter((item:any) => item?.groupName?.toLowerCase().includes(inputParms))
    }else{
      this.materialList = this.copyMaterialData 
    }

  }


//  ShowDriverDeatils() {
//   this.newDriverScreenVisible = true;
// }

  
  searchSubMaterial(searchTerm:any){

    const inputParms =  searchTerm.target.value.toLowerCase();
    if(inputParms){
      this.subMaterialList = this.copySubMaterialData.filter((item:any) => item?.materialName?.toLowerCase().includes(inputParms))
    }else{
      this.subMaterialList = this.copySubMaterialData 
    }

  }


  focusChildInput() {
    this.priceCalculatorComponent.focusInput();
  }


  onContextMenu(event: MouseEvent, obj: any) {
    this.selectedRowObj = obj;
    this.isCODRequired = (obj.codNote != '');
    event.preventDefault();
  }

  addNote(obj: any) {
    this.selectedRowObj = obj;
    // add the Data from Table
    this.itemLocalRowId = this.selectedRowObj?.localRowId;
    this.updateTicketObjectForCOD('Flagged for COD');
  }

  removeCode(obj: any) {
    // remove the Data from Table
    this.selectedRowObj = obj;
    this.itemLocalRowId = this.selectedRowObj.localRowId;
    this.updateTicketObjectForCOD('');
  }

  saveDriverInfo() {    
    this.newDriverScreenVisible = false;
    
    this.salesOrderData = this.salesOrderData || new SalesOrder();
    
    this.salesOrderData.carrier = this.driverDetails?.carrier || '';
    this.salesOrderData.driverLicense = this.driverDetails?.driverlicense || '';
    this.salesOrderData.LicensePlate = this.driverDetails?.licenseplate || '';
    this.salesOrderData.truck = this.driverDetails?.truck || '';
    this.salesOrderData.make = this.driverDetails?.make || '';
    this.salesOrderData.model = this.driverDetails?.model || '';
    this.salesOrderData.driverName = this.driverDetails?.driverName || '';
    this.salesOrderData.note = this.driverDetails?.note || '';
  }

  ShowDriverDeatils() {
    if (this.salesOrderData) {
      this.driverDetails.carrier = this.salesOrderData.carrier || '';
      this.driverDetails.driverlicense = this.salesOrderData.driverLicense || '';
      this.driverDetails.licenseplate = this.salesOrderData.licensePlate || '';
      this.driverDetails.truck = this.salesOrderData.truck || '';
      this.driverDetails.make = this.salesOrderData.make || '';
      this.driverDetails.model = this.salesOrderData.model || '';
      this.driverDetails.driverName = this.salesOrderData.driverName || '';
      this.driverDetails.note = this.salesOrderData.note || '';
    }
    this.newDriverScreenVisible = true;
  }

  hasDriverDetails(): boolean {
    return !!(this.salesOrderData?.driverName || 
              this.driverDetails?.driverName);
  }

  viewDriverDetails() {
    if (this.salesOrderData) {
      this.driverDetails.carrier = this.salesOrderData.carrier || '';
      this.driverDetails.driverlicense = this.salesOrderData.driverLicense || '';
      this.driverDetails.licenseplate = this.salesOrderData.licensePlate || '';
      this.driverDetails.truck = this.salesOrderData.truck || '';
      this.driverDetails.make = this.salesOrderData.make || '';
      this.driverDetails.model = this.salesOrderData.model || '';
      this.driverDetails.driverName = this.salesOrderData.driverName || '';
      this.driverDetails.note = this.salesOrderData.note || '';
    }
    this.newDriverScreenVisible = true;
  }


  isInputValid(input: any): boolean {
    const numberFloatRegex: RegExp = /^-?\d+(\.\d+)?$/;
    return numberFloatRegex.test(input);
  }

  errorAlert(msg:any){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  get isDisabled(): boolean {
    return (this.getTotal() < this.totalAmount);
  }


  editDriverr(){

  }

  getAddressName(addressID: number): string {
    const selectedAddress = this.addresses.find(address => address.rowId === addressID);
    return selectedAddress ? selectedAddress.streetAddress : 'N/A';
  }

  getAddressLabel(selectedId: number): string {
    const selectedAddress = this.addresses.find(address => address.rowId === selectedId);
    return selectedAddress ? selectedAddress.streetAddress : 'Address not found';
  }
  

  getAllUsers(userId: any) {
    const reqObj = {
      LocationId: this.locId,
      UserID: parseInt(userId)
    }
    this.commonService.GetAllUsers(reqObj).subscribe((res) => {
      this.user = res?.body?.data[0];
    })
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.getAllTicketsDetails();
  }

  editSeller() {    
    this.dialogPopupVisible = true;
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
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
    // this.router.navigateByUrl(`${this.orgName}/sellers-buyers/add-seller`);
    this.addSellerPopupVisible = true;
  }


  onSubmit() {
    const reqObj = {
      ...this.sellerForm.value,
      ...{ 
        rowId: 0,
        locID: this.locId,
        createdBy: this.logInUserId,
        createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
      }
    }
    console.log(reqObj);
    this.commonService.addSeller(reqObj).subscribe(data =>{
      console.log(data);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller updated Successfully' });
        const sellerFullname = reqObj.firstName + (reqObj.middleName != '' ? ' ' + reqObj.middleName : '') 
        + (reqObj.lastName != '' ? ' ' + reqObj.lastName : '') ;
           
        this.addSellerPopupVisible = false;
        this.sellerForm.patchValue({
          firstName: '',
          middleName: '',
          lastName: ''
        });
        
        this.clickOnSeller(data.body.insertedRow);
      },(error: any) =>{
      console.log(error);
    })

  }

  clickOnSeller(sellerId: any) {
    this.dialogPopupVisible = false;
    this.sellerId = sellerId;
    this.getSellerById();
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

  getSellerById() {
    this.isLoading = true;
    console.log('customerId in getSellerById:', this.customerId); 

    const paramObject = {
      ID: this.sellerId,
      LocationId: Number(this.locId)
    };
      
    this.commonService.getSellerById(paramObject).subscribe({
        next: (data) => {
        console.log('getSellerById :: ');
        console.log(data);
        this.customer = data.body.data;
        //alert(JSON.stringify(this.customer));
        this.customer.fullName = this.customer?.fullName || this.customer?.firstName;
        this.originalCustomerName = this.customer.fullName;
        this.businessOwnerName = this.customer?.businessOwnerName || '';
        //alert(JSON.stringify(this.customer));
        this.isBuniessUser = this.customer.sellerType ==  "Business" ? true : false;
        this.isBusiness = this.customer?.sellerType === 'Business';
        this.currentAdvanceAmount = this.customer?.totalAdvance || 0;

         if (this.ticketId && this.ticketData?.isBusinessOwnerName) {
          this.isBusinessOwnerName = true;
          this.customer.fullName = this.businessOwnerName;
        }

  
        if (this.isBusiness) {
          this.fetchSellerAddresses();
        } else {
          this.addresses = [this.customer.streetAddress];
          // this.isLoading = false;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching seller details:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
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

  calculateTotal(materials: any[]) {
    this.totalGross = materials.reduce((sum, item) => sum + item.gross, 0);
    this.totalTare = materials.reduce((sum, item) => sum + item.tare, 0);
    this.totalNet = materials.reduce((sum, item) => sum + item.net, 0);
    this.totalAmount = materials.reduce((sum, item) => sum + (item.isActive !== false ? item.amount : 0), 0);
  }
  

  editTicketDetails() {
    this.isEditModeOn = true;       
    this.mainMaterialsVisible = true; 
    this.editItemCloseImageCapture = false; 
    this.getAllGroupMaterial(); 
  }

  onConfirmEdit() {
    this.isConfirmDialogVisible = false;
    this.proceedWithEdit();
  }

  onCancelEdit() {
    this.isConfirmDialogVisible = false;
  }

  // private proceedWithEdit() {
  //   this.TicketEditMode(true);
  //   this.isEditModeOn = true; 
  //   // this.getAllGroupMaterial();
  // }

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
    this.mainMaterialsVisible = true;
  }

  getSubMaterials(materialId: any, selectedMaterial: any, isChangeItemMode: any) {
    if (isChangeItemMode) {
      this.changeItemMaterialsVisible = false;
    } else {
      this.mainMaterialsVisible = false;
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

  saveSalesOrderDetails() {
    this.salesOrderData = this.salesOrderData || new SalesOrder();

    const totalAmount = this.ticketObj.reduce((sum: number, item: any) => sum + item.amount, 0);

    const payload = {
      rowID: this.salesOrderData.rowID || 0,   
      customerID: +this.sellerId,
      locID: this.locId,
      status: totalAmount === 0 ? 'PENDING' : 'OPEN',
      totalAmount: parseFloat(totalAmount.toFixed(3)),
      createdBy: this.salesOrderData.rowID ? this.salesOrderData.createdBy : this.logInUserId,
      updatedBy: this.logInUserId,
      carrier: this.salesOrderData.carrier || '',
      driverLicense: this.salesOrderData.driverLicense || '',
      licensePlate: this.salesOrderData.licensePlate || '',
      truck: this.salesOrderData.truck || '',
      make: this.salesOrderData.make || '',
      model: this.salesOrderData.model || '',
      driverName: this.salesOrderData.driverName || '',
      note: this.salesOrderData.note || '',
      lstSalesOrderMaterials: this.ticketObj.map((item: any) => ({
        rowID: item.rowID || 0,
        materialId: item.materialId,
        gross: parseFloat(item.gross),
        tare: parseFloat(item.tare),
        net: parseFloat(item.net),
        price: parseFloat(item.price),
        amount: parseFloat(item.amount),
        materialNote: item.materialNote || '',
        isActive: item.isActive !== false,
        createdBy: item.rowID ? item.createdBy : this.logInUserId,
        updatedBy: this.logInUserId
      }))
    };

    console.log('Payload:', payload);

    this.commonService.InsertUpdateSalesOrder(payload).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);

      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sales Order saved successfully' });
      this.isEditModeOn = false;
      setTimeout(() => {
        this.router.navigateByUrl(`/${this.orgName}/sales-order`);
      }, 1500);
      // this.router.navigateByUrl(`/${this.orgName}/sales-order`);

      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save Sales Order' });
      }
    });
  }
  cancelEditTicket() {
    this.router.navigateByUrl(`${this.orgName}/sales-order`);
  }
  
  addItem(materialId: any, materialName: any, selectedMaterial: string, scrapPrice: any) {
    this.modalHeader = 'Add Item Details';
    this.editItemVisible = false;
    this.editItemCloseImageCapture = false;
    this.imageUrl = null;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemPrice = scrapPrice;
    this.originalItemPrice = scrapPrice;
    this.itemLeveloperationPerform = this.itemLeveloperationPerform == '' ? 'Add' : this.itemLeveloperationPerform;
    this.itemCodNote = '';    
    this.itemGross = '';
    this.itemTare = '';
    this.itemImagePath = '';
    const material = this.subMaterialList.find((item: any) => item.rowId === materialId);
    this.itemMarketPrice = material?.marketPrice || null;
    this.itemIsHold = material?.isHold || false; 
    this.itemHoldDays = material?.holdDays || 0; 
    this.closeCapturedImage(1)
    // this.materialNote = '';
    //  this.materialSlide = false;
  }

  openMaterialSlide() {
    this.materialSlide = true;
    this.mainMaterialsVisible = true;
  }

  calculatePrice(item: any){
    if (!this.customer || !this.customer.dealerType) {
      return item.scrapPrice;
    }

    const dealerNumber = parseInt(this.customer.dealerType.split(' ')[1]);

    const dealerPrice = item[`dealerPrice${dealerNumber}`] || 0;
    const dealerType = item[`dealerType${dealerNumber}`];
    
    if (dealerType === 'D') {
      return item.scrapPrice + dealerPrice;
    } else if (dealerType === 'P') {
      const percentageAmount = item.scrapPrice * (dealerPrice / 100);
      return item.scrapPrice + percentageAmount;
    }
    
    return item.scrapPrice;
  }

  updateExistingItem(materialId: any, materialName: string, selectedMaterial: string, scrapPrice: any) {
    this.isChangeItemOn = false;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemPrice = scrapPrice;
    this.itemLeveloperationPerform = 'Edit';
  }

  editItem(rowData: any) {
     this.materialSlide = true;
    this.clearMaterialCalculatorData(); 
    this.editItemCloseImageCapture = true;
    this.mainMaterialsVisible = false;    
    this.isEditModeOn = true;            

    this.itemLeveloperationPerform = 'Edit';
    this.itemRowId = rowData.rowID;
    this.itemLocalRowId = rowData.localRowId;
    this.itemGroupName = rowData.groupName;
    this.itemMaterialName = rowData.materialName;
    this.itemMaterialId = rowData.materialId;
    this.itemGross = rowData.gross;
    this.itemTare = rowData.tare;
    this.itemNet = rowData.net;
    this.itemPrice = rowData.price;
    this.itemImagePath = rowData.imagePath;
    this.materialNote = rowData.materialNote;
  }



  private clearMaterialCalculatorData() {
    this.itemPrice = null;
    this.itemNet = null;
    this.itemTare = null;
    this.itemGross = null;
    this.itemGroupName = '';
    this.itemMaterialName = '';
    this.materialNote = '';
    this.itemImagePath = '';
    this.imageUrl = null;
  }

  deleteItem(index: number) {
    this.ticketObj.splice(index, 1);
    this.calculateTotal(this.ticketObj); 
  }


  calculateNet() {
    const netQty = this.itemGross - this.itemTare
    this.itemNet = isNaN(netQty) ?  0 : netQty;
  }

  closeCapturedImage(imagetype: number) {
    if (imagetype == 1) {
      this.editItemVisible = false;
      this.editItemCloseImageCapture = true;
      setTimeout(() =>{
        this.focusChildInput()
      },100)
    } else if (imagetype == 7) {
      console.log('Capture Adjustment image');
    } else if (imagetype == 8) {
      console.log('Close Signature pad');
      // this.saveConfirmVisible = true;
      if (this.signaturePadVisible === true) {
        this.signaturePadVisible = false;
      } else {        
        this.signPadVisible = false;     
      }
    }
  }

  backToCapturedImage() {
    this.editItemCloseImageCapture = false;
    this.isChangeItemOn = false;
  }

  handleImage(imageUrl: string) {
    this.imageUrl = imageUrl;
    this.SaveImage(7);
  }


  captureImage(imageUrlString: string){
    this.itemImagePath = imageUrlString
  }

  setSignature($event: any) {
    this.imageUrl = $event;
    this.SaveImage(8);
    this.signaturePadVisible = false;
  }
  
  
  SaveImage(type: number) {

    let requestObj: any = {

      organisationName: this.orgName,
      locationName: this.locationName,
      imagetype: type,
      base64Data: this.imageUrl?.split(';base64,')[1]
    };

    // this.itemImagePath = this.imageUrl;

    this.commonService.FileUploadFromWeb(requestObj).subscribe((res: any) => {
      console.log('Image url path :: {}', res.body.data);
      console.log(res.body.data);
      this.imageUrl = res.body.data;
      if (type == 1 || type == 7) {
        this.itemImagePath = this.imageUrl;
      }else if (type == 11 && this.selectedItemForUpload) {
        console.log("File uploaded for type 11");
        if (this.selectedItemForUpload.materialDocumentsImages) {
          this.selectedItemForUpload.materialDocumentsImages += ',' + this.imageUrl;
      } else {
          this.selectedItemForUpload.materialDocumentsImages = this.imageUrl;
      }
      this.selectedItemForUpload.documentDescription = this.description;

      // Updating the display images array 
      this.ticketImages = this.selectedItemForUpload.materialDocumentsImages.split(',');        
      } else {
        this.sellerSignatureImagePath = this.imageUrl;
        this.saveTicketDetails(this.payAmount, this.isReceiptPrint);
      }
      // this.imageUrl = null;
    },
    (err: any) => {
      //if error occurs while saving the signature
      if (type == 8) {
        console.log('error occurs while saving the signature');
        this.sellerSignatureImagePath = null;
        this.saveTicketDetails(this.payAmount, this.isReceiptPrint);
      }
    })

    this.imageUrl = null;
    this.closeCapturedImage(type);
  }

  clickOnChangeItem() {
    this.isChangeItemOn = true;
  }

  backToChangeItemMainMaterials() {    
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemLeveloperationPerform = '';  
    this.materialList =  this.copyMaterialData;
    this.subMaterialList =  []; 
    // this.editItemVisible = false;
    //this.changeItemMaterialsVisible = true;
  }

  
  calculation(rowData: any) {
    console.log('Calculation data ::');
    console.log(rowData);
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemGross = rowData.itemGross;
    this.itemTare = rowData.itemTare;
    const netQty = this.itemGross - this.itemTare
    this.itemNet = isNaN(netQty) ?  0 : netQty;
    this.itemPrice = rowData.itemPrice;
    this.materialNote = rowData.materialNote;
    this.itemImagePath = rowData.itemImagePath;
    this.updateExistingItemDataResponse();
  }

  changeItem() {
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemLeveloperationPerform = 'Edit';
  }

  changeImage() {
    this.modalHeader = 'Edit Item Details';
    this.editItemVisible = true;

    // this.editItemCloseImageCapture = false;
    this.itemLeveloperationPerform = 'Edit';
  }


  updateExistingItemDataResponse() {

    this.editItemVisible = false;

    if (this.itemLeveloperationPerform === 'Add') {
      // const arr = [];
      const rowData = new SalesOrderItem();
      rowData.rowID = 0;
      rowData.localRowId = this.localRowIdCounter++;
      rowData.groupName = this.itemGroupName;
      rowData.materialName = this.itemMaterialName;
      rowData.materialId = this.itemMaterialId;
      rowData.gross = parseFloat(parseFloat(this.itemGross.toString()).toFixed(3));
      rowData.tare = parseFloat(parseFloat(this.itemTare.toString()).toFixed(3));
      rowData.net = rowData.gross - rowData.tare;
      rowData.price = parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
      rowData.amount = parseFloat(parseFloat((rowData.price * (rowData.gross - rowData.tare)).toString()).toFixed(3));
      // rowData.imagePath = (this.itemImagePath?.indexOf('assets/images') >= 0 ? null : this.itemImagePath);
      // rowData.codNote = '';
      rowData.materialNote = (this.materialNote || this.materialNote == '' ? this.materialNote : '' );
      // rowData.isHold = this.itemIsHold;



      // rowData.createdBy = this.logInUserId;
      // rowData.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      // rowData.updatedBy = this.logInUserId;
      // rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      // rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      // rowData.isHold = this.itemIsHold;

      this.ticketObj.push(rowData);
      // this.ticketObj = arr;
       this.materialSlide = false;

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
          rowData.net = rowData.gross - rowData.tare;
          rowData.price = parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
          rowData.amount = parseFloat(parseFloat((rowData.price * (rowData.gross - rowData.tare)).toString()).toFixed(3));
          rowData.imagePath = (this.itemImagePath?.indexOf('assets/images') >= 0 ? null : this.itemImagePath);
          rowData.codNote = this.itemCodNote;
          rowData.materialNote = (this.materialNote || this.materialNote == '' ? this.materialNote : null);

          // TO DO:: does not required. need to verify;
          rowData.updatedBy = this.logInUserId;
          rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
          rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
        }
      });
      this.itemLeveloperationPerform = '';
      this.materialSlide = false;
    }

    console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));

    this.calculateTotal(this.ticketObj);
    this.updateHoldStatus();
    this.backToChangeItemMainMaterials();
    this.backToMainMaterials();
    this.itemGross = '';
    this.itemTare = 0;
    this.materialNote = '';

  }

  getPromoStyles(ticket: any) {
    if (ticket.codNote == '' && ticket.materialNote == '') {
      return {
        'border-bottom': '1px solid black'
      };
    }
    return { 'border-bottom': 'none !important' }
  }


  closeTicket() {
    console.log('close');
    this.paymentVisible = false;
    this.transactionPaymentType = [];
  }
  
  convertNumberToWords(amount: any) {
    var words = new Array();
    words[0] = 'Zero';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j] as any);
                    n_array[i] = 0;
                }
            }
        }
      let  value;
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }

  

  showSelectedImage(imageUrl: string, selectionType:any) {
    this.selectedImageUrl = imageUrl;
    this.showImage = true;
    if(selectionType=='1') {
      this.showImageHeader = 'Show Material Image';
    } else if(selectionType=='2') {
      this.showImageHeader = 'Show seller photo';
    } else if (selectionType == '11') {
      this.showImageHeader = 'Ticket Document image';
    }
  }

  cancelImage() {
    this.showImage = false;
  }

  getSalesOrderById() {
    const paramObject = {
      RowID: this.salesOrderId
    };
    this.commonService.GetSalesOrderById(paramObject).subscribe({
      next: (res: any) => {
        this.salesOrderData = res.body.data;
        console.log('Sales Order Details:', this.salesOrderData);
        if (this.salesOrderData) {
        this.driverDetails.carrier = this.salesOrderData.carrier || '';
        this.driverDetails.driverlicense = this.salesOrderData.driverLicense || '';
        this.driverDetails.licenseplate = this.salesOrderData.licensePlate || '';
        this.driverDetails.truck = this.salesOrderData.truck || '';
        this.driverDetails.make = this.salesOrderData.make || '';
        this.driverDetails.model = this.salesOrderData.model || '';
        this.driverDetails.driverName = this.salesOrderData.driverName || '';
        this.driverDetails.note = this.salesOrderData.note || '';
      }
      },
      error: (err) => {
        console.error('Error fetching sales order by ID', err);
      }
    });
  }


  getSalesOrderMaterials(salesOrderID: number) {
    this.isLoading = true;

    const paramObj = { 
      RowID: salesOrderID 
    }; 

    this.commonService.GetSalesOrderMaterialsBySalesOrderID(paramObj).subscribe({
      next: (res: any) => {
        console.log('API Response:', res); 
        this.ticketObj = res?.body?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching sales order materials', err);
        this.isLoading = false;
      }
    });
  }

  getShipOutMaterials(salesOrderID: number) {
    this.isLoading = true;

    const paramObj = { 
      SalesOrderID: salesOrderID 
    }; 
    this.commonService.GetShipOutsMaterialsBySalesOrderID(paramObj).subscribe({
      next: (res: any) => {
        console.log('ShipOut Materials Response:', res);
        this.shipOutMaterials = res?.body?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching ShipOut materials', err);
        this.isLoading = false;
      }
    });
  }


}
