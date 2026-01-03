import { Component,OnInit  } from '@angular/core';

@Component({
  selector: 'app-dispatch-map',
  templateUrl: './dispatch-map.component.html',
  styleUrls: ['./dispatch-map.component.css']
})
export class DispatchMapComponent implements OnInit {
   orgName:any;

  zoom = 10;

  center: google.maps.LatLngLiteral = {
    lat: 19.0760,
    lng: 72.8777 
  };

  containers = [
    { id: 1, name: 'Container A', lat: 19.1, lng: 72.85 },
    { id: 2, name: 'Container B', lat: 19.05, lng: 72.88 },
    { id: 3, name: 'Container C', lat: 19.07, lng: 72.82 },
    { id: 4, name: 'Container D', lat: 19.12, lng: 72.90 }
  ];

  constructor() {}

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
  }

}