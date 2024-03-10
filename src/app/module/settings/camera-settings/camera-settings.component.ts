import { AfterViewInit, Component } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-camera-settings',
  templateUrl: './camera-settings.component.html',
  styleUrls: ['./camera-settings.component.scss']
})
export class CameraSettingsComponent implements AfterViewInit {



  showWebcam = false;
  isCameraExist = true;
  allMediaDevices: any;
  selectedCamera:any;
  selectedDefault:any;
  
  webcamImage: WebcamImage | undefined;
  selectedScrap: any = '';
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
      const deviceId = localStorage.getItem('deviceId');
      if(localStorage.getItem('deviceId')){

        setTimeout(() =>{
           this.selectedDefault =  deviceId;
        },100)
       
      }
      console.log('mediaDevices' + JSON.stringify(this.allMediaDevices));
      this.isCameraExist = this.allMediaDevices && this.allMediaDevices.length > 0;
      this.showWebcam = false;
    })();
  }


  changeWebCame(event:any) {    
    console.log(event);

   // localStorage.setItem('defualtCemera' , event.target.value);
  }


  changeDWebCame(event:any) {    
    if(event.target.value){
      localStorage.setItem('deviceId', event.target.value);
    }
 
  }


}
