import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService, ConfirmationService } from 'primeng/api';

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
  styleUrls: ['./dispatch-order-status.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class DispatchOrderStatusComponent implements OnInit {

  mainItems:any[] = [];
  orgName:any;
  locId:any;
  targetBoxes:any = [];
  dispatchRes: any;
  driverList:any  = []
  selecteddriverID:any = [];
  isLoading = false;
  //driverList = [];
  totalUnassignTickets:any= []
  backUrl: any;
  indexbox!: number;
  pendingIndexbox: any;
  draggedFrom!: string;
  boxindex !: number;
  constructor( public commonService: CommonService, private messageService: MessageService,){

  }

  ngOnInit(): void {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getAllUsers();
    this.backUrl = `/${this.orgName}/dispatch`;
  //  this.getAllCODTickets();
  }


  draggedItem: any | null = null;

  onDragStart(item: any,index:any,dragfrom:string,_boxindex?:number): void {
    console.log('Drag Start:', item);
    this.draggedFrom = dragfrom;
    if (_boxindex !== undefined && _boxindex !== null) {
      this.boxindex = _boxindex;
    }
   
    if(dragfrom == 'PT'){
      this.pendingIndexbox = index;
    }else{
      this.indexbox = index;
    }
  
    this.draggedItem = item;  // Save the dragged item


    // this.draggedItem.driverID = driverObj.driverID;
    // this.draggedItem.driverFullName = driverObj.driverFullName;
    
  }

onDragEnd(): void {
    console.log('Drag End');
    this.draggedItem = null;  // Reset the dragged item
}

onDrop(index: number): void {
 // this.indexbox = index;
  if (!this.draggedItem) return;

  // // Ensure the dragged item isn't already in the target box
  // const isItemInTargetBox = this.targetBoxes[index].items.some(
  //     (item: { id: number }) => item.id === this.draggedItem.id
  // );

  // if (isItemInTargetBox) {
  //     console.log('Item already in target box:', this.draggedItem);
  //     return; // Skip if already in the target box
  // }

  // Remove the item from the pending list or other boxes

  this.mainItems = this.mainItems.filter(item => item.id !== this.draggedItem.id);
  if(this.draggedFrom == 'PT'){
    this.targetBoxes[index].items.push(this.draggedItem);
   
  }

  if(this.draggedFrom == 'D'){
  
    this.targetBoxes[index].items.push(this.draggedItem);
    if (this.boxindex !== undefined && this.boxindex !== null) {
       this.targetBoxes[this.indexbox].items.splice(this.boxindex,1)
    }
   
  }
  console.log(this.targetBoxes[index])
  
  this.draggedItem = null;
  
  // this.targetBoxes.forEach((driver:any) => {
  //     driver.items = driver.items.filter((item:any) => item.id !== this.draggedItem.id);
  // });

  // Add the dragged item to the new target box
  // if(this.pendingIndexbox > 0){
  // //  const targetBoxIndex = this.targetBoxes.findIndex((box: any) => box.items.some((item: any) => item.id === this.draggedItem.id));
  //   if(this.draggedFrom == 'PT'){
  //     this.mainItems.splice(this.pendingIndexbox, 1);
  //   }
  //   //delete this.targetBoxes[index].items[this.indexbox];
  //   this.targetBoxes[index].items.push(this.draggedItem);
  // } 
  
  // else{
  //   this.mainItems.push(this.draggedItem)
  // }

  // console.log('Item added to new target box:', this.targetBoxes[index]);

  // this.draggedItem = null;

  // Optionally submit changes after drop
  setTimeout(() => {
      if (this.targetBoxes.length > 0) {
        let driverObj = {
          driverID : this.targetBoxes[index].driverID,
          driverFullName : this.targetBoxes[index].driverFullName
        }
          this.submitSave(this.targetBoxes[index].items[this.targetBoxes[index].items.length - 1],driverObj);
      }
  }, 1000);
}

onDropToPending(event: any): void {
  if (this.draggedItem) {
      // Remove item from current driver box or target box

      const targetBoxIndex = this.targetBoxes.findIndex((box: any) => box.items.some((item: any) => item.id === this.draggedItem.id));

      //delete this.targetBoxes[this.indexbox].items[targetBoxIndex]
      this.targetBoxes[this.indexbox].items.splice(targetBoxIndex,1)

      // Return the item to the Pending Requests
      this.mainItems.push(this.draggedItem);
      console.log('Item returned to Pending Requests:', this.draggedItem);
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

    this.isLoading =  true;

    this.commonService.GetAllPickUpDetails(paramObject).subscribe(
      
      (data: any) => {

        this.isLoading =  false;

        //console.log('API Response:', data); 
        let _filterUnassignTicket = [];
        let _driverList = [];
        if (data && data.body && data.body.data) {
          _filterUnassignTicket = data?.body?.data.filter((item:any) => !item.driverFirstName);
          _driverList = data?.body?.data.filter((item:any) => item.driverID);
          console.log("driverlist",_driverList)
        }

        if (data && data.body && data.body.data) {
          const _mainItems = _filterUnassignTicket.map((item: any,index:number) => {
            //console.log('Mapped item:', item.ticketRowID);
            return {
              rowID: item.rowID, 
              id: index,     
              pickUpDate: item.pickUpDate,
              customerName: item.customerName,
              sellerName: item.sellerName,
              sellerID:item.sellerID,
              ticketRowID:item.ticketRowID,
              charges: item.charges,
              typeID:item.typeID,
              type:item.type,
              driverName:item.driverFirstName,
              ticketStatus:this.addStatus(item),
              colorStatus:this.addColorStatus(item),
              selected: item.closedDate ? true : false,
              ticketId: item.ticketRowID > 0 ? item.ticketRowID : 0,
              sellerAddress: item.streetAddress         
            };
          });
          this.mainItems = _mainItems.filter((item:any) => {
            return item.closedDate==null
          });
          console.log(this.mainItems)
          

        } else {
          console.error('No data found or incorrect response structure.');
        }

        this.targetBoxes = [];
        let  groupedData:any = [];
        _driverList.forEach((item:any) => {
          item.ticketStatus = this.addStatus(item);
          item.driverID = item.driverID;
          item.colorStatus = this.addColorStatus(item);
            if(!groupedData[item.driverID]) {
              groupedData[item.driverID] = [];
            }
           groupedData[item.driverID].push(item);
        });

        console.log(groupedData);


        // this.targetBoxes =  driverData.map((element:any) => {
        //   element.items = [];
        //   element.orderCount = 5;
        //   return element;
        // });

        this.targetBoxes =  this.driverList.map((element:any,index:number) => {
          element.items =  groupedData[element.rowId] ? groupedData[element.rowId] : [] ;
          element.id = index;
          element.driverID = element.rowId;
          element.driverFullName = element.driverFullName;
          return element
        });
        console.log("targetdata",this.targetBoxes);

        
      
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
     this.driverList =  res?.body?.data.filter((item:any) =>item.role.toLowerCase() == 'driver');
      this.getAllCODTickets()
    })
  }



  submitSave(obj:any,driverObj:any){
 

    try {
      // Find the correct target box where the item is being dropped
    //  const targetBoxIndex = this.targetBoxes.findIndex((box: any) => box.items.some((item: any) => item.id === this.draggedItem.id));
    
   
        const targetBox =  obj;
       //const draggedItemIndex = targetBox.items.findIndex((item: any) => item.id === this.draggedItem.id);
    
        // Check if the dragged item has 'Unassigned' status
       
          // Update the driver info for the dragged item
       
    
          const objectData = {...targetBox,...driverObj};
          console.log(objectData);
    
          // Call your service to update the backend with the new driver info
          this.commonService.InsertUpdatePickup(objectData).subscribe(
            (res) => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order Assigned Successfully' });
              this.getAllCODTickets();
            },
            (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
              console.log('Error');
            }
          );
        
     
    } catch (error) {
      console.log(error);
    }
    

   
  }







  addStatus(driver:any) {
    let status  = 'Unassigned';
    if(driver.driverID>0){
      status = 'Assigned'
    }else{
       status = 'Unassigned'
    }
    if(driver.closedDate){
      status = 'Completed'
    }
    return status;
  
  }
  
  
  addColorStatus(driver:any) {
    
    let colorStatus = '#06669c'
    if(driver.driverID>0){
      colorStatus = '#6658dd'
    }else{
      colorStatus = '#06669c'
    }
    if(driver.closedDate){
      colorStatus = '#6658dd'
    }
    return colorStatus;
  
  }
  
  
  


}
