import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-printer-type',
  templateUrl: './printer-type.component.html',
  styleUrls: ['./printer-type.component.scss'],
  providers: [MessageService]

})
export class PrinterTypeComponent implements OnInit {

@Output() close = new EventEmitter<boolean>();
  defaultReceiptPrinter: string = 'Normal';

  
  constructor( private messageService: MessageService) { }

  
  ngOnInit() {
    this.defaultReceiptPrinter = localStorage.getItem('defaultPrintSize') || 'Normal';
  }


  errorAlert(msg:any){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }


  savePrintOption(){
    localStorage.setItem('defaultPrintSize',this.defaultReceiptPrinter);
    this.errorAlert('Set default printer setting for receipt print');
    this.closePopup();
  }

  closePopup(){
    this.close.emit()
  }

}
