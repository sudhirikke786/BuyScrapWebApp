import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage.service';


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

  locationForm!: FormGroup;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private fb:FormBuilder,
    private messageService: MessageService,
    private stroarge:StorageService,) { }
    
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
      });
    }
    

    getLocations() {
      this.commonService.getOrgLocation().subscribe(
        (data) => {
          this.locations = data.body.data; 
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
        "adminID": 0
      }
  
      this.commonService.InsertUpdateLocationDTO(reqObj).subscribe((res) =>{
        
        this.messageService.add({ severity: 'success', summary: 'success', detail: `${this.actionType} Location Successfully` });
         //this.getAllLocatoins();
         this.hideLocationModel();
      })
    }

    creatLocation(){
      this.locationForm = this.fb.group({
        locationName:[''],
        employeeCount:[''],
        ticketLimit:['',],
        userCount:[''],
        availableTickets:[''],
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
      },)
  
     
    }
  
  
    editPopupOpen(obj?:any){
      this.editObj =  obj;
      this.showLocationModel();
      this.actionType = 'Edit';
      console.log(obj)
      setTimeout(()=>{
        this.locationForm.patchValue({...obj});
      },100)
    
  
    }

    getUserManagment(){
      this.router.navigate(['/superadmin/home/superadmin-usermanagment']);
    }
}
