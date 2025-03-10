import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket-advance-details',
  templateUrl: './ticket-advance-details.component.html',
  styleUrls: ['./ticket-advance-details.component.css']
})
export class TicketAdvanceDetailsComponent {

  metarialForm! :  FormGroup
  materialsList: string[] = ['Material A', 'Material B', 'Material C', 'Material D'];
  constructor(private fb :FormBuilder ){

    this.metarialForm = this.fb.group({
      metarial:this.fb.array([this.generateFrom()])
    })

  }

generateFrom():FormGroup {

  return this.fb.group({
    materialName: ['', Validators.required], // The dropdown selection
    gross: [0, [Validators.required, Validators.min(0)]],
    tare: [0, [Validators.required, Validators.min(0)]],
    net: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    amount: [0, [Validators.required, Validators.min(0)]],
    image: ['', Validators.required],
    action: ['add']  // Default action is 'add' or 'edit'
  });

}

get materials(): FormArray {
  return this.metarialForm.get('materials') as FormArray;
}


addMaterial() {
  this.materials.push(this.generateFrom());
}

submit() {

}

removeMaterial(index:number){
  
}

editMaterial(index:number){

}


}
