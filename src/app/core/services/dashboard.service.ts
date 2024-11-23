import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    const token = userObj.token; // Authorization token
    const locationId = localStorage.getItem('locId'); // Location ID
    const orgName = localStorage.getItem('orgName'); // Organization Name

    return new HttpHeaders({
      'ClientName': orgName || 'Default Client Name', // Use orgName, or a default value
      'Authorization': `Bearer ${token}` // Use Bearer token
    });
  }

  getPaidAmountDetails(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllPaidAmountDetails?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching paid amount details:', error);
          return throwError(error);
        })
      );
  }

  getShipOutDetails(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllTotalShipOutDetails?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching ship out details:', error);
          return throwError(error);
        })
      );
  }

  getRegradedDetails(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllTotalRegradedDetails?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching regraded details:', error);
          return throwError(error);
        })
      );
  }

  // New method to get monthly dashboard data
  getAllDashboardMonthlyData(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllDashboardMonthlyData?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching dashboard monthly data:', error);
          return throwError(error);
        })
      );
  }

  getCustomerCount(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetAllCustomerCountDashData?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching customer count data:', error);
          return throwError(error);
        })
      );
  }

  getTopFiveSellers(fromDate: string, toDate: string, type: string): Observable<any> {
    const locationId = localStorage.getItem('locId');
    const url = `${environment.baseUrl}/Dashboard/GetTopFiveSeller?FromDate=${fromDate}&ToDate=${toDate}&Type=${type}&LocationID=${locationId}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching customer count data:', error);
          return throwError(error);
        })
      );
  }
}
