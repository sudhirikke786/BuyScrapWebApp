import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

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

  @Input() titleName = 'Motors/Motores ==> Aluminum Motors (Clean/Limpios)';
  
  grossInput:any;
  tareInput:any;
  netInput:any;
  priceInput:any;
  focusedInput: string | null = null;

  constructor(private renderer: Renderer2) {

  }


  ngOnInit(): void {
    if (this.inputBox1) {
      this.renderer.selectRootElement(this.inputBox1.nativeElement).focus();
    }

  }

  ngAfterViewInit(): void {

  }


  displayValue: string = '0';

  clearDisplay() {
    this.displayValue = '0';
  }

  appendNumber(number: any) {
    this.renderer.selectRootElement(this.inputBox1?.nativeElement).focus();
  
    if (this.focusedInput === 'inputBox1') {
      let data = this.grossInput ?? '';
      if (data === '0') {
        this.grossInput = number.toString();
      } else {
        this.grossInput += number.toString();
      }
    } else if (this.focusedInput === 'inputBox2') {
      let data = this.tareInput
      if (data === '0') {
        this.tareInput = number.toString();
      } else {
        this.tareInput += number.toString();
      }
    } else if (this.focusedInput === 'inputBox3') {
      let data = this.netInput;
      if (data === '0') {
        this.netInput = number.toString();
      } else {
        this.netInput += number.toString();
      }
    } else if (this.focusedInput === 'inputBox4') {
      let data = this.priceInput;
      if (data === '0') {
        this.priceInput = number.toString();
      } else {
        this.priceInput += number.toString();
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

  }

  enter() {

  }

  deleteCharacter() {
    if (this.displayValue.length > 1) {
      this.displayValue = this.displayValue.slice(0, -1);
    } else {
      this.displayValue = '0';
    }
  }
}
