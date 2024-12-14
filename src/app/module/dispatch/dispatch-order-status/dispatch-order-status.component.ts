import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
// export interface Item {
//   id: number;
//   name: string;
//   status:string,
//   ticketId:string,
//   buttonType:string,
// }

@Component({
  selector: 'app-dispatch-order-status',
  templateUrl: './dispatch-order-status.component.html',
  styleUrls: ['./dispatch-order-status.component.css']
})
export class DispatchOrderStatusComponent implements OnInit {

  mainItems:any[] = [];
  orgName:any;
  locId:any;
  targetBoxes:any = [];
  dispatchRes: any;
  //driverList = [];
  totalUnassignTickets:any= []
  constructor( public commonService: CommonService){

  }

  ngOnInit(): void {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getAllUsers();
    this.getAllCODTickets();
  }


  draggedItem: any | null = null;

  onDragStart(item: any): void {
    console.log('Drag Start:', item);
    this.draggedItem = item; // Save the dragged item
  }

  onDragEnd(): void {
    console.log('Drag End');
    this.draggedItem = null; // Reset the dragged item
  }

  onDrop(index:number): void {
  
    console.log(this.draggedItem);
    if (this.draggedItem) {
      this.targetBoxes[index].items.push(this.draggedItem);
      this.mainItems = this.mainItems.filter(item => item.id != this.draggedItem?.id);

      this.draggedItem = null;
    }



    
  

  }

  getAllCODTickets() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SerachText: ''
    };

    this.commonService.GetAllPickUpDetails(paramObject).subscribe(
      
      (data: any) => {
        //console.log('API Response:', data); 
        let _filterUnassignTicket = []
        if (data && data.body && data.body.data) {
          _filterUnassignTicket = data?.body?.data.filter((item:any) => !item.driverFirstName);
        }

        if (data && data.body && data.body.data) {
          const _mainItems = _filterUnassignTicket.map((item: any,index:number) => {
            //console.log('Mapped item:', item.ticketRowID);
            return {
              rowId: item.rowID, 
              id: index,     
              pickUpDate: item.pickUpDate,
              customerName: item.customerName,
              sellerName: item.sellerName,
              sellerID:item.sellerID,
              ticketRowID:item.ticketRowID,
              charges: item.charges,
              driverName:item.driverFirstName,
              selected: item.closedDate ? true : false,
              ticketId: item.ticketRowID > 0 ? item.ticketRowID : 0,
              sellerAddress: item.streetAddress         
            };
          });
          this.mainItems = _mainItems;
          console.log(this.mainItems)
          

        } else {
          console.error('No data found or incorrect response structure.');
        }

        
      
      },
      (err: any) => {
       
      
        console.error('Error fetching COD tickets:', err);
      },
    
       
    );
    
  }

  getAllUsers(){
    const reqObj = {
      LocationId: this.locId,
      UserID:0
    }
    this.commonService.GetAllUsers(reqObj).subscribe((res) =>{
      const driverData =  res?.body?.data;
      this.targetBoxes =  driverData.map((element:any) => {
        element.items = [];
        element.orderCount = 5;
        return element;
      });
     
    })
  }
  
  


}
