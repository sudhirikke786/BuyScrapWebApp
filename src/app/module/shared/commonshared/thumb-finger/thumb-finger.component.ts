import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-thumb-finger',
  templateUrl: './thumb-finger.component.html',
  styleUrls: ['./thumb-finger.component.scss']
})
export class ThumbFingerComponent implements OnInit {

secugen_lic = "http://webapi.secugen.com";   // webapi.secugen.com
imagePath: any;

@Output() getBiomatric = new EventEmitter<any>();

ngOnInit(): void {
  this.CallSGIFPGetData();
}

  
ErrorFunc(status:any) {

  /* 	
      If you reach here, user is probabaly not running the 
      service. Redirect the user to a page where he can download the
      executable and install it. 
  */
  alert("Check if SGIBIOSRV is running; Status = " + status + ":");

}


ErrorCodeToString(ErrorCode:any) {
  var Description;
  switch (ErrorCode) {
      // 0 - 999 - Comes from SgFplib.h
      // 1,000 - 9,999 - SGIBioSrv errors 
      // 10,000 - 99,999 license errors
      case 51:
          Description = "System file load failure";
          break;
      case 52:
          Description = "Sensor chip initialization failed";
          break;
      case 53:
          Description = "Device not found";
          break;
      case 54:
          Description = "Fingerprint image capture timeout";
          break;
      case 55:
          Description = "No device available";
          break;
      case 56:
          Description = "Driver load failed";
          break;
      case 57:
          Description = "Wrong Image";
          break;
      case 58:
          Description = "Lack of bandwidth";
          break;
      case 59:
          Description = "Device Busy";
          break;
      case 60:
          Description = "Cannot get serial number of the device";
          break;
      case 61:
          Description = "Unsupported device";
          break;
      case 63:
          Description = "SgiBioSrv didn't start; Try image capture again";
          break;
      default:
          Description = "Unknown error code or Update code to reflect latest result";
          break;
  }
  return Description;
}


CallSGIFPGetData() {

  // Define the URL for your POST request
const apiUrl = 'https://localhost:8443/SGIFPCapture'; // Replace with your API endpoint

// Create an object containing the data you want to send in the request body
const strUrl ='hE/78I5oOUJnm5fa5zDDRrEJb5tdqU71AVe+/Jc2RK0=';
const postData = {
  Timeout: '100000',
  Quality: '50',
  licstr: strUrl,
  templateFormat: 'ISO',
  imageWSQRate: '0.75',
  // Add more data as needed
};

// Convert the data object to a FormData object (or adjust as needed)
const formData = new FormData();
for (const [key, value] of Object.entries(postData)) {
  formData.append(key, value);
}

// Create the request configuration
const requestOptions = {
  method: 'POST', // HTTP method (POST in this case)
  body: formData, // Use the FormData object as the request body
};

// Send the POST request using the Fetch API
fetch(apiUrl, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response JSON
  })
  .then(result => {
    // Handle the successful response data
    this.imagePath = result;

    this.getBiomatric.emit(result?.BMPBase64);
    console.log('Response data:', result);
  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error('Error:', error);
   // failCall(error)
  });
  
  
  
 
  
  // let uri = "https://localhost:8443/SGIFPCapture";

  // const xmlhttp = new XMLHttpRequest();
  // xmlhttp.onreadystatechange = function () {
  //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //         const fpobject = JSON.parse(xmlhttp.responseText);
  //         successCall(fpobject);
  //     }
  //     else if (xmlhttp.status == 404) {
  //         failCall(xmlhttp.status)
  //     }
  // }
  // let params = "Timeout=" + "100000";
  // params += "&Quality=" + "50";
  // params += "&licstr=" + encodeURIComponent('hE/78I5oOUJnm5fa5zDDRrEJb5tdqU71AVe+/Jc2RK0=');
  // params += "&templateFormat=" + "ISO";
  // params += "&imageWSQRate=" + "0.75";
  // console.log
  // xmlhttp.open("POST", uri, true);
  // xmlhttp.send(params);

  // xmlhttp.onerror = function () {
  //     failCall(xmlhttp.statusText);
  // }
}



}
