import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';

declare var SetTabletState: any;
declare var SetDisplayXSize: any;
declare var SetDisplayYSize: any;
declare var SetJustifyMode: any;
declare var ClearTablet: any;
declare var ClearTablet: any;
declare var GetSigString:any;
declare var SetSigCompressionMode:any;
declare var SetImageXSize:any;
declare var SetImageYSize:any;
declare var NumberOfTabletPoints:any;
declare var SetImagePenWidth:any;
declare var GetSigImageB64:any;
declare var SigImageCallback:any;
var tmr:any;

@Component({
  selector: 'app-pen-signature',
 
  templateUrl: './pen-signature.component.html',
  styleUrls: ['./pen-signature.component.scss']
})
export class PenSignatureComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  signatureNeeded!: boolean;
  signaturePad!: SignaturePad;

  @Output() setSignature = new EventEmitter<any>();
  signatureImg: any = '';
  singPen: boolean = false;
  
  ngOnInit() {
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
  }

 onSign(){
   this.signatureNeeded = true
   this.singPen = true
      var ctx = this.canvas.nativeElement.getContext('2d');
      SetDisplayXSize( 500 );
      SetDisplayYSize( 100 );
      SetTabletState(0, tmr);
      SetJustifyMode(0);
      ClearTablet();
      if(tmr == null)
      {
        tmr = SetTabletState(1, ctx, 50);
      }
      else
      {
        SetTabletState(0, tmr);
        tmr = null;
        tmr = SetTabletState(1, ctx, 50);
      }
   
  }

saveDone(){
  this.signatureImg = '';
  if(this.singPen){
    
      this.onDone();
  }else{
    this.savePad();
  }
}
 


 onDone() {
    if(NumberOfTabletPoints() == 0)
    {
      alert("Please sign before continuing");
    }
    else
    {
      SetTabletState(0, tmr);
      //RETURN TOPAZ-FORMAT SIGSTRING
      SetSigCompressionMode(1);
      //this returns the signature in Topaz's own format, with biometric information


      //RETURN BMP BYTE ARRAY CONVERTED TO BASE64 STRING
      SetImageXSize(500);
      SetImageYSize(100);
      SetImagePenWidth(5);
      this.signatureImg = GetSigImageB64(SigImageCallback);
     // this.setSignature.emit(this.signatureImg)
    }
  }

  startDrawing(event: Event) {
    this.singPen =  false
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }


  clearPad() {
    this.signatureImg = '';
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;

    this.setSignature.emit(this.signatureImg)
    this.signatureNeeded = this.signaturePad.isEmpty();
    if (!this.signatureNeeded) {
      this.signatureNeeded = false;
    }
  }


  



}