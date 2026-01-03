import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-manager',
  templateUrl: './dashboard-manager.component.html',
  styleUrls: ['./dashboard-manager.component.css']
})
export class DashboardManagerComponent implements OnInit {
  dashboards: any[] = [];
  // The 'selectedDashboardId' holds the unique ID of the chosen dashboard.
  selectedDashboardId: string | null = null;
  isLoading = true;
  apiError: string | null = null;

  // This object represents your hard-coded static dashboard.
  // Using a unique ID like 'static-default' prevents clashes with real IDs.
  private readonly staticDashboard = {
    dashboard_id: 'static-default',
    dashboard_name: 'Default Dashboard'
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboards();
  }

  loadDashboards(): void {
    this.isLoading = true;
    this.apiError = null;

    this.dashboardService.getAllDashboards().subscribe({
      next: (res: any) => {
        // Prepend the static "Default Dashboard" to the list from the API.
        this.dashboards = [this.staticDashboard, ...(res.dashboards || [])];
        
        // On initial load, select the static dashboard by default.
        if (!this.selectedDashboardId) {
            this.selectedDashboardId = this.staticDashboard.dashboard_id;
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.apiError = 'Could not load custom dashboards. Displaying default view.';
        console.error(err);
        
        // Even if the API fails, ensure the default option is always available.
        this.dashboards = [this.staticDashboard];
        this.selectedDashboardId = this.staticDashboard.dashboard_id;
        this.isLoading = false;
      }
    });
  }

  onDashboardChange(event: any): void {
    // Update the selected ID based on the user's choice in the dropdown.
    this.selectedDashboardId = event.target.value;
  }

  createNewDashboard(): void {
    const name = prompt('Enter a name for the new dashboard:');
    if (name && name.trim()) {
      this.dashboardService.createDashboard(name.trim()).subscribe({
        next: (newDashboard: any) => {
          // After creating, reload the list and select the new dashboard.
          this.selectedDashboardId = newDashboard.dashboard_id;
          this.loadDashboards();
        },
        error: (err) => {
            alert('Failed to create dashboard. Please check the console for details.');
            console.error(err);
        }
      });
    }
  }

  // A simple getter to determine if the static dashboard is currently selected.
  get isStaticDashboardSelected(): boolean {
    return this.selectedDashboardId === this.staticDashboard.dashboard_id;
  }

  // A getter to find the full object for the currently selected dynamic dashboard.
  get selectedDynamicDashboard(): any | null {
      if (this.isStaticDashboardSelected) {
          return null;
      }
      return this.dashboards.find(d => d.dashboard_id === this.selectedDashboardId) || null;
  }

  // This function is called by the dynamic dashboard when it's deleted.
  handleDashboardDeleted(): void {
      // Reset the view to the default dashboard and refresh the list.
      this.selectedDashboardId = this.staticDashboard.dashboard_id;
      this.loadDashboards();
  }
}