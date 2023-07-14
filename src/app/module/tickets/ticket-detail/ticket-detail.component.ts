import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';  

import { CommonService } from 'src/app/core/services/common.service';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  @ViewChild('htmlData') htmlData!: ElementRef;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;
  
  cheight= '50vh'


  ticketObj:any;
  orgName: any;
  sellerId: any;
  ticketId: any;
  locId: any;

  customer: any;
  totalNoOfMaterial: any;
  totalGross: any;
  totalTare: any;
  totalNet: any;
  totalAmount: any;

  isEditModeOn = false;
  divClass = 'col-sm-12 over-flow-200';
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
  itemGroupName: string = '';
  itemMaterialName: string = '';
  itemMaterialId: number = 0;
  itemGross: number = 0;
  itemTare: number = 0;
  itemNet: number = 0;
  itemPrice: number = 0;
  itemImagePath: string = '';
  itemCodNote: string = '';

  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.route.params.subscribe((param)=>{
      this.ticketId = param["ticketId"];
      this.sellerId = param["customerId"];
      this.getSellerById();
      this.getTransactionsDetailsById();
    });
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
    this.totalAmount = tickets.reduce(function (sum:any, tickets:any) {
      return sum + tickets.amount;
    }, 0);
  }

  editTicketDetails() {
    this.isEditModeOn = true;
    this.divClass = 'col-sm-9 over-flow-200';
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


  saveTicketDetails() {
    this.isEditModeOn = false;
    this.divClass = 'col-sm-12 over-flow-200';
  }

  addItem(materialId: any, materialName: any) {
    this.modalHeader = 'Add Item Details';
    this.editItemVisible = true;
    this.editItemCloseImageCapture = false;
    this.imageUrl = null;
  }

  editItem(rowData: any) {
    this.modalHeader = 'Edit Item Details';
    this.editItemVisible = true;
    this.editItemCloseImageCapture = false;

    this.itemRowId = rowData.rowId;
    this.itemGroupName = rowData.groupName;
    this.itemMaterialName = rowData.materialName;
    this.itemMaterialId = rowData.materialId;
    this.itemGross = rowData.gross;
    this.itemTare = rowData.tare;
    this.itemNet = rowData.net;
    this.itemPrice = rowData.price;
    this.itemImagePath = rowData.imagePath;
    this.itemCodNote = rowData.codNote;
    
    
    this.imageUrl = (this.itemImagePath ? this.itemImagePath : null);    

  }

  calculateNet() {
    this.itemNet = this.itemGross - this.itemTare;
  }
  closeCapturedImage() {
    this.editItemCloseImageCapture = true;
  }
  backToCapturedImage() {
    this.editItemCloseImageCapture = false;
    this.isChangeItemOn = false;
  }

  handleImage(imageUrl: string) {
    this.imageUrl = imageUrl;
  }  

  clickOnChangeItem() {
    this.isChangeItemOn = true;
  }

  updateExistingItem(materialId: any, materialName: string, selectedMaterial: string) {
    this.isChangeItemOn = false;
    this.itemMaterialId = materialId;
    this.itemGroupName = selectedMaterial;
    this.itemMaterialName = materialName;
  }

  backToChangeItemMainMaterials() {
    this.changeItemMaterialsVisible =  true;
  }

  updateExistingItemDataResponse() {
    
    this.editItemVisible = false;
    
    this.ticketObj.forEach((rowData: any) => {
      if (this.itemRowId === rowData.rowId) {
        console.log("found " + rowData.rowId);     
        // rowData.rowId = this.itemRowId;
        rowData.groupName = this.itemGroupName;
        rowData.materialName = this.itemMaterialName;
        rowData.materialId = this.itemMaterialId;
        rowData.gross = this.itemGross;
        rowData.tare = this.itemTare;
        rowData.net = this.itemGross - this.itemTare ;
        rowData.price = this.itemPrice;
        rowData.amount = this.itemPrice * (this.itemGross - this.itemTare);
        rowData.imagePath = this.itemImagePath;
        rowData.codNote = this.itemCodNote;
      }
    });


    console.log("updated ticketObj :: " + JSON.stringify(this.ticketObj));

    // this.ticketObj = this.ticketObj.filter( (obj: any) => {
    //     return this.itemRowId === obj.rowId;   
    // }).map((rowData: any) => {
    //   console.log("found " + rowData.rowId);     
    //   // rowData.rowId = this.itemRowId;
    //   rowData.groupName = this.itemGroupName;
    //   rowData.materialName = this.itemMaterialName;
    //   rowData.materialId = this.itemMaterialId;
    //   rowData.gross = this.itemGross;
    //   rowData.tare = this.itemTare;
    //   rowData.net = this.itemGross - this.itemTare ;
    //   rowData.price = this.itemPrice;
    //   rowData.imagePath = this.itemImagePath;
    //   rowData.codNote = this.itemCodNote;
    //   return rowData; 
    // });

    // alert(JSON.stringify(this.ticketObj));

    
    this.calculateTotal(this.ticketObj);
    this.backToChangeItemMainMaterials();

  }

  openPDF(){
    alert('pdf ........');
    this.isEditModeOn = false;
    let DATA: any = document.getElementById('htmlData');
    const _div = document.querySelectorAll('.p-button');
    const _removeHeight = document.querySelector('.mainbox-row');
    const _tableHeight = document.querySelector('.p-datatable-wrapper');
    const _print_remove = document.querySelector('.pay-print-box');

    if(_div){

      for (var i = 0, len = _div.length; i < len; i++) {
        //work with checkboxes[i]
        _div[i].setAttribute('style', 'display: none');
       }
    }
    
   
    
    if(_removeHeight){
      _removeHeight.setAttribute('style', 'max-height: 100%');
    }
    if(_tableHeight){
      _tableHeight.setAttribute('style', 'max-height: 100%');
    }
    if( _print_remove){
      _print_remove.setAttribute('style', 'display: none');
    }
   

    this.cheight = "100vh";
    
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 200;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('billing-demo.pdf');

      if(_div){

        for (var i = 0, len = _div.length; i < len; i++) {
          //work with checkboxes[i]
          _div[i].setAttribute('style', 'display: block');
         }
      }
      if(_removeHeight){
        _removeHeight.setAttribute('style', 'max-height: 110px');
      }
      if(_tableHeight){
      _tableHeight.setAttribute('style', 'max-height:20vh');
      }

      if(_print_remove){
        _print_remove.setAttribute('style', 'display: block');
      }

      this.cheight = '50vh';
    });
    if(_print_remove){
      _print_remove.setAttribute('style', 'display: block');
    }
  }


}
