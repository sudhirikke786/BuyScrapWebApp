import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit,AfterViewInit, OnDestroy {

  showImage = false;

  planObj:any;
  extraMOnthlyobj:any;
  organizationPlanDetails:any; 
  selectedPlan: any;

  constructor( private commonService: CommonService){

  }

  
  ngAfterViewInit(): void {
    const ds : any = document.querySelector('body');
    if(ds){
      ds.classList.remove('fix-body');
    }   
  }

  ngOnInit(): void {
    this.getSubscription();
  }


  getSubscription(){
 

  
       this.commonService.getAllSubscriptionPlan({SubscriptionPlanID: 0}).subscribe((res) => {
         this.planObj = res.body.data.map((res:any) => {
          res.planDesc =  this.addCrossMark(res.planHighlights);
          res.isselected =  false;
          return res;
        });

       })
  
   
  
  
      
 
  
    

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

  ngOnDestroy(): void {

    const ds : any = document.querySelector('body');
    if(ds){
      ds.classList.add('fix-body');
    }


  }

  addRegister(){
    this.showImage = true;
  }

  cancelImage(){
    this.showImage = false;
  }

  makePayment(){    
    console.log(this.selectedPlan);
    alert(JSON.stringify(this.selectedPlan));

    // const reqObj = {
    //   amount: 1
    // };

    // this.commonService.paySubscriptionFee(reqObj).subscribe(session =>{
    //   console.log("session details :: ");
    //   console.log(session);
    //   this.commonService.redirectToCheckout(session.body);
    //   // this.htmlToAdd = session;

    //   // window.location.href = session;
    //   // return session;
    // },(error: any) =>{
    //   console.log(error);
    // })
  }



}
