import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { 


  }

  setLocalStorage(keyname:string,obj:any){
    if(obj){
      localStorage.setItem(keyname,JSON.stringify(obj))
    }
  }

  getLocalStorage(keyname:any){
   const storage = localStorage.getItem(keyname);
    if(storage){
      return JSON.parse(storage);
    }
  }
}
