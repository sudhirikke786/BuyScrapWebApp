import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-price-calculator',
  templateUrl: './price-calculator.component.html',
  styleUrls: ['./price-calculator.component.scss']
})
export class PriceCalculatorComponent implements OnInit, AfterViewInit {

  @Output() getPicture = new EventEmitter<string>();
  showWebcam = false;
  isCameraExist = true;
  allMediaDevices: any;

  @Input() defaultCamera:any;
  
  
  webcamImage: WebcamImage | undefined;
  selectedCamera: any = '';
  imageUrl: any;

  errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();



























  @ViewChild('inputBox1') inputBox1: ElementRef | undefined;
  @ViewChild('inputBox2') inputBox2: ElementRef | undefined;
  @ViewChild('inputBox3') inputBox3: ElementRef | undefined;
  @ViewChild('inputBox4') inputBox4: ElementRef | undefined;

  @Input() materialNote = '';
  @Input() itemGroupName = 'Motors/Motores';
  @Input() itemMaterialName = 'Aluminum Motors (Clean/Limpios)';
  @Input() itemImagePath :any


  @Input() itemGross: any;
  @Input() itemTare: any;
  @Input() itemNet: any = 0;
  @Input() itemPrice: any;

  isKeyboard = true;

  @Output() calculateObj = new EventEmitter<any>();
  @Output() changeItemEvent = new EventEmitter<any>();
  @Output() changeImageEvent = new EventEmitter<any>();

  @Output()  backClose =  new EventEmitter<any>();

  orgName: any;
  locId: any;
  logInUserId: any;
  locationName: any;
  isAutocapture = false;
  grossInput:any;
  tareInput:any;
  netInput:any = 0;
  priceInput:any;
  focusedInput: string | null = null;
  addNoteSectionVisible = false;  
  inputBoxes: any[] = [];
  private currentFocusIndex = 0;

  isNaN: Function = Number.isNaN;

  isVirtual = true;
  dCamera: any;
  checkTabView =  false;


  wHeight = 210;
  wWidth :any

  passwordmode = true;
  currentRole: any;
  i = 0 ;
  showCamera = true;
  materialkey: string = '';

  constructor(private renderer: Renderer2,
    private elementRef: ElementRef,
    private stroarge: StorageService,
    private authService:AuthService,
    private messageService: MessageService,
    private helperService:HelperService,
    public commonService: CommonService) {
      this.checkTabView = this.helperService.isTab();
  }




