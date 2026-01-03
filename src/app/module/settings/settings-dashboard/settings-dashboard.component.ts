import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';


@Component({
  selector: 'app-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.scss']
})
export class SettingsDashboardComponent implements OnInit {

  pvisible = false;
  mpVisible = false;
  cvisible =  false;
  tvisible = false;
  cameravisible = false;
  isDispatchOnly: boolean = false;
  orgName: any;
  locId: any;
  systemprefVisible = false;
  currentRole:any;
  userprefVisible = false;
  currencySettingVisible = false;
  isMultiCurrencySupportEnabled: boolean = false;
  isMultiCashDrawerSupportEnabled: boolean = false;
  isRedeemCouponEnabled: boolean = false;
  isScaleMAchinesEnabled:boolean=false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService,
    private commonService: CommonService,
    private stroarge:StorageService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.currentRole = this.authService.userCurrentRole();
    this.isDispatchOnly = localStorage.getItem('isDispatchOnly') === 'true';
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.cameravisible = false;

     const systemInfo: any = this.stroarge.getLocalStorage('systemInfo');
    
      if (systemInfo && systemInfo.length > 0) {
        const currencySupportSetting = systemInfo.find(
          (item: any) => item?.keys?.toLowerCase() === 'ismulticurrencysupport'
        );
        this.isMultiCurrencySupportEnabled = (currencySupportSetting?.values.toLowerCase() === 'true');

        const cashDrawerSupportSetting = systemInfo.find(
        (item: any) => item?.keys?.toLowerCase() === 'ismulticashdrawersupport'
        );
        this.isMultiCashDrawerSupportEnabled = (cashDrawerSupportSetting?.values?.toLowerCase() === 'true');

        const redeemCouponEnabled =systemInfo.find(
          (item:any) => item?.keys?.toLowerCase() === 'isreedeemcoupen'
        );
        this.isRedeemCouponEnabled = (redeemCouponEnabled?.values?.toLowerCase() === 'true');

        const scalemachinesEnabled =systemInfo.find(
          (item:any) => item?.keys?.toLowerCase() === 'ismultiplescale'
        );
        this.isScaleMAchinesEnabled = (scalemachinesEnabled?.values?.toLowerCase() === 'true');
      }
      
  
  }

  hidePSettingsmodel(){
    this.pvisible = false
  }

  showPSettingsmodel() {
    this.pvisible = true;
  }


  showMpVisible() {
    this.mpVisible = true;
  }
  
  hideMpVisible(){
    this.mpVisible = false;
  }
  cashierModel(){
    this.cvisible = true;
  }

  hideModel(){
    this.cvisible = false;
  }

  tiketModel(){
    this.tvisible = true;
  }

  hidetiketModel(){
    this.tvisible = false;
  }

  scrapModel(){
      this.cameravisible =  true;
  }

  hidescrapModel(){
      this.cameravisible = false;
  }



  showSytemPerf(){
    this.systemprefVisible = true;
  }

  hideSytemPerf(){
    this.systemprefVisible = false;
  }

  showUserPerf(){
    this.userprefVisible = true;
  }

  hideUserPerf(){
    this.userprefVisible = false;
  }

   navigateToCashDrawerManagement() {
    this.router.navigate(['/{{orgName}}/settings/cash-drawer-management']);
  }


  navigateToRedemptionProgram(){
    this.router.navigate(['/{{orgName}}/settings/redemption-program-component']);
  }

  navigateToScaleMachines(){
    this.router.navigate(['/{{orgName}}/settings/scale-machine']);
  }




}
