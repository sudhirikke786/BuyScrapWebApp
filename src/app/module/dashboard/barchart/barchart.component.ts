import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { Chart, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts'; // Import BaseChartDirective

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined; // Reference to the chart directive

  public selectedType: string = 'Monthly'; // Default type is set to 'Monthly'

  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Paid',
        data: [],
        backgroundColor: 'rgba(66, 165, 245, 0.7)',
      },
      {
        label: 'Regraded',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
      {
        label: 'Shipouts',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      }
    ]
  };

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      // title: {
      //   display: true,
      //   text: 'Monthly Comparison of Paid Amount, Regraded, and Ship Out Details',
      // },
      legend: {
        position: 'top',
        display: true,
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        stacked: false,
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchChartData();
  }

  // Method to calculate date range based on selected type
  // calculateDateRange(): { fromDate: string, toDate: string } {
  //   const currentDate = new Date();
  //   let fromDate: string;
  //   let toDate: string = currentDate.toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  //   if (this.selectedType === 'OneWeek') {
  //     // FromDate is 7 days prior to today's date for 1 Week
  //     const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  //     fromDate = oneWeekAgo.toISOString().split('T')[0];
  //     this.selectedType = 'Daily';
  //   } else if (this.selectedType === 'OneMonth') {
  //     // FromDate is the first day of the current month
  //     const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  //     fromDate = thirtyDaysAgo.toISOString().split('T')[0];
  //     this.selectedType = 'Daily';
  //   } else if (this.selectedType === 'ThreeMonths') {
  //     // FromDate is 3 months prior to today's date
  //     const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
  //     fromDate = threeMonthsAgo.toISOString().split('T')[0];
  //     this.selectedType = 'Daily';
  //   } else if (this.selectedType === 'Monthly') {
  //     // FromDate is the first day of the current year
  //     const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
  //     fromDate = firstDayOfYear.toISOString().split('T')[0];
  //     this.selectedType = 'Monthly';
  //   } else if (this.selectedType === 'Daily') {
  //     // FromDate is the first day of the current month
  //     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  //     fromDate = firstDayOfMonth.toISOString().split('T')[0];
  //     this.selectedType = 'Daily';
  //   } else {
  //     // Default case if any other types are added
  //     fromDate = '2024-01-01'; // Some default value
  //   }

  //   return { fromDate, toDate };
  // }

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

  fetchChartData(): void {
    const { fromDate, toDate, type } = this.calculateDateRange(this.selectedType);
  
    this.dashboardService.getAllDashboardMonthlyData(fromDate, toDate, type).subscribe(
      response => {
        const apiData = response.data;
  
        const labels: string[] = [];
        const totalPaidAmountData: number[] = [];
        const totalQuantityData: number[] = [];
        const totalShipOutData: number[] = [];
  
        apiData.forEach((item: any) => {
          if (type === 'Monthly') {
            // Convert date string (e.g., '2024-01-01') to month name (e.g., 'Jan') if type is 'Monthly'
            const date = new Date(item.days);
            const monthName = date.toLocaleString('default', { month: 'short' }); // Get short month name (e.g., 'Jan', 'Feb', etc.)
            labels.push(monthName);
          } else {
            // For other types, just push the raw date value
            labels.push(item.days);
          }
  
          totalPaidAmountData.push(item.totalPaidAmount);
          totalQuantityData.push(item.totalQuantity);
          totalShipOutData.push(item.totalShipOutDetails);
        });
  
        // Update chart data
        this.chartData.labels = labels;
        this.chartData.datasets[0].data = totalPaidAmountData;
        this.chartData.datasets[1].data = totalQuantityData;
        this.chartData.datasets[2].data = totalShipOutData;
  
        this.updateChart(); // Update the chart after data is set
      },
      error => {
        console.error('Error fetching bar chart data:', error);
        // Optionally handle the error, e.g., show a message
      }
    );
  }

  // Handle the change in the dropdown
  onTypeChange(event: Event): void {
    this.selectedType = (event.target as HTMLSelectElement).value;
    this.fetchChartData(); // Fetch new data based on the selected type
  }
  

  // Method to manually update the chart
  updateChart(): void {
    if (this.chart) {
      this.chart.update(); // Call the Chart.js update method
    }
  }
}
