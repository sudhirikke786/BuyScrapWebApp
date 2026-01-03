import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  // Totals for each card
  public receivedTotal: number = 0;
  public shipoutTotal: number = 0;
  public regradedTotal: number = 0;
  public revenueTotal: number = 0;

  // Default labels for the X axis
  public labels: string[] = [];

  // Modal properties
  isModalOpen = false;
  selectedCard: string | null = null;
  public selectedTimeRange: string = 'Monthly'; // Default value

  // Data for 'Received' sparkline
  public receivedData = {
    labels: this.labels,
    datasets: [
      { 
        data: [], 
        label: 'Received', 
        fill: false, 
        borderColor: 'blue', 
        backgroundColor: 'blue',
        pointBackgroundColor: 'blue',
        pointBorderColor: 'blue'
      }
    ]
  };
  
  // Data for 'Shipout' sparkline
  public shipoutData = {
    labels: this.labels,
    datasets: [
      { 
        data: [], 
        label: 'Shipout', 
        fill: false, 
        borderColor: 'lightgreen', 
        backgroundColor: 'lightgreen',
        pointBackgroundColor: 'lightgreen',
        pointBorderColor: 'lightgreen'
      }
    ]
  };
  
  // Data for 'Regraded' sparkline
  public regradedData = {
    labels: this.labels,
    datasets: [
      { 
        data: [], 
        label: 'Regraded', 
        fill: false, 
        borderColor: 'orange', 
        backgroundColor: 'orange',
        pointBackgroundColor: 'orange',
        pointBorderColor: 'orange'
      }
    ]
  };
  
  // Data for 'Total Revenue' sparkline
  public totalRevenueData = {
    labels: this.labels,
    datasets: [
      { 
        data: [],
        label: 'Total Revenue', 
        fill: false, 
        borderColor: 'green', 
        backgroundColor: 'green',
        pointBackgroundColor: 'green',
        pointBorderColor: 'green'
      }
    ]
  };

  // Chart options with visible data points and tooltips
  public chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: { display: false },
      y: { display: false }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        backgroundColor: 'blue',
        hoverRadius: 6
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.raw.toLocaleString()}`;
          }
        }
      }
    }
  };

  // Modified chart options for modal
  public modalChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: { display: true },
      y: { display: true }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        backgroundColor: 'blue',
        hoverRadius: 6
      }
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem: any) => {
            return `$${tooltipItem.raw.toLocaleString()}`;
          }
        }
      }
    }
  };

  constructor(private dashboardService: DashboardService) {
    this.revenueTotal = this.calculateTotal(this.totalRevenueData.datasets[0].data);
  }

  private calculateDateRange(timeRange: string): { fromDate: string, toDate: string, type: string } {
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

  ngOnInit(): void {
    this.fetchReceivedData();
    this.fetchShipoutData();
    this.fetchRegradedData();
  }

  onTimeRangeChange(event: any): void {
    this.selectedTimeRange = event.target.value;
    this.updateDataBasedOnTimeRange();
  }

  // Modal control methods
  openModal(cardType: string) {
    this.selectedCard = cardType;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCard = null;
  }

  getCardTitle(): string {
    switch (this.selectedCard) {
      case 'received': return 'Received';
      case 'shipout': return 'Shipout';
      case 'regraded': return 'Regraded';
      case 'revenue': return 'Total Revenue';
      default: return '';
    }
  }

  getCardTotal(): number {
    switch (this.selectedCard) {
      case 'received': return this.receivedTotal;
      case 'shipout': return this.shipoutTotal;
      case 'regraded': return this.regradedTotal;
      case 'revenue': return this.revenueTotal;
      default: return 0;
    }
  }

  getCardData(): any {
    switch (this.selectedCard) {
      case 'received': return this.receivedData;
      case 'shipout': return this.shipoutData;
      case 'regraded': return this.regradedData;
      case 'revenue': return this.totalRevenueData;
      default: return null;
    }
  }

  // Helper function to calculate total
  private calculateTotal(data: number[]): number {
    return data.reduce((sum, current) => sum + current, 0);
  }

  // Update data based on the selected time range
  private updateDataBasedOnTimeRange(): void {
    this.fetchReceivedData();
    this.fetchShipoutData();
    this.fetchRegradedData();
  }

  private fetchReceivedData(): void {
    const { fromDate, toDate, type } = this.calculateDateRange(this.selectedTimeRange);

    this.dashboardService.getPaidAmountDetails(fromDate, toDate, type).subscribe(
      (response: any) => {
        if (response && response.data) {
          const days = response.data.map((item: any) => item.days);
          const amounts = response.data.map((item: any) => item.totalPaidAmount);

          this.receivedData.labels = days;
          this.receivedData.datasets[0].data = amounts;
          this.receivedTotal = this.calculateTotal(amounts);
          
          this.updateCharts();
        }
      },
      (error: any) => {
        console.error('Error fetching received data:', error);
      }
    );
  }

  private fetchShipoutData(): void {
    const { fromDate, toDate, type } = this.calculateDateRange(this.selectedTimeRange);

    this.dashboardService.getShipOutDetails(fromDate, toDate, type).subscribe(
      (response: any) => {
        if (response && response.data) {
          const days = response.data.map((item: any) => item.days);
          const quantities = response.data.map((item: any) => item.totalQuantity);

          this.shipoutData.labels = days;
          this.shipoutData.datasets[0].data = quantities;
          this.shipoutTotal = this.calculateTotal(quantities);
          
          this.updateCharts();
        }
      },
      (error: any) => {
        console.error('Error fetching shipout data:', error);
      }
    );
  }

  private fetchRegradedData(): void {
    const { fromDate, toDate, type } = this.calculateDateRange(this.selectedTimeRange);

    this.dashboardService.getRegradedDetails(fromDate, toDate, type).subscribe(
      (response: any) => {
        if (response && response.data) {
          const days = response.data.map((item: any) => item.days);
          const quantities = response.data.map((item: any) => item.totalQuantity);

          this.regradedData.labels = days;
          this.regradedData.datasets[0].data = quantities;
          this.regradedTotal = this.calculateTotal(quantities);
          
          this.updateCharts();
        }
      },
      (error: any) => {
        console.error('Error fetching regraded data:', error);
      }
    );
  }

  // Update all charts
  private updateCharts(): void {
    if (this.charts) {
      this.charts.forEach(chart => {
        if (chart) {
          chart.update();
        }
      });
    }
  }
}