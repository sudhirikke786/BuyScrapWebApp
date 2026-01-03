import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent {
  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Revenue',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)', // Area fill color with transparency
        fill: true, // Fill the area below the line
        tension: 0.4 // Smooth line
      }
    ]
  };

  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue by Month',
        align: 'start'
      }
    },
    scales: {
      x: {
        grid: {
          color: ['#f3f3f3', 'transparent'],
        }
      },
      y: {
        beginAtZero: true
      }
    },
    elements: {
      line: {
        tension: 0.4 // Smooth curve for the area chart
      }
    }
  };
}
