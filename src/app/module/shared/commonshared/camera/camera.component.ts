import { Component, EventEmitter, AfterViewInit, Output, OnDestroy } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements AfterViewInit ,OnDestroy {
  @Output() getPicture = new EventEmitter<string>();
  showWebcam = false;
  isCameraExist = true;
  allMediaDevices: any;
  
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
    // WebcamUtil.getAvailableVideoInputs().then(
    //   (mediaDevices: MediaDeviceInfo[]) => {
    //     this.allMediaDevices = mediaDevices;
    //     console.log('mediaDevices' + JSON.stringify(mediaDevices));
    //     this.isCameraExist = mediaDevices && mediaDevices.length > 0;
    //   }
    // );

    // devices.filter(inputDeviceInfo => inputDeviceInfo.kind == "videoinput")

    navigator.mediaDevices.getUserMedia({video: true}); 
    (async () => {     
      let devices = await navigator.mediaDevices.enumerateDevices(); 
      console.log('mediaDevices 1111111111111');
      console.log(devices); 
      console.log('mediaDevices 2222222222222222');
      this.allMediaDevices = devices.filter(inputDeviceInfo => inputDeviceInfo.kind == "videoinput");
      console.log('mediaDevices' + JSON.stringify(this.allMediaDevices));
      this.isCameraExist = this.allMediaDevices && this.allMediaDevices.length > 0;
      this.showWebcam = false;
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

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.imageUrl = webcamImage.imageAsDataUrl;
   
    this.getPicture.emit(this.imageUrl);

    
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
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.getPicture.emit(this.imageUrl);
      }       
    }
    // Clear the input
    // event.target.value = null;
  }
}
