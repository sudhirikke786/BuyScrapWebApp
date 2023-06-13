import { Component } from '@angular/core';

@Component({
  selector: 'app-shipout-dashboard',
  templateUrl: './shipout-dashboard.component.html',
  styleUrls: ['./shipout-dashboard.component.scss']
})
export class ShipoutDashboardComponent {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode:'mdi-plus',
      title:'New Ship Out'
    }
  ];

   newButtonList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode:'mdi-account',
      title:'New Customer'
    }
  ];


  

  shipouts = [
    {	
      billOfLanding: '117',
      dateCreated: '05/11/2023',
      carrier: '',
      totalNet: '22.00',
      buyer: 'MetalBuyers USA'
    },
    {	
      billOfLanding: '119',
      dateCreated: '08/05/2023',
      carrier: '',
      totalNet: '22.00',
      buyer: 'MetalBuyers USA'
    },
    {	
      billOfLanding: '116',
      dateCreated: '25/12/2023',
      carrier: '',
      totalNet: '22.00',
      buyer: 'MetalBuyers USA'
    },
    {	
      billOfLanding: '115',
      dateCreated: '03/10/2023',
      carrier: '',
      totalNet: '152.00',
      buyer: 'Tata Model'
    },
    {	
      billOfLanding: '120',
      dateCreated: '09/09/2023',
      carrier: '',
      totalNet: '22.00',
      buyer: 'MetalBuyers USA'
    },
    {	
      billOfLanding: '121',
      dateCreated: '19/10/2023',
      carrier: '',
      totalNet: '35.00',
      buyer: 'Monster Cable INC'
    },
    {	
      billOfLanding: '122',
      dateCreated: '14/08/2023',
      carrier: '',
      totalNet: '45.00',
      buyer: 'MetalBuyers USA'
    },
    {	
      billOfLanding: '123',
      dateCreated: '30/10/2023',
      carrier: '',
      totalNet: '82.00',
      buyer: 'MetalBuyers USA'
    },
    {	
      billOfLanding: '152',
      dateCreated: '31/02/2023',
      carrier: '',
      totalNet: '95.00',
      buyer: 'Monster Cable INC'
    },
    {	
      billOfLanding: '125',
      dateCreated: '26/10/2023',
      carrier: '',
      totalNet: '105.00',
      buyer: 'MetalBuyers USA'
    },
    {	
      billOfLanding: '128',
      dateCreated: '28/04/2023',
      carrier: '',
      totalNet: '520.00',
      buyer: 'MetalBuyers USA'
    },
    {	
      billOfLanding: '110',
      dateCreated: '24/11/2023',
      carrier: '',
      totalNet: '22.00',
      buyer: 'Monster Cable INC'
    }
  ];

  newCustomer = [{
   sellers : '202',
   dLicense :'2-----',
   licensePlat:'kksjkdksjd',
   address:'sllsdlsd'
  }]

  visible = false;
  custVisible=  false;


  showDialog() {
    this.visible =  true;
  }

  showCustomerModel(){
    this.custVisible = true;
  }
  closeDriver(){
    this.custVisible = false;
  }


  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.showDialog();
        break;
      case 'mdi-merge':
      
        break;
      default:
        break;
    }

  
  }

}
