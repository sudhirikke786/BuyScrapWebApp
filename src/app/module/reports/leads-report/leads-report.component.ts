import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-leads-report',
  templateUrl: './leads-report.component.html',
  styleUrls: ['./leads-report.component.css']
})
export class LeadsReportComponent implements OnInit {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode: 'mdi-download',
      title: 'Download'
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
  startDate: any;
  endDate: any;
  showLoader = false;
  currentRole:any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService: HelperService,
    private commonService: CommonService,
    private authService: AuthService,) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.currentRole = this.authService.userCurrentRole();
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate(); 
    this.getLeadsOnlineData();
    this.setActionsByRole();
  }

 setDefaultDate() {
  const today = new Date();
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);

  this.startDate = this.datePipe.transform(fifteenDaysAgo, 'yyyy-MM-dd');
  this.endDate = this.datePipe.transform(today, 'yyyy-MM-dd');
}


  getLeadsOnlineData() { 
    const param = {
      StartDate: this.startDate,
      EndDate: this.endDate
    };
    this.commonService.getLeadsOnlineData(param)
      .subscribe(
        data => {
          console.log('getLeadsOnlineData :: ');
          console.log(data);
          this.reportData = data.body.data;
        },
        (err: any) => {
          console.error('API Error:', err);
        },
        () => {
        
        }
      );
  }
  

  setActionsByRole(){
    const allActions = [
      { iconcode: 'mdi-magnify', title: 'Search' },
      { iconcode: 'mdi-refresh', title: 'Download CSV' },
      { iconcode: 'mdi-download', title: 'PDF' }
      
    ];
    if (this.currentRole === 'Administrator') {
      this.actionList = allActions;
    } else {
      
      this.actionList = allActions.filter(
        action => action.iconcode !== 'mdi-download'
      );
    }
  }

  getAction(actionCode:any){
  
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getLeadsOnlineData();
        break;
      case 'mdi-download':
        this.downloadCSV();
        break;
        case 'mdi-refresh':
        this.setDefaultDate();
        this.getLeadsOnlineData();
        break;
      default:
        break;
  }
  }
    
  downloadCSV() {
    if (!this.reportData || this.reportData.length === 0) {
     console.warn('No data available to download');
     return;
    }

     const csvContent = this.convertToCSV(this.reportData);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const link = document.createElement('a');
     const url = URL.createObjectURL(blob);

     const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
     link.setAttribute('href', url);
     link.setAttribute('download', `Leads Online Report ${currentDate}.csv`);
     link.style.visibility = 'hidden';
    
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
    }
    
    convertToCSV(data: any[]): string {
       if (!data || data.length === 0) return '';
      
       const headers = Object.keys(data[0]);
       const csvRows = [];
      
       csvRows.push(headers.join(','));
      
       for (const row of data) {
       const values = headers.map(header => {
       const escaped = ('' + row[header]).replace(/"/g, '""') 
        return `"${escaped}"`;
        });
       csvRows.push(values.join(','));
       }
      
       return csvRows.join('\n');
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

