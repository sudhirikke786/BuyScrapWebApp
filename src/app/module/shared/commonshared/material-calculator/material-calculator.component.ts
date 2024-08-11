import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-material-calculator',
  templateUrl: './material-calculator.component.html',
  styleUrls: ['./material-calculator.component.scss']
})
export class MaterialCalculatorComponent  implements OnInit, AfterViewInit {

  @ViewChild('inputBox1') inputBox1: ElementRef | undefined;
  @ViewChild('inputBox2') inputBox2: ElementRef | undefined;
  @ViewChild('inputBox3') inputBox3: ElementRef | undefined;
  @ViewChild('inputBox4') inputBox4: ElementRef | undefined;

  @Input() materialNote = '';
  @Input() itemGroupName = 'Motors/Motores';
  @Input() itemMaterialName = 'Aluminum Motors (Clean/Limpios)';
  @Input() itemImagePath = 'assets/images/custom/id_scan.png';


  @Input() itemGross: any;
  @Input() itemTare: any;
  @Input() itemNet: number = 0;
  @Input() itemAvailableNet: number = 0;

  @Output() calculateObj = new EventEmitter<any>();
  @Output() changeItemEvent = new EventEmitter<any>();

  grossInput:any;
  tareInput:any;
  netInput:any =0;
  availableNetInput:any =0;
  focusedInput: string | null = null;
  inputBoxes: any[] = [];
  private currentFocusIndex = 0;

  displayValue: string = '';

  isNaN: Function = Number.isNaN;

  isVirtual = true;
  isKeyboard = true;
  @Output()  backClose =  new EventEmitter<any>();
  constructor(private renderer: Renderer2,
    private elementRef: ElementRef) {

  }

  onKeyPress(event: KeyboardEvent) {
    if(this.isVirtual){
      event.preventDefault();
    }   
  }

  ngOnInit(): void {
  
    this.grossInput = this.itemGross;
    this.tareInput = this.itemTare;
    const netQty = this.grossInput - this.tareInput
    this.netInput = isNaN(netQty) ?  0 : netQty;
    this.availableNetInput = this.itemAvailableNet;
    if (this.inputBox1) {
      this.renderer.selectRootElement(this.inputBox1.nativeElement).focus();
    }
   
    this.isVirtual = true;

  }

  calcNetFromGross(gross: any) {
    this.tareInput = (isNaN(this.tareInput) ?  0 : this.tareInput);
    this.netInput = gross - this.tareInput;
  }

  // ngOnChanges(changes: SimpleChanges): void {

  //   if(changes){
  //     this.grossInput = changes['itemGross'].currentValue;
  //     this.tareInput =changes['itemTare'].currentValue;
  //     this.netInput = this.grossInput - this.tareInput;
  //     this.availableNetInput = changes['itemAvailableNet'].currentValue;
  //   }
    
  // }

  ngAfterViewInit(): void {
    this.inputBoxes = [this.inputBox1, this.inputBox2, this.inputBox4,this.inputBox3];
    setTimeout(()=>{
      this.inputBoxes[this.currentFocusIndex]?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },100)
  }

  showKeyboard(val:any){
    this.isVirtual = val.checked
    console.log(this.isKeyboard);
  }

  focusInput() {
    this.elementRef.nativeElement.querySelector('.inputone').focus();
  }

