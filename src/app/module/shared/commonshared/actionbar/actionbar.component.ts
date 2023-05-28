import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-actionbar',
  templateUrl: './actionbar.component.html',
  styleUrls: ['./actionbar.component.scss']
})
export class ActionbarComponent implements OnChanges {

  @Input() actions : any;
  @Output() iconAction = new EventEmitter<any>();


  ngOnChanges(changes:SimpleChanges){

    if(changes && changes['actions']){
      this.actions =  changes['actions']?.currentValue;
    }

  }


  actionClick(item:any){
    this.iconAction.emit(item)
  }
  
}
