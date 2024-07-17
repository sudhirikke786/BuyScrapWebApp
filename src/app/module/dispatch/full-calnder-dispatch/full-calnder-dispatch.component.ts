import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-full-calnder-dispatch',
  templateUrl: './full-calnder-dispatch.component.html',
  styleUrls: ['./full-calnder-dispatch.component.scss']
})
export class FullCalnderDispatchComponent implements OnInit {

  
  constructor( private route:ActivatedRoute,
               private router:Router) {

  }



 
  
  orgName!: string | null;


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    customButtons: {
      myCustomButton: {
        text: 'Back',
        click: function () {
          alert('clicked the back button!');
        }
      }
    },
    headerToolbar: {
      left: 'prev,next myCustomButton today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    buttonText: {
      prev: 'Previous',
      next: 'Next'
    },
    events: [
      { title: 'Collabartion', start: '2024-07-16T10:00:00', end: '2024-07-16T11:00:00', icon: 'fa-solid fa-calendar' },
      { title: 'Planing', start: '2024-07-18T12:00:00', end: '2024-07-16T18:00:00', icon: 'fa-solid fa-calendar-check' },
      { title: 'Collabartion', start: '2024-07-19T10:00:00', end: '2024-07-19T11:00:00', icon: 'fa-solid fa-calendar' },
      { title: 'Planing', start: '2024-07-20T12:00:00', end: '2024-07-20T13:00:00', icon: 'fa-solid fa-calendar-check' },
      { title: 'Collabartion', start: '2024-07-21T10:00:00', end: '2024-07-21T11:00:00', icon: 'fa-solid fa-calendar' },
      { title: 'Planing', start: '2024-07-22T12:00:00', end: '2024-07-22T13:00:00', icon: 'fa-solid fa-calendar-check' }
    ],
    eventContent: this.renderEventContent
  };

  ngOnInit(){
    this.orgName = localStorage.getItem('orgName');
  }





 
  
 renderEventContent(info: any) {
  const start = new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const end = new Date(info.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return {
    html: `
      <div style="border:1px solid #6658dd; border-left:3px solid #6658dd;padding:5px;">

        <i class="${info.event.extendedProps.icon} me-2"></i>
        <div display: flex; align-items: center;">
          <div style="font-weight: bold;">${info.event.title}</div>
          <div>${start} - ${end}</div>
        </div>
        <div display: flex; align-items: center;">
         <div style="font-weight: bold;">10 -Appointments</div>
         <div style="font-weight: bold;">  <a  class="text-primary">View All</a></div>

        </div>

      </div>`
  }
}

}
