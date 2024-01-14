import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { TicketItem } from 'src/app/core/model/ticket-item.model';
import { Ticket } from 'src/app/core/model/ticket.model';
import { StorageService } from 'src/app/core/services/storage.service';

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

  cheight = '50vh';

  isHoldTrue: boolean = false;

  selectedHoldAmount = 'Pay Total Amount'


  ticketObj: any = [];
  holdticketObj: any = [];
  orgName: any;
  sellerId: any;
  ticketId: any;
  locId: any;
  logInUserId: any;
  locationName: any;
  showImage = false;

  ticketData: any = {};
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
  itemTare: any;
  itemNet: any = 0;
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
  isLoading = false;
  systemInfo: any;
  signPadVisible = false;
  isEnable = true;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private stroarge: StorageService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');

    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      const isElectronic = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'iselectronicpayment')[0];
      this.systemInfo = isElectronic?.values;

      const isSignatureOnReceipt = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'signatureonreceipt')[0];
      this.signPadVisible = Boolean(isSignatureOnReceipt?.values.toLowerCase());
    }


    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.route.params.subscribe((param) => {
      this.ticketId = param["ticketId"];
      this.sellerId = param["customerId"];
      this.getSellerById();
      this.processDataBasedOnTicketId();
      this.GetAllAdjustmentType();
      this.getTicketTransactions();
    });


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
      this.getTransactionsDetailsById();
      this.getAllTicketsDetails();
      this.getTicketTransactions();
    } else {
      this.ticketId = 0;
      this.ticketData['createdDate'] = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      this.ticketData['status'] = 'NEW TICKET';
      this.ticketData['paidAmount'] = 0;
      this.ticketData['balanceAmount'] = 0;
      this.ticketData['isCOD'] = false;
      

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


  isInputValid(input: any): boolean {
    const numberFloatRegex: RegExp = /^-?\d+(\.\d+)?$/;
    return numberFloatRegex.test(input);
  }

  addTransction() {

    if (this.selectedPayAmount <= 0) {
      window.alert("Please Enter Amount");
      return;
    }

    if (!this.isInputValid(this.selectedPayAmount)) {
      window.alert("Add valid input");
      return;
    }

    const findItemExist = this.transactionPaymentType.findIndex((item: any) => item.typeofPayment?.toLowerCase() == this.activeSection?.toLowerCase())
    const checkPrice = this.checkTotalAmount();

    if (checkPrice) {
      window.alert("adding amount is greter than total amount")
      return;
    }

    
    if (this.activeSection == 'Check') {
      if (this.checkNumber.length == 0) {
        alert('Enter Check Number');
        return;
      }
    } else if (this.activeSection == 'Electronic Payment') {
      if (this.ePaymentType?.length == 0) {
        alert('Enter Electronic Payment Type');
        return;
      }
    }

    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        const total = this.getTotal();
        const eligiblePayAmount = this.totalAmount - total - this.totalHoldAmount;
        if (this.selectedPayAmount > eligiblePayAmount) {
          alert('Exclude hold item amount');
          this.selectedPayAmount = eligiblePayAmount;
          return;
        }
        break;
      case 'Hold All Amount':
        alert('You have selected option as "Hold All Amount"!!!');
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
      window.alert("adding amount is greter than total amount")
      return false;
    }

    this.remainingAmount = this.totalAmount - this.ticketData?.paidAmount - this.getTotal();
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
  }


  getTotal(): number {
    return this.transactionPaymentType.reduce((sum: number, curr: any) => {
      return sum = sum + Number(curr.typeofAmount)
    }, 0)
  }

  get isDisabled(): boolean {
    return (this.getTotal() < this.totalAmount);
  }


  getAllTicketsDetails() {
    this.isLoading = true;
    const paramObject = {
      LocationId: this.locId,
      SerachText: this.ticketId,
      SearchOrder: 'TicketId',
      PageNumber: 1,
      RowOfPage: 10
    };
    this.commonService.getAllTicketsDetails(paramObject)
      .subscribe(data => {
        console.log('getAllTicketsDetails for ticketId :: ');
        console.log(data);
        this.ticketData = data.body.data[0];
        this.isCODRequired = this.ticketData.isCOD;
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
    this.getAllTicketsDetails();
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


  getTransactionsDetailsById() {
    const paramObject = {
      TicketId: this.ticketId,
      locid: this.locId,
      IsCOD: false,
      IsCODDone: false
    };
    this.commonService.getTransactionsDetailsById(paramObject)
      .subscribe(data => {
        console.log('getTransactionsDetailsById :: ');
        console.log(data);
        this.ticketObj = data.body.data.map((item: any) => {
          item.isSelected = false;
          return item
        });

        this.holdticketObj = null;
        this.holdticketObj = data.body.data.filter((obj: any) => {
          return obj.isHold === true
        });
        this.isHoldTrue = (this.holdticketObj.length > 0) ? true : false;

        this.calculateTotal(this.ticketObj);
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
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
      return sum + (tickets.isAdjusmentSet ? tickets.amount * -1 : tickets.amount);
    }, 0);

    this.totalAmount = Math.round(this.totalActualAmount);
    this.totalRoundingAmount = this.totalAmount - this.totalActualAmount;
    this.totalAdjustment = tickets.reduce(function (sum: any, tickets: any) {
      return sum + (tickets.isAdjusmentSet ? tickets.amount * -1 : 0);
    }, 0);
  }

  editTicketDetails() {
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
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


  confirmSave() {
    if (this.ticketId != 0) {
      this.saveConfirmVisible = true;
      this.signaturePadVisible = false;
    } else {
      if (this.signPadVisible) {
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
    this.selectedPayAmount = this.remainingAmount = this.payAmount = this.totalAmount - this.ticketData?.paidAmount;
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
      this.totalHoldAmount = this.holdticketObj.reduce((acc: any, curr: any) => acc + curr.amount, 0);
    }
    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        if (this.totalHoldAmount >= this.payAmount && (this.totalHoldAmount != 0 || this.payAmount != 0)) {
          alert(`Hold amount ( $${this.totalHoldAmount} ) is equal or more than total pay amount ( $${this.payAmount} )`);
          this.payAmount = 0;
        } else {
          this.payAmount = this.totalAmount - this.ticketData?.paidAmount - this.totalHoldAmount;
        }
        break;
      case 'Hold All Amount':
        this.payAmount = 0;
        break;
    }
  }

  payAndSave(activeSection: string) {

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
      alert('Enter Amount');
      return
    }
    if (this.payAmount > 0 && parseFloat(this.payAmount.toString()) > (parseFloat(this.totalAmount.toString()) - this.ticketData?.paidAmount)) {
      alert('Please enter valid amount!!!');
      return;
    }

    switch (this.selectedHoldAmount) {
      case 'Partial Pay Amount':
        const eligiblePayAmount = this.totalAmount - this.ticketData?.paidAmount - this.totalHoldAmount;
        if (this.payAmount > eligiblePayAmount) {
          alert('Exclude hold item amount');
          this.payAmount = eligiblePayAmount;
          return;
        }
        break;
      case 'Hold All Amount':
        alert('You have selected option as "Hold All Amount"!!!');
        this.payAmount = 0;
        return;
        break;
    }

    let msg = 'Do You want to print receipt?';

    if (this.activeSection == 'Check') {
      msg = 'Do You want to print receipt?'
      if (this.checkNumber.length == 0) {
        alert('Enter Check Number');
        return;
      }
    } else if (this.activeSection == 'Electronic Payment') {
      msg = 'Do You want to print receipt?'
      if (this.ePaymentType?.length == 0) {
        alert('Enter Electronic Payment Type');
        return;
      }
    } else {
      msg = 'You selected as Cash as payment mode please confirm ?';
    }
    
    this.saveTicketDetails(this.payAmount, this.isReceiptPrint);
  }


  saveTransactionData(activeSection: any) {
    let isCheckPrint = false;
    let isCheckTransaction = false;
    let payTransactionObj: any = [];
    let checkAmount = 0;
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
        checkAmount = parseFloat(item.typeofAmount);
        checkNumber = item.paymentType;

        payTransactionObj.push({
          localRowId: 2,
          rowId: 0,
          createdBy: this.logInUserId,
          createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          updatedBy: this.logInUserId,
          updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
          ticketId: parseInt(this.ticketId),
          type: item.typeofPayment,
          amount: checkAmount,
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
      }

      return item
    })

    
    let text = "Do you want to print receipt?";
    if (confirm(text) == true) {
      if (isCheckTransaction) {
        isCheckPrint = true;
      }
    }

    const transactionObj = {
      tickettransaction : {
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
        checkDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS')
      },
      lstickettransaction : payTransactionObj
    };

    this.commonService.insertTicketTransactions(transactionObj).subscribe(data => {
      

      const checkPaymentTransaction = this.transactionPaymentType.filter((item:any) => item.typeofPayment == 'Check')
      if (checkPaymentTransaction.length < 1) {
        this.cancelEditTicket(this.isReceiptPrint, this.ticketId);
      } else {
        this.cancelEditTicket(false, this.ticketId);
      }
      
      // this.isReceiptPrint = false;
      if (isCheckPrint) {
        alert("Please insert Check into Printer!!!");
        // Open Pdf viewer          
        this.showDownload = true;
        this.pdfViwerTitle = 'Check For Print';
        this.generateCheckPrintReport(this.ticketId, checkAmount);
      }     

    }, (error: any) => {
      // this.saveTicketDetails(0, false);
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
    this.paymentVisible = false;
    this.saveConfirmVisible = false;

  }






  saveTicketDetails(paidAmount: number, isReceiptPrint: boolean) {
    // alert(paidAmount);
    // alert(this.totalAmount);
    let ticketStatus = 'OPEN';
    if (paidAmount > 0 && paidAmount == this.totalAmount) {
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
      this.ticketData.paidAmount = parseFloat(paidAmount.toString());
      this.ticketData.lstttransactionMasterDTO = this.ticketObj;
    } else {
      const newTicket = new Ticket();
      newTicket.rowId = 0;
      newTicket.createdBy = this.logInUserId;
      newTicket.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newTicket.updatedBy = this.logInUserId;
      newTicket.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newTicket.customerId = parseFloat(this.sellerId);
      newTicket.ticketId = 0;
      newTicket.status = ticketStatus;
      newTicket.amount = parseFloat(this.totalAmount.toFixed(3));
      newTicket.balanceAmount = parseFloat(this.totalAmount.toFixed(3));
      newTicket.roundingAmount = parseFloat(this.totalRoundingAmount.toFixed(3));
      newTicket.ticketAmount = parseFloat(this.totalActualAmount.toFixed(3));
      newTicket.paidAmount = parseFloat(paidAmount.toString());
      newTicket.dateOpened = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      newTicket.dateClosed = null;
      newTicket.customerName = this.customer?.fullName;
      newTicket.adjustmentAmount = parseFloat(this.totalAdjustment.toFixed(3));
      newTicket.locID = this.locId;
      newTicket.lstttransactionMasterDTO = this.ticketObj;
      newTicket.sellerSignature = this.sellerSignatureImagePath;
      newTicket.isCOD = this.isCODRequired;

      this.ticketData = newTicket;
      this.sellerSignatureImagePath = null;
    }


    console.log("Final ticketData :: " + JSON.stringify(this.ticketData));

    this.commonService.insertUpdateTickets(this.ticketData).subscribe(data => {
      console.log(data);

      
      if (this.transactionPaymentType.length > 0) { 
        const oldTicketId = this.ticketId;       
        this.ticketId = data.body.insertedRow;
        this.saveTransactionData(this.activeSection);
        this.saveConfirmVisible = false;
      } else {     
        this.ticketId = data.body.insertedRow;
        this.saveConfirmVisible = false;     
        this.cancelEditTicket(isReceiptPrint, this.ticketId);
      }

      // this.confirmSave();
      // alert('Ticket Inserted/ updated successfully');
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      
    }, (error: any) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
    // setTimeout(this.cancelEditTicket, 2000);
    // this.cancelEditTicket();
    // this.router.navigateByUrl(`${this.orgName}/home`);
  }

  cancelEditTicket(isReceiptPrint: boolean, ticketId: any) {
    // alert('Refresh' + this.ticketId);
    if (ticketId && ticketId != 0) {
      console.log('11111');
      this.isEditModeOn = false;
      this.editItemCloseImageCapture = false;
      this.processDataBasedOnTicketId();
    } else if (ticketId == 0 && !isReceiptPrint) {
      console.log('222222');
      this.router.navigateByUrl(`${this.orgName}/home`);
    }
    if (isReceiptPrint) {
      this.generateSingleTicketReport(ticketId);
    }
  }

  addItem(materialId: any, materialName: any, selectedMaterial: string, scrapPrice: any) {
    this.modalHeader = 'Add Item Details';
    this.editItemVisible = true;
    this.editItemCloseImageCapture = false;
    this.imageUrl = null;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemPrice = scrapPrice;
    this.itemLeveloperationPerform = this.itemLeveloperationPerform == '' ? 'Add' : this.itemLeveloperationPerform;
    this.itemCodNote = '';
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
      this.itemNet = isNaN(rowData.net) ?  0 : rowData.net;
      this.itemPrice = rowData.price;
      this.itemImagePath = rowData.imagePath;
      this.itemCodNote = rowData.codNote;
      this.materialNote = rowData.materialNote;

      this.imageUrl = (this.itemImagePath ? this.itemImagePath : 'assets/images/custom/id_scan.png');
    }

  }

  calculateNet() {
    const netQty = this.itemGross - this.itemTare
    this.itemNet = isNaN(netQty) ?  0 : netQty;
  }

  closeCapturedImage(imagetype: number) {
    if (imagetype == 1) {
      this.editItemVisible = false;
      this.editItemCloseImageCapture = true;
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

  setSignature($event: any) {
    // alert($event);
    this.imageUrl = $event;
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
    this.changeItemMaterialsVisible = true;
  }

  calculation(rowData: any) {
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemGross = rowData.itemGross;
    this.itemTare = rowData.itemTare;
    const netQty = this.itemGross - this.itemTare
    this.itemNet = isNaN(netQty) ?  0 : netQty;
    this.itemPrice = rowData.itemPrice;
    this.materialNote = rowData.materialNote;
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
      const rowData = new TicketItem();
      rowData.rowId = 0;
      rowData.localRowId = this.localRowIdCounter++;
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
      rowData.materialNote = (this.materialNote ? null : this.materialNote);


      rowData.createdBy = this.logInUserId;
      rowData.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.updatedBy = this.logInUserId;
      rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');

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
          rowData.net = rowData.gross - rowData.tare;
          rowData.price = parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
          rowData.amount = parseFloat(parseFloat((rowData.price * (rowData.gross - rowData.tare)).toString()).toFixed(3));
          rowData.imagePath = (this.itemImagePath?.indexOf('assets/images') >= 0 ? null : this.itemImagePath);
          rowData.codNote = this.itemCodNote;
          rowData.materialNote = (this.materialNote ? null : this.materialNote);

          // TO DO:: does not required. need to verify;
          rowData.updatedBy = this.logInUserId;
          rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
          rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
        }
      });
      this.itemLeveloperationPerform = '';
    }

    console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));

    this.calculateTotal(this.ticketObj);
    this.backToChangeItemMainMaterials();
    this.backToMainMaterials();
    this.itemGross = 0;
    this.itemTare = 0;

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
    alert(this.selectedAdjustment);
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
      rowData.imagePath = '';
      rowData.isCOD = 0;
      rowData.isAdjusmentSet = true;

      rowData.createdBy = this.logInUserId;
      rowData.createdDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.updatedBy = this.logInUserId;
      rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');

      this.ticketObj.push(rowData);
      // this.ticketObj = arr;

    } else if (this.itemLeveloperationPerform === 'Edit') {
      alert(this.selectedAdjustment);

      this.ticketObj.forEach((rowData: any) => {
        if (this.itemLocalRowId === rowData.localRowId) {
          console.log("found " + rowData.rowId);

          alert(this.selectedAdjustment);
          rowData.materialName = rowData.concatAdjustments = this.selectedAdjustment;
          rowData.materialNote = this.adjustmentNote;
          rowData.price = rowData.amount = parseFloat(parseFloat(this.adjustmentAmount.toString()).toFixed(3));
          rowData.imagePath = '';
          rowData.isCOD = 0;
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

    const param = {
      TicketId: ticketId,
      LocationId: this.locId,
      Type: localStorage.getItem('defaultPrintSize')
    }
    this.showLoaderReport = true;

    this.commonService.generateSingleTicketReport(param)
      .subscribe(data => {
        console.log('generateSingleTicketReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;

        this.showDownload = true;
        this.pdfViwerTitle = 'Ticket Receipt';
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  closePdfReport() {
    this.showDownload = false;
    if (this.ticketId && this.ticketId != 0) {
      console.log('11111');
      // this.isEditModeOn = false;
      // this.editItemCloseImageCapture = false;
      // this.processDataBasedOnTicketId();
    } else {
      console.log('222222');
      this.router.navigateByUrl(`${this.orgName}/home`);
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


  generateCheckPrintReport(ticketId: any, checkAmount: any) {
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
      TicketId: ticketId,
      FullName: this.customer?.fullName.toUpperCase(),
      PrintDate: this.formatDate(new Date()),
      CheckDate: this.formatDate(this.selectedCheckDate),
      CheckAmount: '$' + (Math.round(checkAmount*100)/100).toFixed(2),
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
