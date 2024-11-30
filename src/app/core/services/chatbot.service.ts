// src/app/shared/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    // const apiUrl = 'http://3.135.87.230/chatbot/ask';
    const apiUrl = 'http://localhost:8000/chatbot/ask';

    return this.http.post<ChatbotResponse>(apiUrl, requestBody, { headers });
  }

  updateConversationId(conversationId: string) {
    this.currentConversationId = conversationId;
  }

  uploadPDF(formData: FormData) {
    // const apiUrl = 'http://3.135.87.230/chatbot/upload-pdf';
    const apiUrl = 'http://localhost:8000/chatbot/upload-pdf';
    return this.http.post<any>(apiUrl, formData, { observe: 'response' });
  }
}