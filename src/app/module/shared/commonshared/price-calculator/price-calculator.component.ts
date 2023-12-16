import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-price-calculator',
  templateUrl: './price-calculator.component.html',
  styleUrls: ['./price-calculator.component.scss']
})
export class PriceCalculatorComponent implements OnInit, AfterViewInit {

  @ViewChild('inputBox1') inputBox1: ElementRef | undefined;
  @ViewChild('inputBox2') inputBox2: ElementRef | undefined;
  @ViewChild('inputBox3') inputBox3: ElementRef | undefined;
  @ViewChild('inputBox4') inputBox4: ElementRef | undefined;

  @Input() materialNote = '';
  @Input() itemGroupName = 'Motors/Motores';
  @Input() itemMaterialName = 'Aluminum Motors (Clean/Limpios)';
  @Input() itemImagePath = 'assets/images/custom/id_scan.png';


  @Input() itemGross: number = 0;
  @Input() itemTare: number = 0;
  @Input() itemNet: number = 0;
  @Input() itemPrice: number = 0;

  @Output() calculateObj = new EventEmitter<any>();

  grossInput:any =0;
  tareInput:any =0;
  netInput:any =0;
  priceInput:any =0;
  focusedInput: string | null = null;
  addNoteSectionVisible = false;  
  inputBoxes: any[] = [];
  private currentFocusIndex = 0;


  constructor(private renderer: Renderer2) {

  }


  ngOnInit(): void {
  
    this.grossInput = this.itemGross;
    this.tareInput = this.itemTare;
    this.netInput = this.grossInput - this.tareInput;
    this.priceInput = this.itemPrice;
    if (this.inputBox1) {
      this.renderer.selectRootElement(this.inputBox1.nativeElement).focus();
    }
   

  }

  // ngOnChanges(changes: SimpleChanges): void {

  //   if(changes){
  //     this.grossInput = changes['itemGross'].currentValue;
  //     this.tareInput =changes['itemTare'].currentValue;
  //     this.netInput = this.grossInput - this.tareInput;
  //     this.priceInput = changes['itemPrice'].currentValue;
  //   }
    
  // }

  ngAfterViewInit(): void {
    this.inputBoxes = [this.inputBox1, this.inputBox2, this.inputBox4,this.inputBox3];
    setTimeout(()=>{
      this.inputBoxes[this.currentFocusIndex]?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },100)
  }

  changeFocus() {
    // Set focus on the current input

    if (this.currentFocusIndex === this.inputBoxes.length-1) {
      const obj = {
        itemGross: this.grossInput,
        itemTare: this.tareInput,
        itemNet: this.grossInput - this.tareInput,
        itemPrice: this.priceInput,
        materialNote: this.materialNote
      }
      this.calculateObj.emit(obj);
     }
      this.inputBoxes[this.currentFocusIndex]?.nativeElement.focus();
     
     

      // Increment the focus index, resetting to 0 if it exceeds the number of inputs
      this.currentFocusIndex = (this.currentFocusIndex + 1) % this.inputBoxes.length;
    
  
  }


  displayValue: string = '0';

  clearDisplay() {
    this.displayValue = '0';
  }

  appendNumber(number: any) {
   
  
    if (this.focusedInput === 'inputBox1') {
      this.renderer.selectRootElement(this.inputBox1?.nativeElement).focus();
      let data = this.grossInput ?? '';
      if (data === '0') {
        this.grossInput = number.toString().trim();
      } else {
        this.grossInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox2') {
      this.renderer.selectRootElement(this.inputBox2?.nativeElement).focus();
      let data = this.tareInput ?? '';
      if (data === '0') {
        this.tareInput = number.toString().trim();
      } else {
        this.tareInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox3') {
      this.renderer.selectRootElement(this.inputBox3?.nativeElement).focus();
      let data = this.netInput ?? '';;
      if (data === '0') {
        this.netInput = number.toString().trim();
      } else {
        this.netInput += number.toString().trim();
      }
    } else if (this.focusedInput === 'inputBox4') {
      this.renderer.selectRootElement(this.inputBox4?.nativeElement).focus();
      let data = this.priceInput ?? '';
      if (data === '0') {
        this.priceInput = number.toString().trim();
      } else {
        this.priceInput += number.toString().trim();
      }
    } else {
      console.log('No input box is currently focused');
    }

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



  getFocusElemet(){
  
  }

  note() {
    this.addNoteSectionVisible = true;
  }

  addEditNote() {   
    // alert(this.materialNote); 
    this.addNoteSectionVisible = false;
  }

  deleteNote() {
    this.addNoteSectionVisible = false;
  }

  enter() {
    this.changeFocus();
    console.log(this.currentFocusIndex);
    
   
  }


 
  deleteCharacter() {
    if (this.focusedInput === 'inputBox1') {
      if (this.grossInput.length > 1) {
        this.grossInput = this.grossInput.slice(0, -1);
      } else {
        this.grossInput = '0';
      }

    }else if (this.focusedInput === 'inputBox2') {
      if (this.tareInput.length > 1) {
        this.tareInput = this.tareInput.slice(0, -1);
      } else {
        this.tareInput = '0';
      }

    }else if (this.focusedInput === 'inputBox3') {
      if (this.netInput.length > 1) {
        this.netInput = this.netInput.slice(0, -1);
      } else {
        this.netInput = '0';
      }
      
    }else if (this.focusedInput === 'inputBox4') {
      if (this.grossInput.length > 1) {
        this.priceInput = this.grossInput.slice(0, -1);
      } else {
        this.priceInput = '0';
      }
    }

    // switch (key) {
    //   case value:
        
    //     break;
    
    //   default:
    //     break;
    // }
   
  }
}
