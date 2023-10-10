import { Component } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';


@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.scss']
})
export class ViewCartComponent {
  orgName:any;
  locId: any;
  cartObj: any[]= [];
  paymentHandler: any = null;

  stripeAPIKey: any = 'pk_test_51NyqSvSEJISOhUbDfdtjYyaSRTMi2lEmnNt7IHJWhkgF5xPT8XOJdS2qUDPqiPG6FV8hWcxwvAZDp8PMLYaAbroI00NbpxxMV8';
  constructor(
    private localService:StorageService,
    public cartService:CartService,
    private commonService: CommonService) { }
    

  ngOnInit() {
    this.invokeStripe();
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.cartObj = this.cartService.getCartItems();
  }


  removeCart(item:any){
    const index = this.cartService.findIndexItem(item);
    this.cartService.removeToCart(index);
    this.cartObj = this.cartService.getCartItems();

  }


  


  /*------------------------------------------

  --------------------------------------------

  makePayment() Function

  --------------------------------------------

  --------------------------------------------*/

  makePayment(amount: any) {

    const paymentHandler = (<any>window).StripeCheckout.configure({

      key: this.stripeAPIKey,

      locale: 'auto',

      token: function (stripeToken: any) {

        console.log(stripeToken);

        alert('Stripe token generated!');

      },

    });

    paymentHandler.open({

      name: 'Kisanpwr1@gmail.com',

      description: "Plan Ans Subscription",

      amount: amount

    });

  }


  getCartData(){
    const _paymentData =  this.cartObj.map((item) => {
      return {
        name: item.name,
        amount: item.price
      }
    })
    return _paymentData;
  }



  description(){
    
    let templateString = '';

    // Loop through the array and build the template string
    for (const item of this.cartObj) {
      templateString += `
       Name: ${item.name} '\n'
      `;
    }
    
    return templateString;
    
    
    
    
    
  }

  /*------------------------------------------

  --------------------------------------------

  invokeStripe() Function

  --------------------------------------------

  --------------------------------------------*/

  invokeStripe() {

    if (!window.document.getElementById('stripe-script')) {

      const script = window.document.createElement('script');



      script.id = 'stripe-script';

      script.type = 'text/javascript';

      script.src = 'https://checkout.stripe.com/checkout.js';

      script.onload = () => {

        this.paymentHandler = (<any>window).StripeCheckout.configure({

          key: this.stripeAPIKey,

          locale: 'auto',

          token: function (stripeToken: any) {

            console.log(stripeToken);

            alert('Payment has been successfull!');

          },

        });

      };

      window.document.body.appendChild(script);

    }

  }

  
}
