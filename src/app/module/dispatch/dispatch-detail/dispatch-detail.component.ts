import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';

interface DispatchEntry {
  containerType: string;
  dropOffBox: number;
  pickUpBox: number;
  charges: number;
  notes: string;
}

@Component({
  selector: 'app-dispatch-detail',
  templateUrl: './dispatch-detail.component.html',
  styleUrls: ['./dispatch-detail.component.css']
})
export class DispatchDetailComponent implements OnInit {
  containers: any[] = [];
  drivers: any[] = [];
  locId: string | number | null | undefined;
  customerName: string = '';
  address: string | null = null;

  formData: DispatchEntry = {
    containerType: '',
    dropOffBox: 0,
    pickUpBox: 0,
    charges: 0,
    notes: ''
  };

  tableData: DispatchEntry[] = [];
  totalCharges: number = 0;
  firstname: string = '';

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private localService:StorageService,

  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.customerName = params['sellerName'];
      this.address = params['address'] || null;
    });
    this.getAllContainers();
    this.getAllDrivers();
    this.loadFromLocalStorage();
  }

  getAllContainers(): void {
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.GetAllContainer(paramObject).subscribe(
      (response) => {
        console.log(response);
        this.containers = response.body.data;
        this.containers.unshift({
          rowId:0,
          containerType:"Select Container Type"

        })
      },
      (error) => {
        console.error('Error fetching container data:', error);
      }
    );
  }

  getAllDrivers(): void {
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    const paramObject = {
      LocationId: this.locId
    };
    this.commonService.GetAllUsers(paramObject).subscribe(
      (response) => {
        console.log('Driver Response:', response);
        this.drivers = response.body.data;
      },
      (error) => {
        console.error('Error fetching driver data:', error);
      }
    );
  }

  loadFromLocalStorage(): void {
    const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    this.firstname = userObj.userdto.firstName;
    const savedData = localStorage.getItem('dispatchData');
    if (savedData) {
      this.tableData = JSON.parse(savedData);
      this.calculateTotalCharges();
    }
  }

  calculateTotalCharges(): void {
    this.totalCharges = this.tableData.reduce((sum, item) => sum + Number(item.charges), 0);
  }

  onEnterClick(): void {
    if (!this.formData.containerType) {
      alert('Please select a container');
      return;
    }
    const newEntry: DispatchEntry = { ...this.formData };
    
    this.tableData.push(newEntry);
    
    localStorage.setItem('dispatchData', JSON.stringify(this.tableData));
    this.calculateTotalCharges();
    
    this.resetForm();
  }

  deleteEntry(index: number): void {
    this.tableData.splice(index, 1);
    localStorage.setItem('dispatchData', JSON.stringify(this.tableData));
    this.calculateTotalCharges();
  }

  editEntry(index: number): void {
    this.formData = { ...this.tableData[index] };
    this.tableData.splice(index, 1);
    localStorage.setItem('dispatchData', JSON.stringify(this.tableData));
    this.calculateTotalCharges();
  }

  resetForm(): void {
    this.formData = {
      containerType: 'Select Container Type',
      dropOffBox: 0,
      pickUpBox: 0,
      charges: 0,
      notes: ''
    };
  }
}