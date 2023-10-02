import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';

declare var SetTabletState: any;
declare var SetDisplayXSize: any;
declare var SetDisplayYSize: any;
declare var SetJustifyMode: any;
declare var ClearTablet: any;
declare var GetSigString: any;
declare var SetSigCompressionMode: any;
declare var SetImageXSize: any;
declare var SetImageYSize: any;
declare var NumberOfTabletPoints: any;
declare var SetImagePenWidth: any;
declare var GetSigImageB64: any;
declare var SigImageCallback: any;
var tmr: any;

@Component({
  selector: 'app-pen-signature',

  templateUrl: './pen-signature.component.html',
  styleUrls: ['./pen-signature.component.scss']
})
export class PenSignatureComponent implements OnInit {
  @ViewChild('canvasmanual', { static: true }) canvasmanual!: ElementRef;
  @ViewChild('canvaspen', { static: true }) canvaspen!: ElementRef;
  signatureNeeded!: boolean;
  signaturePad!: SignaturePad;

  @Input() signpad = '';
  

  @Output() setSignature = new EventEmitter<any>();
  signatureImg: any ;
  singPen: boolean = false;

  ngOnInit() {
    if(this.signpad =='manual'){
      this.singPen = false;
      this.signaturePad = new SignaturePad(this.canvasmanual.nativeElement);
    }else{
      this.singPen = true;
      this.onSign();
    }
 
  }

  onSign() {

      var ctx = this.canvaspen.nativeElement.getContext('2d');
      SetDisplayXSize(250);
      SetDisplayYSize(100);
      SetTabletState(0, tmr);
      SetJustifyMode(0);
      ClearTablet();
      if (tmr == null) {
        tmr = SetTabletState(1, ctx, 50);
      }
      else {
        SetTabletState(0, tmr);
        tmr = null;
        tmr = SetTabletState(1, ctx, 50);
      }
   

   

  }

  saveDone() {
   
    if (this.singPen) {
      this.onDone();
    } else {
      this.savePad();
    }
  }



  onDone() {
    this.signatureNeeded = true;
    if (NumberOfTabletPoints() == 0) {
      alert("Please sign before continuing");
    }
    else {
      SetTabletState(0, tmr);
      //RETURN TOPAZ-FORMAT SIGSTRING
      SetSigCompressionMode(1);
      //this returns the signature in Topaz's own format, with biometric information
    
  
      // this.signatureImg =`data:image/png;base64,${imagPath}`;
      //RETURN BMP BYTE ARRAY CONVERTED TO BASE64 STRING
      SetImageXSize(250);
      SetImageYSize(100);
      SetImagePenWidth(5);
     // GetSigImageB64(this.sigImageCallback);
    
      GetSigImageB64((str:any) => {
        console.log(str)
        const  data = str;
        this.signatureImg = data;
        console.log(this.signatureImg)
        this.signatureNeeded = true;
        this.setSignature.emit('data:image/jpg;base64,'+this.signatureImg);
      });
      
      
    }
  }

   

  startDrawing(event: Event) {
    this.singPen = false
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }


  clearPad() {
   
    this.signatureImg = '';
 
    if(this.signpad =='manual'){
    this.signaturePad.clear();
    }else{
      this.signatureImg = '';
      this.onSign();
      //this.canvaspen.nativeElement.value = ''; 
      
   
    }

  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;

    this.setSignature.emit(this.signatureImg)
    this.signatureNeeded = this.signaturePad.isEmpty();
    if (!this.signatureNeeded) {
      this.signatureNeeded = true;
    }
  }






}