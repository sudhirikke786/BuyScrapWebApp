import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit,AfterViewInit, OnDestroy {

  showImage = false;
  ngAfterViewInit(): void {
    const ds : any = document.querySelector('body');
    if(ds){
      ds.classList.remove('fix-body');
    }   
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {

    const ds : any = document.querySelector('body');
    if(ds){
      ds.classList.add('fix-body');
    }


  }


  addRegister(){
    this.showImage = true;
  }

  cancelImage(){
    this.showImage = false;
  }



}
