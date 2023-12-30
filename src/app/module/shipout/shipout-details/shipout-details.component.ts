import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { TicketItem } from 'src/app/core/model/ticket-item.model';
import { Ticket } from 'src/app/core/model/ticket.model';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-shipout-details',
  templateUrl: './shipout-details.component.html',
  styleUrls: ['./shipout-details.component.scss'],
  providers: [MessageService]
})
export class ShipoutDetailsComponent implements OnInit {
  [x: string]: any;
  @ViewChild('htmlData') htmlData!: ElementRef;

  showCalculator = false;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;
  
  cheight= '50vh';

  isHoldTrue : boolean = false;

  selectedHoldAmount= 'Pay Total Amount'


  ticketObj:any = [];
  orgName: any;
  sellerId: any;
  ticketId: any;
  locId: any;
  logInUserId: any;
  locationName: any;

  ticketData:any = {};
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
  editItemCloseImageCapture = false;
  
  webcamImage: WebcamImage | undefined;
  imageUrl: any;
  isChangeItemOn = false;

  
  itemRowId: number = 0;
  itemLocalRowId: number = 0;
  itemGroupName: string = '';
  itemMaterialName: string = '';
  itemMaterialId: number = 0;
  itemGross: number = 0;
  itemTare: number = 0;
  itemNet: number = 0;
  itemAvailableNet: number = 0;
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


  ticketsTransactions:any;
  defaultSelectedTicketsTypes =  [
    {name: 'OPEN', code: 'OPEN'},
    {name: 'Partially Paid', code: 'Partially Paid'},
    {name: 'ON HOLD', code: 'ON HOLD'}
  ];

  /**Print out Variable */
  activeSection: string = '';

  payAmount: number = 0;
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
  isReceiptPrint = false;

