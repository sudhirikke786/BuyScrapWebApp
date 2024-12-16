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
  constructor( public commonService: CommonService, private messageService: MessageService,){

  }

  ngOnInit(): void {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getAllUsers();
  //  this.getAllCODTickets();
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
  
    this.selecteddriverID =  this.targetBoxes[index];
    console.log(this.draggedItem);
    if (this.draggedItem) {
      this.targetBoxes[index].items.push(this.draggedItem);
      this.mainItems = this.mainItems.filter(item => item.id != this.draggedItem?.id);
      this.mainItems.sort((a,b) => b.id - a.id);
      console.log("Drop Element",this.targetBoxes);
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
              rowId: item.rowID, 
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
          this.mainItems = _mainItems;
          console.log(this.mainItems)
          

        } else {
          console.error('No data found or incorrect response structure.');
        }

        this.targetBoxes = [];
        let  groupedData:any = [];
        _driverList.forEach((item:any) => {
          item.ticketStatus = this.addStatus(item);
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



  submitSave(){
    // "pickUpDate": this.datePipe.transform(this.pickupdate, 'YYYY-MM-ddTHH:mm:ss.SSS'),
  try {
    const  dragObjIndex = this.targetBoxes[0].items.findIndex((item:any) =>  item.ticketStatus == 'Unassigned');
    console.log(dragObjIndex);
    this.targetBoxes[0].items[dragObjIndex]['driverID'] =  this.selecteddriverID.rowId;
    this.targetBoxes[0].items[dragObjIndex]['driverName'] = this.selecteddriverID.firstName;
 
   
    const objectData = this.targetBoxes[0].items[dragObjIndex] 
    console.log(objectData);
    this.commonService.InsertUpdatePickup(objectData).subscribe((res) =>{

      this.messageService.add({ severity: 'success', summary: 'success', detail: ' Order Assigned Successfully' });
     this.getAllCODTickets();
    
    },(error) =>{

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

      console.log("Error")
    })



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
