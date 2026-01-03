import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

// import JsBarcode from 'jsbarcode';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { TicketItem } from 'src/app/core/model/ticket-item.model';
import { TicketDocument } from 'src/app/core/model/ticket-document.model';
import { Ticket } from 'src/app/core/model/ticket.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { PriceCalculatorComponent } from '../../shared/commonshared/price-calculator/price-calculator.component';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tick } from '@angular/core/testing';
import { driver } from 'src/app/core/model/driver.model';
import { HelperService } from 'src/app/core/services/helper.service';
import { TemplatePrintService, PrintData } from 'src/app/core/services/template-print.service';
import { CashDrawerTransaction } from 'src/app/core/model/cash-drawer-transaction.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class TicketDetailComponent implements OnInit {
  [x: string]: any;
  @ViewChild('htmlData') htmlData!: ElementRef;

  showCalculator = false;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;

  currentRoute: string = '';

  cheight = '50vh';

  isHoldTrue: boolean = false;

  selectedHoldAmount = 'Partial Pay Amount'

  // Metal Detection Variables
  isMetalDetectionEnabled: boolean = false;
  materialsLoading = false;
  showMlPredictionDialog = false;
  showManualAddDialog = false;
  mlPredictions: any[] = [];
  manualMaterialName: string = '';

  private allMaterials: any[] = [];


  ticketObj: any = [];
  holdticketObj: any = [];
  orgName: any;
  ticketsTicketID: any;
  ticketsParentID: any;
  sellerId: any;
  addressId: number = 0;
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
  adminAdvertisement!: string | null;

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
  dCamera: any;
  showBarcodeDialog: boolean = false;
  selectedTicket: any = null;
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
  subScriptionType: any;
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
  selectedItemForUpload: TicketItem | null = null;
  ticketImages: string[] = [];
  description: string = '';
  type: number = 0;
  selectedImagesPreview: string[] = [];
  materialDocumentsList: TicketDocument[] = [];
  ticketMaterialDocumentsList: string[] = [];
  displayDocumentPopup: boolean = false;
  editingIndex: number | null = null;
  existingImageUrl: string | null = null;
  editingRowId: number | null = null;





  confirmZeroAmountVisible: boolean = false;
  isZeroAmountConfirmedPaid = false;

  isScaleMaterialPriceLimit: boolean = false;
  materialPriceLimit: number = 10;
  originalItemPrice: number = 0;
  itemMarketPrice: number = 0;


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
    label: 'New Customer'
  }
  ];

  backUrl = '';

  printCheckNo!: string;
  checkVisible = false;

  showImageHeader = 'Show image';
  selectedImageUrl: any;

  numberFormat: string = '1.3-3';
  defaultCurrencyCode: string = 'USD';

  @ViewChild(PriceCalculatorComponent) priceCalculatorComponent!: PriceCalculatorComponent;
  @ViewChild('searchMaterialInput', { static: false }) searchMaterialInput!: ElementRef;

  @ViewChild('searchsubMaterialInput', { static: false }) searchsubMaterialInput!: ElementRef;
  copyMaterialData: any[] = [];
  copySubMaterialData: any[] = [];

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

  purchaseOrderMaterialsDropdown: any[] = [];
  selectedPurchaseOrderMaterialID: number = 0;
  selectedPurchaseOrderID: number = 0;
  isTruckScale: boolean = false;
  tagHoldVisible: boolean = false;
  tagHoldDate: any;
  tagHoldReason: string = '';
  minDate: string = '';
  purchaseOrderPopupVisible: boolean = false;
  ticketScaleTypeList: any[] = [];
  selectedScaleTypeId: number = 0;



  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authService: AuthService,
    private messageService: MessageService,
    private stroarge: StorageService,
    private dataService: DataService,
    private helperService: HelperService,
    private confirmationService: ConfirmationService,
    private templatePrintService: TemplatePrintService,
    public commonService: CommonService,
    private http: HttpClient
  ) {
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

    // Set Camera
    const mCamera = localStorage.getItem('metarialCamera');
    if (mCamera) {
      this.dCamera = mCamera;
    }

    // Parse System Info
    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      const isElectronic = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'iselectronicpayment')[0];
      this.systemInfo = isElectronic?.values;

      const checkKeyboard = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'isvirtualkeyboard')[0];
      this.isVirtual = checkKeyboard?.values == 'True' ? true : false;

      const isSignatureOnReceipt = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'signatureonreceipt')[0];
      this.signPadVisible = (isSignatureOnReceipt?.values.toLowerCase() === "true");

      const isRounding = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'isrounding')[0];
      this.isRounding = (isRounding?.values.toLowerCase() === "true");

      const isTicketDocuments = _dataObj.filter((item: any) => item?.keys?.toLowerCase() === 'isticketdocuments')[0];
      this.isTicketDocumentsEnabled = (isTicketDocuments?.values.toLowerCase() === 'true');

      const isScalePriceLimit = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'isscalematerialpricelimit')[0];
      this.isScaleMaterialPriceLimit = (isScalePriceLimit?.values.toLowerCase() === 'true');

      const materialPriceLimit = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'materialpricelimit')[0];
      this.materialPriceLimit = materialPriceLimit ? parseInt(materialPriceLimit.values) : 10;

      const iscustomeradvance = _dataObj.filter((item: any) => item?.keys?.toLowerCase() === 'iscustomeradvance')[0];
      this.IsCustomerAdvanceEnabled = (iscustomeradvance?.values.toLowerCase() === 'true');

      const isCustomerFacePicture = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'iscustomerfacepicture');
      this.IsCustomerFacePictureEnabled = String(isCustomerFacePicture?.values).toLowerCase() === 'true';

      const UseCheckTemplate = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'usechecktemplate');
      this.IsUseCheckTemplateEnabled = String(UseCheckTemplate?.values).toLowerCase() === 'true';

      const isAImetalDetection = _dataObj.find((item: any) => item?.keys?.toLowerCase() === 'isaimetaldetection');
      this.IsAIMetalDetectionEnabled = String(isAImetalDetection?.values).toLowerCase() === 'true';
    }

    // --- CRITICAL FIX: Initialize locId BEFORE calling fetchAllMaterials ---
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    // ----------------------------------------------------------------------

    this.defaultCurrencyCode = localStorage.getItem('currencyCode') || 'USD';
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');

    // --- Metal Detection Initialization (Moved Here) ---
    const storedDetectionState = localStorage.getItem('isMetalDetectionEnabled');
    this.isMetalDetectionEnabled = storedDetectionState === 'true';

    // Now that this.locId is set, this call will work
    if (this.IsAIMetalDetectionEnabled) {
      this.fetchAllMaterials();
    }
    // -------------------------------------------------

    this.route.params.subscribe((param) => {
      this.ticketId = param["ticketId"];
      this.sellerId = param["customerId"];
      this.route.queryParams.subscribe(params => {
        this.dispatchID = params['dispatchID'];
        this.PickupID = params['PickupID'];
        this.currencyCode = params['currencyCode'];
        this.currencySymbol = params['currencySymbol'];
        console.log(this.currencySymbol);
      });
      if (this.ticketData) {
        this.ticketData.currencyCode = this.currencyCode;
        this.ticketData.currencySymbol = this.currencySymbol;
      }
      const drawerJson = localStorage.getItem('selectedCashDrawer');
      if (drawerJson) {
        this.selectedCashDrawer = JSON.parse(drawerJson);
      }

      this.activeDrawerId = localStorage.getItem('selectedCashDrawerId')
        ? parseInt(localStorage.getItem('selectedCashDrawerId')!, 10)
        : (this.selectedCashDrawer ? this.selectedCashDrawer.drawerID : 1);

      this.getSellerById();
      this.processDataBasedOnTicketId();
      this.GetAllAdjustmentType();
      this.getTicketTransactions();
      this.getAllTicketScaleTypes();
    });

    this.route.queryParams.subscribe(params => {
      const types = params['type'];
      if (types == 'seller') {
        this.backUrl = `/${this.orgName}/sellers-buyers`;
      } else {
        this.backUrl = `/${this.orgName}/home`;
      }
    });

    this.sellerForm = this.fb.group({
      firstName: ['', Validators.required],
      sellerType: [this.sellerType],
      middleName: [''],
      lastName: ['']
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.isEditModeOn && !this.showConfirmLeavePopup) {
          this.showConfirmLeavePopup = true;
          this.pendingNavigationUrl = event.url;
          this.router.navigateByUrl(this.router.url, { replaceUrl: true });
        }
      }
    })
    const savedType = localStorage.getItem('signCaptureType');
    this.signCaptureType = savedType ? savedType : 'Using Signature Pad';
  }

  TicketEditMode(editFlag: boolean) {
    const paramObject = {
      TicketID: this.ticketId,
      Flag: editFlag,
      UserID: this.logInUserId,
      Role: this.currentRole
    };
    this.commonService.ticketEditMode(paramObject).subscribe(data => {
      console.log('ticketEditMode :: ');
      console.log(data);
    },
      (err: any) => {
        // this.errorMsg = 'Error occured';
      }
    );
  }

  searchMaterial(searchTerm: any) {

    const inputParms = searchTerm.target.value.toLowerCase();
    if (inputParms) {
      this.materialList = this.copyMaterialData.filter((item: any) => item?.groupName?.toLowerCase().includes(inputParms))
    } else {
      this.materialList = this.copyMaterialData
    }

  }

  // generateBarcode(ticket: any) {
  //   this.selectedTicket = ticket;     
  // this.showBarcodeDialog = true; 
  // setTimeout(() => {
  //   const canvas = document.getElementById('barcode-popup') as HTMLCanvasElement;
  //   if (canvas) {
  //     const value = ticket.barcodeNumber;
  //     JsBarcode(canvas, value, {
  //       format: 'CODE128',
  //       width: 2,
  //       height: 60,
  //       displayValue: true 
  //     });
  //   }
  // }, 0);
  // }

  //   printBarcode() {
  //  debugger;
  //     this.isReportShow = true;
  //     this.showLoaderReport = true;
  //     const paramObj = { BarcodeNumber: this.selectedTicket.barcodeNumber };

  //     this.commonService.GetMaterialDetailsByBarcode(paramObj).subscribe(
  //        data => {
  //         console.log('GetMaterialDetailsByBarcode Response :: ', data);
  //         this.fileDataObj = data.body.data;

  //         this.showLoaderReport = false;

  //         if(this.checkTabView) {
  //           this.helperService.downloadBase64Pdf(this.fileDataObj,"Dispatch Report " );
  //         }
  //       },
  //         (err: any) => {
  //           this.showLoaderReport = false;
  //         }
  //       );
  //   }

  ShowDriverDeatils() {
    this.newDriverScreenVisible = true;
  }


  searchSubMaterial(searchTerm: any) {

    const inputParms = searchTerm.target.value.toLowerCase();
    if (inputParms) {
      this.subMaterialList = this.copySubMaterialData.filter((item: any) => item?.materialName?.toLowerCase().includes(inputParms))
    } else {
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

  private updateTicketObjectForCOD(itemCodNote: any) {
    this.ticketObj.forEach((rowData: any) => {
      if (this.itemLocalRowId === rowData.localRowId) {
        console.log("found " + rowData.rowId);
        rowData.codNote = itemCodNote;
        rowData.isCOD = itemCodNote != '' ? true : false;

        // TO DO:: does not required. need to verify
        rowData.updatedBy = this.logInUserId;
        rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      }
    });
  }

  private processDataBasedOnTicketId() {
    if (parseInt(this.ticketId)) {
      this.GetTicketMaterialsDetailsByTicketId();
      this.getAllTicketsDetails();
      this.getTicketTransactions();
    } else {
      this.ticketId = 0;
      this.ticketData['createdDate'] = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      this.ticketData['status'] = 'NEW TICKET';
      this.ticketData['paidAmount'] = 0;
      this.ticketData['balanceAmount'] = 0;
      this.ticketData['isCOD'] = false;

      // driver details
      this.driverDetails = this.dataService.getNewDriverDetail();
      this.ticketData['carrier'] = this.driverDetails?.carrier || '';
      this.ticketData['driverlicense'] = this.driverDetails?.driverlicense || '';
      this.ticketData['licenseplate'] = this.driverDetails?.licenseplate || '';
      this.ticketData['truck'] = this.driverDetails?.truck || '';
      this.ticketData['make'] = this.driverDetails?.make || '';
      this.ticketData['model'] = this.driverDetails?.model || '';
      this.ticketData['driverName'] = this.driverDetails?.driverName || '';
      this.ticketData['note'] = this.driverDetails?.note || '';
      this.dataService.setNewDriverDetail(new driver());

      this.ticketObj = [];

      this.totalNoOfMaterial = 0;
      this.totalGross = 0;
      this.totalTare = 0;
      this.totalNet = 0;
      this.totalRoundingAmount = 0;
      this.totalAmount = 0;
      this.totalActualAmount = 0;
      this.editTicketDetails();
    }
  }

  saveDriverInfo() {
    this.newDriverScreenVisible = false;
    this.ticketData['carrier'] = this.driverDetails?.carrier || '';
    this.ticketData['driverlicense'] = this.driverDetails?.driverlicense || '';
    this.ticketData['licenseplate'] = this.driverDetails?.licenseplate || '';
    this.ticketData['truck'] = this.driverDetails?.truck || '';
    this.ticketData['make'] = this.driverDetails?.make || '';
    this.ticketData['model'] = this.driverDetails?.model || '';
    this.ticketData['driverName'] = this.driverDetails?.driverName || '';
    this.ticketData['note'] = this.driverDetails?.note || '';
  }

  isInputValid(input: any): boolean {
    const numberFloatRegex: RegExp = /^-?\d+(\.\d+)?$/;
    return numberFloatRegex.test(input);
  }

  errorAlert(msg: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  messageAlert(msg: any) {
    this.alertVisible = true;
    this.alertMessage = msg;
  }

  addTransction() {
    if (this.selectedPayAmount <= 0) {
      this.confirmationService.confirm({
        message: `This entered amount ₹${this.selectedPayAmount}will be added into the Cash Drawer?`,
        header: 'Add Money',
        icon: 'pi pi-info-circle',
        acceptLabel: 'OK',

        accept: () => {


          this.activeSection = 'Cash';
          this.transactionPaymentType = [{ typeofPayment: 'Cash', typeofAmount: this.selectedPayAmount }];
          this.proceedWithAddTransaction();
        },
        reject: () => {

          this.messageAlert('Operation cancelled.');
        }
      });
      return;
    }

    if (!this.isInputValid(this.selectedPayAmount)) {
      this.messageAlert('Add valid input')
      return;
    }

    if (this.activeSection == 'Cash' && this.cashPaymentLimit > 0) {
      let CashPaid = 0;
      let CashAdded = 0;
      let newCashAmount = 0;
      const transactions = this.ticketsTransactions ?? [];
      CashPaid = transactions.filter((t: any) => t?.type?.toLowerCase() === 'cash').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
      const paymentTypes = this.transactionPaymentType ?? [];
      CashAdded = paymentTypes.filter((p: any) => p?.typeofPayment === 'Cash').reduce((sum: number, p: any) => sum + Number(p.typeofAmount), 0);
      newCashAmount = Number(this.selectedPayAmount);
      const totalCash = CashPaid + CashAdded + newCashAmount;
      if (totalCash > this.cashPaymentLimit) {
        const remainingAllowed = this.cashPaymentLimit - CashPaid - CashAdded;
        if (remainingAllowed > 0) {
          this.messageAlert(`Cash payment exceeds the limit of ${this.cashPaymentLimit}. You can only add up to ${remainingAllowed.toFixed(2)} more in cash.`);
        } else {
          this.messageAlert(`You have already reached the cash payment limit of ${this.cashPaymentLimit}. Please use another payment method.`);
        }
        return;
      }
    }


    if (this.isHoldTrue) {
      const fullTicketBalance = this.totalAmount - this.totalAdjustment - (this.ticketData?.paidAmount || 0);
      let maxPayableNow = fullTicketBalance;
      if (this.selectedHoldAmount === 'Partial Pay Amount') {
        maxPayableNow = fullTicketBalance - this.totalHoldAmount;
      }

      if ((Number(this.selectedPayAmount) + this.getTotal()) > maxPayableNow) {
        this.messageAlert(`Payment exceeds the maximum eligible amount of $${maxPayableNow.toFixed(2)}.`);
        return;
      }
    }

    const checkPrice = this.checkTotalAmount();

    if (checkPrice) {
      this.messageAlert('adding amount is greter than total amount');
      return;
    }


    if (this.activeSection == 'Check') {
      if (this.checkNumber.length == 0) {
        this.messageAlert('Enter Check Number')
        return;
      }
      this.proceedWithAddTransaction();
    } else if (this.activeSection == 'Electronic Payment') {
      if (this.ePaymentType?.length == 0) {
        this.messageAlert('Enter Electronic Payment Type')
        return;
      }
      this.proceedWithAddTransaction();
    } else if (this.activeSection == 'Cash') {
      let text = 'You selected as Cash as payment mode, please confirm?';
      this.confirmationMessage(text, 'cashTransaction', null);
    } else if (this.activeSection == 'Advance') {
      if (this.selectedPayAmount > this.currentAdvanceAmount) {
        this.messageAlert(`Insufficient advance amount. Available: $${this.currentAdvanceAmount}`)
        return;
      }
      this.proceedWithAddTransaction();
    }
  }


  confirmationMessage(msg: any, triggerPoint: any, additionData: any) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: msg,
      accept: () => {
        if (triggerPoint == 'cashTransaction') {
          this.proceedWithAddTransaction();
        } else if (triggerPoint == 'payAndSave') {
          this.proceedPayAndSave(additionData);
        }
      },
      reject: () => {
        return false;
      },
    });
  }

  proceedWithAddTransaction() {
    const findItemExist = this.transactionPaymentType.findIndex((item: any) => item.typeofPayment?.toLowerCase() == this.activeSection?.toLowerCase())

    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        const total = this.getTotal();
        const eligiblePayAmount = this.totalAmount - total - this.totalHoldAmount;
        if (this.selectedPayAmount > eligiblePayAmount) {
          this.messageAlert('Exclude hold item amount')
          this.selectedPayAmount = eligiblePayAmount;
          return;
        }
        break;
      case 'Hold All Amount':
        this.messageAlert('You have selected option as "Hold All Amount"!!!')
        this.selectedPayAmount = 0;
        return;
        break;
    }

    if (findItemExist > -1) {

      this.transactionPaymentType[findItemExist] = {
        typeofPayment: this.activeSection,
        typeofAmount: this.selectedPayAmount,
        paymentType: this.getType()
      }

    } else {


      this.transactionPaymentType.push({
        typeofPayment: this.activeSection,
        typeofAmount: this.selectedPayAmount,
        paymentType: this.getType()
      })

    }

    const checkPrice2 = this.checkTotalAmount();
    if (checkPrice2) {
      // TO DO: Needs to write a logic to remove latest added transaction based on activeSection 
      this.transactionPaymentType.splice(this.transactionPaymentType.length - 1, 1);
      this.messageAlert('adding amount is greter than total amount')

      return false;
    }

    if (this.isHoldTrue) {
      const fullTicketBalance = this.totalAmount - this.totalAdjustment - (this.ticketData?.paidAmount || 0);
      const currentPayments = this.getTotal();
      this.remainingAmount = fullTicketBalance - currentPayments;
      if (this.selectedHoldAmount === 'Partial Pay Amount') {
        this.selectedPayAmount = fullTicketBalance - this.totalHoldAmount - currentPayments;
      } else { // else Pay Total Amount 
        this.selectedPayAmount = fullTicketBalance - currentPayments;
      }

    } else {
      this.remainingAmount = this.totalAmount - this.totalAdjustment - this.ticketData?.paidAmount - this.getTotal();
      this.selectedPayAmount = this.remainingAmount;
    }

  }


  onHoldAmountChange() {
    if (this.selectedHoldAmount === 'Pay Total Amount' && this.isHoldTrue) {
      const holdItemNames = this.holdticketObj.map((item: any) => item.materialName).join(', ');
      this.holdConfirmationMessage = `${holdItemNames} Material is on Hold. Are you sure you want to Pay Total Amount?`;
      this.showHoldConfirmDialog = true;
      return;
    }
    this.applyHoldAmountLogic();
  }

  confirmHoldAmount() {
    this.showHoldConfirmDialog = false;
    this.applyHoldAmountLogic();
  }

  cancelHoldAmount() {
    this.showHoldConfirmDialog = false;
    this.selectedHoldAmount = 'Partial Pay Amount';
    this.applyHoldAmountLogic();
  }

  applyHoldAmountLogic() {
    const fullTicketBalance = this.totalAmount - this.totalAdjustment - (this.ticketData?.paidAmount || 0);
    const currentPayments = this.getTotal();
    this.remainingAmount = fullTicketBalance - currentPayments;
    if (this.selectedHoldAmount === 'Partial Pay Amount') {
      this.selectedPayAmount = fullTicketBalance - this.totalHoldAmount - currentPayments;
    } else {// else Pay Total Amount 
      this.selectedPayAmount = fullTicketBalance - currentPayments;
    }
  }

  getType() {
    let str = '';
    if (this.activeSection == 'Cash' || this.activeSection === 'Advance') {
      str = ''
    }

    str = this.activeSection == 'Check' ? this.checkNumber : this.ePaymentType;
    return str;
  }

  checkTotalAmount() {
    let checkError = false;
    if (Number(this.payAmount) > Number(this.totalAmount)) {
      checkError = true;

    } else {
      const total = this.getTotal();
      if (Number(total) > (Number(this.totalAmount) - Number(this.totalAdjustment))) {
        checkError = true;
      }
    }
    return checkError;

  }

  removeItem(i: number) {
    this.transactionPaymentType.splice(i, 1);
    if (this.isHoldTrue) {
      const fullTicketBalance = this.totalAmount - this.totalAdjustment - (this.ticketData?.paidAmount || 0);
      const currentPayments = this.getTotal();
      this.remainingAmount = fullTicketBalance - currentPayments;

      if (this.selectedHoldAmount === 'Partial Pay Amount') {
        this.selectedPayAmount = fullTicketBalance - this.totalHoldAmount - currentPayments;
      } else {
        this.selectedPayAmount = fullTicketBalance - currentPayments;
      }
    } else {
      this.remainingAmount = this.totalAmount - this.totalAdjustment - this.ticketData?.paidAmount - this.getTotal();
      this.selectedPayAmount = this.remainingAmount;
    }
  }


  getTotal(): number {
    return this.transactionPaymentType.reduce((sum: number, curr: any) => {
      return sum = sum + Number(curr.typeofAmount)
    }, 0)
  }

  get isDisabled(): boolean {
    return (this.getTotal() < this.totalAmount);
  }


  editDriverr() {

  }


  getAllTicketsDetails() {
    // this.isLoading = true;
    setTimeout(() => {
      const paramObject = {
        LocationId: this.locId,
        SerachText: this.ticketId,
        SearchOrder: 'TicketId',
        PageNumber: 1,
        RowOfPage: 10
      };
      this.commonService.getAllTicketsDetails(paramObject)
        .subscribe({
          next: (data) => {
            console.log('getAllTicketsDetails for ticketId :: ');
            console.log(data);
            this.ticketData = data.body.data[0];
            this.selectedScaleTypeId = this.ticketData.scaleTypeID ?? 0;
            this.isBusinessOwnerName = this.ticketData.isBusinessOwnerName;
            this.isTruckScale = this.ticketData.truckScale;
            this.tagHoldDate = this.ticketData.tagHoldDate ? this.ticketData.tagHoldDate.split('T')[0] : '';
            this.tagHoldReason = this.ticketData.tagHoldReason || '';
            if (this.isBusinessOwnerName && this.businessOwnerName) {
              this.customer.fullName = this.businessOwnerName;
            } else {
              this.customer.fullName = this.originalCustomerName;
            }

            if (!this.isEditModeOn) {
              this.driverDetails = {
                driverName: this.ticketData.driverName,
                driverlicense: this.ticketData.driverlicense,
                licenseplate: this.ticketData.licenseplate,
                carrier: this.ticketData.carrier,
                truck: this.ticketData.truck,
                make: this.ticketData.make,
                model: this.ticketData.model,
                note: this.ticketData.note,
              };
            }

            //logic for display address
            if (this.ticketData.addressID === 0) {
              this.addressName = this.customer?.streetAddress || 'N/A';
              this.selectedBusinessAddressID = 0;
            } else {
              this.selectedBusinessAddressID = this.ticketData.addressID;
              this.addressName = this.getAddressName(this.ticketData.addressID);
            }
            this.isCODRequired = this.ticketData.isCOD;
            this.totalRecords = data.totalRecords;
            const userId = data.body.data[0].createdBy;

            this.getAllUsers(userId);
          },
          error: (err: any) => {
            // this.isLoading = false;
            // this.errorMsg = 'Error occured';
          },
          complete: () => {
            // this.isLoading = false;
          }
        });
    }, 0);
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
    this.commonService.addSeller(reqObj).subscribe(data => {
      console.log(data);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller updated Successfully' });
      const sellerFullname = reqObj.firstName + (reqObj.middleName != '' ? ' ' + reqObj.middleName : '')
        + (reqObj.lastName != '' ? ' ' + reqObj.lastName : '');

      this.addSellerPopupVisible = false;
      this.sellerForm.patchValue({
        firstName: '',
        middleName: '',
        lastName: ''
      });

      this.clickOnSeller(data.body.insertedRow);
    }, (error: any) => {
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
    this.sellerLoader = true;
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
        this.isBuniessUser = this.customer.sellerType == "Business" ? true : false;
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
        this.sellerLoader = false;
        console.error('Error fetching seller details:', err);
      },
      complete: () => {
        this.sellerLoader = false;
      }
    });
  }

  onBusinessOwnerNameToggle(event: any) {
    if (event.target.checked) {
      if (!this.customer?.businessOwnerName) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No Business Owner Name initialized for this seller.' });
        event.target.checked = false;
        return;
      }
      this.isBusinessOwnerName = true;
      this.customer.fullName = this.customer.businessOwnerName;
    } else {
      this.isBusinessOwnerName = false;
      this.customer.fullName = this.originalCustomerName;
    }
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


  GetTicketMaterialsDetailsByTicketId() {
    this.isLoading = true;

    setTimeout(() => {
      const paramObject = {
        TicketId: this.ticketId,
        locid: this.locId,
        IsCOD: false,
        IsCODDone: false
      };
      this.commonService.GetTicketMaterialsDetailsByTicketId(paramObject)
        .subscribe({
          next: (data) => {
            console.log('GetTicketMaterialsDetailsByTicketId :: ');
            console.log(data);
            this.ticketObj = data.body.data.map((item: any) => {
              item.isSelected = item.isCOD;
              if (item.materialDocumentsImages && item.materialDocumentsImages !== '') {
                this.hasAnyDocuments = true;
              }
              if (item.isHold && item.holdDays > 0) {
                const createdDate = new Date(item.createdDate);
                createdDate.setDate(createdDate.getDate() + item.holdDays);
                item.holdReleaseDate = this.datePipe.transform(createdDate, 'yyyy-MM-dd');
              }
              if (item.materialId && this.sellerId) {
                this.getPurchaseOrderMaterialsDropdown(item.materialId, item, true);
              }

              // if (item.materialDocumentsImages) {
              //   this.ticketImages = item.materialDocumentsImages.split(',');
              // }
              // this.getMaterialDocumentsByMaterialId(item.rowId);

              return item
            });
            this.ticketsParentID = this.ticketObj[0]?.parentRowID;
            this.ticketsTicketID = this.ticketObj[0]?.ticketsTicketID;
            const maxLocalRowID = Math.max(
              ...data.body.data.map((item: any) => item.itemLocalRowID),
              0
            );

            console.log('Calculated maxLocalRowID:', maxLocalRowID);
            this.nextItemLocalRowId = maxLocalRowID + 1;
            this.holdticketObj = null;
            this.holdticketObj = data.body.data.filter((obj: any) => {
              return obj.isHold === true
            });
            this.isHoldTrue = (this.holdticketObj.length > 0) ? true : false;
            this.updateHoldStatus();

            this.calculateTotal(this.ticketObj);
          },
          error: (err: any) => {
            // this.errorMsg = 'Error occured';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }, 300);
  }

  calculateTotal(tickets: any) {
    this.totalNoOfMaterial = tickets.length;
    this.totalGross = tickets.reduce(function (sum: any, tickets: any) {
      return sum + tickets.gross;
    }, 0);
    this.totalTare = tickets.reduce(function (sum: any, tickets: any) {
      return sum + tickets.tare;
    }, 0);
    this.totalNet = tickets.reduce(function (sum: any, tickets: any) {
      return sum + tickets.net;
    }, 0);
    this.totalActualAmount = tickets.reduce(function (sum: any, tickets: any) {
      // return sum + (tickets.isAdjusmentSet ? tickets.amount * -1 : tickets.amount);
      // let amount = tickets.amount; 
      // if (tickets.isCOD) {
      //   amount = -Math.abs(tickets.amount); 
      // }
      return sum + (tickets.isAdjusmentSet ? 0 : (tickets.isCOD ? 0 : tickets.amount));
    }, 0);

    if (this.isRounding) {
      //rounding true
      this.totalAmount = Math.round(this.totalActualAmount);
      this.totalRoundingAmount = this.totalAmount - this.totalActualAmount;
    } else {
      this.totalAmount = this.totalActualAmount;
      this.totalRoundingAmount = 0;
    }
    this.totalAdjustment = tickets.reduce(function (sum: any, tickets: any) {
      // return sum + (tickets.isAdjusmentSet ? tickets.amount * -1 : 0);
      return sum + (tickets.isAdjusmentSet ? tickets.amount : 0);
    }, 0);
  }

  onCODChange(ticket: any) {
    ticket.amount = ticket.isCOD ? -Math.abs(ticket.amount) : Math.abs(ticket.amount);
    this.calculateTotal(this.ticketObj);
  }


  editTicketDetails() {
    if (this.ticketData.isEditMode) {
      if (this.currentRole === "Administrator") {
        this.isConfirmDialogVisible = true;
        return;
      } else if ((this.currentRole === "Scale" || this.currentRole === "Cashier") && (this.ticketData.editedBy !== this.logInUserId)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ticket is in edit mode. Please contact administartor !!!' });
        return;
      }
    } else {
      this.proceedWithEdit();
    }
  }

  onConfirmEdit() {
    this.isConfirmDialogVisible = false;
    this.proceedWithEdit();
  }

  onCancelEdit() {
    this.isConfirmDialogVisible = false;
  }

  private proceedWithEdit() {
    this.TicketEditMode(true);
    this.isEditModeOn = true;
    this.getAllGroupMaterial();
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


  confirmSave() {
    this.uploadDialogVisible = false;
    this.saveConfirmVisible = true;
    this.signaturePadVisible = false;
    // if (this.ticketId != 0) {
    //   this.saveConfirmVisible = true;
    //   this.signaturePadVisible = false;
    // } else {
    //   if (this.signPadVisible && this.currentRole !== 'Scale') {
    //     this.saveConfirmVisible = false;
    //     this.signaturePadVisible = true;
    //   } else {
    //     this.saveConfirmVisible = true;
    //     this.signaturePadVisible = false;
    //   }
    // }
  }

  // showPayment(isReceiptPrint: boolean) {
  //   this.isReceiptPrint = isReceiptPrint;
  //   this.paymentVisible = true;
  //   this.selectedPayAmount = this.remainingAmount = this.payAmount = this.totalAmount - this.totalAdjustment - this.ticketData?.paidAmount;
  //   this.showSection('Cash');
  // }

  showPayment(isReceiptPrint: boolean) {
    this.isReceiptPrint = isReceiptPrint;
    const cashLimit = localStorage.getItem('cashPaymentLimit');
    this.cashPaymentLimit = cashLimit ? parseFloat(cashLimit) : 0;
    const checkOnly = localStorage.getItem('checkOnlyPayment');
    this.isCheckOnlyPayment = checkOnly === 'true';
    this.selectedPayAmount = this.remainingAmount = this.payAmount = this.totalAmount - this.totalAdjustment - this.ticketData?.paidAmount;

    if (this.selectedPayAmount === 0) {
      this.confirmZeroAmountVisible = true;
    } else {
      this.paymentVisible = true;
      if (this.isCheckOnlyPayment) {
        this.showSection('Check');
      } else {
        this.showSection('Cash');
      }
    }
  }

  ZeroAmountConfirmation(userConfirmed: boolean) {
    this.confirmZeroAmountVisible = false;

    if (userConfirmed) {
      this.isZeroAmountConfirmedPaid = true;
      this.saveTicketDetails(0, this.isReceiptPrint);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket paid Successfully' });
    } else {
      this.isZeroAmountConfirmedPaid = false;
    }
  }




  showSection(paymentType: string) {
    this.activeSection = paymentType;

    setTimeout(() => {
      this.selectedCheckDate = new Date().toISOString().split('T')[0];
    }, 10)
    this.checkNumber = '';
    this.ePaymentType = '';

    if (this.isHoldTrue) {
      this.totalHoldAmount = this.holdticketObj.reduce((acc: any, curr: any) => acc + curr.amount, 0);
    }
    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        if (this.totalHoldAmount >= this.payAmount && (this.totalHoldAmount != 0 || this.payAmount != 0)) {
          //this.errorAlert(`Hold amount ( $${this.totalHoldAmount} ) is equal or more than total pay amount ( $${this.payAmount} )`);
          this.payAmount = 0;
        } else {
          this.payAmount = this.totalAmount - this.ticketData?.paidAmount - this.totalHoldAmount;
        }
        break;
      case 'Hold All Amount':
        this.payAmount = 0;
        break;
    }
    if (this.selectedHoldAmount === 'Partial Pay Amount') {
      this.selectedPayAmount = this.totalAmount - this.totalHoldAmount - this.totalAdjustment - (this.ticketData?.paidAmount || 0) - this.getTotal();
    } else {
      this.selectedPayAmount = this.totalAmount - this.totalAdjustment - (this.ticketData?.paidAmount || 0) - this.getTotal();
    }
  }

  payAndSave(activeSection: string) {
    const cashDrawerStatus = localStorage.getItem('cashDrawerStatus');

    if (cashDrawerStatus == 'CLOSE') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You must open the cash drawer before making a payment.' });
      return;
    }
    if (this.transactionPaymentType.length > 1) {
      let text = 'You selected multiple payment mode please confirm ?';
      this.confirmationMessage(text, 'payAndSave', activeSection);
    } else if (this.transactionPaymentType.length == 1) {
      this.proceedPayAndSave(activeSection);
    }
  }

  proceedPayAndSave(activeSection: string) {
    const payAmout = this.getTotal();
    console.log('Checking the selected Amount to pAy', payAmout);
    if (payAmout == 0 && this.selectedPayAmount > 0) {
      console.log('directly click on Pay Tiket button');
      this.transactionPaymentType.push({
        typeofPayment: this.activeSection,
        typeofAmount: this.selectedPayAmount,
        paymentType: this.getType()
      });
    }

    this.payAmount = this.getTotal();

    if (!this.payAmount) {
      this.messageAlert('Enter Amount')
      return
    }
    if (this.payAmount > 0 && parseFloat(this.payAmount.toString()) > (parseFloat(this.totalAmount.toString()) - this.ticketData?.paidAmount)) {
      this.messageAlert('adding amount is greter than total amount')
      return;
    }

    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        const eligiblePayAmount = this.totalAmount - this.ticketData?.paidAmount - this.totalHoldAmount;
        if (this.payAmount > eligiblePayAmount) {
          this.messageAlert('Exclude hold item amount')
          this.payAmount = eligiblePayAmount;
          return;
        }
        break;
      case 'Hold All Amount':
        this.messageAlert('You have selected option as "Hold All Amount"!!!');
        this.payAmount = 0;
        return;
        break;
    }

    let msg = '';
    if (this.activeSection == 'Check') {
      if (this.checkNumber.length == 0) {
        this.messageAlert('Enter Check Number')

        return;
      }
    } else if (this.activeSection == 'Electronic Payment') {
      if (this.ePaymentType?.length == 0) {
        this.messageAlert('Enter Electronic Payment Type')
        return;
      }
    } else if (this.activeSection == 'Advance Amount') {
      const advanceAmount = this.transactionPaymentType
        .filter((item: any) => item.typeofPayment === 'Advance Amount')
        .reduce((sum: number, item: any) => sum + parseFloat(item.typeofAmount), 0)
      if (advanceAmount > this.currentAdvanceAmount) {
        this.messageAlert(`Insufficient advance amount. Available: $${this.currentAdvanceAmount}`)
        return;
      }
    } else {
      // TO DO:: Needs to check condition when directly hitting to pay amount
      // msg = 'You selected as Cash as payment mode, please confirm?';
      // this.messageAlert(msg);
    }

    const paramObject = { LocationId: this.locId, DrawerID: this.activeDrawerId };
    this.commonService.getCashDrawerAmountAndPaidTicketCount(paramObject).subscribe(
      (data: any) => {
        const cashDrawerBalance = data.body.cashDrawerbalance;
        debugger;
        if (this.activeSection == 'Cash') {
          if (cashDrawerBalance < payAmout) {
            this.messageAlert('Cash Drawer balance is insufficient.');
            return;
          }
        }

        if (this.signPadVisible && this.currentRole !== 'Scale') {
          this.signaturePadVisible = true;
        } else {
          this.saveTicketDetails(this.payAmount, this.isReceiptPrint);
        }
      }
    );
  }


  saveTransactionData(activeSection: any) {
    this.isCheckPrint = false;
    let isCheckTransaction = false;
    let payTransactionObj: any = [];
    this.checkAmount = 0;
    let checkNumber = '';

    this.transactionPaymentType.map((item: any) => {

      if (item.typeofPayment == 'Cash') {

        payTransactionObj.push({
          localRowId: 1,
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketId: parseInt(this.ticketId),
          locID: this.locId,
          drawerID: this.activeDrawerId,
          type: item.typeofPayment,
          amount: parseFloat(item.typeofAmount),
          checkNumber: '',
          barCode: '',
          guid: '',
          dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
        });

      } else if (item.typeofPayment == 'Check') {

        isCheckTransaction = true;
        this.checkAmount = parseFloat(item.typeofAmount);
        checkNumber = item.paymentType;

        payTransactionObj.push({
          localRowId: 2,
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketId: parseInt(this.ticketId),
          locID: this.locId,
          drawerID: this.activeDrawerId,
          type: item.typeofPayment,
          amount: this.checkAmount,
          checkNumber: checkNumber,
          barCode: '',
          guid: '',
          dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
        });

      } else if (item.typeofPayment == 'Electronic Payment') {

        payTransactionObj.push({
          localRowId: 3,
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketId: parseInt(this.ticketId),
          type: item.typeofPayment,
          amount: parseFloat(item.typeofAmount),
          checkNumber: item.paymentType,
          barCode: '',
          guid: '',
          dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
        });
      } else if (item.typeofPayment == 'Advance') {
        payTransactionObj.push({
          localRowId: 4,
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketId: parseInt(this.ticketId),
          type: 'Advance',
          amount: parseFloat(item.typeofAmount),
          checkNumber: '',
          barCode: '',
          guid: '',
          dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
        });
      }

      return item
    })

    if (isCheckTransaction) {
      this.isCheckPrint = true;
    }

    const transactionObj = {
      tickettransaction: {
        localRowId: 0,
        rowId: 0,
        createdBy: this.logInUserId,
        createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        ticketId: parseInt(this.ticketId),
        type: this.transactionPaymentType[0]?.typeofPayment,
        amount: 0,
        checkNumber: '',
        barCode: '',
        guid: '',
        dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        LocID: this.locId,
        drawerID: this.activeDrawerId
      },
      lstickettransaction: payTransactionObj
    };

    this.commonService.insertTicketTransactions(transactionObj).subscribe(data => {
      this.printTicket(this.ticketId);
      this.getCashDrawerAmountAndPaidTicketCount();
    }, (error: any) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
    this.paymentVisible = false;
    this.saveConfirmVisible = false;

  }


  getCashDrawerAmountAndPaidTicketCount() {
    const paramObject = {
      LocationId: this.locId,
      DrawerID: this.activeDrawerId
    };
    this.commonService.getCashDrawerAmountAndPaidTicketCount(paramObject)
      .subscribe((data: any) => {
        console.log('getCashDrawerAmountAndPaidTicketCount :: ');
        console.log(data);
        // this.dataService.cashDrawerAmountAndPaidTicketCount(data);
        const cashDrawerBalanceAmount = data.body.cashDrawerbalance;
        const paidTicketCount = data.body.paidTicketCount;
        this.dataService.setCashDrawerAmountDTO(cashDrawerBalanceAmount);
        this.dataService.setPaidCount(paidTicketCount);
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  saveTicketDetails(paidAmount: number, isReceiptPrint?: boolean) {
    // if (this.ticketObj.some((item:any) => 
    //       item.purchaseOrderMaterialID && 
    //       item.balanceMaterialQty != null && 
    //       Number(item.net) > Number(item.balanceMaterialQty)
    //     )) {
    //   this.messageService.add({severity: 'error', summary: 'Over Shipment', detail: 'Entered quantity exceeds balance quantity. Please adjust before saving.'
    //   });
    //   return; 
    // }

    if (isReceiptPrint) {
      this.isReceiptPrint = isReceiptPrint;
    } else {
      this.isReceiptPrint = false;
    }
    if (this.isCODRequired) {
      this.ticketObj = this.ticketObj.map((item: TicketItem) => {
        // Only update if item is marked for COD
        if (item.isCOD) {
          item.isCODDone = false;
          item.isCODupdated = false;
        }
        return item;
      });
    } else {
      // If COD is not required, reset all COD flags
      this.ticketObj = this.ticketObj.map((item: TicketItem) => {
        item.isCOD = false;
        item.isCODDone = false;
        item.isCODupdated = false;
        return item;
      });
    }

    this.prepareMaterialDocumentsList();

    if (this.tagHoldVisible || this.tagHoldDate || this.tagHoldReason) {
      if (!this.tagHoldDate) {
        this.messageService.add({ severity: 'warn', summary: 'Missing Date', detail: 'Please select a valid future date for Tag & Hold.' });
        return;
      }

      const selectedDate = new Date(this.tagHoldDate);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() <= today.getTime()) {
        this.messageService.add({ severity: 'error', summary: 'Invalid Date', detail: 'Please select a future date for Tag & Hold.' });
        return;
      }

      if (!this.tagHoldReason || this.tagHoldReason.trim() === '') {
        this.messageService.add({ severity: 'warn', summary: 'Missing Reason', detail: 'Please enter a reason for Tag & Hold.' });
        return;
      }
    }



    let ticketStatus = 'OPEN';
    // if (paidAmount > 0 && paidAmount == this.totalAmount) {
    //   ticketStatus = 'PAID';
    // }
    if (this.tagHoldDate && this.tagHoldReason) {
      ticketStatus = 'TAG AND HOLD';
    }
    if (this.totalAmount === 0) {
      if (this.isZeroAmountConfirmedPaid) {
        ticketStatus = 'PAID';
      } else {
        ticketStatus = 'OPEN';
      }
    } else if (paidAmount > 0 && paidAmount == this.totalAmount) {
      ticketStatus = 'PAID';
    }

    if (this.ticketId != 0) {
      if (paidAmount > 0 && paidAmount == (this.totalAmount - this.ticketData?.paidAmount)) {
        ticketStatus = 'PAID';
      } else if (paidAmount > 0 && paidAmount != this.totalAmount) {
        ticketStatus = 'Partially Paid';
      }
      this.isEditModeOn = false;
      this.ticketData.isCOD = this.isCODRequired;
      this.ticketData.status = ticketStatus;
      this.ticketData.amount = parseFloat(this.totalAmount.toFixed(3));
      this.ticketData.roundingAmount = parseFloat(this.totalRoundingAmount.toFixed(3));
      this.ticketData.ticketAmount = parseFloat(this.totalActualAmount.toFixed(3));
      this.ticketData.paidAmount = parseFloat(paidAmount.toString());
      this.ticketData.adjustmentAmount = parseFloat(this.totalAdjustment.toFixed(3));
      this.ticketData.balanceAmount = this.ticketData.amount - this.ticketData.adjustmentAmount;
      this.ticketData.lstttransactionMasterDTO = this.ticketObj.map((item: any) => {
        item.ticketMaterialDocumentsList = item.ticketMaterialDocumentsList || [];
        return item;
      });
      this.ticketData.updatedBy = this.logInUserId;
      this.ticketData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      this.ticketData.customerId = parseFloat(this.sellerId);
      this.ticketData.dispatchID = parseFloat(this.dispatchID);
      this.ticketData.sellerSignature = this.sellerSignatureImagePath;
      this.ticketData.locID = this.locId;
      // this.ticketData.currencyId = Number(this.currency);
      this.ticketData.currencyCode = this.currencyCode;
      this.ticketData.currencySymbol = this.currencySymbol;
      this.ticketData.truckScale = this.isTruckScale;
      this.ticketData.scaleType = this.selectedScaleTypeId ?? 0;
      this.ticketData.isBusinessOwnerName = this.isBusinessOwnerName;
      this.ticketData.businessOwnerName = this.businessOwnerName;

      if (this.isBusinessOwnerName && this.businessOwnerName) {
        this.ticketData.customerName = this.businessOwnerName;
      } else {
        this.ticketData.customerName = this.originalCustomerName;
      }
      this.ticketData.tagHoldDate = this.tagHoldDate ? this.datePipe.transform(this.tagHoldDate, 'YYYY-MM-ddTHH:mm:ss.SSS') : null;
      this.ticketData.tagHoldReason = this.tagHoldReason || null;



    } else {
      const newTicket = new Ticket();
      newTicket.rowId = 0;
      newTicket.addressID = Number(this.addressId);
      newTicket.createdBy = this.logInUserId;
      newTicket.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newTicket.updatedBy = this.logInUserId;
      newTicket.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newTicket.customerId = parseFloat(this.sellerId);
      newTicket.ticketId = 0;
      newTicket.status = ticketStatus;
      newTicket.amount = parseFloat(this.totalAmount.toFixed(3));
      newTicket.roundingAmount = parseFloat(this.totalRoundingAmount.toFixed(3));
      newTicket.ticketAmount = parseFloat(this.totalActualAmount.toFixed(3));
      newTicket.paidAmount = parseFloat(paidAmount.toString());
      newTicket.dateOpened = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newTicket.dateClosed = null;
      newTicket.customerName = this.customer?.fullName;
      newTicket.adjustmentAmount = parseFloat(this.totalAdjustment.toFixed(3));
      newTicket.balanceAmount = newTicket.amount - newTicket.adjustmentAmount;
      newTicket.locID = this.locId;
      newTicket.lstttransactionMasterDTO = this.ticketObj.map((item: any) => {
        item.ticketMaterialDocumentsList = item.ticketMaterialDocumentsList || [];
        return item;
      });
      newTicket.sellerSignature = this.sellerSignatureImagePath;
      newTicket.isCOD = this.isCODRequired;
      newTicket.dispatchID = parseFloat(this.dispatchID);
      newTicket.carrier = this.driverDetails?.carrier;
      newTicket.driverlicense = this.driverDetails?.driverlicense;
      newTicket.licenseplate = this.driverDetails?.licenseplate;
      newTicket.truck = this.driverDetails?.truck;
      newTicket.make = this.driverDetails?.make;
      newTicket.model = this.driverDetails?.model;
      newTicket.driverName = this.driverDetails?.driverName;
      newTicket.note = this.driverDetails?.note;
      // newTicket.currencyId = Number(this.currency);
      newTicket.currencyCode = this.currencyCode;
      newTicket.currencySymbol = this.currencySymbol;
      newTicket.truckScale = this.isTruckScale;
      newTicket.scaleType = this.selectedScaleTypeId ?? 0;
      newTicket.customerName = this.isBusinessOwnerName && this.businessOwnerName ? this.businessOwnerName : this.originalCustomerName;
      newTicket.isBusinessOwnerName = this.isBusinessOwnerName;
      newTicket.businessOwnerName = this.businessOwnerName;
      newTicket.tagHoldDate = this.tagHoldDate ? this.datePipe.transform(this.tagHoldDate, 'YYYY-MM-ddTHH:mm:ss.SSS') : null;
      newTicket.tagHoldReason = this.tagHoldReason;


      this.ticketData = newTicket;
    }
    this.sellerSignatureImagePath = null;


    console.log("Final ticketData :: " + JSON.stringify(this.ticketData));

    this.commonService.insertUpdateTickets(this.ticketData).subscribe(data => {
      console.log(data);
      this.isEditModeOn = false;
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });

      if (this.transactionPaymentType.length > 0) {
        const oldTicketId = this.ticketId;
        this.ticketId = data.body.insertedRow;
        this.saveTransactionData(this.activeSection);
        this.saveConfirmVisible = false;
      } else {
        this.ticketId = data.body.insertedRow;
        this.saveConfirmVisible = false;

        if (this.isReceiptPrint) {
          this.printTicket(this.ticketId);
        } else if (this.isCheckPrint) {
          this.checkPrintAction();
        } else {
          setTimeout(() => {
            this.router.navigateByUrl(`${this.orgName}/home`);
          }, 1500);
        }
      }

    }, (error: any) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  openTagHoldPopup() {
    this.tagHoldVisible = true;
  }

  closeTagHoldPopup() {
    this.tagHoldVisible = false;
    this.tagHoldDate = null;
    this.tagHoldReason = '';
  }

  cancelEditTicket(ticketId: any) {
    // alert('Refresh' + this.ticketId);
    if (this.isEditModeOn) {
      this.showConfirmLeavePopup = true;
      return;
    }
    if (ticketId && ticketId != 0 && this.isEditModeOn) {
      console.log('11111');
      this.isEditModeOn = false;
      this.editItemCloseImageCapture = false;
      this.processDataBasedOnTicketId();
    } else {
      console.log('222222');
      this.router.navigateByUrl(`${this.orgName}/home`);
    }
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

  printTicket(ticketId: any) {
    if (ticketId && ticketId != 0) {
      console.log('11111');
      this.isEditModeOn = false;
      this.editItemCloseImageCapture = false;
      this.processDataBasedOnTicketId();
    } else if (ticketId == 0 && !this.isReceiptPrint) {
      console.log('222222');
      this.router.navigateByUrl(`${this.orgName}/home`);
    }
    if (this.isReceiptPrint) {
      this.generateSingleTicketReport(ticketId);
    } else {
      if (this.isCheckPrint) {
        this.checkPrintAction();
      } else {
        this.router.navigateByUrl(`${this.orgName}/home`);
      }
    }
  }

  private checkPrintAction() {
    if (this.isCheckPrint) {

      // Use confirmation dialog to wait for user to click OK before proceeding
      this.confirmationService.confirm({
        message: 'Please insert Check into Printer!!!',
        header: 'Check Print',
        icon: 'pi pi-print',
        acceptLabel: 'OK',
        rejectVisible: false,
        accept: () => {
          // Open Pdf viewer          
          // this.showDownload = true;
          // this.pdfViwerTitle = 'Check For Print';
          if (this.checkTabView) {
            this.helperService.downloadBase64Pdf(this.fileDataObj, this.pdfViwerTitle)
          } else {
            if (this.IsUseCheckTemplateEnabled) {
              this.generateCheckPrintReport(this.ticketId, this.checkAmount);
            } else {
              this.generateCheckPrintReportDefault(this.ticketId, this.checkAmount);
            }
          }

          this.isCheckPrint = false;
          this.checkAmount = 0;
        }
      });
    }
  }

  // addItem(materialId: any, materialName: any, selectedMaterial: string, scrapPrice: any) {

  //   this.modalHeader = 'Add Item Details';
  //   this.editItemVisible = false;
  //   this.editItemCloseImageCapture = false;
  //   if (this.itemLeveloperationPerform !== 'Edit') {
  //     this.imageUrl = null;
  //     this.itemImagePath = '';
  // }
  //   this.itemMaterialId = materialId;
  //   this.itemGroupName = selectedMaterial;
  //   this.itemMaterialName = materialName;
  //   this.itemPrice = scrapPrice;
  //   this.originalItemPrice = scrapPrice;
  //   this.itemLeveloperationPerform = this.itemLeveloperationPerform == '' ? 'Add' : this.itemLeveloperationPerform;
  //   this.itemCodNote = '';    
  //   this.itemGross = '';
  //   this.itemTare = '';
  //   if (this.itemLeveloperationPerform !== 'Edit') {
  //     this.itemImagePath = '';
  // }
  //   const material = this.subMaterialList.find((item: any) => item.rowId === materialId);
  //   this.itemMarketPrice = material?.marketPrice || null;
  //   this.itemIsHold = material?.isHold || false; 
  //   this.itemHoldDays = material?.holdDays || 0; 
  //   this.closeCapturedImage(1)
  //   // this.materialNote = '';
  // }

  addItem(materialId: any, materialName: any, selectedMaterial: string, scrapPrice: any) {
    this.modalHeader = 'Add Item Details';
    this.editItemVisible = false;
    this.editItemCloseImageCapture = false;

    // Assign the captured image
    this.itemImagePath = this.imageUrl;

    if (!this.itemLeveloperationPerform) {
      this.itemLeveloperationPerform = 'Add';
    }
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemPrice = scrapPrice;
    this.originalItemPrice = scrapPrice;

    this.itemCodNote = '';
    this.itemGross = '';
    this.itemTare = '';
    this.materialNote = '';

    // --- IMPROVED METADATA LOOKUP ---
    // 1. Try to find in the current sub-list (standard flow)
    let material = this.subMaterialList?.find((item: any) => item.rowId === materialId);

    // 2. If not found (e.g. AI flow), try to find in the full database
    if (!material && this.allMaterials.length > 0) {
      material = this.allMaterials.find((item: any) => item.rowId === materialId);
    }

    // 3. If we found the material object, set metadata. 
    //    Otherwise, keep values if they were set externally (like in onSuggestedMaterialSelected), or default to 0.
    if (material) {
      this.itemMarketPrice = material.marketPrice || 0;
      this.itemIsHold = material.isHold || false;
      this.itemHoldDays = material.holdDays || 0;
    } else if (materialId === 0) {
      // Manual Entry / New Item
      this.itemMarketPrice = 0;
      this.itemIsHold = false;
      this.itemHoldDays = 0;
    }

    // Trigger the Calculator View
    this.closeCapturedImage(1);
  }

  calculatePrice(item: any) {
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
    // alert('testing.......')
    // this.editItemCloseImageCapture = false;
    this.clearMaterialCalculatorData();
    // this.backToChangeItemMainMaterials();
    // alert('111111111')

    if (rowData.isAdjusmentSet == true) {
      this.addEditAdjustmentVisible = true;
      this.modalAdjustmentHeader = 'Edit Adjustment';
      this.itemLeveloperationPerform = 'Edit';

      this.itemRowId = rowData.rowId;
      this.itemLocalRowId = rowData.localRowId;
      this.adjustmentAmount = rowData.price;
      this.adjustmentNote = rowData.materialNote;
      this.selectedAdjustment = rowData.concatAdjustments;

    } else {
      this.modalHeader = 'Edit Item Details';
      this.editItemVisible = true;

      this.editItemCloseImageCapture = false;
      this.itemLeveloperationPerform = 'Edit';

      this.itemRowId = rowData.rowId;
      this.itemLocalRowId = rowData.localRowId;
      this.itemGroupName = rowData.groupName;
      this.itemMaterialName = rowData.materialName;
      this.itemMaterialId = rowData.materialId;
      this.itemGross = rowData.gross;
      this.itemTare = rowData.tare;
      this.itemNet = isNaN(rowData.net) ? 0 : rowData.net;
      this.itemPrice = rowData.price;
      this.itemImagePath = rowData.imagePath;
      this.itemCodNote = rowData.codNote;
      this.materialNote = rowData.materialNote;

      this.imageUrl = (this.itemImagePath ? this.itemImagePath : 'assets/images/custom/id_scan.png');
      this.closeCapturedImage(1);
    }

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

  deleteItem(i: number) {
    this.ticketObj.splice(i, 1);
    console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));

    this.calculateTotal(this.ticketObj);
    this.updateHoldStatus();
    // this.backToChangeItemMainMaterials();
    // this.backToMainMaterials();
    // this.itemGross = '';
    // this.itemTare = 0;
  }

  calculateNet() {
    const netQty = this.itemGross - this.itemTare
    this.itemNet = isNaN(netQty) ? 0 : netQty;
  }

  closeCapturedImage(imagetype: number) {
    if (imagetype == 1) {
      this.editItemVisible = false;
      this.editItemCloseImageCapture = true;
      setTimeout(() => {
        this.focusChildInput()
      }, 100)
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

  // handleImage(imageUrl: string) {
  //   this.imageUrl = imageUrl;
  //   this.SaveImage(7);
  // }

  // Helper to convert Base64 DataURI to a Blob (File)
  private dataURItoBlob(dataURI: string): Blob {
    // Split 'data:image/jpeg;base64,......'
    const splitData = dataURI.split(',');
    const byteString = atob(splitData[1]);
    const mimeString = splitData[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  predictMaterial(formData: FormData) {
    this.materialsLoading = true;
    this.mlPredictions = []; // Clear previous predictions

    this.commonService.predictMaterial(formData).subscribe(
      (response: any) => {
        this.materialsLoading = false;

        // The service returns 'null' on error (due to catchError(of(null)))
        if (response) {
          console.log('ML Response:', response);

          // Depending on your Python API structure, the data might be directly in 'response' 
          // or in 'response.predictions', etc. Adjust 'response' below if needed.
          // Example: if Python returns [ {class_name: 'Copper', ...} ]

          // Check if response is an array or object and assign to mlPredictions
          // We wrap it in an array if it's a single object to match HTML ngFor
          const predictions = Array.isArray(response) ? response : [response];

          this.mlPredictions = predictions;
          this.showMlPredictionDialog = true; // Open the popup

        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Prediction Failed',
            detail: 'Could not connect to the AI Model.'
          });
        }
      },
      (error) => {
        // This block might not be reached if service handles catchError, but good to keep
        this.materialsLoading = false;
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred.' });
      }
    );
  }

  async handleImage(imageUrl: string) {
    this.imageUrl = imageUrl;

    // 1. Standard behavior (Edit/Adjustment/Toggle OFF)
    if (this.editItemVisible || this.addEditAdjustmentVisible || !this.IsAIMetalDetectionEnabled) {
      this.SaveImage(this.editItemVisible || this.addEditAdjustmentVisible ? 7 : 1);
      return;
    }

    // 2. Metal Detection Logic
    this.showCameraDialog = false;
    this.materialsLoading = true;
    this.messageService.add({ severity: 'info', summary: 'Processing...', detail: 'Identifying material...' });

    try {
      const fetchResponse = await fetch(imageUrl);
      const imageBlob = await fetchResponse.blob();

      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');

      // Using direct HTTP call as per your 2nd code logic
      this.http.post<any>(`${environment.ocrUrl}/material/predict/`, formData).subscribe({
        next: (response: any) => { // Explicit type
          this.materialsLoading = false;

          if (response && response.predictions && response.predictions.length > 0) {
            this.mlPredictions = response.predictions.map((p: any) => ({
              ...p,
              suggestedMaterials: this.findSuggestedMaterials(p.class_name)
            }));
            this.showMlPredictionDialog = true;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Prediction Failed', detail: 'No match found.' });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.materialsLoading = false;
          console.error("ML Prediction API error", err);
          this.messageService.add({ severity: 'error', summary: 'API Error', detail: 'Prediction service unavailable.' });
        }
      });
    } catch (error) {
      this.materialsLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Image Error', detail: 'Could not process image.' });
    }
  }


  captureImage(imageUrlString: string) {
    this.itemImagePath = imageUrlString
  }

  setSignature($event: any) {
    this.imageUrl = $event;
    this.SaveImage(8);
    this.signaturePadVisible = false;
  }

  onSignCaptureTypeChange(value: string) {
    this.signCaptureType = value;
    localStorage.setItem('signCaptureType', value);
  }

  //Created for Images payload
  prepareMaterialDocumentsList() {
    type TicketItemWithDocuments = TicketItem & {
      ticketMaterialDocumentsList: TicketDocument[];
    };

    const ticketItems: TicketItemWithDocuments[] = Array.isArray(this.ticketObj)
      ? [...this.ticketObj]
      : [{ ...this.ticketObj }];

    ticketItems.forEach((item: TicketItemWithDocuments) => {
      if (this.selectedItemForUpload && item.localRowId === this.selectedItemForUpload.localRowId) {
        item.ticketMaterialDocumentsList = [];

        if (this.documentsList && this.documentsList.length > 0) {
          this.documentsList.forEach((uiDoc: any) => {
            if (uiDoc.imageUrl && uiDoc.imageUrl.trim()) {
              const doc = new TicketDocument();
              doc.rowID = uiDoc.rowID || 0;
              doc.itemRowID = uiDoc.rowID || 0;
              doc.itemLocalID = item.itemLocalRowID;
              doc.ticketID = 0;
              doc.locID = this.locId;
              doc.materialID = item.materialId;
              doc.itemMaterialID = item.rowId || 0;
              doc.description = uiDoc.description || '';
              doc.images = uiDoc.imageUrl.trim();
              doc.materialImages = uiDoc.imageUrl.trim();
              doc.createdBy = this.logInUserId;
              doc.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
              doc.updatedBy = this.logInUserId;
              doc.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
              doc.isDeleted = false;

              item.ticketMaterialDocumentsList.push(doc);
            }
          });
        }
      }
    });

    console.log('Prepared documents with description:', this.description);
    console.log('Prepared documents:', this.ticketObj);
  }

  onDescriptionChange(description: string) {
    this.description = description;
    console.log('Description updated:', this.description);
  }
  //Popup for Upload add images
  showUploadDialog(ticket: TicketItem) {
    console.log('selected item image', ticket);
    this.selectedItemForUpload = ticket;
    this.uploadDialogVisible = true;
    this.selectedImagesPreview = [];
    this.description = '';
    this.documentsList = [];
    this.editingIndex = null;
    this.editingRowId = 0;

    if (ticket.rowId) {
      this.getMaterialDocumentsByMaterialId(ticket.rowId);
    }
  }

  onFileChanged(event: any) {
    const files = event.target.files;

    if (this.editingIndex !== null) {
      this.selectedImagesPreview = [];
    }

    if (files && files.length > 0) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImagesPreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }
  //Add 
  onDocumentUpload() {
    const selectedItem = this.selectedItemForUpload;
    if (!selectedItem) {
      console.error('No item selected for upload');
      return;
    }

    selectedItem.documentDescription = this.description;

    const fileInput: HTMLInputElement = document.querySelector('#certificateFile') as HTMLInputElement;
    const files = fileInput?.files;

    //  only description is updated without changing the image
    if (this.editingIndex !== null && (!files || files.length === 0)) {
      const updatedDoc = {
        ...this.documentsList[this.editingIndex],
        description: this.description,
        rowID: this.editingRowId
      };
      this.documentsList[this.editingIndex] = updatedDoc;

      const materialDocs = this.documentsList.map((d: any) => d.imageUrl).join(',');
      selectedItem.materialDocumentsImages = materialDocs;

      this.finalizeSave(fileInput);
      return;
    }

    if ((files && files.length > 0) || this.editingIndex !== null) {
      const selectedFiles = files ? Array.from(files) : [];

      this.uploadingLoader = true;

      let uploadedCount = 0;

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file: File, index: number) => {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const base64Data = e.target.result;
            this.imageUrl = base64Data;
            this.type = 11;

            const requestObj: any = {
              organisationName: this.orgName,
              locationName: this.locationName,
              imagetype: this.type,
              base64Data: this.imageUrl?.split(';base64,')[1]
            };

            this.commonService.FileUploadFromWeb(requestObj).subscribe((res: any) => {
              const uploadedImageUrl = res.body.data;

              // Determine file type
              const fileType = file.type.includes('image') ? 'image' : 'other';

              const docObj = {
                description: this.description,
                imageUrl: uploadedImageUrl,
                imagePreview: fileType === 'image' ? uploadedImageUrl : null,
                fileType: fileType,
                rowID: 0
              };

              if (this.editingIndex !== null) {
                this.documentsList[this.editingIndex] = {
                  ...this.documentsList[this.editingIndex],
                  ...docObj,
                  rowID: this.editingRowId
                };
              } else {
                this.documentsList.push(docObj);
              }

              const materialDocs = this.documentsList.map((d: any) => d.imageUrl).join(',');
              selectedItem.materialDocumentsImages = materialDocs;

              uploadedCount++;
              if (uploadedCount === selectedFiles.length) {
                this.finalizeSave(fileInput);
                this.uploadingLoader = false;
              }

              this.selectedImagesPreview = [];
            }, () => {
              this.uploadingLoader = false;
            });
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }


  private finalizeSave(fileInput: HTMLInputElement) {
    this.selectedImagesPreview = [];
    this.editingIndex = null;
    this.existingImageUrl = null;
    this.description = '';
    if (fileInput) {
      fileInput.value = '';
    }
    this.prepareMaterialDocumentsList();
  }

  saveAllDocuments() {
    this.uploadDialogVisible = false;
  }

  editDocument(index: number) {
    const doc = this.documentsList[index];
    if (doc) {
      this.editingRowId = doc.rowID || 0;
      this.description = doc.description;
      this.editingIndex = index;
      this.existingImageUrl = doc.imageUrl;
      this.selectedImagesPreview = [doc.imagePreview];
    }
  }

  getMaterialDocumentsByMaterialId(materialID: number) {
    const params = { materialID };

    console.log('Getting documents for ID:', materialID);
    this.commonService.GetMaterialDocumnetsByID(params).subscribe(
      (response: any) => {
        const documents = response?.body?.data;
        this.documentsList = [];

        if (documents && documents.length > 0) {
          documents.forEach((doc: any) => {
            const url = doc.images || doc.materialImages || '';

            const extension = url.split('.').pop()?.toLowerCase();
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

            const fileType = imageExtensions.includes(extension || '') ? 'image' : 'other';

            this.documentsList.push({
              rowID: doc.rowID,
              itemMaterialID: doc.itemMaterialID,
              itemLocalID: doc.itemLocalID,
              description: doc.description || 'No description',
              imageUrl: url,
              imagePreview: fileType === 'image' ? url : null,
              fileType: fileType
            });
          });
        }

        this.prepareMaterialDocumentsList();

        console.log('Documents List:', this.documentsList);
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  onViewDocuments(materialID: number) {
    this.displayDocumentPopup = true;
    this.documentsList = [];
    this.getMaterialDocumentsByMaterialId(materialID);
  }




  removeDocument(index: number) {
    if (this.documentsList[index]) {
      this.documentsList.splice(index, 1);

      if (this.selectedItemForUpload) {
        this.selectedItemForUpload.materialDocumentsImages = this.documentsList
          .map((d: any) => d.imageUrl)
          .join(',');

        if (this.documentsList.length === 0) {
          this.selectedItemForUpload.documentDescription = '';
        }
      }

      this.prepareMaterialDocumentsList();
    }
  }

  removeSelectedImage(index: number) {
    this.selectedImagesPreview.splice(index, 1);

    const fileInput: HTMLInputElement = document.querySelector('#certificateFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  cancelEditing() {
    this.editingIndex = null;
    this.description = '';
    this.existingImageUrl = null;
    this.selectedImagesPreview = [];

    const fileInput: HTMLInputElement = document.querySelector('#certificateFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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
      } else if (type == 11 && this.selectedItemForUpload) {
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
    this.materialList = this.copyMaterialData;
    this.subMaterialList = [];
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
    this.itemNet = isNaN(netQty) ? 0 : netQty;
    this.itemPrice = rowData.itemPrice;
    this.materialNote = rowData.materialNote;
    this.itemImagePath = rowData.itemImagePath;
    this.updateExistingItemDataResponse();
  }

  changeItem() {
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
  }

  changeImage() {
    this.modalHeader = 'Edit Item Details';
    this.editItemVisible = true;

    // this.editItemCloseImageCapture = false;
    this.itemLeveloperationPerform = 'Edit';
  }


  updateExistingItemDataResponse() {
    debugger;
    this.editItemVisible = false;

    if (this.itemLeveloperationPerform === 'Add') {
      // const arr = [];
      const rowData = new TicketItem();
      rowData.rowId = 0;
      rowData.localRowId = this.localRowIdCounter++;
      rowData.itemLocalRowID = this.nextItemLocalRowId++;//Added for img
      rowData.documentDescription = '';
      rowData.groupName = this.itemGroupName;
      rowData.materialName = this.itemMaterialName;
      rowData.materialId = this.itemMaterialId;
      rowData.gross = parseFloat(parseFloat(this.itemGross.toString()).toFixed(3));
      rowData.tare = parseFloat(parseFloat(this.itemTare.toString()).toFixed(3));
      rowData.net = rowData.gross - rowData.tare;
      rowData.price = parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
      rowData.amount = parseFloat(parseFloat((rowData.price * (rowData.gross - rowData.tare)).toString()).toFixed(3));
      rowData.imagePath = (this.itemImagePath?.indexOf('assets/images') >= 0 ? null : this.itemImagePath);
      rowData.codNote = '';
      rowData.materialNote = (this.materialNote || this.materialNote == '' ? this.materialNote : '');
      // const uniqueBarcode = 'MAT' + new Date().getTime().toString();
      // rowData.barcodeNumber = uniqueBarcode;
      rowData.isHold = this.itemIsHold;
      rowData.holdDays = this.itemHoldDays;
      if (rowData.isHold && rowData.holdDays && rowData.holdDays > 0) {
        const transactionDate = new Date();
        transactionDate.setDate(transactionDate.getDate() + rowData.holdDays);
        rowData.holdReleaseDate = this.datePipe.transform(transactionDate, 'yyyy-MM-dd');
      } else {
        rowData.holdDays = 0;
        rowData.holdReleaseDate = null;
      }



      rowData.createdBy = this.logInUserId;
      rowData.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.updatedBy = this.logInUserId;
      rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.isHold = this.itemIsHold;
      rowData.purchaseOrderMaterialID = 0;

      this.ticketObj.push(rowData);
      // this.ticketObj = arr;
      this.getPurchaseOrderMaterialsDropdown(rowData.materialId, rowData, true);


      if (this.itemImagePath.includes(';base64,')) {
        this.SaveBase64Image(1, rowData.localRowId);
      }

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

          if (this.itemImagePath.includes(';base64,')) {
            this.SaveBase64Image(1, rowData.localRowId);
          }
          this.getPurchaseOrderMaterialsDropdown(rowData.materialId, rowData, false);
        }
      });
      this.itemLeveloperationPerform = '';
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
  openPurchaseOrderPopup(ticket: any) {
    this.selectedTicket = ticket;
    this.purchaseOrderPopupVisible = true;
  }

  unlinkPurchaseOrderMaterial() {
    if (!this.selectedTicket) return;

    this.selectedTicket.purchaseOrderMaterialID = 0;
    this.selectedTicket.purchaseOrderID = 0;
    this.selectedTicket.balanceMaterialQty = 0;

  }

  linkPurchaseOrderMaterial(poMaterial: any) {
    if (!this.selectedTicket) return;

    if (Number(this.selectedTicket.net) > Number(poMaterial.balanceMaterialQty)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Over Shipment',
        detail: 'Entered quantity exceeds remaining quantity'
      });
      return;
    }

    this.selectedTicket.purchaseOrderMaterialID = poMaterial.purchaseOrderMaterialID;
    this.selectedTicket.purchaseOrderID = poMaterial.purchaseOrderID;
    this.selectedTicket.balanceMaterialQty = poMaterial.balanceMaterialQty;

    this.purchaseOrderPopupVisible = false;
    // this.selectedTicket = null; 
  }

  getPurchaseOrderMaterialsDropdown(materialId: any, ticket: any, autoSelectIfSingle: boolean = false) {

    const params = {
      CustomerID: parseFloat(this.sellerId),
      MaterialID: materialId,
    };

    console.log(`Fetching PurchaseOrderMaterials for CustomerID: ${this.sellerId}, MaterialID: ${materialId}`);

    this.commonService.GetPurchaseOrderMaterialsByCustomerAndMaterial(params).subscribe({
      next: (data: any) => {
        console.log('Purchase Order Dropdown API response data:', data);

        if (data?.body?.data && data.body.data.length > 0) {
          ticket.purchaseOrderMaterialsDropdown = data.body.data.map((item: any) => ({
            materialName: item.materialName,
            purchaseOrderMaterialID: item.purchaseOrderMaterialID,
            purchaseOrderID: item.purchaseOrderID,
            balanceMaterialQty: item.balanceMaterialQty
          }));

          // Auto-select if only one record is available
          if (autoSelectIfSingle && ticket.purchaseOrderMaterialsDropdown.length === 1) {
            // const singleItem = ticket.purchaseOrderMaterialsDropdown[0];
            // ticket.purchaseOrderMaterialID = singleItem.purchaseOrderMaterialID;
            // ticket.purchaseOrderID = singleItem.purchaseOrderID;
          } else if (autoSelectIfSingle && ticket.purchaseOrderMaterialsDropdown.length === 0) {
            ticket.purchaseOrderMaterialID = 0;
            ticket.purchaseOrderID = 0;
          }
        } else {
          ticket.purchaseOrderMaterialsDropdown = [];
          ticket.purchaseOrderMaterialID = 0;
          ticket.purchaseOrderID = 0;
        }

        console.log('Updated ticket after PO dropdown binding:', ticket);
      },
      error: (err) => {
        console.error('Error fetching GetPurchaseOrderMaterialsByCustomerAndMaterial:', err);
        ticket.purchaseOrderMaterialsDropdown = [];
        ticket.purchaseOrderMaterialID = null;
        ticket.purchaseOrderID = null;
      },
    });
  }

  onPurchaseMaterialChange(ticket: any) {
    ticket.purchaseOrderMaterialID = ticket.purchaseOrderMaterialID ? Number(ticket.purchaseOrderMaterialID) : 0;

    const selectedMaterial = ticket.purchaseOrderMaterialsDropdown.find(
      (m: any) => m.purchaseOrderMaterialID === ticket.purchaseOrderMaterialID
    );

    if (selectedMaterial) {
      ticket.purchaseOrderID = selectedMaterial.purchaseOrderID;
      ticket.balanceMaterialQty = selectedMaterial.balanceMaterialQty;

      if (Number(ticket.net) > Number(ticket.balanceMaterialQty)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Over Shipment',
          detail: `Entered quantity (${ticket.net}) exceeds balance quantity (${ticket.balanceMaterialQty}). Please adjust.`
        });

        setTimeout(() => {
          ticket.purchaseOrderMaterialID = 0;
          ticket.purchaseOrderID = 0;
          ticket.balanceMaterialQty = 0;
        }, 0);
      }

    } else {
      ticket.purchaseOrderID = 0;
      ticket.balanceMaterialQty = 0;
    }

    console.log('ticket after purchase material selection:', ticket);
  }


  getSelectedPurchaseOrderMaterialDisplay(ticket: any) {
    if (ticket.purchaseOrderMaterialID && ticket.purchaseOrderMaterialsDropdown && ticket.purchaseOrderMaterialsDropdown.length > 0) {
      const selected = ticket.purchaseOrderMaterialsDropdown.find(
        (m: any) => m.purchaseOrderMaterialID === ticket.purchaseOrderMaterialID
      );
    }
    if (ticket.purchaseOrderMaterialID && ticket.purchaseOrderID) {
      return `(PO ID: ${ticket.purchaseOrderID} and PO Material ID: ${ticket.purchaseOrderMaterialID})`;
    }
  }

  updateHoldStatus() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeHoldItems = this.ticketObj.filter((item: any) => {
      return item.isHold === true && item.holdReleaseDate && new Date(item.holdReleaseDate) >= today;
    });

    this.isHoldTrue = activeHoldItems.length > 0;

    if (this.isHoldTrue) {
      this.holdticketObj = activeHoldItems;
      this.totalHoldAmount = this.holdticketObj.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
    } else {
      this.holdticketObj = [];
      this.totalHoldAmount = 0;
    }
  }

  addAdjustments() {

    this.editItemCloseImageCapture = false;
    this.clearMaterialCalculatorData();
    this.backToChangeItemMainMaterials();

    this.modalAdjustmentHeader = 'Add Adjustment';
    this.addEditAdjustmentVisible = true;
    this.itemLeveloperationPerform = 'Add';
    this.adjustmentAmount = '';
    this.adjustmentNote = '';
    this.selectedAdjustment = 'Certified Destruction Cost ';
  }

  onAdjustmentChange(value: any) {
    this.selectedAdjustment = value.target.value;
  }

  GetAllAdjustmentType() {
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.GetAllAdjustmentType(paramObject)
      .subscribe(data => {
        console.log('GetAllAdjustmentType :: ');
        console.log(data);
        this.adjustmentList = data.body.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  SaveAdjustment() {
    this.addEditAdjustmentVisible = false;
    this.editItemVisible = false;

    if (this.itemLeveloperationPerform === 'Add') {
      // const arr = [];
      const rowData = new TicketItem();
      rowData.rowId = 0;
      rowData.localRowId = this.localRowIdCounter++;
      rowData.materialName = rowData.concatAdjustments = this.selectedAdjustment;
      rowData.materialNote = this.adjustmentNote;
      rowData.price = rowData.amount = parseFloat(parseFloat(this.adjustmentAmount.toString()).toFixed(3));
      rowData.imagePath = (this.itemImagePath?.indexOf('assets/images') >= 0 ? null : this.itemImagePath);
      rowData.isCOD = false;
      rowData.isAdjusmentSet = true;

      rowData.createdBy = this.logInUserId;
      rowData.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.updatedBy = this.logInUserId;
      rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');

      this.ticketObj.push(rowData);
      // this.ticketObj = arr;

    } else if (this.itemLeveloperationPerform === 'Edit') {
      this.messageAlert(this.selectedAdjustment);


      this.ticketObj.forEach((rowData: any) => {
        if (this.itemLocalRowId === rowData.localRowId) {
          console.log("found " + rowData.rowId);

          this.messageAlert(this.selectedAdjustment);
          rowData.materialName = rowData.concatAdjustments = this.selectedAdjustment;
          rowData.materialNote = this.adjustmentNote;
          rowData.price = rowData.amount = parseFloat(parseFloat(this.adjustmentAmount.toString()).toFixed(3));
          rowData.imagePath = (this.itemImagePath?.indexOf('assets/images') >= 0 ? null : this.itemImagePath);
          rowData.isCOD = false;
          rowData.isAdjusmentSet = true;

          // TO DO:: does not required. need to verify;
          rowData.updatedBy = this.logInUserId;
          rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
          rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
        }
      });

    }

    console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));

    this.calculateTotal(this.ticketObj);
    // this.backToChangeItemMainMaterials();
    // this.backToMainMaterials();
    // this.itemGross = 0;
    // this.itemTare = 0;
    this.adjustmentAmount = '';
    this.adjustmentNote = '';
    this.selectedAdjustment = 'Certified Destruction Cost ';

  }

  closeAdjustment() {
    this.addEditAdjustmentVisible = false;
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

  generateSingleTicketReport(ticketId: any) {
    this.isReceiptPrint = true;
    //this.isReportShow =true;
    //this.showLoaderReport = true; 
    // this.checkPrintAction();
    const param = {
      TicketId: ticketId,
      LocationId: this.locId,
      Type: localStorage.getItem('defaultPrintSize'),
      Advertising: this.adminAdvertisement
    }
    this.showLoaderReport = false;
    const orgName = localStorage.getItem('orgName');
    const apiCall = orgName === 'Sota Recycling'
      ? this.commonService.generateSingleTicketReportSota(param, this.ticketData.isParent)
      : this.commonService.generateSingleTicketReport(param, this.ticketData.isParent);

    apiCall.subscribe(
      data => {
        console.log('generateSingleTicketReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;

        this.showDownload = false;
        this.pdfViwerTitle = 'Ticket Receipt';

        const checkTabView = this.helperService.isTab();
        if (checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj, this.ticketId);
        } else {
          this.loadAndPrintBase64Pdf(this.fileDataObj);
        }
      },
      (err: any) => {
        this.showLoaderReport = false;
        // this.errorMsg = 'Error occurred';
      }
    );
  }



  loadAndPrintBase64Pdf(base64Data: string): void {
    const iframe = document.createElement('iframe');
    iframe.id = 'print-iframe';
    iframe.style.display = 'none'; // optional: hide it
    document.body.appendChild(iframe);

    // Wait for DOM to fully process the iframe append
    requestAnimationFrame(() => {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      iframe.src = blobUrl;

      iframe.onload = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            this.pollPrintStatus();
          } catch (err) {
            console.error("Print error:", err);
          }
        }, 500); // Ensures PDF content is ready to print
      };
    });
  }


  downloadBase64Pdf(base64Data: string): void {
    // Convert Base64 string to byte array




  }


  pollPrintStatus() {
    const checkPrintStatus = () => {
      // You can implement a condition to check if the print dialog is closed
      // For example, check if the browser is active again
      if (document.hidden) {
        setTimeout(checkPrintStatus, 1000);
      } else {
        alert('Ticket Receipt Print...!!!');
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket Receipt Print...!!!' });
        this.afterPrintHandler();
        // Add your post-print logic here
      }
    };
    setTimeout(checkPrintStatus, 1000);
  }


  afterPrintHandler() {
    console.log('Print dialog closed.');
    const existingIframe = document.getElementById('print-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }
    console.log(existingIframe);
    // Perform your actions here
    if (this.isCheckPrint) {
      this.checkPrintAction();
    } else {
      this.router.navigateByUrl(`${this.orgName}/home`);
    }
  }

  closePdfReport() {
    this.showDownload = false;
    // if (this.ticketId && this.ticketId != 0) {
    //   console.log('11111');      
    //   this.checkPrintAction();
    // } else {
    //   console.log('222222');
    //   this.router.navigateByUrl(`${this.orgName}/home`);
    // }

    this.router.navigateByUrl(`${this.orgName}/home`);
  }

  checkReprint(ticketsTransaction: any) {
    this.checkVisible = true;
    this.printCheckNo = ticketsTransaction.checkNumber;
    this.originalCheckNumber = ticketsTransaction.checkNumber;
    this.selectedRowId = ticketsTransaction.rowId;
    // this.ticketId =  ticketsTransaction.
    this.checkAmount = ticketsTransaction.amount
    this.selectedCheckDate = ticketsTransaction.checkDate;

    console.log('Check Reprint Triggered:');
    console.log('Original Check Number:', this.originalCheckNumber);
    console.log('Selected Row ID:', this.selectedRowId);
  }

  generateCheck() {
    console.log('Modified Check Number:', this.printCheckNo);
    console.log('Original Check Number:', this.originalCheckNumber);
    console.log('Selected Row ID:', this.selectedRowId);
    if (this.printCheckNo !== this.originalCheckNumber && this.selectedRowId) {
      // If the check number was modified, then these api will call
      const requestObj = {
        RowID: this.selectedRowId,
        checkNumber: this.printCheckNo,
      };
      const reqParams = {
        RowID: this.selectedRowId,
        checkNumber: this.printCheckNo,
      };
      console.log('Calling UpdateCheckByRowId API with params:', reqParams);



      this.commonService.UpdateCheckByRowId(requestObj, reqParams).subscribe(
        (response) => {
          console.log('Check number updated successfully:', response);
          this.isCheckPrint = true;
          this.checkVisible = false;
          this.checkPrintAction();
          this.getTicketTransactions();
        },
        (error) => {
          console.error('Error updating check number:', error);
          this.checkVisible = false;
        }
      );
    } else {
      // If no changes to the check number, directly print
      console.log('No changes to the check number, proceeding to print.');
      this.isCheckPrint = true;
      this.checkVisible = false;
      this.checkPrintAction();
    }
  }


  getTicketTransactions() {

    const param = {
      TicketId: this.ticketId
    };
    this.getAllTicketsTransactionsByTicketId(param);
  }

  getAllTicketsTransactionsByTicketId(paramObj: any) {
    console.log(paramObj);
    this.commonService.getAllTicketsTransactionsByTicketId(paramObj)
      .subscribe(data => {
        console.log('getAllTicketsTransactionsByTicketId :: ');
        console.log(data);
        if (data.body.data.length > 0) {
          this.ticketsTransactions = data.body.data;

        } else {
          this.showPartially = false;
          this.showOpen = true;
        }
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


  generateCheckPrintReportDefault(ticketId: any, checkAmount: any) {
    this.showLoaderReport = true;

    let amount = checkAmount;
    console.log('getCheckPrintReport Check Print Data for Address :: ', this.customer);

    var num = amount.toString().split(".");
    let doller = this.convertNumberToWords(num[0]);
    let cent = '';
    if (num.length > 1) {
      // cent = this.convertNumberToWords(num[1])

      let centValue = num[1].padEnd(2, '0').substring(0, 2); // ensure exactly 2 digits
      cent = this.convertNumberToWords(parseInt(centValue));
    }
    let amountInWord = ((doller.length == 0 ? 'Zero ' : doller) + 'DOLLARS AND ' + (cent.length == 0 ? 'Zero' : cent) + ' CENTS ONLY').toUpperCase()
    console.info(amountInWord);
    const fullAddress = `${this.customer?.streetAddress}<br/>${this.customer?.city} ${this.customer?.state} ${this.customer?.zipCode}`;
    const payeeName = this.isBusinessOwnerName && this.customer?.businessOwnerName ? this.customer.businessOwnerName.toUpperCase() : this.customer?.checkName?.toUpperCase();
    const param = {
      TicketId: ticketId,
      FullName: payeeName,
      PrintDate: this.formatDate(new Date()),
      CheckDate: this.formatDate(this.selectedCheckDate),
      CheckAmount: (Math.round(checkAmount * 100) / 100).toFixed(2),
      AmountInWord: amountInWord,
      OrgName: this.orgName,
      Address: fullAddress
    }

    this.commonService.getCheckPrintReport(param)
      .subscribe(data => {
        this.showLoaderReport = false;
        console.log('getCheckPrintReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = true;
        this.pdfViwerTitle = 'Check For Print';
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  async generateCheckPrintReport(ticketId: any, checkAmount: any) {
    this.showLoaderReport = true;

    try {
      // --- 1. Prepare all the dynamic data ---
      const amount = checkAmount;
      const num = amount.toString().split(".");
      const doller = this.convertNumberToWords(num[0]);
      let cent = '';
      if (num.length > 1) {
        // Ensure cents are handled correctly, e.g., '5' becomes '05'
        const centVal = num[1].padEnd(2, '0');
        cent = this.convertNumberToWords(centVal);
      }
      const amountInWord = ((doller.length == 0 ? 'Zero ' : doller) + 'DOLLARS AND ' + (cent.length == 0 ? 'Zero' : cent) + ' CENTS ONLY').toUpperCase();
      const fullAddress = `${this.customer?.streetAddress}<br/>${this.customer?.city} ${this.customer?.state} ${this.customer?.zipCode}`;
      const payeeName = this.isBusinessOwnerName && this.customer?.businessOwnerName ? this.customer.businessOwnerName.toUpperCase() : this.customer?.checkName?.toUpperCase();

      // --- 2. Create the data object for the template ---
      // IMPORTANT: The keys here MUST match the placeholders in your template.
      // e.g., for {{name}}, the key is 'name'. For {{amount}}, the key is 'amount'.
      const printData: PrintData = {
        payee_name: payeeName,
        company_name: this.orgName, // Assuming you have this.orgName
        date: this.formatDate(new Date()),
        company_address: fullAddress,
        amount: (Math.round(checkAmount * 100) / 100).toFixed(2),
        amount_in_words: amountInWord,
        memo: ticketId,
        print_date: this.formatDate(new Date()),
        check_issued_date: this.formatDate(this.selectedCheckDate),
        // You had 'dollers' in your placeholder list, let's map to the 'doller' word part.
        dollars: doller.toUpperCase()
      };

      // --- 3. Call the service to fetch, populate, and print the template ---
      await this.templatePrintService.print(printData);

    } catch (err: any) {
      // The service will throw an error if the template isn't found or something else goes wrong.
      console.error("Error generating check print report:", err);
      // You can show a user-friendly error message here
      // this.errorMsg = 'Error: Could not generate the check. The template may be missing.';
      // alert('Error: Could not generate the check. The template may be missing or another error occurred.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error: Could not generate the check. The template may be missing or another error occurred.' });
    } finally {
      // --- 4. Always hide the loader ---
      this.showLoaderReport = false;
    }
  }

  formatDate(dateStr: any) {
    const d = new Date(dateStr);
    return (d.getMonth() + 1).toString().padStart(2, '0') + '/' + d.getDate().toString().padStart(2, '0') + '/' + d.getFullYear();
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
      let value;
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



  showSelectedImage(imageUrl: string, selectionType: any) {
    this.selectedImageUrl = imageUrl;
    this.showImage = true;
    if (selectionType == '1') {
      this.showImageHeader = 'Show Material Image';
    } else if (selectionType == '2') {
      this.showImageHeader = 'Show seller photo';
    } else if (selectionType == '11') {
      this.showImageHeader = 'Ticket Document image';
    }
  }

  cancelImage() {
    this.showImage = false;
  }



  SaveBase64Image(type: number, localRowId: number) {

    let requestObj: any = {
      organisationName: this.orgName,
      locationName: this.locationName,
      imagetype: type,
      base64Data: this.itemImagePath?.split(';base64,')[1]
    };

    this.commonService.FileUploadFromWeb(requestObj).subscribe((res: any) => {
      console.log('Image url path :: {}', res.body.data);
      console.log(res.body.data);
      if (type == 1 && localRowId >= 0) {
        const index = this.ticketObj.findIndex((i: any) => i.localRowId === localRowId);
        if (index !== -1) {
          this.ticketObj[index].imagePath = res.body.data;
        }
      }
    });
  }

  fetchAllMaterials() {
    // If already loaded, don't reload unless forced (you can remove this check if needed)
    if (this.allMaterials.length > 0) {
      console.log('Materials already loaded:', this.allMaterials.length);
      return;
    }

    this.materialsLoading = true;
    const paramObject = { LocationId: this.locId };

    console.log('Fetching Material Groups...');

    this.commonService.getAllGroupMaterial(paramObject).pipe(
      switchMap((response: any) => {
        // Handle response structure safety
        const groups = response?.body?.data || response?.data || [];

        if (!groups || groups.length === 0) {
          console.warn('No Material Groups found.');
          return of([]);
        }

        console.log(`Found ${groups.length} groups. Fetching sub-materials...`);

        // Create an array of observables, each fetching sub-materials for one group.
        const subMaterialObservables = groups.map((group: any) =>
          this.commonService.getAllSubMaterials({ MaterialID: group.rowId, LocationId: this.locId }).pipe(
            map((subResponse: any) => {
              // Handle response structure safety for sub-materials
              const subMaterials = subResponse?.body?.data || subResponse?.data || [];
              // Attach the groupName to each sub-material
              return subMaterials.map((subMat: any) => ({ ...subMat, groupName: group.groupName }));
            }),
            catchError(err => {
              console.error(`Error fetching sub-materials for group ${group.groupName}`, err);
              return of([]); // Continue even if one group fails
            })
          )
        );

        return forkJoin(subMaterialObservables) as Observable<any[][]>;
      }),
      map((arrayOfSubMaterialArrays: any[][]) => {
        return arrayOfSubMaterialArrays.flat();
      })
    ).subscribe({
      next: (allMaterials: any[]) => {
        this.allMaterials = allMaterials;
        console.log('✅ AI Material Database loaded. Total Items:', this.allMaterials.length);
        // Log the first item to verify structure
        if (this.allMaterials.length > 0) console.log('Sample Material:', this.allMaterials[0]);

        this.materialsLoading = false;
      },
      error: (err: any) => {
        console.error('❌ Failed to load material list:', err);
        this.messageService.add({ severity: 'error', summary: 'System Error', detail: 'Could not load material database for AI.' });
        this.materialsLoading = false;
      }
    });
  }

  private findSuggestedMaterials(predictionName: string): any[] {
    // 1. Safety Check
    if (!predictionName || !this.allMaterials || this.allMaterials.length === 0) {
      return [];
    }

    // 2. Helper to clean strings (remove special chars, lowercase)
    const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    // 3. Define your Abbreviation Map
    const abbreviationMap: { [key: string]: string } = {
      'alu': 'aluminium',
      'copp': 'copper',
      'st': 'steel',
      'fe': 'iron',
      'ewaste': 'electronic',
      'ss': 'stainless',
      'pvc': 'plastic',
      'hdpe': 'plastic',
      'rad': 'radiator',
      'bat': 'battery'
    };

    // 4. Initialize Keywords from the Prediction (e.g., "ALUMINIUM" -> ["aluminium"])
    let searchKeywords = predictionName
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .filter(k => k.length > 1); // Remove single chars

    // --- CRITICAL FIX: EXPAND KEYWORDS ---
    // If prediction is "Aluminium", add "alu". If "Alu", add "Aluminium".
    const expandedKeywords = new Set<string>(searchKeywords);

    searchKeywords.forEach(word => {
      // Check if 'word' is a Short form (key) -> Add Long form (value)
      if (abbreviationMap[word]) {
        expandedKeywords.add(abbreviationMap[word]);
      }

      // Check if 'word' is a Long form (value) -> Add Short form (key)
      // Example: word is "aluminium", we find 'alu' maps to it, so we add 'alu'
      const shortForm = Object.keys(abbreviationMap).find(key => abbreviationMap[key] === word);
      if (shortForm) {
        expandedKeywords.add(shortForm);
      }
    });

    // Convert back to array for looping
    const finalKeywords = Array.from(expandedKeywords);
    // e.g., now contains ["aluminium", "alu"]

    // 5. Scoring Logic
    const scoredMaterials = this.allMaterials.map(material => {
      let score = 0;
      const matNameNorm = normalize(material.materialName);
      const groupNameNorm = normalize(material.groupName);

      finalKeywords.forEach(keyword => {
        const cleanKey = normalize(keyword);
        if (!cleanKey) return;

        // Check Material Name
        if (matNameNorm.includes(cleanKey)) {
          score += 10;
          // Bonus for exact word match (avoids "alu" matching "value")
          // We check the non-normalized string for word boundaries
          if (material.materialName.toLowerCase().split(/[\s/]+/).includes(keyword)) {
            score += 5;
          }
        }

        // Check Group Name
        if (groupNameNorm.includes(cleanKey)) {
          score += 5;
        }
      });

      return { ...material, score };
    });

    // 6. Return top 5 matches sorted by score
    return scoredMaterials
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  // --- Toggle Handler ---
  onMetalDetectionChange(event: any) {
    localStorage.setItem('isMetalDetectionEnabled', String(this.isMetalDetectionEnabled));

    // If user just turned it ON, load the database
    if (this.isMetalDetectionEnabled && this.allMaterials.length === 0) {
      this.fetchAllMaterials();
    }
  }

  // --- AI / Metal Detection Logic ---

  openManualAddDialog() {
    this.showManualAddDialog = true;
    this.manualMaterialName = '';
  }

  openManualSearchFromPrediction() {
    this.showMlPredictionDialog = false;
    this.openManualAddDialog();
  }

  formatPredictionName(name: string): string {
    return name ? name.replace(/_/g, ' ').toUpperCase() : '';
  }

  onPredictionHeaderSelected(prediction: any) {
    this.showMlPredictionDialog = false;
    this.addItem(0, this.formatPredictionName(prediction.class_name), 'AI Predicted', 0);
  }

  onSuggestedMaterialSelected(material: any): void {
    if (!material) return;

    // 1. Close the dialog immediately
    this.showMlPredictionDialog = false;

    // 2. Use setTimeout to allow the dialog to close and view to update
    setTimeout(() => {
      // OPTIONAL: If you want to ensure addItem finds this material's metadata, 
      // you can push it to subMaterialList or just rely on defaults.
      // Better yet, let's extract the metadata here if needed, but standard addItem 
      // call should work if calculator handles defaults.

      // Explicitly set these if they are available on the material object from allMaterials
      this.itemMarketPrice = material.marketPrice || 0;
      this.itemIsHold = material.isHold || false;
      this.itemHoldDays = material.holdDays || 0;

      this.addItem(
        material.rowId,
        material.materialName,
        material.groupName,
        this.calculatePrice(material)
      );
    }, 100);
  }

  onManualMaterialSubmit() {
    if (this.manualMaterialName) {
      this.showManualAddDialog = false;
      this.addItem(0, this.manualMaterialName, 'Manual Entry', 0);
    }
  }

  getAllTicketScaleTypes() {
    this.commonService.GetAllTicketScaleTypes({}).subscribe((data: any) => {
      this.ticketScaleTypeList = data.body?.data;
    },
      (err) => {
        console.error('Failed to load ticket scale types:', err);
      });
  }

}
