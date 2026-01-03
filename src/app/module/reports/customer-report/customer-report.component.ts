import { Component, OnInit, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.scss']
})
export class CustomerReportComponent implements OnInit {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search',
      isDisable:false,
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh',
      isDisable:false,
    },
    // {
    //   iconcode: 'mdi-download',
    //   title: 'Download',
    //   isDisable:true,
    // }
    {
      iconcode: 'mdi-file-pdf-box',
      title: 'Download PDF',
      isDisable: true
    },
    {
      iconcode: 'mdi-file-excel-box',
      title: 'Download Excel',
      isDisable: true
    },
    {
      iconcode: 'mdi-file-word-box',
      title: 'Download Word',
      isDisable: true
    },
    {
      iconcode: 'mdi-xml',
      title: 'Download XML',
      isDisable: true
    }
  ];

   newButtonList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    }
  ];

  reportData: any;
  orgName: any;
  locId: any;  
  fromDate: any;
  toDate: any;
  sellerName: string = '';
  fileDataObj:any;
  showDownload = false;
  currentRole:any;
  showLoader = false;
  showLoaderReport = false;
  isReportShow = false;
  customerObj: any;
  checkTabView: boolean = false;
  adminAdvertisement!:  string | null;
  mainGroups: any[] = [];
  dropdownOpen: boolean = false;
  searchTerm: string = '';
  filteredGroups: any[] = [];
  searchQuery:any[] = [];
selectedGroup: any = null;
subMaterials: any[] = [];
selectedMaterials: any[] = [];
selectedSubMaterial: any = null;
groupedMaterials: any[] = [];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService: HelperService,
    private commonService: CommonService,
    private authService: AuthService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.adminAdvertisement = localStorage.getItem('adminAdvertisement');
    this.setDefaultDate();
    this.getCustomerReport();
    this.checkTabView = this.helperService.isTab();
    this.currentRole = this.authService.userCurrentRole();
    this.setActionsByRole();
    this.loadMainGroups();
  }

  loadMainGroups() {
    this.commonService.GetMainAndSubMaterials({ groupId: 0 }).subscribe(data => {
      if (data && data.body && data.body.data) {
        this.mainGroups = data.body.data;
  
        this.mainGroups.forEach(group => {
          console.log('Group:', group.groupName);
          console.log('SubMaterials:', group.subMaterials); 
        });
        this.groupedMaterials = this.mainGroups.map(group => ({
          label: group.groupName,  
          items: (group.subMaterials || []).map((sub: any) => ({
            label: sub.materialName,
            value: sub.materialName   
          })),
          expanded: false
        }));
        this.filteredGroups = [...this.groupedMaterials];
        console.log('Grouped materials:', this.groupedMaterials);
      }
    });
  }

  filterMaterials() {
    const term = this.searchTerm.toLowerCase();
  
    if (!term) {
      this.filteredGroups = [...this.groupedMaterials]; // reset
      return;
    }
  
    this.filteredGroups = this.groupedMaterials
      .map(group => {
        const matchedItems = group.items.filter((item: any) =>
          item.label.toLowerCase().includes(term)
        );
        if (matchedItems.length > 0 || group.label.toLowerCase().includes(term)) {
          return {
            ...group,
            items: matchedItems.length > 0 ? matchedItems : group.items, // show group if its name matches
            expanded: true // auto-expand when searching
          };
        }
        return null;
      })
      .filter(g => g !== null);
  }
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  // Toggle group expansion
  toggleGroup(group: any) {
    // Don't toggle if click was on checkbox
    if (event && (event.target as HTMLElement).closest('.group-checkbox')) {
      return;
    }
    
   
    group.expanded = !group.expanded;
  }
  
  // Check if material is selected
  isSelected(value: string): boolean {
    return this.selectedMaterials.includes(value);
  }
  
  // Toggle material selection
  toggleMaterial(item: any) {
    const index = this.selectedMaterials.indexOf(item.value);
    if (index > -1) {
      this.selectedMaterials.splice(index, 1);
    } else {
      this.selectedMaterials.push(item.value);
    }
  }
  
  // Remove material from selection
  removeMaterial(event: Event, material: string) {
    event.stopPropagation();
    const index = this.selectedMaterials.indexOf(material);
    if (index > -1) {
      this.selectedMaterials.splice(index, 1);
    }
  }
  
  // Get display label for material
  getMaterialLabel(value: string): string {
    for (let group of this.groupedMaterials) {
      const item = group.items.find((item: any) => item.value === value);
      if (item) {
        return item.label;
      }
    }
    return value;
  }
  
  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-multi-select')) {
      this.dropdownOpen = false;
    }
  }

  // Add these methods for group selection

// Check if all materials are selected
areAllSelected(): boolean {
  if (this.groupedMaterials.length === 0) return false;
  
  const totalItems = this.groupedMaterials.reduce((count, group) => 
    count + group.items.length, 0);
  
  return this.selectedMaterials.length === totalItems;
}

// Check if some (but not all) materials are selected
isSomeSelected(): boolean {
  if (this.groupedMaterials.length === 0) return false;
  
  const totalItems = this.groupedMaterials.reduce((count, group) => 
    count + group.items.length, 0);
  
  return this.selectedMaterials.length > 0 && this.selectedMaterials.length < totalItems;
}

// Toggle select all materials
toggleSelectAll() {
  if (this.areAllSelected()) {
    // Deselect all
    this.selectedMaterials = [];
  } else {
    // Select all
    this.selectedMaterials = [];
    this.groupedMaterials.forEach(group => {
      group.items.forEach((item: any) => {
        if (!this.selectedMaterials.includes(item.value)) {
          this.selectedMaterials.push(item.value);
        }
      });
    });
  }
}

