import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.css']
})
export class DynamicDashboardComponent implements OnInit, OnChanges {
  // --- INPUT & OUTPUT ---
  @Input() initialDashboard: any | null = null;
  @Output() dashboardDeleted = new EventEmitter<void>();

  // --- State for Dashboard Management ---
  activeDashboard: any | null = null;
  isDashboardLoading: boolean = true;
  isRefreshing: boolean = false;

  // --- State for Modals & Data Fetching ---
  newQuery: string = '';
  isLoading: boolean = false;
  apiError: string | null = null;
  chartOptionsFromApi: any[] = [];

  // --- State for the new UI flow ---
  selectionStep: 'format' | 'preview' = 'format';
  activePreviewChart: any | null = null;
  customizationQuery: string = '';

  lastGeneratedData: {
    original_query: string;
    generated_query: string;
    current_output: any[];
  } | null = null;

  // --- Modal Visibility State ---
  isQueryModalOpen = false;
  isSelectionModalOpen = false;

  // --- Chart Configuration ---
  public mainChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };
  public previewChartOptions: ChartOptions = { responsive: true };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    if (this.initialDashboard) {
      this.loadDashboardDetails(this.initialDashboard.dashboard_id);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDashboard'] && !changes['initialDashboard'].firstChange) {
      const newDashboard = changes['initialDashboard'].currentValue;
      if (newDashboard) {
        this.loadDashboardDetails(newDashboard.dashboard_id);
      }
    }
  }

  loadDashboardDetails(dashboardId: string): void {
    this.isDashboardLoading = true;
    this.apiError = null;
    this.dashboardService.getDashboardById(dashboardId).subscribe({
      next: (res: any) => {
        const loadedDashboard = res.dashboard;
        loadedDashboard.components.forEach((item: any) => this.prepareChartJsData(item.visualization));
        this.activeDashboard = loadedDashboard;
        this.isDashboardLoading = false;
        this.triggerAutoRefresh(this.activeDashboard.components);
      },
      error: (err: any) => {
        this.apiError = `Could not load dashboard details.`;
        this.isDashboardLoading = false;
      }
    });
  }

  renameDashboard(): void {
    if (!this.activeDashboard) return;
    const newName = prompt('Enter the new name for the dashboard:', this.activeDashboard.dashboard_name);
    if (newName && newName.trim() && newName !== this.activeDashboard.dashboard_name) {
      this.dashboardService.updateDashboardName(this.activeDashboard.dashboard_id, newName.trim()).subscribe({
        next: () => {
          this.activeDashboard.dashboard_name = newName.trim();
        },
        error: (err: any) => alert('Failed to rename dashboard.')
      });
    }
  }

  deleteDashboard(): void {
    if (!this.activeDashboard) return;
    if (confirm(`Are you sure you want to delete the dashboard "${this.activeDashboard.dashboard_name}"? This action cannot be undone.`)) {
      this.dashboardService.deleteDashboard(this.activeDashboard.dashboard_id).subscribe({
        next: () => {
          this.dashboardDeleted.emit();
        },
        error: (err: any) => alert('Failed to delete dashboard.')
      });
    }
  }

  removeComponent(componentId: string): void {
    if (!this.activeDashboard) return;
    if (confirm('Are you sure you want to remove this widget?')) {
      this.dashboardService.deleteComponent(this.activeDashboard.dashboard_id, componentId).subscribe({
        next: () => {
          const index = this.activeDashboard.components.findIndex((c: any) => c.component_id === componentId);
          if (index > -1) this.activeDashboard.components.splice(index, 1);
        },
        error: (err: any) => alert('Failed to remove widget.')
      });
    }
  }

  private triggerAutoRefresh(components: any[]): void {
    if (!components || components.length === 0) return;
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const staleComponentIds = components
      .filter(comp => !comp.refreshed_at || new Date(comp.refreshed_at) < oneDayAgo)
      .map(comp => comp.component_id);
    if (staleComponentIds.length > 0) {
      console.log(`Auto-refreshing ${staleComponentIds.length} stale component(s).`);
      this.executeRefresh(staleComponentIds);
    }
  }

  private executeRefresh(componentIds: string[]): void {
    this.isRefreshing = true;
    this.dashboardService.refreshDashboardComponents(this.activeDashboard.dashboard_id, componentIds).subscribe({
      next: (response: any) => {
        if (response && response.refreshed_components) {
          response.refreshed_components.forEach((refreshedComp: any) => {
            const localComp = this.activeDashboard.components.find((c: any) => c.component_id === refreshedComp.component_id);
            if (localComp) {
              if (refreshedComp.data.chartData) localComp.visualization.chartData = refreshedComp.data.chartData;
              if (refreshedComp.data.tableData) localComp.visualization.tableData = refreshedComp.data.tableData;
              this.prepareChartJsData(localComp.visualization);
              localComp.refreshed_at = new Date().toISOString();
            }
          });
        }
        if (response.errors && response.errors.length > 0) {
          alert('Some components could not be auto-refreshed. Check console for details.');
          console.error('Auto-Refresh Errors:', response.errors);
        }
        this.isRefreshing = false;
      },
      error: (err: any) => {
        // alert('A critical error occurred while auto-refreshing the dashboard.');
        this.isRefreshing = false;
      }
    });
  }

  openQueryModal(): void {
    if (!this.activeDashboard) {
      alert('An active dashboard is required to add a widget.');
      return;
    }
    this.newQuery = '';
    this.isQueryModalOpen = true;
  }

  closeQueryModal(): void { this.isQueryModalOpen = false; }
  openSelectionModal(): void { this.isSelectionModalOpen = true; }
  closeSelectionModal(): void {
    this.isSelectionModalOpen = false;
    this.chartOptionsFromApi = [];
    this.lastGeneratedData = null;
    this.activePreviewChart = null;
    this.customizationQuery = '';
    this.selectionStep = 'format';
  }

  generateCharts(): void {
    if (!this.newQuery.trim()) return;
    this.closeQueryModal();
    this.openSelectionModal();
    this.isLoading = true;
    this.apiError = null;

    // UPDATED: No longer passing hardcoded 'WProdTest'
    this.dashboardService.getChartData(this.newQuery).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && Array.isArray(response.answer) && response.answer.length > 0) {
          this.chartOptionsFromApi = response.answer;
          this.lastGeneratedData = {
            original_query: response.query,
            generated_query: response.sql_query,
            current_output: response.answer,
          };
          this.selectionStep = 'format';
        } else {
          this.apiError = 'Could not generate any visualizations for this query.';
        }
      },
      error: (err: any) => {
        this.apiError = 'Failed to fetch data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectFormat(chart: any): void {
    this.activePreviewChart = chart;
    this.selectionStep = 'preview';
  }

  goBackToFormatSelection(): void {
    this.activePreviewChart = null;
    this.customizationQuery = '';
    this.apiError = null;
    this.selectionStep = 'format';
  }

  customizeCharts(): void {
    if (!this.customizationQuery.trim() || !this.lastGeneratedData || !this.activePreviewChart) return;
    this.isLoading = true;
    this.apiError = null;

    // UPDATED: Payload no longer contains db_name. The service will add it.
    const payload = {
      original_query: this.lastGeneratedData.original_query,
      generated_query: this.lastGeneratedData.generated_query,
      current_output: [this.activePreviewChart],
      changes: this.customizationQuery,
      history: []
    };

    this.dashboardService.customizeChart(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && Array.isArray(response.answer) && response.answer.length > 0) {
          this.chartOptionsFromApi = response.answer;
          this.lastGeneratedData = {
            original_query: response.original_query,
            generated_query: response.sql_query,
            current_output: response.answer,
          };
          this.customizationQuery = '';
          this.goBackToFormatSelection();
        } else {
          this.apiError = 'The customization did not return a valid chart format.';
        }
      },
      error: (err: any) => {
        this.apiError = 'Failed to customize chart. Please try again.';
        this.isLoading = false;
      }
    });
  }

  addActiveChartToDashboard(): void {
    if (!this.activeDashboard || !this.lastGeneratedData || !this.activePreviewChart) return;
    this.isLoading = true;
    this.dashboardService.saveChartToDashboard(
      this.activeDashboard.dashboard_id,
      this.activeDashboard.dashboard_name,
      this.lastGeneratedData.original_query,
      this.activePreviewChart,
      this.lastGeneratedData.generated_query
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeSelectionModal();
        this.loadDashboardDetails(this.activeDashboard.dashboard_id);
      },
      error: (err: any) => {
        this.isLoading = false;
        alert('An error occurred while saving the chart.');
      }
    });
  }

  private prepareChartJsData(item: any): void {
    if (item.chartType !== 'table' && item.chartData) {
      item.chartJsData = {
        labels: item.chartData.map((d: any) => d.label),
        datasets: [{ data: item.chartData.map((d: any) => d.value), label: item.chartTitle || 'Series' }]
      };
    }
  }

  getPreviewData(option: any): ChartData {
    if (!option.chartData) return { labels: [], datasets: [] };
    return {
      labels: option.chartData.map((d: any) => d.label),
      datasets: [{ data: option.chartData.map((d: any) => d.value), label: 'Value' }]
    };
  }

  getFormatName(chartType: string): string {
    if (chartType === 'table') return 'Table';
    if (chartType === 'bar') return 'Bar Chart';
    return chartType.charAt(0).toUpperCase() + chartType.slice(1) + ' Chart';
  }
}