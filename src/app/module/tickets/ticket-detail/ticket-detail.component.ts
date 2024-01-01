import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


import { MessageService,ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { TicketItem } from 'src/app/core/model/ticket-item.model';
import { Ticket } from 'src/app/core/model/ticket.model';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class TicketDetailComponent implements OnInit {
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
  itemGross: number = 0;
  itemTare: number = 0;
  itemNet: number = 0;
  itemPrice: number = 0;
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
  selectedCheckDate:any;
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

  fileDataObj: any;
  showDownload = false;
  isLoading = false;
  systemInfo:any;
  isEnable =  true;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private stroarge:StorageService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
  
    const _dataObj : any = this.stroarge.getLocalStorage('systemInfo');
    if(_dataObj){
      const isElectronic = _dataObj.filter((item:any) => item?.keys?.toLowerCase() == 'iselectronicpayment')[0];
      this.systemInfo =  isElectronic?.values;
    }
   

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.route.params.subscribe((param)=>{
      this.ticketId = param["ticketId"];
      this.sellerId = param["customerId"];
      this.getSellerById();
      this.processDataBasedOnTicketId();
      this.GetAllAdjustmentType();
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
      this.ticketData['status'] = 'NEW TICKET';
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
    this.saveConfirmVisible = true;
  }

  showPayment(isReceiptPrint: boolean){
    this.isReceiptPrint = isReceiptPrint;
    this.paymentVisible =  true;
    this.payAmount = this.totalAmount - this.ticketData?.paidAmount;
    this.showSection('Cash');
  }


  showSection(paymentType: string) {
    this.activeSection =  paymentType;

   setTimeout(()=>{
    this.selectedCheckDate = new Date().toISOString().split('T')[0];
   },10)
    this.checkNumber = '';
    this.ePaymentType = '';
  }  

  payAndSave(activeSection: string) {
    
    if(!this.payAmount){
      alert('Enter Amount');
      return 
    }
    if (this.payAmount > 0 && parseFloat(this.payAmount.toString()) > (parseFloat(this.totalAmount.toString()) - this.ticketData?.paidAmount)) {
      alert('Please enter valid amount!!!');
      return;
    }

  let msg = 'Do You want to print receipt?';

  if(this.activeSection =='Check') {
    msg = 'Do You want to print receipt?'
    if(this.checkNumber.length == 0){  
      alert('Enter Check Number');
      return 
    }
  
  } else if(this.activeSection=='Electronic Payment'){
    msg = 'Do You want to print receipt?'
    if(this.ePaymentType?.length == 0){
      alert('Enter Electronic Payment Type');
      return 
    }
  }else{
    msg= 'You selected as Cash as payment mode please confirm ?';
  }
    
    
  

    this.showConfirmation(activeSection,msg);


    



   
  }

  showConfirmation(pos:any,confirmMessage:any) {
    // this.saveConfirmVisible = false;
    // this.paymentVisible = false;
    

    this.confirmationService.confirm({
      header: 'Confirmation',
      message: confirmMessage,
      accept: () => {
        // Action to take when the user clicks "Yes" or "OK"
        console.log('Confirmed');
        this.saveTransactionData(pos);
        // Add your logic here
      },
      reject: () => {
        // Action to take when the user clicks "No" or "Cancel"
        console.log('Rejected');
        // Add your logic here
      },
    });
  }


  saveTransactionData(activeSection:any){

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
    this.paymentVisible =  false;
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
      this.saveConfirmVisible = false;
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

  addItem(materialId: any, materialName: any, selectedMaterial: string, scrapPrice: any) {
    this.modalHeader = 'Add Item Details';
    this.editItemVisible = true;
    this.editItemCloseImageCapture = false;
    this.imageUrl = null;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemPrice = scrapPrice;
    this.itemLeveloperationPerform = 'Add';
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
      this.itemNet = rowData.net;
      this.itemPrice = rowData.price;
      this.itemImagePath = rowData.imagePath;
      this.itemCodNote = rowData.codNote;    
      this.materialNote = rowData.materialNote;
      
      this.imageUrl = (this.itemImagePath ? this.itemImagePath : 'assets/images/custom/id_scan.png');
    }   

  }

  calculateNet() {
    this.itemNet = this.itemGross - this.itemTare;
  }
  closeCapturedImage() {
    this.editItemVisible = false;
    this.editItemCloseImageCapture = true;
  }
  backToCapturedImage() {
    this.editItemCloseImageCapture = false;
    this.isChangeItemOn = false;
  }

  handleImage(imageUrl: string) {
    // alert(imageUrl);
    this.imageUrl = imageUrl;
  }  
  
  SaveImage() {
    
    let  requestObj:any = {
    
      organisationName: this.orgName,
      locationName: this.locationName,
      imagetype: 1,
      base64Data: this.imageUrl.split(';base64,')[1]
    };
    
    this.itemImagePath = this.imageUrl;
    
    this.commonService.FileUploadFromWeb(requestObj).subscribe((res:any) =>{
      console.log('Image url path :: {}', res.body.data);
      console.log(res.body.data);
      this.imageUrl = res.body.data;
      this.itemImagePath = this.imageUrl;
    })

    this.imageUrl = null;
    this.closeCapturedImage();
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
    this.itemPrice = rowData.itemPrice;
    this.materialNote = rowData.materialNote;
    this.updateExistingItemDataResponse();
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
      rowData.net = rowData.gross - rowData.tare ;
      rowData.price = parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
      rowData.amount = parseFloat(parseFloat((rowData.price * (rowData.gross - rowData.tare)).toString()).toFixed(3));
      rowData.imagePath = (this.itemImagePath.indexOf('assets/images')>=0 ? null : this.itemImagePath);
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
          rowData.net = rowData.gross - rowData.tare ;
          rowData.price = parseFloat(parseFloat(this.itemPrice.toString()).toFixed(3));
          rowData.amount = parseFloat(parseFloat((rowData.price * (rowData.gross - rowData.tare)).toString()).toFixed(3));
          rowData.imagePath = (this.itemImagePath.indexOf('assets/images')>=0 ? null : this.itemImagePath);
          rowData.codNote = this.itemCodNote;          
          rowData.materialNote = (this.materialNote ? null : this.materialNote);

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
