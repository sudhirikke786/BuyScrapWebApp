import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// Base URL for the new FastAPI chatbot endpoints
const API_BASE_URL = environment.ocrUrl;

// Interface for the Organisation API response structure
interface OrganisationResponse {
  data: {
    databaseName: string;
    // other properties can be listed here if needed
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // --- Properties for new dynamic dashboard ---
  private orgId: string;
  private userId: string;

  // Cache for the database name to avoid repeated API calls
  private dbNameCache$: Observable<string> | null = null;

  constructor(private http: HttpClient) {
    const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    this.orgId = localStorage.getItem('orgName') || 'default-org-id';
    this.userId = userObj.userdto.userName || userObj.id || 'default-user-id';
  }

  // --- START: ORIGINAL METHODS (PRESERVED) ---

  // Headers for the original API (environment.baseUrl)
  private getHeaders() {
    const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    const token = userObj.token;
    const orgName = localStorage.getItem('orgName');

    return new HttpHeaders({
      'ClientName': orgName || 'Default Client Name',
      'Authorization': `Bearer ${token}`
    });
  }
  
  // Method to get organisation details and cache the database name
  private getDatabaseName(): Observable<string> {
    if (this.dbNameCache$) {
      return this.dbNameCache$;
    }

    const userObjString = localStorage.getItem('userObj');
    const orgName = localStorage.getItem('orgName');

    if (!userObjString || !orgName) {
      console.error('Token or orgName missing in localStorage');
      // Return an observable that errors out
      return throwError(() => new Error('Authentication data missing'));
    }
    
    const userObj = JSON.parse(userObjString);
    const token = userObj?.token;
    
    if (!token) {
        return throwError(() => new Error('Authentication token missing'));
    }

    const headers = new HttpHeaders({
      'ClientName': orgName,
      'Authorization': `Bearer ${token}`
    });

    const apiUrl = environment.baseUrl + '/Organisations/GetOrganisactionDetailByName';

    this.dbNameCache$ = this.http.get<OrganisationResponse>(apiUrl, { headers }).pipe(
      map(response => {
        if (!response?.data?.databaseName) {
          throw new Error('Database name not found in organisation details response.');
        }
        return response.data.databaseName;
      }),
      shareReplay(1), // Cache the result and replay for subsequent subscribers
      catchError(this.handleError)
    );

    return this.dbNameCache$;
  }


  getPaidAmountDetails(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllPaidAmountDetails?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError((error) => {
        console.error('Error fetching paid amount details:', error);
        return throwError(error);
      }));
  }

  getShipOutDetails(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllTotalShipOutDetails?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError((error) => {
        console.error('Error fetching ship out details:', error);
        return throwError(error);
      }));
  }

  getRegradedDetails(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllTotalRegradedDetails?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError((error) => {
        console.error('Error fetching regraded details:', error);
        return throwError(error);
      }));
  }

  getAllDashboardMonthlyData(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllDashboardMonthlyData?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError((error) => {
        console.error('Error fetching dashboard monthly data:', error);
        return throwError(error);
      }));
  }

  getCustomerCount(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllCustomerCountDashData?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError((error) => {
        console.error('Error fetching customer count data:', error);
        return throwError(error);
      }));
  }

  getTopFiveSellers(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetTopFiveSeller?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError((error) => {
        console.error('Error fetching top five sellers:', error);
        return throwError(error);
      }));
  }

  // --- END: ORIGINAL METHODS ---


  // --- START: DYNAMIC DASHBOARD METHODS (UPDATED) ---

  // UPDATED: No longer accepts dbName, fetches it internally.
  getChartData(query: string): Observable<any> {
    return this.getDatabaseName().pipe(
      switchMap(dbName => {
        const url = `${API_BASE_URL}/chatbot/generate-chart`;
        const requestBody = { query: query, db_name: dbName, history: [] };
        return this.http.post<any>(url, requestBody);
      }),
      catchError(this.handleError)
    );
  }

  // UPDATED: Fetches dbName and adds it to the payload.
  customizeChart(payload: any): Observable<any> {
    return this.getDatabaseName().pipe(
      switchMap(dbName => {
        const url = `${API_BASE_URL}/chatbot/customize-chart`;
        // Create the full payload with the dynamic db_name
        const requestBody = { ...payload, db_name: dbName };
        return this.http.post<any>(url, requestBody);
      }),
      catchError(this.handleError)
    );
  }

  saveChartToDashboard(dashboardId: string, dashboardName: string, query: string, visualization: any, sqlQuery: string): Observable<any> {
    const url = `${API_BASE_URL}/chatbot/save-chart`;
    const requestBody = {
      org_id: this.orgId,
      user_id: this.userId,
      dashboard_id: dashboardId,
      dashboard_name: dashboardName,
      query: query,
      visualization: visualization,
      sql_query: sqlQuery
    };
    return this.http.post(url, requestBody).pipe(catchError(this.handleError));
  }

  createDashboard(dashboardName: string): Observable<any> {
    const url = `${API_BASE_URL}/chatbot/dashboards`;
    const body = { org_id: this.orgId, user_id: this.userId, dashboard_name: dashboardName };
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  getAllDashboards(): Observable<any> {
    const url = `${API_BASE_URL}/chatbot/dashboards`;
    const params = new HttpParams().set('org_id', this.orgId).set('user_id', this.userId);
    return this.http.get(url, { params }).pipe(catchError(this.handleError));
  }

  getDashboardById(dashboardId: string): Observable<any> {
    const url = `${API_BASE_URL}/chatbot/dashboards/${dashboardId}`;
    const params = new HttpParams().set('org_id', this.orgId).set('user_id', this.userId);
    return this.http.get(url, { params }).pipe(catchError(this.handleError));
  }

  updateDashboardName(dashboardId: string, newName: string): Observable<any> {
    const url = `${API_BASE_URL}/chatbot/dashboards/${dashboardId}`;
    const body = { org_id: this.orgId, user_id: this.userId, dashboard_name: newName };
    return this.http.put(url, body).pipe(catchError(this.handleError));
  }

  deleteDashboard(dashboardId: string): Observable<any> {
    const url = `${API_BASE_URL}/chatbot/dashboards/${dashboardId}`;
    const options = { body: { org_id: this.orgId, user_id: this.userId } };
    return this.http.delete(url, options).pipe(catchError(this.handleError));
  }

  deleteComponent(dashboardId: string, componentId: string): Observable<any> {
    const url = `${API_BASE_URL}/chatbot/dashboards/${dashboardId}/components/${componentId}`;
    const options = { body: { org_id: this.orgId, user_id: this.userId } };
    return this.http.delete(url, options).pipe(catchError(this.handleError));
  }

  // UPDATED: Fetches dbName and adds it to the request body.
  refreshDashboardComponents(dashboardId: string, componentIds: string[]): Observable<any> {
    return this.getDatabaseName().pipe(
      switchMap(dbName => {
        const url = `${API_BASE_URL}/chatbot/dashboards/refresh`;
        const body = {
          org_id: this.orgId,
          user_id: this.userId,
          dashboard_id: dashboardId,
          component_ids: componentIds,
          db_name: dbName // Using dynamic db_name
        };
        return this.http.post(url, body);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error('An error occurred with the API. Please try again.'));
  }

  // --- END: DYNAMIC DASHBOARD METHODS ---
}