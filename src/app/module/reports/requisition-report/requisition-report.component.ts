import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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


    
  orgName: any;
  locId: any;
  subScriptionType: any;
  showPlan = false;
  constructor(private route: ActivatedRoute,
   
 
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
   
  ];

  getRowSpan(data: DataRow[], key: keyof DataRow, value: any): number {
    return data.filter(item => item[key] === value).length;
  }

  isFirstOccurrence(data: DataRow[], key: keyof DataRow, index: number): boolean {
    return data.findIndex(item => item[key] === data[index][key]) === index;
  }

}
