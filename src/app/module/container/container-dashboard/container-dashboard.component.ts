import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-container-dashboard',
  templateUrl: './container-dashboard.component.html',
  styleUrls: ['./container-dashboard.component.scss'],
  providers: [MessageService]
})
export class ContainerDashboardComponent implements OnInit {

  actionList:any[] = [
    {
      iconcode:'mdi-magnify',
      title:'Search',
      
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    }
  ];

  showLoader = false;

  visible: boolean = false;
  headerTitle: any = 'Add Container';

  isEditModeOn = false;
  containerData: any;
  datePipe: DatePipe = new DatePipe('en-US');

  orgName: any;
  logInUserId: any;
  locId: any;
  containerList: any;
  searchText: string = '';
  filteredContainerList: any[] = [];
  currentRole:any;
  form: FormGroup = this.formBuilder.group({
    rowId: 0,
    containerType: ['', Validators.required],
    containerSize: '',
    isEnable: true,
    isActive: true,
    createdBy: 0,
    createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
    updatedBy: 0,
    updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
    locID: 0
  });
  
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService:AuthService,
    private stroarge:StorageService,
    private commonService: CommonService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);

    this.currentRole = this.authService.userCurrentRole();

    if(['Administrator','Cashier'].includes(this.currentRole)){
      this.actionList.unshift(
        {
          iconcode:'mdi-plus',
          title:'Add Container',
          label:'Add Container'
         
        })
    }

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');

    this.form = this.formBuilder.group({
      rowId: 0,
      containerType: ['', Validators.required],
      containerSize: '',
      isEnable: true,
      isActive: true,
      createdBy: this.logInUserId,
      createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      updatedBy: this.logInUserId,
      updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
      locID: this.locId
    });

    this.GetAllContainer();
  }

  GetAllContainer() {
    this.showLoader = true;
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.GetAllContainer(paramObject)
      .subscribe(data => {
          console.log('GetAllContainer :: ');
          console.log(data);
          this.containerList = data.body.data;
          this.filteredContainerList = [...this.containerList];
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.showLoader = false;
        },
        () => {
          this.showLoader = false;
        }
      );
  }
  filterContainers() {
    this.filteredContainerList = this.containerList.filter((item: { containerType: string; containerSize: string }) =>
        item.containerType.toLowerCase().includes(this.searchText.toLowerCase()) || 
        item.containerSize.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  showDialog(containerData?: any){
    if (containerData) {
      this.headerTitle = 'Edit Container';
      this.isEditModeOn = true;
      this.containerData = containerData;
      this.form.patchValue(containerData)
    } else {
      this.headerTitle = 'Add Container';
      this.isEditModeOn = false;
      this.containerData = null;

      this.form = this.formBuilder.group({
        rowId: 0,
        containerType: ['', Validators.required],
        containerSize: '',
        isEnable: true,
        isActive: true,
        createdBy: this.logInUserId,
        createdDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedBy: this.logInUserId,
        updatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        locID: this.locId
      });

    }
    this.visible = true;
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(containerData: any) {
    // alert(JSON.stringify(containerData));
    // alert(JSON.stringify(this.form.value));    
    if (this.form.invalid) {
        return;
    }
    console.log("clicked save")

    const target = { ...containerData };
    const source = this.form.value;

    const returnedTarget = Object.assign(target, source);
    // alert(JSON.stringify(returnedTarget));
    
    this.commonService.InsertUpdateContainert(returnedTarget).subscribe(data =>{    
      console.log(data); 

      this.isEditModeOn = false;
      this.containerData = null;
      this.visible = false;      
      // alert('Container data Inserted/ updated successfully');
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Container data Inserted/ updated successfully' });

      
      this.GetAllContainer();
    },(error: any) =>{  
      console.log(error);  
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'error while inserting/updating Tickect' });
    });

  }
 
  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.filterContainers();
        break;
      case 'mdi-refresh':
        this.searchText = ''; 
        this.GetAllContainer();
        break;
      case 'mdi-plus':
        this.showDialog();
        break;
      default:
        break;
    }

  }
 
}
