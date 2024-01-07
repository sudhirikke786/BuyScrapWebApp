import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnChanges {

  @Input() type:any = 'default'
  @Input() count:any = 10;
  products = new Array(10).fill('1');
  
  ngOnChanges(changes: SimpleChanges){
    this.type = changes?.type?.currentValue || 'default';
    this.count = changes?.count?.currentValue || 10;
    this.products = new Array(Number(this.count) || 10).fill('1');
    
  }



}
