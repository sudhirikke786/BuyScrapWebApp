import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChatbotService } from 'src/app/core/services/chatbot.service';
import { HttpResponse } from '@angular/common/http';

interface ChatMessage {
  isUser: boolean;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  template: `
    <div class="chatbot-container" *ngIf="shouldShowChat">
      <!-- Chat Icon -->
      <button 
        class="chat-icon" 
        [class.active]="isChatOpen"
        (click)="toggleChat()"
        *ngIf="!isChatOpen">
        <i class="fas fa-comments"></i>
      </button>

      <!-- Chat Window -->
      <div class="chat-window" *ngIf="isChatOpen">
        <div class="chat-header">
          <h3>BuyScrapApp Support</h3>
          <!-- Upload File Button (visible only if username is 'rb') -->
          <div>
            <button *ngIf="isAuthorizedOrg && isAuthorizedUser" class="close-btn" (click)="onFileUploadClick()">
              <i class="fas fa-upload"></i>
              <!-- <input type="file" #fileInput accept="application/pdf" (change)="onFileSelected($event)" hidden /> -->
            </button>
            <button class="close-btn" (click)="toggleChat()">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- File Upload Modal -->
        <div *ngIf="isUploadModalVisible" class="modal-overlay">
          <div class="modal-content">
            <h3>Upload PDF</h3>
            <form (submit)="submitUploadForm()">
              <div class="form-group">
                <label for="file">Choose PDF:</label>
                <input type="file" #fileInput id="file" accept="application/pdf" (change)="onFileSelected($event)" required />
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" [(ngModel)]="password" name="password" required />
              </div>
              <button type="submit" class="btn-upload">Upload</button>
              <button type="button" class="btn-cancel" (click)="closeUploadModal()">Cancel</button>
            </form>
          </div>
        </div>


        <div class="chat-messages" #messageContainer>
          <div *ngFor="let msg of messages" 
               [ngClass]="{'user-message': msg.isUser, 'bot-message': !msg.isUser}"
               class="message">
            <div class="message-content" [innerHTML]="msg.message"></div>
            <div class="message-timestamp">
              {{ msg.timestamp | date:'shortTime' }}
            </div>
          </div>
          <div *ngIf="isLoading" class="bot-message message">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <input 
            #chatInput
            type="text" 
            [(ngModel)]="currentMessage" 
            (keyup.enter)="sendMessage()"
            [disabled]="isLoading"
            placeholder="Type your message...">
          <button (click)="sendMessage()" [disabled]="!currentMessage.trim() || isLoading">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .chat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #007bff;
      border: none;
      color: white;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }

    .chat-icon:hover {
      transform: scale(1.1);
    }

    .chat-window {
      position: fixed;
      bottom: 50px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: 15px;
      background: #007bff;
      color: white;
      border-radius: 10px 10px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-header h3 {
      margin: 0;
      font-size: 16px;
      color: white;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      margin-left: 10px;
    }

    .chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .message {
      max-width: 80%;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 5px;
    }

    .user-message {
      background: #007bff;
      color: white;
      align-self: flex-end;
    }

    .bot-message {
      background: #f0f0f0;
      color: black;
      align-self: flex-start;
    }

    .message-timestamp {
      font-size: 0.7em;
      opacity: 0.7;
      margin-top: 5px;
    }

    .chat-input {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
    }

    .chat-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 20px;
      outline: none;
    }

    .chat-input input:disabled {
      background: #f5f5f5;
    }

    .chat-input button {
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-input button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 5px 10px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: #999;
      border-radius: 50%;
      animation: typing 1s infinite ease-in-out;
    }

    .message-content {
      white-space: pre-wrap;
      line-height: 1.5;
    }

    .bot-message .message-content {
      font-size: 14px;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }

    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      width: 400px;
      max-width: 100%;
      text-align: center;
    }

    .form-group {
      margin-bottom: 15px;
    }

    form input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-top: 5px;
    }

    .btn-upload {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;
    }

    .btn-cancel {
      background-color: #ccc;
      color: black;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;
      margin-left: 10px;
    }

    .chatbot-container.modal-open {
      filter: blur(5px); /* Blur the background when modal is open */
    }


    .typing-indicator span:nth-child(1) { animation-delay: 0s; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `]
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('chatInput') chatInput!: ElementRef; // <-- Add this for input reference
  @ViewChild('fileInput') fileInput!: ElementRef; // <-- File input reference
  isAuthorizedOrg = false;
  isAuthorizedUser = false;
  isUploadModalVisible = false;
  password = '';
  selectedFile: File | null = null;

  isChatOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  shouldShowChat = false;
  isLoading = false;

  constructor(
    private router: Router,
    private chatbotService: ChatbotService
  ) {}

  ngOnInit() {
    this.shouldShowChat=true;
    this.messages.push({
      isUser: false,
      message: 'Hello! How can I help you today?',
      timestamp: new Date()
    });

    const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    const username = userObj.userdto.userName;
    const orgName = localStorage.getItem('orgName');
    this.isAuthorizedOrg = orgName === 'ProdTest';
    this.isAuthorizedUser = username === 'rb';

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe((event: any) => {
    //   this.shouldShowChat = event.url.split('/').length > 1 && 
    //                        !['organization-login', 'user-login', 'error', 'print-layout']
    //                        .some(path => event.url.includes(path));
    // });
  }

  onFileUploadClick() {
    // this.fileInput.nativeElement.click();
    this.isUploadModalVisible = true;
  }

  closeUploadModal() {
    this.isUploadModalVisible = false;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;  // Store the selected file in the selectedFile property
      console.log('PDF file selected:', file);
    } else {
      this.selectedFile = null; // Clear if no file is selected
    }
  }

  submitUploadForm() {
    if (this.password && this.selectedFile) {
      const formData = new FormData();
      formData.append('password', this.password);
      formData.append('file', this.selectedFile);

      console.log(formData)

      // Make the POST request to upload the file
      this.chatbotService.uploadPDF(formData).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            alert('PDF has been uploaded successfully!');
            this.closeUploadModal();
          }
        },
        error: (error: any) => {
          console.error('File upload failed:', error);
          alert('Failed to upload PDF. Incorrect Password');
        }
      });
    } else {
      alert('Please fill all fields and select a PDF file.');
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = 
        this.messageContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => {
        this.scrollToBottom();
        this.chatInput.nativeElement.focus();
      }, 100);
    }
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage = this.currentMessage;
    this.messages.push({
      isUser: true,
      message: userMessage,
      timestamp: new Date()
    });
    this.currentMessage = '';
    this.isLoading = true;

    this.chatbotService.getBotResponse(userMessage).subscribe(
      response => {
        this.isLoading = false;
        this.chatbotService.updateConversationId(response.conversation_id);

        this.messages.push({
          isUser: false,
          message: response.answer,
          timestamp: new Date()
        });
      },
      error => {
        console.error('Error getting bot response:', error);
        this.isLoading = false;
        this.messages.push({
          isUser: false,
          message: 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date()
        });
        this.chatbotService.updateConversationId('');
      }
    );
    if (this.isChatOpen) {
      setTimeout(() => {
        this.chatInput.nativeElement.focus();
      }, 500);
    }
  }
}