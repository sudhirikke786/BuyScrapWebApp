import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { InvoiceItem } from 'src/app/core/model/invoice-item.model';
import { Invoice } from 'src/app/core/model/invoice.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { PriceCalculatorComponent } from '../../shared/commonshared/price-calculator/price-calculator.component';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tick } from '@angular/core/testing';
import { InvoiceCalculatorComponent } from '../Invoice-calculator/invoice-calculator.component';

import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';




@Component({
  selector: 'app-invoice-ticket-detail',
  templateUrl: './invoice-ticket-detail.component.html',
  styleUrls: ['./invoice-ticket-detail.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class InvoiceTicketDetailComponent implements OnInit , AfterViewInit {
  [x: string]: any;
  @ViewChild('htmlData') htmlData!: ElementRef;

  @ViewChild('searchMaterialInput' , { static: false }) searchMaterialInput!: ElementRef;

  @ViewChild('searchsubMaterialInput' , { static: false }) searchsubMaterialInput!: ElementRef;

  


  showCalculator = false;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;

  cheight = '50vh';

  isHoldTrue: boolean = false;

  selectedHoldAmount = 'Pay Total Amount'


  invoiceObj: any = [];
  holdinvoiceObj: any = [];
  orgName: any;
  sellerId: any;
  invoiceId: any;
  locId: any;
  logInUserId: any;
  locationName: any;
  showImage = false;

  invoiceData: any = {};
  customer: any;
  user: any;
  totalNoOfMaterial: any;
  totalGross: any;
  totalTare: any;
  totalNet: any;
  totalAmount: any;
  totalAdjustment: any;
  totalActualAmount: any;
  totalRoundingAmount: any;

  isEditModeOn = false;
  materialList: any;
  subMaterialList: any;
  mainMaterialsVisible = true;
  changeItemMaterialsVisible = true;
  selectedMaterial = '';
  editItemVisible = false;
  editItemCloseImageCapture = false;
  modalHeader = '';

  webcamImage: WebcamImage | undefined;
  imageUrl: any;
  isChangeItemOn = false;


  itemRowId: number = 0;
  itemLocalRowId: number = 0;
  itemGroupName: string = '';
  itemMaterialName: string = '';
  itemMaterialId: number = 0;
  itemGross: any;
  itemPrice: any;
  itemImagePath: string = 'assets/images/custom/id_scan.png';
  itemDefaultImagePath: string = 'assets/images/custom/id_scan.png';
  materialNote: any = null;
  itemCodNote: any = null;
  itemLeveloperationPerform: string = '';
  localRowIdCounter: number = 0;


  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  isCODRequired = false;
  dCamera:any; 

  invoicesTransactions: any;
  defaultSelectedInvoicesTypes = [
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
  pdfViwerTitle = 'Invoice Receipt';
  isCheckPrint = false;
  checkAmount = 0;
  isLoading = false;
  systemInfo: any;
  signPadVisible = false;
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
  
  newInvoiceList = [{
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
  
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';

  copyMaterialData:any[]  = [];
  copySubMaterialData:any[]  = [];



  @ViewChild(InvoiceCalculatorComponent) InvoiceCalculatorComponent!:InvoiceCalculatorComponent;
  


  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authService: AuthService,
    private messageService: MessageService,
    private stroarge: StorageService,
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    public commonService: CommonService) { }

  ngOnInit() {    
    window.addEventListener('afterprint', this.afterPrintHandler);
    this.currentRole = this.authService.userCurrentRole();

    this.orgName = localStorage.getItem('orgName');
    this.subScriptionType = this.dataService.getActivePlan();


    const mCamera =  localStorage.getItem('metarialCamera') ;
    if(mCamera) {
      this.dCamera = mCamera;
    }


    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      const isElectronic = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'iselectronicpayment')[0];
      this.systemInfo = isElectronic?.values;
    

      const checkKeyboard = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'isvirtualkeyboard')[0];
      this.isVirtual = checkKeyboard?.values == 'True' ? true : false ;
      console.log(this.isVirtual)

      const isSignatureOnReceipt = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'signatureonreceipt')[0];
      this.signPadVisible = (isSignatureOnReceipt?.values.toLowerCase() === "true");
    }


    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.route.params.subscribe((param) => {
      this.invoiceId = param["invoiceId"];
      this.sellerId = param["customerId"];
     
      this.getSellerById();
      this.processDataBasedOnInvoiceId();
    //  this.GetAllAdjustmentType();
      this.getInvoiceTransactions();
    });

    this.route.queryParams.subscribe(params => {

      const types  = params['type'];
      if(types=='seller'){
        this.backUrl = `/${this.orgName}/sellers-buyers`;
      }else{
        this.backUrl = `/${this.orgName}/invoice`;
      }

    });

    this.sellerForm = this.fb.group({
      firstName : ['',Validators.required],
      sellerType:[this.sellerType],
      middleName : [''],
      lastName : ['']
    });


  }


  ngAfterViewInit() {
    // if(this.searchMaterialInput){
    //   fromEvent(this.searchMaterialInput.nativeElement, 'input')
    //   .pipe(
    //     map((event: any) => event.target.value),
    //     debounceTime(300),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((term: string) => {
    //     this.searchMaterial(term);
    //   });
    // }
  
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
    this.updateInvoiceObjectForCOD('Flagged for COD');
  }

  removeCode(obj: any) {
    // remove the Data from Table
    this.selectedRowObj = obj;
    this.itemLocalRowId = this.selectedRowObj.localRowId;
    this.updateInvoiceObjectForCOD('');
  }

  private updateInvoiceObjectForCOD(itemCodNote: any) {
    this.invoiceObj.forEach((rowData: any) => {
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

  private processDataBasedOnInvoiceId() {
    if (parseInt(this.invoiceId)) {
      this.GetInvoiceMaterialsDetailsByInvoiceId();
      this.getAllInvoicesDetails();
      this.getInvoiceTransactions();
    } else {
      this.invoiceId = 0;
      this.invoiceData['createdDate'] = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      this.invoiceData['status'] = 'NEW INVOICE';
      this.invoiceData['paidAmount'] = 0;
      this.invoiceData['balanceAmount'] = 0;
      

      this.invoiceObj = [];

      this.totalNoOfMaterial = 0;
      this.totalGross = 0;
      this.totalTare = 0;
      this.totalNet = 0;
      this.totalRoundingAmount = 0;
      this.totalAmount = 0;
      this.totalAdjustment = 0;
      this.totalActualAmount = 0;
      this.editInvoiceDetails();
    }
  }


  isInputValid(input: any): boolean {
    const numberFloatRegex: RegExp = /^-?\d+(\.\d+)?$/;
    return numberFloatRegex.test(input);
  }

  errorAlert(msg:any){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  messageAlert(msg:any) {    
    this.alertVisible = true;
    this.alertMessage = msg;
  }

  addTransction() {

    if (this.selectedPayAmount <= 0) {
      this.messageAlert('Please Enter Amount')
      return;
    }

    if (!this.isInputValid(this.selectedPayAmount)) {
   
      this.messageAlert('Add valid input')
      return;
    }

    const findItemExist = this.transactionPaymentType.findIndex((item: any) => item.typeofPayment?.toLowerCase() == this.activeSection?.toLowerCase())
    const checkPrice = this.checkTotalAmount();

    if (checkPrice) {

      this.messageAlert('adding amount is greter than total amount')
    
      return;
    }

    
    if (this.activeSection == 'Check') {
      if (this.checkNumber.length == 0) {
      

        this.messageAlert('Enter Check Number')
        return;
      }
    } else if (this.activeSection == 'Electronic Payment') {
      if (this.ePaymentType?.length == 0) {
        this.messageAlert('Enter Electronic Payment Type')
      //  alert('Enter Electronic Payment Type');
        return;
      }
    } else if (this.activeSection == 'Cash') {
      let text = 'You selected as Cash as payment mode please confirm ?';
      if (confirm(text) != true) {
        return;
      }

    }


    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        const total = this.getTotal();
        const eligiblePayAmount = this.totalAmount - total - this.totalHoldAmount;
        if (this.selectedPayAmount > eligiblePayAmount) {
          //alert('Exclude hold item amount');
          this.messageAlert('Exclude hold item amount')
          this.selectedPayAmount = eligiblePayAmount;
          return;
        }
        break;
      case 'Hold All Amount':
      //  alert('You have selected option as "Hold All Amount"!!!');
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
      this.transactionPaymentType.splice(this.transactionPaymentType.length - 1, 1)
   //   window.alert("adding amount is greter than total amount")

      this.messageAlert('adding amount is greter than total amount')
    
      return false;
    }

    this.remainingAmount = this.totalAmount - this.totalAdjustment - this.invoiceData?.paidAmount - this.getTotal();
    this.selectedPayAmount = this.remainingAmount;


  }

  getType() {
    let str = '';
    if (this.activeSection == 'Cash') {
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
      if (Number(total) > Number(this.totalAmount)) {
        checkError = true;
      }
    }
    return checkError;

  }

  removeItem(i: number) {
    this.transactionPaymentType.splice(i, 1);
    
    this.remainingAmount = this.totalAmount - this.totalAdjustment - this.invoiceData?.paidAmount - this.getTotal();
    this.selectedPayAmount = this.remainingAmount;
  }


  getTotal(): number {
    return this.transactionPaymentType.reduce((sum: number, curr: any) => {
      return sum = sum + Number(curr.typeofAmount)
    }, 0)
  }

  get isDisabled(): boolean {
    return (this.getTotal() < this.totalAmount);
  }


  getAllInvoicesDetails() {
    this.isLoading = true;
    const paramObject = {
      LocationId: this.locId,
      SerachText: this.invoiceId,
      SearchOrder: 'InvoiceId',
      PageNumber: 1,
      RowOfPage: 10
    };
    this.commonService.GetAllInvoiceDetails(paramObject)
      .subscribe(data => {
        console.log('getAllInvoicesDetails for invoiceId :: ');
        console.log(data);
        this.invoiceData = data.body.data[0];
        this.isCODRequired = this.invoiceData.isCOD;
        this.totalRecords = data.totalRecords;
        const userId = data.body.data[0].createdBy;

        this.getAllUsers(userId);
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
    this.getAllInvoicesDetails();
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
    const paramObject = {
      ID: this.sellerId,
      LocationId: this.locId
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


  GetInvoiceMaterialsDetailsByInvoiceId() {
    const paramObject = {
      InvoiceId: this.invoiceId,
      locid: this.locId,
      IsCOD: false,
      IsCODDone: false
    };
    this.commonService.GetInvoiceMaterialsDetailsByInvoiceId(paramObject)
      .subscribe(data => {
        console.log('GetInvoiceMaterialsDetailsByInvoiceId :: ');
        console.log(data);
        this.invoiceObj = data.body.data.map((item: any) => {
          item.isSelected = false;
          return item
        });

        this.holdinvoiceObj = null;
        this.holdinvoiceObj = data.body.data.filter((obj: any) => {
          return obj.isHold === true
        });
        this.isHoldTrue = (this.holdinvoiceObj.length > 0) ? true : false;

        this.calculateTotal(this.invoiceObj);
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  calculateTotal(invoices: any) {
    this.totalNoOfMaterial = invoices.length;
    this.totalGross = invoices.reduce(function (sum: any, invoices: any) {
      return sum + invoices.quantity;
    }, 0);
    this.totalActualAmount = invoices.reduce(function (sum: any, invoices: any) {
      // return sum + (invoices.isAdjusmentSet ? invoices.amount * -1 : invoices.amount);
      return sum + (invoices.amount);
    }, 0);

    this.totalAmount = Math.round(this.totalActualAmount);
    this.totalRoundingAmount = this.totalAmount - this.totalActualAmount;
    this.totalAdjustment = invoices.reduce(function (sum: any, invoices: any) {
      // return sum + (invoices.isAdjusmentSet ? invoices.amount * -1 : 0);
      return sum + (invoices.isAdjusmentSet ? invoices.amount : 0);
    }, 0);
  }

  editInvoiceDetails() {
    this.isEditModeOn = true;
    this.getAllGroupMaterial();
  }


  searchMaterial(searchTerm:any){

    const inputParms =  searchTerm.target.value.toLowerCase();
    if(inputParms){
      this.materialList = this.copyMaterialData.filter((item) => item?.groupName?.toLowerCase().includes(inputParms))
    }else{
      this.materialList = this.copyMaterialData 
    }

  }


  
  searchSubMaterial(searchTerm:any){

    const inputParms =  searchTerm.target.value.toLowerCase();
    if(inputParms){
      this.subMaterialList = this.copySubMaterialData.filter((item) => item?.materialName?.toLowerCase().includes(inputParms))
    }else{
      this.subMaterialList = this.copySubMaterialData 
    }

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
        this.subMaterialList = data?.body?.data;
        this.copySubMaterialData = data?.body?.data;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


  confirmSave() {
    if (this.invoiceId != 0) {
      this.saveConfirmVisible = true;
      this.signaturePadVisible = false;
    } else {
      if (this.signPadVisible && this.currentRole !== 'Scale') {
        this.saveConfirmVisible = false;
        this.signaturePadVisible = true;
      } else {
        this.saveConfirmVisible = true;
        this.signaturePadVisible = false;
      }
    }
  }

  showPayment(isReceiptPrint: boolean) {
    this.isReceiptPrint = isReceiptPrint;
    this.paymentVisible = true;
    this.selectedPayAmount = this.remainingAmount = this.payAmount = this.totalAmount - this.totalAdjustment - this.invoiceData?.paidAmount;
    this.showSection('Cash');
  }


  showSection(paymentType: string) {
    this.activeSection = paymentType;

    setTimeout(() => {
      this.selectedCheckDate = new Date().toISOString().split('T')[0];
    }, 10)
    this.checkNumber = '';
    this.ePaymentType = '';

    if (this.isHoldTrue) {
      this.totalHoldAmount = this.holdinvoiceObj.reduce((acc: any, curr: any) => acc + curr.amount, 0);
    }
    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        if (this.totalHoldAmount >= this.payAmount && (this.totalHoldAmount != 0 || this.payAmount != 0)) {
          alert(`Hold amount ( $${this.totalHoldAmount} ) is equal or more than total pay amount ( $${this.payAmount} )`);
          this.payAmount = 0;
        } else {
          this.payAmount = this.totalAmount - this.invoiceData?.paidAmount - this.totalHoldAmount;
        }
        break;
      case 'Hold All Amount':
        this.payAmount = 0;
        break;
    }
  }

  payAndSave(activeSection: string) {

    if (this.transactionPaymentType.length > 1) {      
      let text = 'You selected multiple payment mode please confirm ?';
      if (confirm(text) != true) {
        return;
      }
    }

    const payAmout = this.getTotal();

    if (payAmout == 0 && this.selectedPayAmount> 0) {
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
    if (this.payAmount > 0 && parseFloat(this.payAmount.toString()) > (parseFloat(this.totalAmount.toString()) - this.invoiceData?.paidAmount)) {
      this.messageAlert('adding amount is greter than total amount')
      return;
    }

    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        const eligiblePayAmount = this.totalAmount - this.invoiceData?.paidAmount - this.totalHoldAmount;
        if (this.payAmount > eligiblePayAmount) {
        //  alert('Exclude hold item amount');

          this.messageAlert('Exclude hold item amount')
          this.payAmount = eligiblePayAmount;
          return;
        }
        break;
      case 'Hold All Amount':

         this.messageAlert('You have selected option as "Hold All Amount"!!!')
      //  alert('You have selected option as "Hold All Amount"!!!');
        this.payAmount = 0;
        return;
        break;
    }

    let msg = '';

    if (this.activeSection == 'Check') {
      // msg = 'Do You want to print receipt?'
      if (this.checkNumber.length == 0) {
        //alert('Enter Check Number');
        this.messageAlert('Enter Check Number')
   
        return;
      }
    } else if (this.activeSection == 'Electronic Payment') {
      // msg = 'Do You want to print receipt?'
      if (this.ePaymentType?.length == 0) {
       // alert('Enter Electronic Payment Type');

        this.messageAlert('Enter Electronic Payment Type')
        return;
      }
    } else {
      // TO DO:: Needs to check condition when directly hitting to pay amount
      // msg = 'You selected as Cash as payment mode please confirm ?';
      // this.messageAlert(msg);
    }
    
    this.isReceiptPrint = true;
    this.saveInvoiceDetails(this.payAmount, this.isReceiptPrint);
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
          invoiceId: parseInt(this.invoiceId),
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
          invoiceId: parseInt(this.invoiceId),
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
          invoiceId: parseInt(this.invoiceId),
          type: item.typeofPayment,
          amount: parseFloat(item.typeofAmount),
          checkNumber: item.paymentType,
          barCode: '',
          guid: '',
          dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
        });
      }

      return item
    })

    if (this.isReceiptPrint) {      
      let text = "Do you want to print receipt?";
      if (confirm(text) != true) {
        this.isReceiptPrint = false;
      }
    }
    if (isCheckTransaction) {
      this.isCheckPrint = true;
    }

    const transactionObj = {
      invoicetransaction : {
        localRowId: 0,
        rowId: 0,
        createdBy: this.logInUserId,
        createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        invoiceId: parseInt(this.invoiceId),
        type: this.transactionPaymentType[0]?.typeofPayment,
        amount: 0,
        checkNumber: '',
        barCode: '',
        guid: '',
        dateClosed: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
      },
      lsinvoicetransaction : payTransactionObj
    };

    this.commonService.insertInvoiceTransactions(transactionObj).subscribe(data => {
     
      this.cancelEditInvoice(this.isReceiptPrint, this.invoiceId); 
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
      LocationId: this.locId
    };
    this.commonService.getCashDrawerAmountAndPaidTicketCount(paramObject)
      .subscribe((data: any) => {
          console.log('getCashDrawerAmountAndPaidTicketCount :: ');
          console.log(data);
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




  saveInvoiceDetails(paidAmount: number, isReceiptPrint: boolean) {
    // alert(paidAmount);
    // alert(this.totalAmount);
    let invoiceStatus = 'OPEN';
    if (paidAmount > 0 && paidAmount == this.totalAmount) {
      invoiceStatus = 'PAID';
    }

    if (this.invoiceId != 0) {
      if (paidAmount > 0 && paidAmount == (this.totalAmount - this.invoiceData?.paidAmount)) {
        invoiceStatus = 'PAID';
      } else if (paidAmount > 0 && paidAmount != this.totalAmount) {
        invoiceStatus = 'Partially Paid';
      }
      this.isEditModeOn = false;
      this.invoiceData.status = invoiceStatus;
      this.invoiceData.amount = parseFloat(this.totalAmount.toFixed(3));
      this.invoiceData.balanceAmount = parseFloat(this.totalAmount.toFixed(3));
      this.invoiceData.roundingAmount = parseFloat(this.totalRoundingAmount.toFixed(3));
      this.invoiceData.totalAmount = parseFloat(this.totalActualAmount.toFixed(3));
      this.invoiceData.paidAmount = parseFloat(paidAmount.toString());
      this.invoiceData.lstttransactionMasterDTO = this.invoiceObj;
      this.invoiceData.updatedBy = this.logInUserId;
      this.invoiceData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      this.invoiceData.customerId = parseFloat(this.sellerId);
      this.invoiceData.customerName = this.customer?.fullName;
    } else {
      const newInvoice = new Invoice();
      newInvoice.rowId = 0;
      newInvoice.createdBy = this.logInUserId;
      newInvoice.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newInvoice.updatedBy = this.logInUserId;
      newInvoice.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newInvoice.customerId = parseFloat(this.sellerId);
      newInvoice.invoiceId = 0;
      newInvoice.status = invoiceStatus;
      newInvoice.amount = parseFloat(this.totalAmount.toFixed(3));
      newInvoice.balanceAmount = parseFloat(this.totalAmount.toFixed(3));
      newInvoice.roundingAmount = parseFloat(this.totalRoundingAmount.toFixed(3));
      newInvoice.totalAmount = parseFloat(this.totalActualAmount.toFixed(3));
      newInvoice.paidAmount = parseFloat(paidAmount.toString());
      newInvoice.dateOpened = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newInvoice.dateClosed = null;
      newInvoice.customerName = this.customer?.fullName;
      newInvoice.locID = this.locId;
      newInvoice.lstttransactionMasterDTO = this.invoiceObj;
      newInvoice.buyerSignature = this.sellerSignatureImagePath;

      this.invoiceData = newInvoice;
      this.sellerSignatureImagePath = null;
    }


    console.log("Final invoiceData :: " + JSON.stringify(this.invoiceData));

    this.commonService.insertUpdateInvoice(this.invoiceData).subscribe(data => {
      console.log(data);

      
      if (this.transactionPaymentType.length > 0) { 
        const oldInvoiceId = this.invoiceId;       
        this.invoiceId = data.body.insertedRow;
        this.saveTransactionData(this.activeSection);
        this.saveConfirmVisible = false;
      } else {     
        this.invoiceId = data.body.insertedRow;
        this.saveConfirmVisible = false;     
        this.cancelEditInvoice(isReceiptPrint, this.invoiceId);
      }

      // this.confirmSave();
      // alert('Invoice Inserted/ updated successfully');
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Invoice Inserted/ updated successfully' });
      
    }, (error: any) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
  }

  cancelEditInvoice(isReceiptPrint: boolean, invoiceId: any) {
    // alert('Refresh' + this.invoiceId);
    if (invoiceId && invoiceId != 0) {
      console.log('11111');
      this.isEditModeOn = false;
      this.editItemCloseImageCapture = false;
      this.processDataBasedOnInvoiceId();
    } else if (invoiceId == 0 && !isReceiptPrint) {
      console.log('222222');
      this.router.navigateByUrl(`${this.orgName}/invoice`);
    }
    if (isReceiptPrint) {
      this.generateSingleInvoiceReport(invoiceId);
    } else {
      if (this.isCheckPrint) {
        this.checkPrintAction();
      } else {
        this.router.navigateByUrl(`${this.orgName}/invoice`);
      }       
    }
  }

  private checkPrintAction() {
    if (this.isCheckPrint) {

      this.messageAlert('Please insert Check into Printer!!!');

      // alert("Please insert Check into Printer!!!");
      // Open Pdf viewer          
      this.showDownload = true;
      this.pdfViwerTitle = 'Check For Print';
      this.generateCheckPrintReport(this.invoiceId, this.checkAmount);
      this.isCheckPrint = false;
      this.checkAmount = 0;
    }
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
    this.itemLeveloperationPerform = this.itemLeveloperationPerform == '' ? 'Add' : this.itemLeveloperationPerform;
    this.itemCodNote = '';    
    this.itemGross = '';
    this.itemImagePath = '';
    this.closeCapturedImage(1)
    // this.materialNote = '';
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
      this.modalHeader =  'Edit Item Details';
      this.editItemVisible = true;
      
      this.editItemCloseImageCapture = false;
      this.itemLeveloperationPerform = 'Edit';

      this.itemRowId = rowData.rowId;
      this.itemLocalRowId = rowData.localRowId;
      this.itemGroupName = rowData.groupName;
      this.itemMaterialName = rowData.materialName;
      this.itemMaterialId = rowData.materialId;
      this.itemGross = rowData.gross;
      this.itemPrice = rowData.price;
      this.itemImagePath = rowData.imagePath;
      this.itemCodNote = rowData.codNote;
      this.materialNote = rowData.materialNote;  

      this.imageUrl = (this.itemImagePath ? this.itemImagePath : 'assets/images/custom/id_scan.png');
      this.closeCapturedImage(1);
    }

  }

  
  deleteItem(i: number) {
    //alert(i);
    this.invoiceObj.splice(i, 1);

    
    console.log("updated invoiceObj :: " + JSON.stringify(this.invoiceObj));

    this.calculateTotal(this.invoiceObj);
    // this.backToChangeItemMainMaterials();
    // this.backToMainMaterials();
    // this.itemGross = '';

  }

  closeCapturedImage(imagetype: number) {
    if (imagetype == 1) {
      this.editItemVisible = false;
      this.editItemCloseImageCapture = true;
      setTimeout(() =>{
        this.focusChildInput()
      },100)
    } else {
      this.saveConfirmVisible = true;
      this.signaturePadVisible = false;
    }
  }

  backToCapturedImage() {
    this.editItemCloseImageCapture = false;
    this.isChangeItemOn = false;
  }

  handleImage(imageUrl: string) {
    // alert(imageUrl);
    this.imageUrl = imageUrl;
  }


  captureImage(imageUrlString: string){
    this.itemImagePath = imageUrlString
  }

  setSignature($event: any) {
    // alert($event);
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
      if (type == 1) {
        this.itemImagePath = this.imageUrl;
      } else {
        this.sellerSignatureImagePath = this.imageUrl;
      }
      this.imageUrl = null;
    })

    this.imageUrl = null;
    this.closeCapturedImage(type);
  }

  clickOnChangeItem() {
    this.isChangeItemOn = true;
  }

  backToChangeItemMainMaterials() {
    // alert('Sudhir');    
    // this.isEditModeOn = true;
    
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemLeveloperationPerform = '';    
    // this.editItemVisible = false;
    //this.changeItemMaterialsVisible = true;
  }

  calculation(rowData: any) {
    console.log('Calculation data ::');
    console.log(rowData);
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemGross = rowData.itemGross;
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

    this.editItemVisible = false;

    if (this.itemLeveloperationPerform === 'Add') {
      // const arr = [];
      const rowData = new InvoiceItem();
      rowData.rowId = 0;
      rowData.localRowId = this.localRowIdCounter++;

      rowData.createdBy = this.logInUserId;
      rowData.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.updatedBy = this.logInUserId;
      rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.invoiceDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');

      //rowData.groupName = this.itemGroupName;
      rowData.itemName = this.itemMaterialName;
      rowData.materialId = this.itemMaterialId;
      rowData.quantity = parseFloat(parseFloat(this.itemGross.toString()).toFixed(0));
      rowData.rate = parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
      rowData.amount = parseFloat(parseFloat((rowData.rate * (rowData.quantity)).toString()).toFixed(3));
      rowData.imagePath = (this.itemImagePath?.indexOf('assets/images') >= 0 ? null : this.itemImagePath);
      rowData.materialNote = (this.materialNote || this.materialNote == '' ? this.materialNote : null );

      this.invoiceObj.push(rowData);
      // this.invoiceObj = arr;

    } else if (this.itemLeveloperationPerform === 'Edit') {

      this.invoiceObj.forEach((rowData: any) => {
        if (this.itemLocalRowId === rowData.localRowId) {
          console.log("found " + rowData.rowId);
          // rowData.rowId = this.itemRowId;
          //rowData.groupName = this.itemGroupName;
          rowData.itemName = this.itemMaterialName;
          rowData.materialId = this.itemMaterialId;
          rowData.quantity = parseFloat(parseFloat(this.itemGross.toString()).toFixed(0));
          rowData.rate = parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
          rowData.amount = parseFloat(parseFloat((rowData.rate * (rowData.quantity)).toString()).toFixed(3));
          rowData.imagePath = (this.itemImagePath?.indexOf('assets/images') >= 0 ? null : this.itemImagePath);
          rowData.materialNote = (this.materialNote || this.materialNote == '' ? this.materialNote : null);

          // TO DO:: does not required. need to verify;
          rowData.updatedBy = this.logInUserId;
          rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
          rowData.invoiceDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
        }
      });
      this.itemLeveloperationPerform = '';
    }

    console.log("updated invoiceObj :: " + JSON.stringify(this.invoiceObj));

    this.calculateTotal(this.invoiceObj);
    this.backToChangeItemMainMaterials();
    this.backToMainMaterials();
    this.itemGross = '';
  }

  addAdjustments() {
    this.modalAdjustmentHeader = 'Add Adjustment';
    this.addEditAdjustmentVisible = true;
    this.itemLeveloperationPerform = 'Add';
    this.adjustmentAmount = '';
    this.adjustmentNote = '';
    this.selectedAdjustment = 'Certified Destruction Cost ';
  }

  onAdjustmentChange(value: any) {
    this.selectedAdjustment = value.target.value;

    // this.messageAlert(this.selectedAdjustment)

    //alert(this.selectedAdjustment);
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
      const rowData = new InvoiceItem();
      rowData.rowId = 0;
      rowData.localRowId = this.localRowIdCounter++;
      rowData.materialNote = this.adjustmentNote;
      rowData.rate = rowData.amount = parseFloat(parseFloat(this.adjustmentAmount.toString()).toFixed(3));
      rowData.imagePath = '';

      rowData.createdBy = this.logInUserId;
      rowData.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.updatedBy = this.logInUserId;
      rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.invoiceDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');

      this.invoiceObj.push(rowData);
      // this.invoiceObj = arr;

    } else if (this.itemLeveloperationPerform === 'Edit') {
      this.messageAlert(this.selectedAdjustment);

  
      this.invoiceObj.forEach((rowData: any) => {
        if (this.itemLocalRowId === rowData.localRowId) {
          console.log("found " + rowData.rowId);

          this.messageAlert(this.selectedAdjustment);
          rowData.materialName = rowData.concatAdjustments = this.selectedAdjustment;
          rowData.materialNote = this.adjustmentNote;
          rowData.price = rowData.amount = parseFloat(parseFloat(this.adjustmentAmount.toString()).toFixed(3));
          rowData.imagePath = '';
          rowData.isCOD = false;
          rowData.isAdjusmentSet = true;

          // TO DO:: does not required. need to verify;
          rowData.updatedBy = this.logInUserId;
          rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
          rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
        }
      });

    }

    console.log("updated invoiceObj :: " + JSON.stringify(this.invoiceObj));

    this.calculateTotal(this.invoiceObj);
    // this.backToChangeItemMainMaterials();
    // this.backToMainMaterials();
    // this.itemGross = 0;
    this.adjustmentAmount = '';
    this.adjustmentNote = '';
    this.selectedAdjustment = 'Certified Destruction Cost ';

  }

  closeAdjustment() {
    this.addEditAdjustmentVisible = false;
  }

  getPromoStyles(invoice: any) {
    if (invoice.codNote == '' && invoice.materialNote == '') {
      return {
        'border-bottom': '1px solid black'
      };
    }
    return { 'border-bottom': 'none !important' }
  }


  closeInvoice() {
    console.log('close');
    this.paymentVisible = false;
    this.transactionPaymentType = [];
  }

  generateSingleInvoiceReport(invoiceId: any) {
    // this.checkPrintAction();
    const param = {
      InvoiceId: invoiceId,
      LocationId: this.locId,
      Type: localStorage.getItem('defaultPrintSize')
    }
    this.showLoaderReport = false;

    this.commonService.generateSingleInvoiceReport(param)
      .subscribe(data => {
        console.log('generateSingleInvoiceReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;

        this.showDownload = false;
        this.pdfViwerTitle = 'Invoice Receipt';
        this.loadAndPrintBase64Pdf(this.fileDataObj)
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  loadAndPrintBase64Pdf(base64Data: string): void {
    const iframe = document.createElement('iframe');
    iframe.id = 'print-iframe';
    document.body.appendChild(iframe);

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
      iframe.contentWindow?.print();
      this.pollPrintStatus();
      //redirct to home page
      //this.router.navigateByUrl(`${this.orgName}/invoice`);
    };
  }

  pollPrintStatus() {
    const checkPrintStatus = () => {
      // You can implement a condition to check if the print dialog is closed
      // For example, check if the browser is active again
      if (document.hidden) {
        //alert('1111');
        setTimeout(checkPrintStatus, 1000);
      } else {
        alert('Tiket Receipt Print');
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
      this.router.navigateByUrl(`${this.orgName}/invoice`);
    } 
  }

  closePdfReport() {
    this.showDownload = false;
    // if (this.invoiceId && this.invoiceId != 0) {
    //   console.log('11111');      
    //   this.checkPrintAction();
    // } else {
    //   console.log('222222');
    //   this.router.navigateByUrl(`${this.orgName}/invoice`);
    // }
    
    this.router.navigateByUrl(`${this.orgName}/invoice`);
  }

  checkReprint(invoicesTransaction: any) {
    this.checkVisible = true;
    this.printCheckNo =  invoicesTransaction.checkNumber;
    // this.invoiceId =  invoicesTransaction.
    this.checkAmount =  invoicesTransaction.amount
    this.selectedCheckDate =  invoicesTransaction.checkDate;
  }

  generateCheck(){
    // alert('Sudhir');
    this.isCheckPrint = true;
    this.checkVisible = false;
    this.checkPrintAction();

  }


  getInvoiceTransactions() {

    const param = {
      InvoiceId: this.invoiceId,
      locid: this.locId,
    };
    this.getAllInvoicesTransactionsByInvoiceId(param);
  }

  getAllInvoicesTransactionsByInvoiceId(paramObj: any) {
    console.log(paramObj);
    this.commonService.GetAllInvoicesTransactionsByInvoiceId(paramObj)
      .subscribe(data => {
        console.log('getAllInvoicesTransactionsByInvoiceId :: ');
        console.log(data);
        if (data.body.data.length > 0) {
          this.invoicesTransactions = data.body.data;

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


  generateCheckPrintReport(invoiceId: any, checkAmount: any) {
    this.showLoaderReport = true;

    let amount = checkAmount;

    var num = amount.toString().split(".");
    let  doller = this.convertNumberToWords(num[0]);
    let cent = '';
    if (num.length>1) {
      cent = this.convertNumberToWords(num[1])
    }
    let amountInWord = ((doller.length==0? 'Zero ' : doller) + 'DOLLARS AND ' + (cent.length==0? 'Zero' : cent) + ' CENTS ONLY').toUpperCase()
    console.info(amountInWord);


    const param = {
      InvoiceId: invoiceId,
      FullName: this.customer?.fullName.toUpperCase(),
      PrintDate: this.formatDate(new Date()),
      CheckDate: this.formatDate(this.selectedCheckDate),
      CheckAmount: (Math.round(checkAmount*100)/100).toFixed(2),
      AmountInWord: amountInWord
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
    } 
  }

  cancelImage() {
    this.showImage = false;
  }


}
