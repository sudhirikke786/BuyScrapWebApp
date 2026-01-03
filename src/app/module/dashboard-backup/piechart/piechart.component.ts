import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  public selectedType: string = 'Monthly';

  public chartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)', // Seller 1 color
          'rgba(54, 162, 235, 0.7)', // Seller 2 color
          'rgba(255, 206, 86, 0.7)',  // Seller 3 color
          'rgba(75, 192, 192, 0.7)',  // Seller 4 color
          'rgba(153, 102, 255, 0.7)', // Seller 5 color
          'rgba(201, 203, 207, 0.7)'  // Others color
        ],
      }
    ]
  };

  public chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      // title: {
      //   display: true,
      //   text: 'Top 5 Sellers Contribution',
      // },
      legend: {
        position: 'top',
      },
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Fetch initial data based on the default selected type
    this.fetchTopFiveSellers();
  }

  // Method to calculate date range based on selected type
  calculateDateRange(timeRange: string): { fromDate: string, toDate: string, type: string } {
    const currentDate = new Date();
    let fromDate: string;
    let toDate: string = currentDate.toISOString().split('T')[0];
    let type: string;

    switch (timeRange) {
      case 'OneWeek':
        const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        fromDate = oneWeekAgo.toISOString().split('T')[0];
        type = 'Daily'; // API only accepts Daily or Monthly
        break;

      case 'OneMonth':
        const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        fromDate = thirtyDaysAgo.toISOString().split('T')[0];
        type = 'Daily';
        break;

      case 'ThreeMonths':
        // Three months ago, first day
        const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
        fromDate = threeMonthsAgo.toISOString().split('T')[0];
        type = 'Daily';
        break;

      case 'Monthly':
        // First day of current year
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        fromDate = firstDayOfYear.toISOString().split('T')[0];
        type = 'Monthly';
        break;

      case 'Daily':
      default:
        // First day of current month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        fromDate = firstDayOfMonth.toISOString().split('T')[0];
        type = 'Daily';
        break;
    }

    return { fromDate, toDate, type };
  }

  // Handle the change in the dropdown
  onTypeChange(event: Event): void {
    this.selectedType = (event.target as HTMLSelectElement).value;
    this.fetchTopFiveSellers(); // Fetch new data based on the selected type
  }

  fetchTopFiveSellers(): void {
    const { fromDate, toDate, type } = this.calculateDateRange(this.selectedType);

    this.dashboardService.getTopFiveSellers(fromDate, toDate, type).subscribe(response => {
      const apiData = response.data;

      // Populate chart labels and data
      this.chartData.labels = apiData.map((item: any) => item.sellerName); // Seller names
      this.chartData.datasets[0].data = apiData.map((item: any) => item.totalQuantity); // Quantities

      this.updateChart(); // Update the chart after data is set
    });
  }

  // Method to manually update the chart
  updateChart(): void {
    if (this.chart) {
      this.chart.update(); // Call the Chart.js update method
    }
  }
}
