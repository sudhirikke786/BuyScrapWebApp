import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-printer-type',
  templateUrl: './printer-type.component.html',
  styleUrls: ['./printer-type.component.scss']
})
export class PrinterTypeComponent {

@Output() close = new EventEmitter<boolean>();


  savePrintOption(){

  }

  closePopup(){
    this.close.emit()
  }

}
