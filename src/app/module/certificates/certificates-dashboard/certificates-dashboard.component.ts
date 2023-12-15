import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-certificates-dashboard',
  templateUrl: './certificates-dashboard.component.html',
  styleUrls: ['./certificates-dashboard.component.scss'],
  providers: [ConfirmationService, MessageService]

  
})
export class CertificatesDashboardComponent implements OnInit {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    }
  ];

  certificates1 = [
    {
      ticketID: '463',
      dateCreated: '04/10/2022',
      ticketAmount: '30.00',
      seller: 'Alex Sample Jr.',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '452',
      dateCreated: '04/10/2022',
      ticketAmount: '305.00',
      seller: 'Alexander',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '451',
      dateCreated: '04/10/2022',
      ticketAmount: '300.00',
      seller: 'Mike Hussey',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '455',
      dateCreated: '04/10/2022',
      ticketAmount: '99.00',
      seller: 'Alex Sample Jr.',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '480',
      dateCreated: '04/10/2022',
      ticketAmount: '55.00',
      seller: 'John Travolta',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '440',
      dateCreated: '04/10/2022',
      ticketAmount: '40.00',
      seller: 'Arnold',
      dateClosed: '04-10-2022'
    },
    {
      ticketID: '445',
      dateCreated: '04/10/2022',
      ticketAmount: '330.00',
      seller: 'Alex Sample Jr.',
      dateClosed: '04-10-2022'
    }
  ];

  visible = false;
  cvisible = false;
  ivisible =  false;

  showLoader = false;
  
  orgName: any;
  locId: any;

  
  certificates: any;
  certificatesImages: any;

  certificateLoader = false;
  selectedProducts:any;
  isShowModel = false;
  checkOBj: any;
  currentIndex: any;
  isConfirmModel: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.getAllCODTickets();
  }


  confirm1() {
  
    this.isConfirmModel =  true;
  }

  confirmData(){
    
    this.saveConfirm();
  }

  saveConfirm(){
    this.isConfirmModel =  false;
  }

  cancelClick(){
      this.certificates[this.currentIndex].selected =  false;
      this.isConfirmModel = false;
  }




  
  getAllCODTickets() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.showLoader = true;
    this.commonService.getAllCODTickets(paramObject)
      .subscribe(data => {
          console.log('getAllCODTickets :: ');
          console.log(data);
          this.certificates = data.body.data.map((item:any) => {
            item.selected =  item?.dateClosed ? true : false;
            return item;
          });
          console.log(this.certificates);
        },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () =>  {
          this.showLoader = false;
        }
      );
  }

  setChecked(item: any,rowIndex:any): void {
      this.currentIndex = rowIndex;
      this.checkOBj = item;
      this.confirm1();
    
      
  }

  onCheckboxChange(item: any) {
    // Handle individual checkbox change if needed
    console.log('Checkbox state changed for item:', item);

    this.confirm1();
  }

  toggleAllSelection() {
    
    // Toggle all checkboxes state
   // this.selectAll = !this.selectAll;
  //  this.certificates.forEach((item:any)=> (item.selected = this.selectAll));
  }

  codeAdd(){
    this.showModel();
  }


  getCODImagesbyID(obj:any,type:string){
    if(type=='cod'){
      this.codeAdd()
    }else{
      this.showModel();
    this.certificateLoader = true;
    const paramObject = {
      TicketID:obj?.rowId
    }
    this.certificatesImages = [];
    this.commonService.GetCODImagesbyID(paramObject)
      .subscribe(data => {
        
          this.certificatesImages = data.body.data;
          
        },
        (err: any) => {
          this.certificateLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.certificateLoader = false;
        }
      );
    }
  }

  showModel(){
    this.visible = true;
  }

  handleImage($event:any){

  }

  showCaptureModel(){
    this.visible = false;
    this.cvisible = true;
  }

  showItemViewModel() {
    this.ivisible =  true;
  }

  hideItemViewModel() {
    this.ivisible =  false;
  }



  hideCaptureModel(){
    this.cvisible = false;
  }

  hideModel(){
    this.visible = false;
  }
  
}
