import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {


  paymentHandler: any = null;

  stripeAPIKey: any = 'pk_test_51NyqSvSEJISOhUbDfdtjYyaSRTMi2lEmnNt7IHJWhkgF5xPT8XOJdS2qUDPqiPG6FV8hWcxwvAZDp8PMLYaAbroI00NbpxxMV8';

  orgName: any;
  locId: any;


  userPlan = { name: 'Add User Login', price: 30, quantity: 1, selected: false };
  locationPlan = { name: 'Add Locations', price: 15, quantity: 1, selected: false };
  buyScrappLite = { name: 'BuyScrApp Lite', price: 49, quantity: 1, selected: false };
  buyScrappPlus = { name: 'BuyScrApp Plus', price: 99, quantity: 1, selected: false };
  extraMonthlyPlan = { name: 'Add Monthly Tickets', price: 30, quantity: 1, selected: false };


  monthlyObj: any[] = [];
  constructor(private route: ActivatedRoute,
    private router: Router,
    public cartService: CartService,
    private localService:StorageService,
    private commonService: CommonService) { }

  ngOnInit() {

    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
  }

  addCart(params: any, isSelected: boolean) {
    console.log(params);
    params.selected = false;
    if (this.cartService.isPlanExist(params)) {
      alert('Plan alreday Exist');
    } else {
      this.cartService.addToCart({ ...params, 'selected': isSelected })
    }

  }

  removeCartItem(item: any) {
    const isplanExist = this.cartService.getCartItems().findIndex((items: any) => items.name == item.name);

    if (isplanExist > -1) {
      this.cartService.removeToCart(isplanExist);
    }



  }

  proccedCart() {

    this.localService.setLocalStorage('product',this.cartService.getCartItems());
    this.router.navigateByUrl(`${this.orgName}/my-account/view-cart`);
   
  }

  monthlyPlan(planObj: any) {

    const isMonthlyItemIndex = this.cartService.getCartItems().findIndex((item: any) => item.isMonthly == true);

    if (isMonthlyItemIndex > -1) {
      this.cartService.removeToCart(isMonthlyItemIndex);
    }
    this.addCart({ ...planObj, 'isMonthly': true }, true);



  }


  addItemLocation(Obj: any) {

    const isItemLocationIndex = this.cartService.getCartItems().findIndex((item: any) => item.isLocation == true);

    if (isItemLocationIndex > -1) {
      this.cartService.removeToCart(isItemLocationIndex);
    } else {
      this.addCart({ ...Obj, 'isLocation': true }, true);
    }


  }
  addUser(obj: any) {
    const isItemUserIndex = this.cartService.getCartItems().findIndex((item: any) => item.isUser == true);

    if (isItemUserIndex > -1) {
      this.cartService.removeToCart(isItemUserIndex);
    } else {
      this.addCart({ ...obj, 'isUser': true }, true);
    }

  }


  addUserQuantity() {
    this.updateUserPlanQuantity(this.userPlan.quantity + 1);
    this.addUser(this.userPlan);
  }

  subUserQuantity() {
    this.updateUserPlanQuantity(this.userPlan.quantity - 1);
    this.addUser(this.userPlan);
  }

  updateUserPlanQuantity(quantity: number) {
    if (quantity > 0) {
      this.userPlan.quantity = quantity;
      this.userPlan.price = 15;
    } else {
      this.userPlan.quantity = 1;
      this.userPlan.price = 15;
    }
  }




  addlocationQuantity() {
    this.updatelocationPlanQuantity(this.locationPlan.quantity + 1);
    this.addItemLocation(this.locationPlan);
  }

  sublocationQuantity() {
    this.updatelocationPlanQuantity(this.locationPlan.quantity - 1);
    this.addItemLocation(this.locationPlan);
  }

  updatelocationPlanQuantity(quantity: number) {
    if (quantity > 0) {
      this.locationPlan.quantity = quantity;
      this.locationPlan.price =  15;
    } else {
      this.locationPlan.quantity = 1;
      this.locationPlan.price = 15;
    }
  }












}




