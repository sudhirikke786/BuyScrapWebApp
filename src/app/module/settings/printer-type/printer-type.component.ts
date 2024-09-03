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


  
  passprntUri: string = '';
  passprntPDfURL: string = '';

  
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


  createURI(): void {
    const pdfstr ='JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDU1ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDAgMCBUZAogICAgKEhlbGxvIFdvcmxkKSBUagogIEVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxNzggMDAwMDAgbiAKMDAwMDAwMDQ1NyAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgIC9Sb290IDEgMCBSCiAgICAgIC9TaXplIDUKICA+PgpzdGFydHhyZWYKNTY1CiUlRU9GCg=='

    this.passprntPDfURL = "starpassprnt://v1/print/nopreview?";

    this.passprntPDfURL += "back=" + encodeURIComponent(window.location.href);

    this.passprntPDfURL += "&pdf=" + encodeURIComponent(pdfstr);

    // This will be used to update the href of the anchor tag in the template
  }


  createHtMl(): void {

    this.passprntUri = "starpassprnt://v1/print/nopreview?";

    this.passprntUri += "back=" + encodeURIComponent(window.location.href);

    this.passprntUri += "&html=" + encodeURIComponent('<html><head></head><body>Hellow Word</body></html>');

    // This will be used to update the href of the anchor tag in the template
  }

}
