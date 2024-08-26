import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

interface DataRow {
  dateAcquired: string;
  time: string;
  ticketNo: number;
  name: string;
  address: string;
  idNumber: string;
  commodity: string;
  quantity: number;
}



@Component({
  selector: 'app-requisition-report',
  templateUrl: './requisition-report.component.html',
  styleUrls: ['./requisition-report.component.css']
})
export class RequisitionReportComponent implements OnInit {
  checkTabView: boolean = false;

  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search',
      isDisable:false,
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh',
      isDisable:false,
    },
    {
      iconcode: 'mdi-download',
      title: 'Download',
      isDisable:false,
    }
  ];

  newButtonList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search'
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh'
    }
  ];

  reportData: any;
  orgName: any;
  locId: any;
  fromDate: any;
  toDate: any;
  ticketNumber: any;
  sellerName: string = '';
  fileDataObj: any;
  showDownload = false;
  showLoader = false;
  showLoaderReport = false;

  subScriptionType: any;
  showPlan = false;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
  }

  

  data: DataRow[] = [
    { dateAcquired: '23.05.2024', time: '08h41', ticketNo: 1234, name: 'Leonard Simon', address: '65 Kabeljou Str.\nKuisebmond', idNumber: '820112546', commodity: 'Copper', quantity: 0.88 },
    { dateAcquired: '23.05.2024', time: '08h41', ticketNo: 1234, name: 'Leonard Simon', address: '65 Kabeljou Str.\nKuisebmond', idNumber: '820112546', commodity: 'Dirty Aluminium', quantity: 5 },
    { dateAcquired: '23.05.2024', time: '08h41', ticketNo: 1234, name: 'Leonard Simon', address: '65 Kabeljou Str.\nKuisebmond', idNumber: '820112546', commodity: 'Brass', quantity: 0.18 },
    { dateAcquired: '23.05.2024', time: '08h41', ticketNo: 1234, name: 'Leonard Simon', address: '65 Kabeljou Str.\nKuisebmond', idNumber: '820112546', commodity: 'Light Steel', quantity: 3 },

    { dateAcquired: '24.05.2024', time: '09h41', ticketNo: 1235, name: 'Simon Simon', address: '75 Kabeljou Str.\nKuisebmond', idNumber: '820112547', commodity: 'Copper', quantity: 0.88 },
    { dateAcquired: '24.05.2024', time: '09h41', ticketNo: 1235, name: 'Simon Simon', address: '75 Kabeljou Str.\nKuisebmond', idNumber: '820112547', commodity: 'Dirty Aluminium', quantity: 5 },
    { dateAcquired: '24.05.2024', time: '09h41', ticketNo: 1235, name: 'Simon Simon', address: '75 Kabeljou Str.\nKuisebmond', idNumber: '820112547', commodity: 'Brass', quantity: 0.18 },
    { dateAcquired: '24.05.2024', time: '09h41', ticketNo: 1235, name: 'Simon Simon', address: '75 Kabeljou Str.\nKuisebmond', idNumber: '820112547', commodity: 'Light Steel', quantity: 3 },

  ];

  getRowSpan(data: DataRow[], key: keyof DataRow, value: any): number {
    return data.filter(item => item[key] === value).length;
  }

  isFirstOccurrence(data: DataRow[], key: keyof DataRow, index: number): boolean {
    return data.findIndex(item => item[key] === data[index][key]) === index;
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 3);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getSingleTicketReport() {

    const param = {
      TicketId: this.ticketNumber || 0,
      LocationId: this.locId,
      TicketSettingsId: 0,
      FromDate: this.fromDate,
      Todate: this.toDate,
      SellerName: this.sellerName
    }
    this.showLoader = true;
    this.commonService.getSingleTicketReport(param)
      .subscribe(data => {
        console.log('getSingleTicketReport :: ');
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

  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getSingleTicketReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getSingleTicketReport();
        break;
      case 'mdi-download':
        // this.generateSingleTicketReport();
        break;
      default:
        break;
    }
  }

}
