import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
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


  orgName: any;
  locId: any;


  userPlan = { name: 'Add User Login', price: 30, quantity: 0, selected: false };
  locationPlan = { name: 'Add Locations', price: 15, quantity: 0, selected: false };
  

  planObj:any;
  extraMOnthlyobj:any;
  organizationPlanDetails:any;

  selectedPlan:any;

  monthlyObj: any[] = [];
  filtermonthlySelectd: any;
  planSelectedObj: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public cartService: CartService,
    private localService:StorageService,
    private userInfo : AuthService,
    private commonService: CommonService) { }

  ngOnInit() {

    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getSubscription();
  }



  getSubscription(){
 

    const apiObj = [this.commonService.getAllSubscriptionPlan({
      SubscriptionPlanID: 0
    }), this.commonService.getAllExtraTicketPlans({
      ExtraTicketPlanID: 0
    }), this.commonService.getAllOrganisationPlanDetails({
      OrgName:this.orgName
    })]


    forkJoin(apiObj).subscribe((res) =>{

    

      this.organizationPlanDetails = res[2].body.data;
      this.organizationPlanDetails.defaultMonthPrice = 15;
      console.log(this.organizationPlanDetails);

      this.planObj =  res[0].body.data.map((res:any) => {
        res.planDesc =  this.addCrossMark(res.planHighlights);
      
        res.isselected = (this.organizationPlanDetails.subscriptionPlanId == res.subscriptionPlanId) ? true : false;
        return res;
      });

      this.extraMOnthlyobj =   res[1].body.data.map((res:any) => {
        res.isSelected = (this.organizationPlanDetails.extraTicketPlanId == res.extraTicketPlanId) ? true : false;
        res.totalTickets = res.extraTicket > 0 ?  (res.extraTicket / 25).toFixed(0) : 0;
        return res
      });

      this.filtermonthlySelectd = this.extraMOnthlyobj.filter((item:any) => item.isSelected)[0];
      this.planSelectedObj =  this.planObj.filter((item:any) => item.isselected)[0];

      console.log("plan Object",this.planSelectedObj)

     

    });
    
  

  }


  addCrossMark(descp:any) {
    const obj = descp?.split('||');

    const resp = obj.map((res:any) =>{
      const crossReplace = res.replace('(X)','');
      let obj =   {
        isCross : res.includes('(X)') ?  true : false,
        planDesc : crossReplace,
       }
       return obj
    })
    return resp;

   
   }



   
  getSelected(res:any,index:number){

    
    this.planObj[index].isselected =  !this.planObj[index].isselected;
    
    this.planObj.map((obj:any, i:number) => {
      obj.isselected = i === index;
      return obj
    });
    console.log(this.planObj);

   this.selectedPlan = res;
    
   

  }




  getAllExtraTicketPlans(){

    const req = {
      ExtraTicketPlanID:0
    }


    this.commonService.getAllExtraTicketPlans(req).subscribe((res) => {
      this.extraMOnthlyobj = res.body.data

    })

    // this.planObj =  res.body.data.map((res:any) => {
    //   res.planDesc =  res.planHighlights?.split('||') ?? res.planHighlights;
    //   return res;
    // });


    
  }


  // //https://api.buyscrapapp.com/Master/GetAllExtraTicketPlans?ExtraTicketPlanID=0

  // addCart(params: any, isSelected: boolean) {
  //   console.log(params);
  //   params.selected = false;
  //   if (this.cartService.isPlanExist(params)) {
  //     this.removeCartItem(params);
  //   } else {

  //     this.cartService.addToCart({ ...params, 'selected': isSelected })
  //   }

  // }

  // removeCartItem(item: any) {
  //   const isplanExist = this.cartService.getCartItems().findIndex((items: any) => items.name == item.name);

  //   if (isplanExist > -1) {
  //     this.cartService.removeToCart(isplanExist);
  //   }



  // }

  proccedCart() {

   const req =
    {
      organisationPlanDetailId : 0 ,
      organisationId : null,
      organisationName : this.orgName ,
      userId : this.userInfo?.currentUserInfo().userId,
      subscriptionPlanId : this.planObj.filter((item:any) => item.isselected)[0].subscriptionPlanId ,
      extraTicketPlanId : this.extraMOnthlyobj.filter((item:any) => item.isSelected)[0].extraTicketPlanId,
      extraUserCount : this.organizationPlanDetails.extraUserCount ,
      extraUserLocation : this.organizationPlanDetails.extraUserLocation ,
      totalSubscriptionCost : 149 ,
      CreatedBy : 7 ,
      UpdatedBy : 7 ,
      IsActive : 1 ,

   }

   console.log(req);
   
  }

  // monthlyPlan(planObj: any) {

  //   const isMonthlyItemIndex = this.cartService.getCartItems().findIndex((item: any) => item.isMonthly == true);

  //   if (isMonthlyItemIndex > -1) {
  //     this.cartService.removeToCart(isMonthlyItemIndex);
  //   }
  //   this.addCart({ ...planObj, 'isMonthly': true }, true);



  // }


  // addItemLocation(Obj: any) {

  //   const isItemLocationIndex = this.cartService.getCartItems().findIndex((item: any) => item.isLocation == true);

  //   if (isItemLocationIndex > -1) {
  //     this.cartService.removeToCart(isItemLocationIndex);
  //   } else {
  //     this.addCart({ ...Obj, 'isLocation': true }, true);
  //   }


  // }




  // addUser(obj: any) {
  //   const isItemUserIndex = this.cartService.getCartItems().findIndex((item: any) => item.isUser == true);

  //   if (isItemUserIndex > -1) {
  //     this.cartService.removeToCart(isItemUserIndex);
  //   } else {
  //     this.addCart({ ...obj, 'isUser': true }, true);
  //   }

  // }


  addUserQuantity() {
    this.updateUserPlanQuantity(this.organizationPlanDetails.extraUserCount + 1);
    //this.addUser(this.userPlan);
  }

  subUserQuantity() {
    this.updateUserPlanQuantity(this.organizationPlanDetails.extraUserCount - 1);
 //   this.addUser(this.userPlan);
  }

  updateUserPlanQuantity(quantity: number) {
    if (quantity > 0) {
      this.organizationPlanDetails.extraUserCount = quantity;
      this.organizationPlanDetails.defaultMonthPrice = 15;
    } else {
      this.organizationPlanDetails.extraUserCount = 0;
      this.organizationPlanDetails.defaultMonthPrice = 0;
    }
  }




  addlocationQuantity() {
    this.updatelocationPlanQuantity(this.organizationPlanDetails.extraUserLocation + 1);
   // this.addItemLocation(this.locationPlan);
  }

  sublocationQuantity() {
    this.updatelocationPlanQuantity(this.organizationPlanDetails.extraUserLocation - 1);
 //   this.addItemLocation(this.locationPlan);
  }

  updatelocationPlanQuantity(quantity: number) {
    if (quantity > 0) {
      this.organizationPlanDetails.extraUserLocation = quantity;
      this.organizationPlanDetails.defaultMonthPrice =  15;
    } else {
      this.organizationPlanDetails.extraUserLocation = 0;
      this.organizationPlanDetails.defaultMonthPrice = 0;
    }
  }



  











}




