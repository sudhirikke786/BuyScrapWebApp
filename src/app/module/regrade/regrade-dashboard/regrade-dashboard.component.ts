import { Component } from '@angular/core';

@Component({
  selector: 'app-regrade-dashboard',
  templateUrl: './regrade-dashboard.component.html',
  styleUrls: ['./regrade-dashboard.component.scss']
})
export class RegradeDashboardComponent {

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
      iconcode:'mdi-plus',
      title:'New Regrade'
    }
  ];

  regrades = [
    {
      dateCreated: '07/11/2022',
      material: 'CRV 1',
      previousNet: '600.00',
      regradedMaterial: 'CRV 1',
      regradeNet: '590.00'
    },
    {
      dateCreated: '05/12/2022',
      material: 'Aluminium Extrusion(Clean)',
      previousNet: '600.00',
      regradedMaterial: 'Aluminium Extrusion(Clean)',
      regradeNet: '590.00'
    },
    {
      dateCreated: '03/08/2022',
      material: 'CRV 1',
      previousNet: '600.00',
      regradedMaterial: 'CRV 1',
      regradeNet: '590.00'
    },
    {
      dateCreated: '19/11/2022',
      material: 'Aluminium Extrusion(Clean)',
      previousNet: '600.00',
      regradedMaterial: 'Aluminium Extrusion(Clean)',
      regradeNet: '590.00'
    },
    {
      dateCreated: '30/10/2022',
      material: 'CRV 1',
      previousNet: '600.00',
      regradedMaterial: 'CRV 1',
      regradeNet: '590.00'
    },
    {
      dateCreated: '15/03/2022',
      material: 'CRV 1',
      previousNet: '600.00',
      regradedMaterial: 'CRV 1',
      regradeNet: '590.00'
    },
    {
      dateCreated: '08/03/2022',
      material: 'Yellow Brass(Clean)',
      previousNet: '600.00',
      regradedMaterial: 'Yellow Brass(Clean)',
      regradeNet: '590.00'
    }	
  ];
  
}
