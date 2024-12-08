import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
export interface Item {
  id: number;
  name: string;
  status:string,
  ticketId:string,
  buttonType:string,
}

@Component({
  selector: 'app-dispatch-order-status',
  templateUrl: './dispatch-order-status.component.html',
  styleUrls: ['./dispatch-order-status.component.css']
})
export class DispatchOrderStatusComponent implements OnInit {

  mainItems: Item[] = [
    { id: 1,  name: "Dropoff",status:"pending review", ticketId:'1222',buttonType:'overdue by 8 days ' },
    { id: 2, name: 'Pickup' ,status:"pending review", ticketId:'1222',buttonType:'overdue by 8 days '},
    { id: 3, name: 'Exchange',status:"pending review", ticketId:'1222',buttonType:'overdue by 8 days ' },
  ];
  orgName:any;
  locId:any;
  targetBoxes:any = [];
  //driverList = [];
  constructor( public commonService: CommonService){

  }

  ngOnInit(): void {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getAllUsers();
  }


  draggedItem: Item | null = null;

  onDragStart(item: Item): void {
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