  changeFocus() {
    // Set focus on the current input

    if (this.currentFocusIndex === this.inputBoxes.length-2) {
      this.tareInput = (isNaN(this.tareInput) || this.tareInput == '') ? 0 : this.tareInput;
      const obj = {
        itemGross: this.grossInput,
        itemTare: this.tareInput,
        itemNet: isNaN(this.grossInput - this.tareInput) ?  0 : (this.grossInput - this.tareInput),
        itemAvailableNet: this.availableNetInput,
        materialNote: this.materialNote
      }
      // if (obj.itemNet > obj.itemAvailableNet) {
      //   alert('Shipout Net is more than Available net.');
      //   return;
      // }
      this.grossInput = '';
      this.tareInput = ''; 
      this.netInput = 0;
      this.calculateObj.emit(obj);
     }
     
     
     // Increment the focus index, resetting to 0 if it exceeds the number of inputs
     if(this.currentFocusIndex > 3){
       this.currentFocusIndex = 0;
     }else{
       this.currentFocusIndex = (this.currentFocusIndex + 1) % this.inputBoxes.length;
     }

     this.inputBoxes[this.currentFocusIndex]?.nativeElement.focus();

     console.log(this.currentFocusIndex);
  }

  changeItem() {
    this.changeItemEvent.emit();
  }

  clearDisplay() {
    this.displayValue = '';
  }

  appendNumber(number: any) {
   
    if (this.focusedInput === 'inputBox1') {
      this.renderer.selectRootElement(this.inputBox1?.nativeElement).focus();
      let data = this.grossInput ?? '';
      if (data === '' || data == '0') {
        this.grossInput = number.toString().trim();
      } else {
        this.grossInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox2') {
      this.renderer.selectRootElement(this.inputBox2?.nativeElement).focus();
      let data = this.tareInput ?? '';
      if (data === '') {
        this.tareInput = number.toString().trim();
      } else {
        this.tareInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox4') {
      this.renderer.selectRootElement(this.inputBox4?.nativeElement).focus();
      let data = this.netInput ?? '';;
      if (data === '') {
        this.netInput = number.toString().trim();
      } else {
        this.netInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox3') {
      this.renderer.selectRootElement(this.inputBox3?.nativeElement).focus();
      let data = this.availableNetInput ?? '';
      if (data === '') {
        this.availableNetInput = number.toString().trim();
      } else {
        this.availableNetInput += number.toString().trim();
      }
    } else {
      console.log('No input box is currently focused');
    }
    
    const netQty = (isNaN(this.grossInput) ?  0 : this.grossInput) - (isNaN(this.tareInput) ?  0 : this.tareInput)
    this.netInput = isNaN(netQty) ?  0 : netQty;

  }

  // appendOperator(operator: string) {
  //   if (this.displayValue[this.displayValue.length - 1] !== operator) {
  //     this.displayValue += operator;
  //   }
  // }

  calculate() {
    try {
      if (this.focusedInput === 'inputBox1') {

      }
      this.displayValue = eval(this.displayValue).toString();
    } catch (error) {
      this.displayValue = 'Error';
    }
  }


  backToChangeItemMainMaterials(){
    this.backClose.emit(true);
  }



  getFocusElemet(){
  
  }

  enter() {    
    const tareInputVar = (isNaN(this.tareInput) || this.tareInput == '') ? 0 : this.tareInput;
      
    if ((this.grossInput - tareInputVar) > this.availableNetInput) {
      alert('Shipout Net is more than Available net.');
      return;
    }

    this.changeFocus();
    console.log(this.currentFocusIndex);
    
   
  }


 
  deleteCharacter() {
    if (this.focusedInput === 'inputBox1') {
      if (this.grossInput.length > 1) {
        this.grossInput = this.grossInput.slice(0, -1);
      } else {
        this.grossInput = '';
      }

    }else if (this.focusedInput === 'inputBox2') {
      if (this.tareInput.length > 1) {
        this.tareInput = this.tareInput.slice(0, -1);
      } else {
        this.tareInput = '';
      }

    }else if (this.focusedInput === 'inputBox3') {
      if (this.netInput.length > 1) {
        this.netInput = this.netInput.slice(0, -1);
      } else {
        this.netInput = '';
      }
      
    }else if (this.focusedInput === 'inputBox4') {
      if (this.grossInput.length > 1) {
        this.availableNetInput = this.grossInput.slice(0, -1);
      } else {
        this.availableNetInput = '';
      }
    }

   
  }
}
