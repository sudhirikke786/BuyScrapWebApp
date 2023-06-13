import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  showHidePanel(){
    const htmlAttr = document.querySelector('html');
    if(htmlAttr){
      const _datasidenav = htmlAttr.getAttribute('data-sidenav-size');
      if(_datasidenav=='condensed'){
        // sidebar-enable
        //
        htmlAttr.setAttribute('data-sidenav-size', 'default');
        htmlAttr.classList.add('menuitem-active')
      }else{
        htmlAttr.setAttribute('data-sidenav-size', 'condensed');
        htmlAttr.classList.add('menuitem-active sidebar-enable')
      }
    }
  
  }
   
}
