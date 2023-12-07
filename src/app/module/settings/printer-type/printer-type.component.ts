import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-printer-type',
  templateUrl: './printer-type.component.html',
  styleUrls: ['./printer-type.component.scss']
})
export class PrinterTypeComponent implements OnInit {

@Output() close = new EventEmitter<boolean>();
  defaultReceiptPrinter: string = 'Normal';

  
  constructor() { }

  
  ngOnInit() {
    this.defaultReceiptPrinter = 'Normal';
  }

  savePrintOption(){
    alert(this.defaultReceiptPrinter);
    localStorage.setItem('defaultPrintSize',this.defaultReceiptPrinter)
  }

  closePopup(){
    this.close.emit()
  }

}
