import { Component, EventEmitter, AfterViewInit, Output, OnDestroy, Input , } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements AfterViewInit ,OnDestroy {
  @Output() getPicture = new EventEmitter<string>();
  @Output() userInfo =  new EventEmitter<any>();
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

  constructor() {}

  ngAfterViewInit(): void {
    
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

    //  this.showWebcam = false;
    })();
  }

  ngOnDestroy() {
    this.showWebcam = false;
    this.imageUrl = '';
    console.log('Destory------->>')
  }
  

  takeSnapshot(): void {
    this.trigger.next();
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
    //   console.log(result); // Log the result object
    //   const dta = result?.text;
    //   const textArray = dta.split('\n'); // Split by line breaks, adjust the delimiter based on your text format
    //    return textArray
    
    } catch (error) {
      console.error('Error during OCR:', error);
    }
  }



  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.imageUrl = webcamImage.imageAsDataUrl;
   


    //const _textData = await this.convertIntoOCR(this.imageUrl);

    //console.log(_textData);

    this.getPicture.emit(this.imageUrl);
    this.userInfo.emit(this.base64ToFile(this.imageUrl));
    
  }

  // Function to convert base64 to File object
  base64ToFile(base64String: any): any {
    // Decode base64 string to binary data
    let byteString = atob(base64String.split(',')[1]);
    
    // Create an ArrayBuffer and a typed array
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let uint8Array = new Uint8Array(arrayBuffer);

    // Populate the typed array with binary data
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    // Create a Blob from the typed array
    let blob = new Blob([uint8Array], { type: 'image/jpeg' }); // or 'image/png' depending on your image format

    let fileName = "image.jpg";
    // Convert Blob to File
    let file = new File([blob], fileName, { type: 'image/jpeg' }); // Specify file name and type
    
    return file;
  }


  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  

 
 
  
   onFileChanged(event: any) {
    this.imageUrl = null;
    const file = event.target.files[0];
    console.log('file  :: ' + JSON.stringify(file));
    let reader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload =  () => {
        this.imageUrl = reader.result;

       // const _textData = await this.convertIntoOCR(this.imageUrl);

      //  console.log(_textData);

        
        this.getPicture.emit(this.imageUrl);
        this.userInfo.emit(file);

        // const index = this.imageUrl.indexOf('base64,') + 7; // Find the position of ','
        // const base64Data = this.imageUrl.substring(index); // Extract base64 data
        // const byteCharacters = atob(base64Data);
        // const byteNumbers = new Array(byteCharacters.length);
        // for (let i = 0; i < byteCharacters.length; i++) {
        //   byteNumbers[i] = byteCharacters.charCodeAt(i);
        // }
        // const byteArray = new Uint8Array(byteNumbers);
      
        // // Create a Blob from the binary data
        // const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Change the type if necessary
        
        // // Generate a local URL for the Blob
        // const url = URL.createObjectURL(blob);

        // try {
        //   const result = await Tesseract.recognize(url);
        //   console.log(result); // Log the result object
        //   const dta = result?.text;
        //   const textArray = dta.split('\n'); // Split by line breaks, adjust the delimiter based on your text format
        //   alert(textArray)
        //   console.log(dta); // Log the recognized text
       
        // } catch (error) {
        //   console.error('Error during OCR:', error);
        // }
      }       
    }
    // Clear the input
    // event.target.value = null;
  }
}
