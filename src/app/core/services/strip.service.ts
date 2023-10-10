import { Injectable } from '@angular/core';
import { Stripe, loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51NyqSvSEJISOhUbDfdtjYyaSRTMi2lEmnNt7IHJWhkgF5xPT8XOJdS2qUDPqiPG6FV8hWcxwvAZDp8PMLYaAbroI00NbpxxMV8');

@Injectable({
  providedIn: 'root'
})
export class StripService {
  private stripe!: Stripe;
  constructor() {
   }
 

    async initializeStripe() {
    const stripe = await loadStripe('pk_test_51NyqSvSEJISOhUbDfdtjYyaSRTMi2lEmnNt7IHJWhkgF5xPT8XOJdS2qUDPqiPG6FV8hWcxwvAZDp8PMLYaAbroI00NbpxxMV8');
    if(stripe){
      this.stripe = stripe;

    }
  }

  async createPaymentMethod(cardElement: any) {
    const stripe = await loadStripe('pk_test_51NyqSvSEJISOhUbDfdtjYyaSRTMi2lEmnNt7IHJWhkgF5xPT8XOJdS2qUDPqiPG6FV8hWcxwvAZDp8PMLYaAbroI00NbpxxMV8')

    if(stripe){
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (result.error) {
        // Handle error
      } else {
        // Use result.paymentMethod.id to process the payment on your server
        // Send the paymentMethod.id to your server for payment processing
      }
    }
  
  }

}
