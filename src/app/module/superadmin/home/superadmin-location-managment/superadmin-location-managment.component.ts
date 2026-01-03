import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-superadmin-location-managment',
  templateUrl: './superadmin-location-managment.component.html',
  styleUrls: ['./superadmin-location-managment.component.css'],
  providers: [MessageService]
})
export class SuperadminLocationManagmentComponent implements OnInit{

  orgName: any;
  locId: any;
  logInUserId: any;
  isSubmit: boolean = false;
  title: string='Add User';
  actionType = 'Add Location'
  editObj: any;
  locations: any[] = [];
  locationVisble: boolean = false;
  addlocationVisble: boolean = false;
  isPopupVisible: boolean = false;
  userForm!: FormGroup<any>;
  totalUsers: number = 0;
  totalTickets: number = 0;
  totalLocations: number = 0;
  currencies: any[] = [];
  timeZones: any[] = [];

  systemPrefPopupVisible: boolean = false;
  systemPrefFalseObj: any[] = [];
  copySystemPrefFalseObj: any[] = [];
  searchValue: string = '';


  locationForm!: FormGroup;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private fb:FormBuilder,
    private messageService: MessageService,
    private stroarge:StorageService,
    private confirmationService: ConfirmationService) { }
    
    ngOnInit() {
      
      this.route.queryParams.subscribe(params => {
        this.orgName = params['orgName']; 
        console.log("Received orgName:", this.orgName);
        if (this.orgName) {
          localStorage.setItem('orgName', this.orgName);
        } else {
          
          this.orgName = localStorage.getItem('orgName');
        }
        console.log("Calling getLocations() in ngOnInit...");
        this.getLocations();
        this.creatLocation();
        this.getAllLocatoins();
        this.getAllCurrencies();
        this.getAllTimeZones();
      });
    }
    

    
  isTicketOlderThan15Days(latestTicketDate: string | Date | null): boolean {
    if (!latestTicketDate)
     {return true};
  
    const loginDate = new Date(latestTicketDate);
    const today = new Date();
    const diffInMs = today.getTime() - loginDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
    return diffInDays > 15;
  }

    getLocations() {
      this.commonService.getOrgLocation().subscribe(
        (data) => {
          this.locations = data.body.data; 
          const locationData = this.locations[0];
          console.log('LocationDate checking',locationData)
          this.totalUsers = locationData.totalUserCount;
          this.totalTickets = locationData.totalTicke;
          this.totalLocations = locationData.totalLocations;
        },
        (error) => {
          console.error('Error fetching locations:', error);
        }
      );
    }
    // goBack() {
    //   localStorage.removeItem('orgName'); 
    //   this.router.navigate(['/superadmin/home']); 
    // }


    submitLocation(){
      const datePipe = new DatePipe('en-US');
  
      const formObj =  this.locationForm.value;
      const selectedTimeZone = this.timeZones.find(tz => tz.rowID === formObj.timeZoneID);
      const selectedCurrency = this.currencies.find(cur => cur.rowID === formObj.currencyID);
      console.log("selectdTimezone",selectedTimeZone);
    console.log("selectedCurrency",selectedCurrency);
      console.log('Location save',formObj);
      const reqObj = {
        "rowId": this.actionType == 'Add' ? 0 : this.editObj?.rowId,
        "createdBy": 1,
        "createdDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        "updatedBy": 1,
        "updatedDate": datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        "locationName":formObj.locationName,
        "isActive": true,
        "userCount":formObj.userCount,
        "employeeCount": formObj.employeeCount,
        "isCashierAdded": false,
        "ticketLimit": formObj.ticketLimit,
        "availableTickets": formObj.availableTickets,
        "isHeadOffice": false,
        "adminID": 0,
        "contactName": formObj.contactName,
        "address": formObj.address,
        "phoneNo": formObj.phoneNo,
        "timezone": selectedTimeZone?.timeZoneID,   
        "currencyCode": selectedCurrency?.currencyCode
      }
  
      this.commonService.InsertUpdateLocationDTO(reqObj).subscribe((res) =>{
        
        this.messageService.add({ severity: 'success', summary: 'success', detail: `${this.actionType} Location Successfully` });
         this.getAllLocatoins();
         this.hideLocationModel();
      })
    }

    loading = false;
    locObj: any;
  getAllLocatoins(){
    this.loading = true;
    this.commonService.GetAllLocatoins({}).subscribe((res) =>{
      this.loading = false;
      this.locObj =  res?.body?.data;
      console.log(this.locObj)
    },(error) =>{
      this.loading = false;
    })
  }

    getAllCurrencies() {
      const params = { 
        CurrencyID: 0 
      }; 
      this.commonService.getAllCurrency(params).subscribe({
        next: (response: any) => {
          this.currencies = response?.body?.data 
          console.log('Currencies loaded:', this.currencies);
        },
        error: (error) => {
          console.error('Error loading currencies:', error);
        }
      });
    }
    getAllTimeZones() {
      const params = { 
        TimeZoneID: 0 
      }; 
      this.commonService.getAllTimeZones(params).subscribe({
        next: (response: any) => {
          this.timeZones = response?.body?.data 
          console.log('TimeZones loaded:', this.timeZones);
        },
        error: (error) => {
          console.error('Error loading time zones:', error);
        }
      });
    }
    creatLocation(){
      this.locationForm = this.fb.group({
        locationName:[''],
        employeeCount:[''],
        ticketLimit:['',],
        userCount:[''],
        availableTickets:[''],
        address:[''],
        contactName:[''],
        phoneNo:[''],
        timeZoneID: [''],  
        currencyID: [''] 
      })
  
    }
    addpoupOpen(){
      this.actionType = 'Add';
      this.creatLocation();
      this.showLocationModel();
  
    }
    
    showLocationModel(){
      this.locationVisble =  true;
    }
  
    hideLocationModel(){
      this.locationVisble =  false;
    }

    createUserForm(){
      this.userForm =  this.fb.group({    
          roleId:['',Validators.required] ,
          userName: ['',Validators.required],
          password: ['',Validators.required],
          confirmPassword:['',Validators.required],
          firstName: ['',[Validators.required,Validators.pattern(RegexPattern.alphabetPattern[0])]],
          lastName: ['',Validators.required],
          mobileNumber:['',Validators.required],
          emailID: ['',Validators.required],
          contactName:['',Validators.required],
          address:['',Validators.required],
          phoneNo:['',Validators.required]
      },)
  
     
    }
  
  
    editPopupOpen(obj?:any){
      this.editObj =  obj;
      this.showLocationModel();
      this.actionType = 'Edit';

      const selectedCurrency = this.currencies?.find(c => c.currencyCode === obj.currencyCode);
      const selectedCurrencyID = selectedCurrency ? selectedCurrency.rowID : null;
  
      const selectedTimeZone = this.timeZones?.find(tz => tz.timeZoneID === obj.timeZone);
      const selectedTimeZoneID = selectedTimeZone ? selectedTimeZone.rowID : null;
      console.log(obj)
      setTimeout(()=>{
        this.locationForm.patchValue({...obj,
          currencyID: selectedCurrencyID,
          timeZoneID: selectedTimeZoneID
        });
        
      },100)
    
  
    }
    back(){
      this.router.navigateByUrl(`/superadmin/home`);
    }

    getUserManagment(locationId :any){
      this.router.navigate(['/superadmin/home/superadmin-usermanagment'],{queryParams:{locationId: locationId}});
    }
    getTicketTrack(){
      this.router.navigate(['/superadmin/home/ticket-track']);
    }

    openSystemPreferencesPopup() {
      this.getSystemPreferencesValue();
      this.systemPrefPopupVisible = true;
    }

    getSystemPreferencesValue() {
      let reqObj = {
        Key: '',
        ManageByStore: false
      };

      this.commonService.GetSystemPreferencesValue(reqObj).subscribe((res) => {
        if (res?.body?.data) {
          this.systemPrefFalseObj = res.body.data.map((item: any) => {
            if (item.type === 'Bool') {
              item.isChecked = item.values == 'True';
            }
            item.originalValue = item.values;
            return item;
          });

          this.copySystemPrefFalseObj = [...this.systemPrefFalseObj];
        } else {
          this.systemPrefFalseObj = [];
          this.copySystemPrefFalseObj = [];
        }

        this.searchValue = '';
      });
    }

    searchBox() {
      if (this.searchValue.length === 0) {
        this.systemPrefFalseObj = [...this.copySystemPrefFalseObj];
      } else {
        this.systemPrefFalseObj = this.copySystemPrefFalseObj.filter((item: any) => {
          return item.keys.toLowerCase().includes(this.searchValue.toLowerCase()) ||
                item.values.toLowerCase().includes(this.searchValue.toLowerCase());
        });
      }
    }

    refreshSettings() {
      this.getSystemPreferencesValue();
      this.searchValue = '';
    }


    saveNumericValue(item: any, rowIndex: number) {
      if (item.values === item.originalValue) {
        return;
      }
      this.confirmationService.confirm({
        header: 'Confirmation',
        message: `Are you sure you want to change ${item.keys} from "${item.originalValue}" to "${item.values}"?`,
        accept: () => {
          this.saveForm(item, undefined, item.values);
        },
        reject: () => {
          item.values = item.originalValue;
        }
      });
    }

    showConfirmation(pos: any, rowIndex: number, type: any) {
      this.confirmationService.confirm({
        header: 'Confirmation',
        message: `Are you sure you want to change ${type.keys} value?`,
        accept: () => {
          this.saveForm(type, pos?.checked);
        },
        reject: () => {
          this.systemPrefFalseObj[rowIndex].isChecked = !pos.checked;
        }
      });
    }

    saveForm(type?: any, ischecked = false, numericValue?: any) {
      const datePipe = new DatePipe('en-US');
      let valueToSave: string;
      if (type.type === 'Bool') {
        valueToSave = ischecked ? 'True' : 'False';
      } else {
        valueToSave = numericValue?.toString() || type.values;
      }

      const sysInfo = {
        createdBy: this.logInUserId,
        updatedBy: this.logInUserId,
        createdDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        updatedDate: datePipe.transform(new Date(), 'YYYY-MM-ddTHH:mm:ss.SSS'),
        rowId: type.rowId,
        keys: type.keys,
        values: valueToSave
      };

      this.commonService.InsertUpdateSystemPreferences(sysInfo).subscribe((res) => {
        const index = this.systemPrefFalseObj.findIndex((item: any) => item.rowId === type.rowId);
        if (index !== -1) {
          this.systemPrefFalseObj[index].originalValue = valueToSave;
          this.systemPrefFalseObj[index].values = valueToSave;
          if (type.type === 'Bool') {
            this.systemPrefFalseObj[index].isChecked = ischecked;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SystemPref Updated successfully'});
        }
        this.getSystemPreferencesValue();
        this.systemPrefPopupVisible = false;
      });
    }
}
