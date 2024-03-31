import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { CommonService } from 'src/app/core/services/common.service';
import { DataService } from 'src/app/core/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class CheckplanGuard implements CanActivate {

  

  constructor(private cService: CommonService , private dtService:DataService){

  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

      try {
        const planObj = await this.getPlanDetails();
        if(planObj.body.data){
          this.dtService.setSubscriptionPlan(planObj.body.data)
        }
      } catch (error) {
        console.log(error)
      }
     
      return true
  }


   getPlanDetails()  {
      // if(this.dtService.getActivePlan()){
      //   let obj : any = {
      //     body: {
      //       data:this.dtService.getActivePlan()
      //     }
      //   }
      //   return obj;
      // }else{
        return this.cService.getAllOrganisationPlanName({}).toPromise();
      // }
     
   }

  
}
