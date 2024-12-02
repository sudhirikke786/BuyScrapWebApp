// src/app/shared/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface ChatbotRequest {
  query: string;
  conversation_id: string;
}

interface ChatbotResponse {
  query: string;
  answer: string;
  conversation_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private currentConversationId: string = '';

  constructor(private http: HttpClient) {}

  getBotResponse(query: string): Observable<ChatbotResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestBody: ChatbotRequest = {
      query: query,
      conversation_id: this.currentConversationId
    };

    const apiUrl = environment.baseUrl + '/AWS/AskQuery';
    // const apiUrl = 'http://localhost:8000/chatbot/ask';

    return this.http.post<ChatbotResponse>(apiUrl, requestBody, { headers });
  }

  updateConversationId(conversationId: string) {
    this.currentConversationId = conversationId;
  }

  uploadPDF(formData: FormData) {
    const apiUrl = environment.baseUrl + '/chatbot/upload-pdf';
    // const apiUrl = 'http://localhost:8000/chatbot/upload-pdf';
    return this.http.post<any>(apiUrl, formData, { observe: 'response' });
  }
}