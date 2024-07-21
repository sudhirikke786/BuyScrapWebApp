import { Component } from '@angular/core';

@Component({
  selector: 'app-requisition-report',
  templateUrl: './requisition-report.component.html',
  styleUrls: ['./requisition-report.component.css']
})
export class RequisitionReportComponent {

  data = [
    {
      DateAcquired: "2024-05-23",
      Time: "08:41",
      TicketNo: "1234",
      Name: "Leonard Simon",
      Address: ["65 Kabeljou Str.", "Kuisebmond"],
      IDNumber: "820112546",
      Commodities: [
        { Commodity: "Copper", QuantityKg: 0.88 },
        { Commodity: "Dirty Aluminium", QuantityKg: 5 },
        { Commodity: "Brass", QuantityKg: 0.18 },
        { Commodity: "Light Steel", QuantityKg: 3 }
      ]
    }
  
  ];

}