  fileDataObj: any;
  showDownload = false;
  isLoading = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private stroarge:StorageService,
    private commonService: CommonService) {  }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.route.params.subscribe((param)=>{
      this.ticketId = param["ticketId"];
      this.sellerId = param["customerId"];
      this.getSellerById();
      this.processDataBasedOnTicketId();
      this.getTicketTransactions();
    });

    
  }


  onContextMenu(event: MouseEvent ,obj:any) {
    this.selectedRowObj =  obj;
    this.isCODRequired = (obj.codNote != '');
    event.preventDefault();
  }

  addNote(obj:any){  
    this.selectedRowObj =  obj;
    // add the Data from Table
    this.itemLocalRowId = this.selectedRowObj?.localRowId;
    this.updateTicketObjectForCOD('Flagged for COD');
  }

  removeCode(obj:any){
    // remove the Data from Table
    this.selectedRowObj =  obj;
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
    } else {
      this.ticketId = 0;
      this.ticketData['createdDate'] = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
      this.ticketData['status'] = 'NEW SHIP OUT';
      this.ticketData['paidAmount'] = 0;
      this.ticketData['balanceAmount'] = 0;

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
          this.totalRecords =  data.totalRecords;
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

  getAllUsers(userId: any){
    const reqObj = {
      LocationId: this.locId,
      UserID: parseInt(userId)
    }
    this.commonService.GetAllUsers(reqObj).subscribe((res) =>{
      this.user =  res?.body?.data[0];     
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
          this.ticketObj = data.body.data.map((item:any) => {
            item.isSelected = false;
            return item
          } );

          this.isHoldTrue = data.body.data[0].isHold;

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
    this.totalActualAmount = tickets.reduce(function (sum:any, tickets:any) {
      return sum + (tickets.isAdjusmentSet? tickets.amount * -1 : tickets.amount);
    }, 0);

    this.totalAmount = Math.round(this.totalActualAmount);
    this.totalRoundingAmount = this.totalAmount - this.totalActualAmount;
    this.totalAdjustment = tickets.reduce(function (sum:any, tickets:any) {
      return sum + (tickets.isAdjusmentSet? tickets.amount * -1 : 0);
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
    this.mainMaterialsVisible =  true;
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
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


  confirmSave() {
    alert('Saving record & opening printer');
  }

  showPayment(isReceiptPrint: boolean){
    this.isReceiptPrint = isReceiptPrint;
    this.payAmount = this.totalAmount - this.ticketData?.paidAmount;
    this.showSection('Cash');
  }


  showSection(paymentType: string) {
    this.activeSection =  paymentType;
    this.selectedCheckDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
    this.checkNumber = '';
    this.ePaymentType = '';
  }  

  payAndSave(activeSection: string) {
    // alert(this.selectedCheckDate);
    // alert(this.payAmount);
    // alert(this.checkNumber);
    // alert(this.ePaymentType);

    
    if (this.payAmount > 0 && parseFloat(this.payAmount.toString()) > (parseFloat(this.totalAmount.toString()) - this.ticketData?.paidAmount)) {
      alert('Please enter valid amount!!!');
      return;
    }


    // return;

    const transactionObj = {
      rowId: 0,
      createdBy: this.logInUserId,
      createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      updatedBy: this.logInUserId,
      updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      ticketId: parseInt(this.ticketId),
      type: activeSection,
      amount: parseFloat(this.payAmount.toString()),
      checkNumber: this.checkNumber,
      barCode: '',
      guid: '',
      dateClosed: null,
      checkDate: null
    }

    this.commonService.insertTicketTransactions(transactionObj).subscribe(data =>{    
   
      this.saveTicketDetails(this.payAmount, this.isReceiptPrint);
      this.isReceiptPrint = false;
    },(error: any) =>{  
      this.saveTicketDetails(0, false);
      console.log(error);  
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });
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
      
      this.ticketData = newTicket;
    } 

    
    console.log("Final ticketData :: " + JSON.stringify(this.ticketData));
    
    this.commonService.insertUpdateTickets(this.ticketData).subscribe(data =>{    
      console.log(data); 

      // this.confirmSave();
      // alert('Ticket Inserted/ updated successfully');
     // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      this.cancelEditTicket();
      if (isReceiptPrint) {
        this.generateSingleTicketReport();
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
    // alert('Refresh' + this.ticketId);
    if (this.ticketId && this.ticketId != 0) {
      console.log('11111');
      this.isEditModeOn = false;
      this.editItemCloseImageCapture = false;
      this.processDataBasedOnTicketId();
    } else {
      console.log('222222');
      this.router.navigateByUrl(`${this.orgName}/home`);
    }    
  }

  addItem(materialId: any, materialName: any, selectedMaterial: string, availableStock: any) {
    alert(availableStock);
    this.editItemCloseImageCapture = true;
    this.imageUrl = null;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemAvailableNet = availableStock;
    this.itemLeveloperationPerform = 'Add';
    this.itemCodNote = '';    
    // this.materialNote = '';
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
    
    if(rowData.isAdjusmentSet == true) {
      this.addEditAdjustmentVisible = true;      
      this.modalAdjustmentHeader = 'Edit Adjustment';
      this.itemLeveloperationPerform = 'Edit';
  
      this.itemRowId = rowData.rowId;
      this.itemLocalRowId = rowData.localRowId;
      this.adjustmentAmount = rowData.price;
      this.adjustmentNote = rowData.materialNote;
      this.selectedAdjustment = rowData.concatAdjustments;

    } else {
      this.editItemCloseImageCapture = true;
      this.itemLeveloperationPerform = 'Edit';
  
      this.itemRowId = rowData.rowId;
      this.itemLocalRowId = rowData.localRowId;
      this.itemGroupName = rowData.groupName;
      this.itemMaterialName = rowData.materialName;
      this.itemMaterialId = rowData.materialId;
      this.itemGross = rowData.gross;
      this.itemTare = rowData.tare;
      this.itemNet = rowData.net;
      this.itemAvailableNet = rowData.price;
      this.itemImagePath = rowData.imagePath;
      this.itemCodNote = rowData.codNote;    
      this.materialNote = rowData.materialNote;
      
      this.imageUrl = (this.itemImagePath ? this.itemImagePath : 'assets/images/custom/id_scan.png');
    }   

  }

  calculateNet() {
    this.itemNet = this.itemGross - this.itemTare;
  }

  clickOnChangeItem() {
    this.isChangeItemOn = true;
  }

  backToChangeItemMainMaterials() {
    this.changeItemMaterialsVisible =  true;
  }

  calculation(rowData:any){
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemGross = rowData.itemGross;
    this.itemTare = rowData.itemTare;
    this.itemNet = this.itemGross - this.itemTare;
    this.itemAvailableNet = rowData.itemAvailableNet;
    this.materialNote = rowData.materialNote;
    this.updateExistingItemDataResponse();
  }


  updateExistingItemDataResponse() {

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
      rowData.net = rowData.gross - rowData.tare ;
      rowData.price = parseFloat(parseFloat(this.itemAvailableNet.toString()).toFixed(3));

      
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
          rowData.net = rowData.gross - rowData.tare ;
          rowData.price = parseFloat(parseFloat(this.itemAvailableNet.toString()).toFixed(3));

          // TO DO:: does not required. need to verify;
          rowData.updatedBy = this.logInUserId;
          rowData.updatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
          rowData.transactionDate = this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS');
        }
      });

    }

    console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));
    
    this.calculateTotal(this.ticketObj);
    this.backToChangeItemMainMaterials();
    this.backToMainMaterials();
    this.itemGross = 0;
    this.itemTare = 0;

  }

  getPromoStyles(ticket: any) {
    if (ticket.codNote == ''  && ticket.materialNote == '' ) {
      return {
        'border-bottom': '1px solid black'
      };
    } 
    return { 'border-bottom': 'none !important' }
  }
  

  generateSingleTicketReport() {

    const param = {
      TicketId: this.ticketId,
      LocationId: this.locId,
      Type: localStorage.getItem('defaultPrintSize')
    }

    this.commonService.generateSingleTicketReport(param)
      .subscribe(data => {
        console.log('generateSingleTicketReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = true;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
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

 

}
