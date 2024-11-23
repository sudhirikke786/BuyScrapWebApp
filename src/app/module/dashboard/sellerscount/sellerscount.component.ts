import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts'; // Import BaseChartDirective
import { NgModel } from '@angular/forms';  // Ensure NgModel is available for two-way binding

// Define an interface for the API response
interface CustomerCountData {
  days: string;
  totalQuantity: number;
}

@Component({
  selector: 'app-sellerscount',
  templateUrl: './sellerscount.component.html',
  styleUrls: ['./sellerscount.component.css']
})
export class SellerscountComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined; // Reference to the chart directive

  public selectedType: string = 'Daily'; // Default type is set to 'Monthly'

  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [], // To be populated with the API response
    datasets: [
      {
        label: 'Sellers Count',
        data: [], // To be populated with the API response
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
      }
    ]
  };

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        stacked: false, // Disable stacking
      },
      y: {
        beginAtZero: true,
        stacked: false, // Disable stacking
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchSellersCountData();
  }  

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

  // Fetch sellers count data based on the selected type
  fetchSellersCountData(): void {
    // Get the dynamic FromDate and ToDate based on selectedType
    const { fromDate, toDate, type } = this.calculateDateRange(this.selectedType);

    this.dashboardService.getCustomerCount(fromDate, toDate, type).subscribe(
      response => {
        const apiData: CustomerCountData[] = response.data; // Type assertion

        const labels: string[] = [];
        const totalQuantityData: number[] = [];

        apiData.forEach((item: CustomerCountData) => {
          if (type === 'Monthly') {
            // Convert date string to month name if type is 'Monthly'
            const date = new Date(item.days);
            const monthName = date.toLocaleString('default', { month: 'short' });
            labels.push(monthName);
          } else {
            labels.push(item.days); // For other types, use the raw date value
          }

          totalQuantityData.push(item.totalQuantity);
        });

        // Update chart data
        this.chartData.labels = labels;
        this.chartData.datasets[0].data = totalQuantityData;

        this.updateChart(); // Update the chart after data is set
      },
      error => {
        console.error('Error fetching sellers count data:', error);
      }
    );
  }

  // Handle the change in the dropdown
  onTypeChange(event: Event): void {
    this.selectedType = (event.target as HTMLSelectElement).value;
    this.fetchSellersCountData(); // Fetch new data based on the selected type
  }

  // Method to manually update the chart
  updateChart(): void {
    if (this.chart) {
      this.chart.update(); // Call the Chart.js update method
    }
  }
}
