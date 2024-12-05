import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';
import { TicketItem } from 'src/app/core/model/ticket-item.model';
import { Ticket } from 'src/app/core/model/ticket.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { Inout } from 'src/app/core/model/inout.model';
import { DataService } from 'src/app/core/services/data.service';
import { MaterialCalculatorComponent } from '../../shared/commonshared/material-calculator/material-calculator.component';
import { HelperService } from 'src/app/core/services/helper.service';
 
@Component({
  selector: 'app-inout-details',
  templateUrl: './inout-details.component.html',
  styleUrls: ['./inout-details.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class InoutDetailsComponent implements OnInit {
  [x: string]: any;
  @ViewChild('htmlData') htmlData!: ElementRef;


  @ViewChild('searchMaterialInput' , { static: false }) searchMaterialInput!: ElementRef;

  @ViewChild('searchsubMaterialInput' , { static: false }) searchsubMaterialInput!: ElementRef;


  copyMaterialData:any[]  = [];
  copySubMaterialData:any[]  = [];
  
  showCalculator = false;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;
  
  cheight= '50vh';

  sidebarVisible1 = false;

  ticketObj:any = [];
  orgName: any;
  sellerId: any;
  inoutId: any;
  inoutAction: any;
  locId: any;
  logInUserId: any;
  locationName: any;

  ticketData:any = {};
  inoutDetails: any;
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
  isNewInout = false;

  fileDataObj: any;
  showDownload = false;
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
    private commonService: CommonService) {  }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);
    this.locationName = localStorage.getItem('locationName');
    this.checkTabView = this.helperService.isTab();
    this.route.params.subscribe((param)=>{
      this.inoutId = param["inoutId"];
      this.inoutAction = param["action"];
      if (this.inoutAction == 'edit') {
        this.editTicketDetails();
      }
      if (parseInt(this.inoutId)) {
        this.getInoutDetailsByID();
        this.isNewInout = false;
      }
      else {
        this.inoutDetails = this.dataService.getNewInout();
        this.getAllUsers(this.logInUserId);
        this.isNewInout = true;
      }
      this.processDataBasedOnTicketId();
    });

    
  }

  
  private processDataBasedOnTicketId() {
    if (parseInt(this.inoutId)) {
      this.getInoutMaterialbyID();
      // this.getAllTicketsDetails();
    } else {
      this.inoutId = 0;
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
  //     SerachText: this.inoutId,
  //     SearchOrder: 'TicketId', 
  //     PageNumber: 1, 
  //     RowOfPage: 10
  //   };
  //   this.commonService.getAllTicketsDetails(paramObject)
  //     .subscribe(data => {
  //         console.log('getAllTicketsDetails for inoutId :: ');
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

    
  getInoutDetailsByID() {
    const paramObject = {
      rowId: this.inoutId,
      LocID: this.locId
    };
    this.commonService.getInoutDetailsByID(paramObject)
      .subscribe(data => {
          console.log('getInoutDetailsByID :: ');
          console.log(data);
          this.inoutDetails = data.body.data; 
          this.inoutDetails.inoutmaterial = null; 
          const userId = data.body.data.createdBy;
          this.getAllUsers(userId);
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  
  getInoutMaterialbyID() {
    const paramObject = {
      RowID: this.inoutId
    };
    this.commonService.getInoutMaterialbyID(paramObject)
      .subscribe(data => {
          console.log('getInoutMaterialbyID :: ');
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
    this.inoutDetails.LocID = this.locId;
    this.inoutDetails.totalGross = this.totalGross;
    this.inoutDetails.totalTare = this.totalTare;
    this.inoutDetails.totalNet = this.totalNet;
    this.inoutDetails.inoutmaterial = this.ticketObj;
    
    console.log("Final inoutDetails :: " + JSON.stringify(this.inoutDetails));
    
    this.commonService.insertInoutDTO(this.inoutDetails).subscribe(data =>{
      if (parseInt(this.inoutId)) {
        this.isNewInout = false;
      } else {
        this.isNewInout = true;
      }
      console.log(data); 
      this.inoutId = data.body;

    
      
      if (this.isReceiptPrint) {
        this.generateInoutReport();
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
   
    
    if (this.inoutId && this.inoutId != 0) {
      console.log('11111');
      this.isEditModeOn = false;
      this.editItemCloseImageCapture = false;
      this.processDataBasedOnTicketId();
    } 
    // else {
    //   console.log('222222');
    //   this.router.navigateByUrl(`${this.orgName}/inout`);
    // }    
  }

  closePdfReport() {
    this.showDownload = false;    
    this.router.navigateByUrl(`${this.orgName}/inout`);
    // if (this.isEditModeOn && this.isNewInout) {
    //   this.router.navigateByUrl(`${this.orgName}/inout`);
    // }
  }

  addItem(materialId: any, materialName: any, selectedMaterial: string, availableStock: any) {
  
    
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
    this.itemRowId = rowData.rowId;
    this.itemLocalRowId = rowData.localRowId;
    this.itemGroupName = rowData.groupName;
    this.itemMaterialName = rowData.materialName;
    this.itemMaterialId = rowData.materialId;
    this.itemGross = rowData.gross;
    this.itemTare = rowData.tare;
    this.itemNet = isNaN(rowData.net) ?  0 : rowData.net;

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
        net : parseFloat(parseFloat(this.itemGross.toString()).toFixed(3)) - parseFloat(parseFloat(this.itemTare.toString()).toFixed(3)),
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
  

  generateInoutReport() {

    const param = {
      InoutId: this.inoutId,
      LocationId: this.locId
    }

    this.commonService.getInoutReportByID(param)
      .subscribe(data => {
        console.log('getInoutReportByID :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Inout Report"+this.inoutId)
        }

        this.showDownload = true;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


}
