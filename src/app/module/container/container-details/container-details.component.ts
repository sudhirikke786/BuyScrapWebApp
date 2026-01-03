import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-container-details',
  templateUrl: './container-details.component.html',
  styleUrls: ['./container-details.component.css']
})
export class ContainerDetailsComponent implements OnInit {

  actionList: any[] = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search',
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh'
    }
  ];

  showLoader = false;
  visible: boolean = false;
  headerTitle: any = 'Add Sub Container';

  isEditModeOn = false;
  containerData: any;
  datePipe: DatePipe = new DatePipe('en-US');

  orgName: any;
  logInUserId: any;
  locId: any;
  containerList: any;
  searchText: string = '';
  filteredContainerList: any[] = [];
  currentRole: any;
  containerId: any;

  form: FormGroup = this.formBuilder.group({
    rowID: 0,
    containerID: 0,
    containerNumber: ['', Validators.required],
    description: '',
    createdBy: '',
    updatedBy: '',
    locID: 0,
    isActive: true
  });

  historyVisible: boolean = false;

  historyList = [
    {
      pickupId: '45',
      date: '2025-01-10',
      status: 'Completed',
      dispatchType: 'DropOff',
      fromLocation: 'Mumbai',
      toLocation: 'Pune'
    },
    {
      pickupId: '89',
      date: '2025-01-11',
      status: 'Completed',
      dispatchType: 'Pickup',
      fromLocation: 'Delhi',
      toLocation: 'Agra'
    },
    {
      pickupId: '100',
      date: '2025-01-12',
      status: 'Completed',
      dispatchType: 'Exchnage',
      fromLocation: 'Chennai',
      toLocation: 'Singapore'
    },
    {
      pickupId: '34',
      date: '2025-01-13',
      status: 'Completed',
      dispatchType: 'DropOff',
      fromLocation: 'Bangalore',
      toLocation: 'Mysore'
    },
  ];

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private stroarge: StorageService,
    private commonService: CommonService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);

    this.currentRole = this.authService.userCurrentRole();

    if (['Administrator', 'Cashier'].includes(this.currentRole)) {
      this.actionList.unshift(
        {
          iconcode: 'mdi-plus',
          title: 'Add Sub Container',
          label: 'Add Sub Container'
        })
    }

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');

    this.form = this.formBuilder.group({
      rowID: 0,
      containerID: 0,
      containerNumber: ['', Validators.required],
      description: '',
      createdBy: this.logInUserId,
      updatedBy: this.logInUserId,
      locID: this.locId,
      isActive: true
    });

    this.route.params.subscribe(params => {
      this.containerId = +params['containerId'];
      console.log('Container ID from route:', this.containerId);

      if (this.containerId) {
        this.GetAllSubContainers();
      }
    });
  }

  GetAllSubContainers() {
    if (!this.containerId) {
      console.error('Container ID is required');
      return;
    }

    this.showLoader = true;
    const paramObject = {
      containerID: this.containerId,
      locID: this.locId
    };

    this.commonService.GetAllSubContainersByContainerID(paramObject)
      .subscribe(data => {
        console.log('GetAllSubContainersByContainerID :: ');
        console.log(data);
        this.containerList = data.body.data;
        this.filteredContainerList = [...this.containerList];
      },
        (err: any) => {
          console.error('Error loading sub containers:', err);
          this.showLoader = false;
        },
        () => {
          this.showLoader = false;
        }
      );
  }

  filterContainers() {
    this.filteredContainerList = this.containerList.filter((item: { containerNumber: string; description: string }) =>
      item.containerNumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  showDialog(containerData?: any) {
    if (containerData) {
      this.headerTitle = 'Edit Sub Container';
      this.isEditModeOn = true;
      this.containerData = containerData;

      console.log('Edit mode - Container Data:', containerData);

      this.form.patchValue({
        rowID: containerData.rowId || containerData.rowID || 0,
        containerID: this.containerId,
        containerNumber: containerData.containerNumber || containerData.containerType || '',
        description: containerData.description || containerData.containerSize || '',
        createdBy: containerData.createdBy || this.logInUserId,
        updatedBy: this.logInUserId,
        locID: this.locId,
        isActive: containerData.isActive !== undefined ? containerData.isActive : true
      });
    } else {
      this.headerTitle = 'Add Sub Container';
      this.isEditModeOn = false;
      this.containerData = null;

      this.form.patchValue({
        rowID: 0,
        containerID: this.containerId,
        containerNumber: '',
        description: '',
        createdBy: this.logInUserId,
        updatedBy: this.logInUserId,
        locID: this.locId,
        isActive: true
      });
    }
    
    console.log('Form values after patch:', this.form.value);
    this.visible = true;
  }

  // Convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(containerData: any) {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    console.log("clicked save");

    const requestObj = {
      rowID: this.isEditModeOn ? (this.containerData?.rowId || this.form.value.rowID || 0) : 0,
      containerID: this.containerId,
      containerNumber: this.form.value.containerNumber || '',
      description: this.form.value.description,
      createdBy: this.logInUserId,
      updatedBy: this.logInUserId,
      locID: this.form.value.locID,
      isActive: true
    };

    console.log('Request Object:', requestObj);
    console.log('Edit Mode:', this.isEditModeOn);
    console.log('Container Data:', this.containerData);

    this.commonService.InsertUpdateContainerMaster(requestObj).subscribe(
      data => {
        console.log('Response:', data);

        this.isEditModeOn = false;
        this.containerData = null;
        this.visible = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditModeOn ? 'Sub Container updated successfully' : 'Sub Container created successfully'
        });

        this.GetAllSubContainers();
      },
      (error: any) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while saving sub container data'
        });
      }
    );
  }

  openHistory() {
    this.historyVisible = true;
  }

  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.filterContainers();
        break;
      case 'mdi-refresh':
        this.searchText = '';
        this.GetAllSubContainers(); 
        break;
      case 'mdi-plus':
        this.showDialog();
        break;
      default:
        break;
    }
  }
}