import { AfterViewInit, Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-camera-settings',
  templateUrl: './camera-settings.component.html',
  styleUrls: ['./camera-settings.component.scss']
})
export class CameraSettingsComponent implements OnInit, AfterViewInit {



  isCameraExist = true;
  allMediaDevices: any;
  selectedCamera:any;
  selectedDefault:any;
  
  webcamImage: WebcamImage | undefined;
  selectedScrap: any = '';
  imageUrl: any;

  errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  


  constructor() {}

  ngOnInit(){

     this.addCameraDevices();
    // navigator.mediaDevices.getUserMedia({video: true}); 
    // (async () => {     
    //   let devices = await navigator.mediaDevices.enumerateDevices(); 
     
    //   if(devices){
    //     this.allMediaDevices = devices.filter(inputDeviceInfo => inputDeviceInfo.kind == "videoinput");
    //     const deviceId = localStorage.getItem('deviceId');
    //     if(localStorage.getItem('deviceId')){
  
    //          this.selectedDefault =  deviceId;
  
    //     }
      
    //   }

    // })();
  }


  async addCameraDevices(): Promise<void> {
    this.allMediaDevices = await this.getCameraDevices();

    const deviceId = localStorage.getItem('deviceId');

    if(localStorage.getItem('deviceId')){
  
        this.selectedDefault =  deviceId;
    
     }
  }


    async getCameraDevices(): Promise<MediaDeviceInfo[]> {

   
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'videoinput');
      } catch (error) {
        console.error('Error enumerating camera devices:', error);
        return [];
      }
    
   }


  ngAfterViewInit(): void {
   


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
