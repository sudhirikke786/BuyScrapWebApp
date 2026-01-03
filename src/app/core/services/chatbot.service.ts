import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, switchMap, tap, of } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interface for chat history
interface HistoryPayloadMessage {
  role: 'user' | 'bot';
  content: string;
}

// Chatbot request body (updated with db_name)
interface ChatbotRequest {
  query: string;
  db_name: string;
  history: HistoryPayloadMessage[];
}

// Chatbot response
interface ChatbotResponse {
  query: string;
  answer: string;
  sql_query: string;
}

// Organisation API response
interface OrganisationResponse {
  data: {
    rowId: number;
    organisationName: string;
    organisationDisplayName: string;
    databaseName: string;
    serverName: string;
    userName: string;
    password: string;
    emailID: string;
    isActive: boolean;
    // ... other properties as needed
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  constructor(private http: HttpClient) {}

  /**
   * Sends a query and chat history to the chatbot backend.
   * First gets the database name from Organisation API, then calls chatbot API.
   */
  getBotResponse(query: string, history: HistoryPayloadMessage[]): Observable<ChatbotResponse> {
    return this.getOrganisationDetails().pipe(
      switchMap((orgResponse: OrganisationResponse) => {
        const dbName = orgResponse.data.databaseName;
        
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });

        const requestBody: ChatbotRequest = {
          query: query,
          db_name: dbName,
          history: history
        };

        // const apiUrl = 'http://localhost:8000/chatbot/ask';
        // const apiUrl = environment.baseUrl + '/AWS/AskQuery';
        const apiUrl = environment.ocrUrl + `/chatbot/ask`;

        return this.http.post<ChatbotResponse>(apiUrl, requestBody, { headers }).pipe(
          tap((response) => {
            console.log('Chatbot Response:', response);
          })
        );
      })
    );
  }

  /**
   * Gets Organisation details and returns the response
   */
  private getOrganisationDetails(): Observable<OrganisationResponse> {
    const userObjString = localStorage.getItem('userObj');
    const orgName = localStorage.getItem('orgName');

    if (!userObjString || !orgName) {
      console.error('Token or orgName missing in localStorage');
      throw new Error('Authentication data missing');
    }

    const userObj = JSON.parse(userObjString);
    const token = userObj?.token;

    if (!token) {
      console.error('Token missing in userObj');
      throw new Error('Authentication token missing');
    }

    const headers = new HttpHeaders({
      'ClientName': orgName,
      'Authorization': `Bearer ${token}`
    });

    // const apiUrl = 'https://localhost:44385/Organisations/GetOrganisactionDetailByName';
    const apiUrl = environment.baseUrl + '/Organisations/GetOrganisactionDetailByName';

    return this.http.get<OrganisationResponse>(apiUrl, { headers }).pipe(
      tap((result) => {
        console.log('Organisation Detail API Result:', result);
      })
    );
  }

  /**
   * Uploads a PDF file to chatbot training
   */
  uploadPDF(formData: FormData): Observable<HttpResponse<any>> {
    const apiUrl = `${environment.baseUrl}/chatbot/upload-pdf`;
    return this.http.post<any>(apiUrl, formData, { observe: 'response' });
  }
}