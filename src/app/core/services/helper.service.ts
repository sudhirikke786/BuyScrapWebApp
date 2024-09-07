import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  deviceInfo: any;
  isMobile: any;
  isTablet: any;
  isDesktop: any;
  constructor(
    private deviceService: DeviceDetectorService,
    private stroarge: StorageService
  ) {}

  isTab(): boolean {
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);

    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();

    const isLinuxOS = this.deviceService.os.toLowerCase() == 'linux'; // For Android Tablet

    // alert(JSON.stringify(this.deviceInfo) + ' :: isMobile :: ' +JSON.stringify(this.isMobile) +
    //  ' :: isTablet :: ' +JSON.stringify(this.isTablet) + ' :: isDesktop :: ' +JSON.stringify(this.isDesktop) +
    //   ' :: ' + ' :: isAndroid :: ' +JSON.stringify(isAndroid) + ' :: ')

    if (this.isMobile || this.isTablet || isAndroid || isLinuxOS) {
      console.log('Mobile / Tablet Device');
      return true;
    } else {
      console.log('Desktop or Laptop');
    }
    return false;
  }

  /**
   *
   * @param base64Data : File data binary string
   * @param fileName  : file name
   */

  downloadBase64Pdf(base64Data: string, fileName: string): void {
    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    let isAutoDownload = false;
    if (_dataObj) {
      const isElectronic = _dataObj.filter(
        (item: any) => item?.keys?.toLowerCase() == 'isStarMicronicsPrinter'
      )[0];
      isAutoDownload = isElectronic?.values == 'True' ? true : false;
    }

    if (isAutoDownload) {
      const _starDownload = `starpassprnt://v1/print/nopreview?back=${encodeURIComponent(
        window.location.href
      )}&pdf=${encodeURIComponent(base64Data)}`;

      location.href = _starDownload;
    } else {
      // // Convert Base64 string to byte array
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob and URL for the PDF
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      // Create and append download link
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName ?? 'Download Report' + '.pdf'; // Set download file name
      downloadLink.textContent = 'Download Receipt PDF';
      downloadLink.style.display = 'none'; // Hide the link
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();
    }
  }
}
