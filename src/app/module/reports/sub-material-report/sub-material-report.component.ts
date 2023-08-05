import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-sub-material-report',
  templateUrl: './sub-material-report.component.html',
  styleUrls: ['./sub-material-report.component.scss']
})
export class SubMaterialReportComponent implements OnInit {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
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
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.getSubMaterialsReport();
  }

  getSubMaterialsReport() {   

    const param = {
      SubMaterialId: 0,
      LocationId: this.locId,
      FromDate: '04-08-2022',
      Todate: '04-08-2023'
    }

    this.commonService.getSubMaterialsReport(param)
      .subscribe(data => {
          console.log('getSubMaterialsReport :: ');
          console.log(data);
          this.reportData = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }


  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getSubMaterialsReport();
        break;
      case 'mdi-refresh':
        this.getSubMaterialsReport();
        break;
      default:
        break;
    }  
  }

}

