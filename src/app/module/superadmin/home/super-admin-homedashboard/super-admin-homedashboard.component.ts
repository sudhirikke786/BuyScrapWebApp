import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-super-admin-homedashboard',
  templateUrl: './super-admin-homedashboard.component.html',
  styleUrls: ['./super-admin-homedashboard.component.css']
})
export class SuperAdminHomedashboardComponent  implements OnInit {

  orgName: any;
  isEditMode = false;
  currentOrgId = 0;
  searchText: string = '';
  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search',
      label:'Search'
    },
    {
    iconcode: 'mdi-refresh',
    title: 'Refresh', 
     label:'Refresh'
  },
  {
    iconcode: 'mdi-ticket',
    title: 'New Oraganization',
    label:'New Oraganization'
  },
  
  ];
 
  users: any[] = [];
  deletedUsers: any[] = [];
  restoreUsers: any[] = [];
  showDeletedPopup: boolean = false;
  deletedUsersLoader: boolean = true;
  isDeletedUserVisible: boolean = false;
  isSubmitting:boolean = false
  currentPage = 1;
  pageSize = 25;
  first = 0;
  last = 0;
  pageTotal = 0;
  displayNewOrgDialog: boolean = false;
  organizationForm!: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  selectedCountryId: number = 0;
  isLoading = false;


  constructor(public commonService: CommonService,private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messageService:MessageService
  ) {} 

  ngOnInit(): void {
    this.fetchOrganizations();
    this.OrganizationForm();
    this.fetchCountries();
    this.handleSameAddressCheckbox();

    const storedPagination = localStorage.getItem('SuperAdminPaginationData_grid');
    if (storedPagination) {
      const paginationData = JSON.parse(storedPagination);
      this.currentPage = paginationData.PageNumber || 1;
      this.pageSize = paginationData.RowOfPage || 10;
      this.first = paginationData.first || 0;
    } else {
      this.currentPage = 1;
      this.pageSize = 25;
      this.first = 0;
    }
  

    // this.users = [
    //   { name: 'John Doe', status:'Active', email: 'john.doe@example.com'  },
    //   { name: 'John Doe', status:'Inactive', email: 'john.doe@example.com' },
     
    //   // Add more users as needed
    // ]
  }


  isLoginOlderThan15Days(latestLoginDate: string | Date | null): boolean {
    if (!latestLoginDate)
     {return true};
  
    const loginDate = new Date(latestLoginDate);
    const today = new Date();
    const diffInMs = today.getTime() - loginDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
    return diffInDays > 15;
  }
  
  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first;
    this.pageSize = event.rows;
  this.fetchOrganizations();
  }

  openNewOrgDialog() {
    this.isEditMode = false;
    this.organizationForm.reset({
      country: '',
      state: '',
      city: '',
      billingCountry: '',
      billingState: '',
      billingCity: '',
      enable: true,
      totalUsers: 5,
      totalTickets: 5000,
      totalLocations: 1,
      
    });
    this.displayNewOrgDialog = true;
    
  }

  OrganizationForm() {
    this.organizationForm = this.fb.group({
      companyName: ['', Validators.required],
      email: [''],
      confirmEmail: [''],
      password: [''],
      confirmPassword: [''],
      contactFirstName: [''],
      contactLastName: [''],
      phoneNumber: [''],
      jobTitle: [''],
      businessAddress: [''],
      country: [''],
      state: [''],
      city: [''],
      zip: [''],
      sameAsBillingAddress: [false],
      billingAddress: [''],
      billingCountry: [''],
      billingState: [''],
      billingCity: [''],
      billingZip: [''],
      enable: [true],
      showReportOnly: [false],
      showSafety: [false],
      locationCompliance: [false],
      freeVersion: [false],
      lightVersion: [false],
      proVersion: [false],
      dispatchOnly:[false],
      trialEndDate:[null],
      totalUsers: [0],
      totalTickets: [0],
      totalLocations: [0],
      
    });
  }


  
  saveOrganization() {
   this.isSubmitting = true;
    const formData = this.organizationForm.value;
    const currentDate = new Date().toISOString();
    if (formData.orgKey !== formData.confirmOrgKey) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Password and Confirm Password do not match'
      });
      this.isSubmitting = false;
      return;
    }
    
    const trialEndDate = formData.freeVersion && formData.trialEndDate
    ? new Date(formData.trialEndDate).toISOString()
    : currentDate;

    const requestObj = {
      rowId: this.isEditMode ? this.currentOrgId : 0,
      totalUsers:formData.totalUsers,
      totalTickets:formData.totalTickets,
      totalLocations: formData.totalLocations,
      createdBy: 0,
      createdDate: currentDate,
      updatedBy: 0,
      updatedDate: currentDate,
      organisationName: formData.companyName,
      organisationDisplayName: formData.companyName,
      orgKey: formData.password,
      confirmOrgKey: formData.confirmPassword,
      hashOrgKey: "",
      emailID: formData.email,
      confirmEmailID: formData.confirmEmail,
      isActive: formData.enable,
      serverName: "string",
      databaseName: "string",
      userName: "string",
      password: "string",
      isReportOnly: Boolean(formData.showReportOnly),
      manageByStore: true,
      value: "string",
      type: "string",
      isShowSafety: Boolean(formData.showSafety),
      isLocationCompliance: Boolean(formData.locationCompliance),
      isLightVersion: Boolean(formData.lightVersion),
      isProVersion: Boolean(formData.proVersion),
      isDispatchOnly:Boolean(formData.dispatchOnly),
      isProPlusVersion: false,
      isFreeVersion: Boolean(formData.freeVersion),
      subscriptionEndDate: trialEndDate,
      isRecursive: true,
      recursiveType: 0,
      contactFirstName: formData.contactFirstName,
      contactLastName: formData.contactLastName,
      phoneNumber: formData.phoneNumber,
      jobTitle: formData.jobTitle,
      businessAddress: formData.businessAddress,
      countryID: parseInt(formData.country) || 0,
      stateID: parseInt(formData.state) || 0,
      cityID: parseInt(formData.city) || 0,
      zipCode: formData.zip,
      sameaddress: Boolean(formData.sameAsBillingAddress),
      billingBusinessAddress: formData.billingAddress,
      billingCountryID: parseInt(formData.billingCountry) || 0,
      billingStateID: parseInt(formData.billingState) || 0,
      billingCityID: parseInt(formData.billingCity) || 0,
      billingZipCode: formData.billingZip,
      getReference: "string",
      
    };

    this.commonService.InsertOrganisationDTO(requestObj).subscribe(
      (response: any) => {
        this.isSubmitting = false;
        console.log(' API response:', response);
        const responseBody = response.body;
        if (responseBody && responseBody.issuccess) {
          this.displayNewOrgDialog = false;
          this.fetchOrganizations();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Organization created successfully'
          });
        } else {
          const msg = responseBody?.message || 'Something went wrong';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: msg
          });
          
        }
      },
      (error) => {
        this.isSubmitting = true;
        console.error('Error creating organization:', error);
      }
    );
  }

  editOrganization(organization: any) {
    this.isEditMode = true;
    this.currentOrgId = organization.rowId;
    
    this.organizationForm.reset({
      country: '',
      state: '',
      city: '',
      billingCountry: '',
      billingState: '',
      billingCity: '',
      enable: true
    });
    
    this.organizationForm.patchValue({
      companyName: organization.organisationName,
      email: organization.emailID,
      confirmEmail: organization.emailID,
      password: organization.orgKey,
      confirmPassword: organization.confirmOrgKey,
      contactFirstName: organization.contactFirstName,
      contactLastName: organization.contactLastName,
      phoneNumber: organization.phoneNumber,
      jobTitle: organization.jobTitle,
      businessAddress: organization.businessAddress,
      country: organization.countryID ? organization.countryID.toString() : '',
      state: organization.stateID ? organization.stateID.toString() : '',
      city: organization.cityID ? organization.cityID.toString() : '',
      zip: organization.zipCode,
      sameAsBillingAddress: organization.sameaddress,
      billingAddress: organization.billingBusinessAddress,
      billingCountry: organization.billingCountryID ? organization.billingCountryID.toString() : '',
      billingState: organization.billingStateID ? organization.billingStateID.toString() : '',
      billingCity: organization.billingCityID ? organization.billingCityID.toString() : '',
      billingZip: organization.billingZipCode,
      enable: organization.isActive,
      showReportOnly: organization.isReportOnly,
      showSafety: organization.isShowSafety,
      locationCompliance: organization.isLocationCompliance,
      freeVersion: organization.isFreeVersion,
      lightVersion: organization.isLightVersion,
      proVersion: organization.isProVersion,
      dispatchOnly: organization.isDispatchOnly,
      trialEndDate: organization.subscriptionEndDate ? organization.subscriptionEndDate.split('T')[0] : null,
      totalUsers:organization.totalUsers,
      totalTickets:organization.totalTickets,
      totalLocations: organization.totalLocations

    });
    
    if (organization.countryID) {
      this.selectedCountryId = organization.countryID;
      this.fetchStates(organization.countryID, organization.stateID); // pass state ID
    }
    
  
    this.displayNewOrgDialog = true;
  }
  
  
  fetchCountries() {
    const paramObject = {
      CountryID: 0
    };
    
    this.commonService.GetAllCountry(paramObject)
      .subscribe(
        (response: any) => {
          if (response && response.body && response.body.data) {
            this.countries = response.body.data;
            console.log('Countries fetched:', this.countries);
          }
        },
        (error) => {
          console.error('Error fetching countries:', error);
        }
      );
  }
  
  fetchStates(countryId: number, stateIdToSet?: number) {
    const params = {
      CountryID: countryId,
      StateID: 0
    };
  
    this.commonService.GetAllState(params).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data) {
          this.states = response.body.data;
          console.log('States fetched:', this.states);
  
          if (stateIdToSet) {
            this.organizationForm.get('state')?.setValue(stateIdToSet.toString());
  
            this.fetchCities(countryId, stateIdToSet, this.organizationForm.get('city')?.value);
          } else {
            this.organizationForm.get('state')?.setValue('');
          }
  
          this.cities = [];
          this.organizationForm.get('city')?.setValue('');
        }
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );
  }
  
  fetchCities(countryId: number, stateId: number, cityIdToSet?: number) {
    const params = {
      CountryID: countryId,
      StateID: stateId,
      CityID: 0
    };
  
    this.commonService.GetAllCity(params).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data) {
          this.cities = response.body.data;
          console.log('Cities fetched:', this.cities);
  
          if (cityIdToSet) {
            this.organizationForm.get('city')?.setValue(cityIdToSet.toString());
          } else {
            this.organizationForm.get('city')?.setValue('');
          }
        }
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }
  
  
  onCountryChange(event: any) {
    const selectedCountryId = parseInt(event.target.value, 10);
    if (selectedCountryId) {
      this.fetchStates(selectedCountryId);
      
      this.selectedCountryId = selectedCountryId;
      
      this.cities = [];
    } else {
      this.states = [];
      this.cities = [];
    }
  }
  
  onStateChange(event: any) {
    const selectedStateId = parseInt(event.target.value, 10);
    if (selectedStateId && this.selectedCountryId) {
      this.fetchCities(this.selectedCountryId, selectedStateId);
    } else {
      this.cities = [];
    }
  }

  handleSameAddressCheckbox() {
    const sameAddressControl = this.organizationForm.get('sameAsBillingAddress');
    
    if (sameAddressControl) {
      sameAddressControl.valueChanges.subscribe(checked => {
        if (checked) {
          const businessAddress = this.organizationForm.get('businessAddress')?.value || '';
          const country = this.organizationForm.get('country')?.value || '';
          const state = this.organizationForm.get('state')?.value || '';
          const city = this.organizationForm.get('city')?.value || '';
          const zip = this.organizationForm.get('zip')?.value || '';
          
          this.organizationForm.patchValue({
            billingAddress: businessAddress,
            billingCountry: country,
            billingState: state,
            billingCity: city,
            billingZip: zip
          });
        }
      });
    }
  }

  
  


  getlocations(organizationName:string){
    const paramObject = {
      clientName:organizationName
    };
    this.commonService.getAdminOrganisaction(paramObject)
      .subscribe(data => {
          console.log('GetAllOrganisations :: ');
          console.log(data);
          this.users = data.body.data;
          console.log("Location button clicked!",organizationName);
          this.router.navigate(['/superadmin/home/superadmin-loc'], { queryParams: { orgName: organizationName } });
         
          
        },
        
        (err: any) => {
         
        },
        () => {
          
        }
        
      );
   
    
  }

  fetchOrganizations() {
   
    const paramObject = {
    
     PageNumber: this.currentPage,
     RowOfPage: this.pageSize,
    
     SerachText: this.searchText
    };
    this.isLoading = true;
    this.commonService.GetAllOrganisations(paramObject)
      .subscribe(data => {
          console.log('GetAllOrganisations :: ');
          console.log(data);
          this.users = data.body.data;
          this.pageTotal = data?.body?.totalRecord || 0;
          this.last = data?.body?.totalIndex || 0;

          localStorage.setItem('dispatchPaginationData_grid', JSON.stringify({
            PageNumber: this.currentPage,
            RowOfPage: this.pageSize,
            first: this.first
          }));
         
          
        },
        (err: any) => {
         this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }
 
  searchOrganizations(){
    const paramObject = {
    
      PageNumber: this.currentPage,
      RowOfPage: this.pageSize,
     
      SerachText: this.searchText
     };
     this.commonService.GetAllOrganisations(paramObject)
       .subscribe(data => {
           console.log('GetAllOrganisations :: ');
           console.log(data);
           this.users = data.body.data;
           this.currentPage =1
         },
         (err: any) => {
          
         },
         () => {
           
         }
       );
  }

  showDeletedOrganizations() {
    const paramObject = {
      SearchText: this.searchText
     };
     this.isLoading = true;
    this.commonService.GetAllDeletedOrganisations(paramObject).subscribe(
      (data) => {
        console.log('GetAllDeletedOrganisations:', data);
        this.deletedUsers = data.body.data ; 
        this.showDeletedPopup = true; 
        this.searchText = '';
        this.isLoading = false;
      },
      (err) => {
        console.error('Error fetching deleted organizations', err);
      }
      
    );
  }

  filterDeletedUsers(){

  }
  restoreOrganization(user:any){
    console.log("DAATA in user", user)
  const  paramObj = {
    DatabaseName : user.databaseName , 
    RowID : user.rowId  
    }
    this.commonService.getRestoreOrganisation(paramObj).subscribe(
      (data) => {
        alert(data.body.message);
       
        this.showDeletedPopup = true; 
      },
      (err) => {
        console.error('Error fetching deleted organizations', err);
      }
    );
  }

  closeDeletedPopup() {
    this.showDeletedPopup = false;
  }
  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchOrganizations();
        break;
      case 'mdi-refresh':
        this.currentPage = 1, 
        this.searchText = '';  
       this.fetchOrganizations();     
        break;
      case 'mdi-ticket':
        this.openNewOrgDialog();
          break;
      case 'mdi-merge':
        
        break;
      default:
        break;
    }
  }
  credentialM(){
    console.log('crendential click')
   
   //this.router.navigateByUrl(`/superadmin/credential`);
    this.router.navigateByUrl(`/superadmin/syspref`);
  }
}