  @HostListener('window:resize', ['$event'])
  onResize(event?:any) {
   
    // this.wWidth =  this.elementRef.nativeElement.querySelector('.calculator').offsetWidth;
    // this.wHeight =  this.elementRef.nativeElement.querySelector('.calculator').offsetHeight;

    const totalWidth = this.elementRef.nativeElement.querySelector('.main-cal').offsetWidth;
    const cal = this.elementRef.nativeElement.querySelector('.cal').offsetWidth;
    this.wWidth = (totalWidth - cal)-10;

  }



  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(this.checkTabView) {
      if (event.key === 'Enter') {
        this.enter();
      }
    }
   
  }
  currentSize(){

    const totalWidth = this.elementRef.nativeElement.querySelector('.main-cal').offsetWidth;
    const cal = this.elementRef.nativeElement.querySelector('.cal').offsetWidth;



    this.wWidth = (totalWidth - cal)-10;
    this.wHeight = 300;
  
    console.log(this.wWidth,this.wHeight);
  }


  


  onKeyPress(event: KeyboardEvent) {

    if(this.isVirtual){
      event.preventDefault();
    }
   
  }


  ngOnInit(): void {

   
  
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);

    const autoCaptureMaterialPhotoItem = this.stroarge.getLocalStorage('systemInfo').find((item: any) => item.keys === "AutoCaptureMaterialPhoto");
    if (autoCaptureMaterialPhotoItem) {
      this.isAutocapture = this.stroarge.getLocalStorage('systemInfo').filter((item:any) => item.keys == "AutoCaptureMaterialPhoto")[0].values == "True" ? true : false;
    } else {
      this.isAutocapture = false;
    }
    
    this.locationName = localStorage.getItem('locationName');
    this.currentRole = this.authService.userCurrentRole();

    if(this.currentRole?.toLowerCase()=='administrator'){
      this.passwordmode = false;
    }
    this.grossInput = this.itemGross;
    this.tareInput = this.itemTare;
    const netQty = this.grossInput - this.tareInput
    this.netInput = isNaN(netQty) ?  0 : netQty;
    this.priceInput = this.itemPrice;
    if (this.inputBox1) {
      this.renderer.selectRootElement(this.inputBox1.nativeElement).focus();
    }


    if(this.checkTabView){
      this.isVirtual = true;
    }else{
      this.isVirtual = false;
    } 




    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      // const checkKeyboard = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'isvirtualkeyboard')[0];
      // this.isVirtual = checkKeyboard?.values == 'True' ? true : false ;
      // console.log(this.isVirtual)
    }
    const mCamera =  localStorage.getItem('metarialCamera') ;
    if(mCamera) {
      this.dCamera = mCamera;
    }

    this.currentSize();

  }

  focusInput() {
    this.elementRef.nativeElement.querySelector('.inputone').focus();
  }

  calcNetFromGross(gross: any) {    
    this.grossInput = (isNaN(gross) || gross == '') ?  0 : gross;
    // this.tareInput = (isNaN(this.tareInput) || this.tareInput == '') ?  0 : this.tareInput;
    this.netInput = gross - this.tareInput;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentSize();

    if(changes && changes.itemImagePath){
      if (changes.itemImagePath.currentValue != 'assets/images/custom/id_scan.png') {
        this.showWebcam = false;
        this.showCamera = false; 
        this.imageUrl =  changes.itemImagePath.currentValue;
        
      } else {
        this.imageUrl =  '';
        this.showWebcam = true;
      }
    }
    
  }

  showKeyboard(val:any){
    this.isVirtual = val.checked
    console.log(this.isKeyboard);
  }

 
  changeFocus() {
    // Set focus on the current input

    if (this.currentFocusIndex === this.inputBoxes.length-2) {
      this.tareInput = (isNaN(this.tareInput) || this.tareInput == '') ? 0 : this.tareInput;
      const obj = {
        itemGross: this.grossInput,
        itemTare: this.tareInput,
        itemNet: isNaN(this.grossInput - this.tareInput) ?  0 : (this.grossInput - this.tareInput),
        itemPrice: this.priceInput,
        materialNote: this.materialNote,
        itemImagePath: this.itemImagePath
      }
      this.grossInput = '';
      this.tareInput = ''; 
      this.netInput = 0; 
      this.materialNote = '';
      this.imageUrl = '';
      this.itemImagePath = '';
      this.calculateObj.emit(obj);
     }
     
     
      // Increment the focus index, resetting to 0 if it exceeds the number of inputs
      if(this.currentFocusIndex > 3){
        this.currentFocusIndex = 0;
      }else{
        this.currentFocusIndex = (this.currentFocusIndex + 1) % this.inputBoxes.length;
      }

      this.inputBoxes[this.currentFocusIndex]?.nativeElement.focus();

    //  
      console.log(this.currentFocusIndex);
  }

  changeItem() {
    this.imageUrl = '';
    this.itemImagePath = '';
    this.changeItemEvent.emit();
  }

  changeImage() {
    this.changeImageEvent.emit();
  }

  displayValue: string = '';

  clearDisplay() {
    this.displayValue = '';
  }

  appendNumber(number: any) {
   
    // if (this.i == 0 && this.isAutocapture) {
    //   this.takeSnapshot();
    // }
    // this.i++;
  
    if (this.focusedInput === 'inputBox1') {
      this.renderer.selectRootElement(this.inputBox1?.nativeElement).focus();
      let data = this.grossInput ?? '';
      if (data === '' || data == '0') {
        this.grossInput = number.toString().trim();
      } else {
        this.grossInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox2') {
      this.renderer.selectRootElement(this.inputBox2?.nativeElement).focus();
      let data = this.tareInput ?? '';
      if (data === '') {
        this.tareInput = number.toString().trim();
      } else {
        this.tareInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox4') {
      this.renderer.selectRootElement(this.inputBox4?.nativeElement).focus();
      let data = this.netInput ?? '';;
      if (data === '') {
        this.netInput = number.toString().trim();
      } else {
        this.netInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox3') {
      if(!this.passwordmode){
        this.renderer.selectRootElement(this.inputBox3?.nativeElement).focus();
        let data = this.priceInput ?? '';
        if (data === '') {
          this.priceInput = number.toString().trim();
        } else {
          this.priceInput += number.toString().trim();
        }
      }
      
    } else {
      console.log('No input box is currently focused');
    }
    
    const netQty = (isNaN(this.grossInput) ?  0 : this.grossInput) - (isNaN(this.tareInput) ?  0 : this.tareInput)
    this.netInput = isNaN(netQty) ?  0 : netQty;

  }

  // appendOperator(operator: string) {
  //   if (this.displayValue[this.displayValue.length - 1] !== operator) {
  //     this.displayValue += operator;
  //   }
  // }

  calculate() {
    try {
      if (this.focusedInput === 'inputBox1') {

      }
      this.displayValue = eval(this.displayValue).toString();
    } catch (error) {
      this.displayValue = 'Error';
    }
  }



  getFocusElemet(){
  
  }

  note() {
    this.addNoteSectionVisible = true;
  }

  addEditNote() {   
    // alert(this.materialNote); 
    this.addNoteSectionVisible = false;
  }

  deleteNote() {
    this.materialNote = '';
    this.addNoteSectionVisible = false;
  }

  enter() {
    if (this.i == 0 && this.isAutocapture) {
      this.takeSnapshot();
    }
    this.i++;
    this.calcNetFromGross(this.grossInput);
    this.changeFocus();
    console.log(this.currentFocusIndex);
    
   
  }


 
  deleteCharacter() {
    if (this.focusedInput === 'inputBox1') {
      if (this.grossInput.length > 1) {
        this.grossInput = this.grossInput.slice(0, -1);
      } else {
        this.grossInput = '';
      }

    }else if (this.focusedInput === 'inputBox2') {
      if (this.tareInput.length > 1) {
        this.tareInput = this.tareInput.slice(0, -1);
      } else {
        this.tareInput = '';
      }

    }else if (this.focusedInput === 'inputBox4') {
      if (this.netInput.toString().length > 1) {
        this.netInput = this.netInput.toString().slice(0, -1);
      } else {
        this.netInput = '';
      }
      
    }else if (this.focusedInput === 'inputBox3') {
      if (this.priceInput.toString().length > 1) {
        this.priceInput = this.priceInput.toString().slice(0, -1);
      } else {
        this.priceInput = '';
      }
    }

    // switch (key) {
    //   case value:
        
    //     break;
    
    //   default:
    //     break;
    // }
   
  }


  
  ngAfterViewInit(): void {



    this.inputBoxes = [this.inputBox1, this.inputBox2, this.inputBox3,this.inputBox4];
    setTimeout(()=>{
      this.inputBoxes[this.currentFocusIndex]?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },100);

    /**
     * On edit if image came default camera stop
     * 
     */
    if(this.showCamera){
      (async () => {     
        let devices = await navigator.mediaDevices.enumerateDevices(); 
       
        this.allMediaDevices = devices.filter(inputDeviceInfo => inputDeviceInfo.kind == "videoinput");
      
        this.isCameraExist = this.allMediaDevices && this.allMediaDevices.length > 0;
        const deviceId =  localStorage.getItem('metarialCamera');
        if(localStorage.getItem('metarialCamera')){
          setTimeout(() =>{
             this.selectedCamera =  deviceId; 
             this.changeWebCame(this.selectedCamera);
          },100)
         
        }else{
          this.selectedCamera =  this.allMediaDevices[0].deviceId;
          this.changeWebCame(this.selectedCamera);
        }
      
      })();
    }
 

   
    

  
  }


  startCpatureImage(){

    this.imageUrl = '';
    this.currentSize();

    navigator.mediaDevices.getUserMedia({video: true}); 
    (async () => {     
      let devices = await navigator.mediaDevices.enumerateDevices(); 
      console.log('mediaDevices 1111111111111');
      console.log(devices); 
      console.log('mediaDevices 2222222222222222');
      this.allMediaDevices = devices.filter(inputDeviceInfo => inputDeviceInfo.kind == "videoinput");
      console.log('mediaDevices' + JSON.stringify(this.allMediaDevices));
      this.isCameraExist = this.allMediaDevices && this.allMediaDevices.length > 0;
      const deviceId =  localStorage.getItem('metarialCamera');
      if(localStorage.getItem('metarialCamera')){
        setTimeout(() =>{
           this.selectedCamera =  deviceId; 
           this.changeWebCame(this.selectedCamera);
        },100)
       
      }else{
        this.selectedCamera =  this.allMediaDevices[0].deviceId;
        this.changeWebCame(this.selectedCamera);
      }
    
    })();
  }

  ngOnDestroy() {
    this.showWebcam = false;
    this.imageUrl = '';
    this.itemImagePath = '';
    console.log('Destory------->>')
  }





  takeSnapshot(): void {
    this.trigger.next();
    this.currentSize();
  }

  onOffWebCame() {
    if (this.selectedCamera != '') {
      this.showWebcam = !this.showWebcam;
    }
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {    
    if (this.selectedCamera != '') {
      console.log('directionOrDeviceId' + JSON.stringify(directionOrDeviceId));
      this.nextWebcam.next(directionOrDeviceId);
      this.showWebcam = true;
    } else {      
      this.showWebcam = false;
    }
  }


   async convertIntoOCR(imgUrl:any) {
    const index =  imgUrl.indexOf('base64,') + 7; // Find the position of ','
    const base64Data = imgUrl.substring(index); // Extract base64 data
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
  
    // Create a Blob from the binary data
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Change the type if necessary
    
    // Generate a local URL for the Blob
    const url = URL.createObjectURL(blob);

    try {
    //  // const result =  await Tesseract.recognize(url);
    
    
    } catch (error) {
      console.error('Error during OCR:', error);
    }
  }



  handleImage(webcamImage: WebcamImage) {
    // alert('Sudhir');
    this.webcamImage = webcamImage;
    this.imageUrl = webcamImage.imageAsDataUrl;
    this.showWebcam = false;
    this.getPicture.emit(this.imageUrl);
    // alert(this.imageUrl);
    this.SaveImage(1);
  }

  SaveImage(type: number) {

    let requestObj: any = {

      organisationName: this.orgName,
      locationName: this.locationName,
      imagetype: type,
      base64Data: this.imageUrl?.split(';base64,')[1]
    };

    // this.itemImagePath = this.imageUrl;

    this.commonService.FileUploadFromWeb(requestObj).subscribe((res: any) => {
      console.log('Image url path :: {}', res.body.data);
      console.log(res.body.data);
      this.imageUrl = res.body.data;
      if (type == 1) {
        this.itemImagePath = this.imageUrl;
      } 
      // this.imageUrl = null;
    })

    // this.imageUrl = null;
    // this.closeCapturedImage(type);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  

  priceModify(){
    this.validateExistingMaterialKey();
  }
  
  validateExistingMaterialKey() {
    const datePipe = new DatePipe('en-US');

    const requestObj = {
      "Key": this.materialkey,
      "LocId": this.locId
    }
 
    this.commonService.ValidatePriceKeySettings(requestObj)
      .subscribe(data => {
          console.log('data :: ');
          console.log(data.body.data);
          if (data.body.data) {
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Key validated' });
            this.passwordmode = false;
          } else {          
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Key.' }); 
            this.passwordmode = true;         
          }
                
        },
        (err: any) => {          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while updating.' });          
        }
      );
  }

  backToChangeItemMainMaterials(){
    this.backClose.emit(true);
  }



}
