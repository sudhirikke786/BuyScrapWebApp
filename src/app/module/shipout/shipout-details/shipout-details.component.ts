import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { TicketItem } from 'src/app/core/model/ticket-item.model';
import { Ticket } from 'src/app/core/model/ticket.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { ShipOut } from 'src/app/core/model/ship-out.model';
import { DataService } from 'src/app/core/services/data.service';
import { MaterialCalculatorComponent } from '../../shared/commonshared/material-calculator/material-calculator.component';

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

  ticketObj:any = [];
  orgName: any;
  sellerId: any;
  shipoutId: any;
  shipoutAction: any;
  locId: any;
  logInUserId: any;
  locationName: any;

  ticketData:any = {};
  shipOutDetails: any;
  user: any;
  totalNoOfMaterial: any;
  totalGross: any;
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
  isLoading = false;

  @ViewChild(MaterialCalculatorComponent) materialCalculatorComponent!: MaterialCalculatorComponent;
 
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private stroarge:StorageService,
    public dataService: DataService,
    private commonService: CommonService) {  }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.route.params.subscribe((param)=>{
      this.shipoutId = param["shipOutId"];
      this.shipoutAction = param["action"];
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
    
  getShipOutDetailsByID() {
    const paramObject = {
      rowId: this.shipoutId,
      LocID: this.locId
    };
    this.commonService.getShipOutDetailsByID(paramObject)
      .subscribe(data => {
          console.log('getShipOutDetailsByID :: ');
          console.log(data);
          this.shipOutDetails = data.body.data; 
          this.shipOutDetails.shipoutmaterial = null; 
          const userId = data.body.data.createdBy;
          this.getAllUsers(userId);
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
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
  }

  editTicketDetails() {
    this.isEditModeOn = true;
    this.getAllGroupMaterial();
  }

  
  deleteItem(i: number) {
    //alert(i);
    this.ticketObj.splice(i, 1);    
    console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));

    this.calculateTotal(this.ticketObj);
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
    this.shipOutDetails.shipoutmaterial = this.ticketObj;
    
    console.log("Final shipOutDetails :: " + JSON.stringify(this.shipOutDetails));
    
    this.commonService.insertShipOutDTO(this.shipOutDetails).subscribe(data =>{
      if (parseInt(this.shipoutId)) {
        this.isNewShipOut = false;
      } else {
        this.isNewShipOut = true;
      }
      console.log(data); 
      this.shipoutId = data.body;

      // this.confirmSave();
      // alert('Ticket Inserted/ updated successfully');
      // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ticket Inserted/ updated successfully' });
      // this.cancelEditTicket();
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
    // alert('Refresh' + this.shipoutId);
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
    if (this.isEditModeOn && this.isNewShipOut) {
      this.router.navigateByUrl(`${this.orgName}/ship-out`);
    }
  }

  addItem(materialId: any, materialName: any, selectedMaterial: string, availableStock: any) {
    // alert(availableStock);
    this.editItemCloseImageCapture = true;
    this.imageUrl = null;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
    this.itemAvailableNet = availableStock;
    this.itemLeveloperationPerform = this.itemLeveloperationPerform == '' ? 'Add' : this.itemLeveloperationPerform;
    this.itemCodNote = '';      
    this.itemGross = '';
    this.itemTare = '';
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
    this.editItemCloseImageCapture = true;
    this.itemLeveloperationPerform = 'Edit';

    this.itemRowId = rowData.rowId;
    this.itemLocalRowId = rowData.localRowId;
    this.itemGroupName = rowData.groupName;
    this.itemMaterialName = rowData.materialName;
    this.itemMaterialId = rowData.materialId;
    this.itemGross = rowData.gross;
    this.itemTare = rowData.tare;
    this.itemNet = isNaN(rowData.net) ?  0 : rowData.net;
    this.itemAvailableNet = rowData.price;
    this.itemImagePath = rowData.imagePath;
    this.itemCodNote = rowData.codNote;    
    this.materialNote = rowData.materialNote;
    
    this.imageUrl = (this.itemImagePath ? this.itemImagePath : 'assets/images/custom/id_scan.png');
    
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
  }

  calculation(rowData:any){
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
    this.itemGross = rowData.itemGross;
    this.itemTare = rowData.itemTare;
    const netQty = this.itemGross - this.itemTare
    this.itemNet = isNaN(netQty) ?  0 : netQty;
    this.itemAvailableNet = rowData.itemAvailableNet;
    this.materialNote = rowData.materialNote;
    this.updateExistingItemDataResponse();
  }

  changeItem() {
    this.editItemCloseImageCapture = false;
    this.mainMaterialsVisible = true;
  }


  updateExistingItemDataResponse() {

    if (this.itemLeveloperationPerform === 'Add') {
      // const arr = [];
      let rowData = {
        rowId : 0,
        localRowId : this.localRowIdCounter++,
        groupName : this.itemGroupName,
        materialName : this.itemMaterialName,
        materialId : this.itemMaterialId,
        gross : parseFloat(parseFloat(this.itemGross.toString()).toFixed(3)),
        tare : parseFloat(parseFloat(this.itemTare.toString()).toFixed(3)),
        net : parseFloat(parseFloat(this.itemGross.toString()).toFixed(3)) - parseFloat(parseFloat(this.itemTare.toString()).toFixed(3))
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

    const param = {
      ShipOutId: this.shipoutId,
      LocationId: this.locId
    }

    this.commonService.getShipOutReportByID(param)
      .subscribe(data => {
        console.log('getShipOutReportByID :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = true;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


}
