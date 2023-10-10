import { Injectable } from '@angular/core';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: CartItem[] = [];


  constructor() { 

  }

  // Add a cart item to the cart
  addToCart(item: CartItem): void {
    this.cartItems.push(item);
  }

  isPlanExist(item: CartItem){
    return this.cartItems.some((items) => items.name === item.name && items.quantity === item.quantity);
  }

  findIndexItem(item:CartItem){
    return  this.cartItems.findIndex((items: any) => items.name == item.name);
  }

   // Remove a cart item to the cart
  removeToCart(index:number) { 
  
      this.cartItems.splice(index,1);
    
  
  }


  // Get all cart items
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getTotal(){
    const total = this.cartItems.reduce((acc, curr) => acc + curr.price, 0);
    return total;
  }


}
