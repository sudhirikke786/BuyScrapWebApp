import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-print-ticket',
  templateUrl: './print-ticket.component.html',
  styleUrls: ['./print-ticket.component.css']
})
export class PrintTicketComponent implements OnInit {


  ngOnInit(){
   
      setTimeout(() =>{
         const _demo = document.getElementsByClassName('fix-body');

    if(_demo?.length > 0) {
       _demo[0].classList.remove("fix-body"); 
      }
      this.generatePDF();

      },10)
  }


  generatePDF() {
    const pdf = new jspdf.jsPDF();
    const element = document.getElementById('contentToConvert'); // Replace with the ID of your HTML content
  if(element)
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // Adjust the dimensions as needed
      pdf.save('your-file-name.pdf'); // Save the PDF with your desired file name
      document.body.classList.add('fix-body')

    });
  }

}