// Check if entire group is selected
isGroupSelected(group: any): boolean {
  if (!group.items || group.items.length === 0) return false;
  
  return group.items.every((item: any) => 
    this.selectedMaterials.includes(item.value)
  );
}

// Check if group is partially selected (some but not all)
isGroupIndeterminate(group: any): boolean {
  if (!group.items || group.items.length === 0) return false;
  
  const selectedCount = group.items.filter((item: any) => 
    this.selectedMaterials.includes(item.value)
  ).length;
  
  return selectedCount > 0 && selectedCount < group.items.length;
}

// Toggle selection for entire group
toggleGroupSelection(group: any) {
  if (this.isGroupSelected(group)) {
    // Deselect all items in group
    group.items.forEach((item: any) => {
      const index = this.selectedMaterials.indexOf(item.value);
      if (index > -1) {
        this.selectedMaterials.splice(index, 1);
      }
    });
  } else {
    // Select all items in group
    group.items.forEach((item: any) => {
      if (!this.selectedMaterials.includes(item.value)) {
        this.selectedMaterials.push(item.value);
      }
    });
  }
}

// Get count of selected items in group
getSelectedCount(group: any): number {
  if (!group.items) return 0;
  
  return group.items.filter((item: any) => 
    this.selectedMaterials.includes(item.value)
  ).length;
}

// Update toggleGroup to handle checkbox clicks properly

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 10);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getCustomerReport() {   

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      SearchText: this.sellerName
    }
    this.showLoader = true;

    this.commonService.getCustomerReport(param)
      .subscribe(data => {
          console.log('getCustomerReport :: ');
          console.log(data);
          this.reportData = data.body.data;
        },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.showLoader = false;
        }
      );
  }

  // (onRowSelect)="onRowSelect($event)" (onRowClick)="onRowClick($event)"

  onRowSelect(event: any) {
    // Handle row selection
    this.customerObj = event?.data;
    console.log('Selected Row:', event?.data);
    this.actionList =  this.actionList.map((item) => {
      if(item.iconcode=='mdi-download' || item.iconcode=='mdi-file-pdf-box' || item.iconcode=='mdi-file-excel-box' || item.iconcode=='mdi-file-word-box' || item.iconcode=='mdi-xml'){
        item.isDisable = false;
      }
      return item
    })
  }
  onRowUnselect(event: any) {
    // Handle row selection
    //this.customerObj = event?.data;
    console.log('Selected Row:', event?.data);
    this.actionList =  this.actionList.map((item) => {
      if(item.iconcode=='mdi-download' || item.iconcode=='mdi-file-pdf-box' || item.iconcode=='mdi-file-excel-box' || item.iconcode=='mdi-file-word-box' || item.iconcode=='mdi-xml'){
        item.isDisable = true;
      }
      return item
    })
  }

  generateCustomerReport(reportType? : string | null) {

    const selectedNames = this.groupedMaterials
    .flatMap(g => g.items)
    .filter(sub => this.selectedMaterials.includes(sub.value))
    .map(sub => sub.label);
    const param = {
      LocationId: this.locId,
      SellerId: this.customerObj.rowId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      ReportType: reportType,
      Advertising: this.adminAdvertisement,
      MaterialNames: selectedNames.join(',')  
    }

    if ((reportType && reportType == 'PDF') || !reportType) {
      this.isReportShow = true;
      this.showLoaderReport = true;
    }
    

    this.commonService.generateCustomerReport(param)
      .subscribe(data => {
        console.log('generateCustomerReport :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;

        if(this.checkTabView && !reportType) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Customer Report " + this.customerObj.rowId);
        } else if (reportType && reportType != 'PDF') {
          this.helperService.downloadBase64Report(this.fileDataObj,"Customer Report " + this.customerObj.rowId, reportType);
        }

      },
        (err: any) => {
        this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  setActionsByRole() {
    const allActions = [
      { iconcode: 'mdi-magnify', title: 'Search',isDisable: false  },
      { iconcode: 'mdi-refresh', title: 'Refresh',isDisable: false  },
      { iconcode: 'mdi-file-pdf-box', title: 'PDF',isDisable: true  },
      { iconcode: 'mdi-file-excel-box', title: 'Excel',isDisable: true  },
      { iconcode: 'mdi-file-word-box', title: 'Word',isDisable: true  },
      {iconcode: 'mdi-xml',title:'XML',isDisable: true}

    ];
  
    const restrictedActions = ['mdi-file-pdf-box', 'mdi-file-excel-box', 'mdi-file-word-box','mdi-xml'];

    if (this.currentRole === 'Administrator') {
      this.actionList = allActions;
    } else {
      this.actionList = allActions.filter(
        action => !restrictedActions.includes(action.iconcode)
      );
    }
  }


  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getCustomerReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getCustomerReport();
        break;
      // case 'mdi-download':
      //   this.generateCustomerReport();
      //   break;
      case 'mdi-file-pdf-box':
        this.generateCustomerReport('PDF');
      break;
      case 'mdi-file-excel-box':
        this.generateCustomerReport('Excel');
        break;
      case 'mdi-file-word-box':
        this.generateCustomerReport('Word');
        break;
        case 'mdi-xml':
          this.generateCustomerReport('XML');
          break;
      default:
        break;
    }  
  }

  openDatePicker() {
    const dateInput = document.getElementById('fromDate') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker(); 
    }
  }

  openToDatePicker() {
    const dateInput = document.getElementById('toDate') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker(); 
    }
  }
}

