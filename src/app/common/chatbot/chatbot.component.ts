import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChatbotService } from 'src/app/core/services/chatbot.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VoiceRecognitionService } from 'src/app/core/services/voice-recognition.service'; 

// --- Interfaces for Chat Messages ---
interface BaseChatMessage { isUser: boolean; timestamp: Date; }
interface TextMessage extends BaseChatMessage { type: 'text'; text: string; }
// CHANGED: Added rawAnswer to store original bot response for history
interface ChartMessage extends BaseChatMessage { type: 'chart'; chartData: ChartData; chartOptions: ChartConfiguration['options']; chartType: ChartType; rawAnswer: string; }
interface TableMessage extends BaseChatMessage { type: 'table'; tableData: { headers: string[]; rows: string[][] }; rawAnswer: string; }
type ChatMessage = TextMessage | ChartMessage | TableMessage;

// --- Interface for a Chat Session ---
export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messages: ChatMessage[];
}

// --- Interface for API Response ---
interface ApiChartData { explanation: string; chartData: { label: string; value: number }[]; chartType: ChartType; chartTitle: string; }

// --- Interface for Pop-up Modal Content ---
interface DetailModalContent {
  type: 'chart' | 'table';
  title: string;
  data: any;
}

// NEW: Interface for history payload sent to backend
interface HistoryPayloadMessage {
  role: 'user' | 'bot';
  content: string;
}


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('chatInput') chatInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  // --- State for Modals & Authorization ---
  isAuthorizedOrg = false;
  isAuthorizedUser = false;
  isUploadModalVisible = false;
  isDetailModalVisible = false;
  password = '';
  selectedFile: File | null = null;
  modalContent: DetailModalContent | null = null;

  // --- Core Chat State ---
  shouldShowChat = true;
  isChatOpen = false;
  isLoading = false;
  currentMessage = '';
  isHistoryPanelOpen = true;
  allChats: ChatSession[] = [];
  activeChat: ChatSession | null = null;
  private readonly CHAT_STORAGE_KEY = 'buyScrapApp_chatHistory';

  isListening = false;

  constructor(
    private router: Router,
    private chatbotService: ChatbotService,
    private sanitizer: DomSanitizer,
    public voiceService: VoiceRecognitionService
  ) {}

  public sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit() {
    this._loadChatsFromStorage();
    this.initVoiceService();

    try {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.isAuthorizedOrg = localStorage.getItem('orgName') === 'ProdTest';
      this.isAuthorizedUser = userObj?.userdto?.userName === 'rb';
    } catch (e) {
      console.error("Could not parse user data from localStorage", e);
    }

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      const forbiddenPaths = ['organization-login', 'user-login', 'error', 'print-layout'];
      this.shouldShowChat = !forbiddenPaths.some(path => event.url.includes(path));
    });
  }

  initVoiceService() {
    this.voiceService.textAvailable$.subscribe((text) => {
      // Append text to current message (with a space if needed)
      this.currentMessage = (this.currentMessage ? this.currentMessage + ' ' : '') + text;
      this.isListening = false; // Turn off animation when done speaking
    });
  }

  toggleVoiceInput() {
    if (this.isListening) {
      this.voiceService.stop();
      this.isListening = false;
    } else {
      this.voiceService.start();
      this.isListening = true;
    }
  }

  ngAfterViewChecked() { this.scrollToBottom(); }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => { this.scrollToBottom(); this.chatInput?.nativeElement.focus(); }, 100);
    }
  }

  toggleHistoryPanel() {
    this.isHistoryPanelOpen = !this.isHistoryPanelOpen;
  }

  // --- Detail Modal (Pop-up) ---
  openDetailModal(message: ChatMessage) {
    if (message.type === 'chart') {
      this.modalContent = {
        type: 'chart',
        title: message.chartOptions?.plugins?.title?.text as string || 'Chart Details',
        data: {
          chartData: message.chartData,
          chartOptions: { ...message.chartOptions, responsive: true, maintainAspectRatio: true },
          chartType: message.chartType
        }
      };
      this.isDetailModalVisible = true;
    } else if (message.type === 'table') {
      this.modalContent = {
        type: 'table',
        title: 'Table Details',
        data: message.tableData
      };
      this.isDetailModalVisible = true;
    }
  }

  closeDetailModal() {
    this.isDetailModalVisible = false;
    setTimeout(() => { this.modalContent = null; }, 300);
  }

  // --- History Management ---
  createNewChat() {
    this.closeDetailModal(); // Close any open pop-up when starting a new chat
    const newChat: ChatSession = {
      id: `chat_${Date.now()}`,
      title: 'New Chat',
      createdAt: new Date(),
      messages: [{
        type: 'text', isUser: false,
        text: 'Hello! I am your AI assistant. How can I help you today?',
        timestamp: new Date()
      }]
    };
    this.allChats.unshift(newChat);
    this.selectChat(newChat.id);
    this._saveChatsToStorage();
  }

  selectChat(chatId: string) {
    this.closeDetailModal(); // Close any open pop-up when switching chats
    this.activeChat = this.allChats.find(c => c.id === chatId) || null;
  }

  deleteChat(chatIdToDelete: string, event: MouseEvent) {
    event.stopPropagation();
    this.closeDetailModal(); // Close pop-up if the active chat is deleted
    this.allChats = this.allChats.filter(c => c.id !== chatIdToDelete);
    if (this.activeChat?.id === chatIdToDelete) {
      this.activeChat = this.allChats.length > 0 ? this.allChats[0] : null;
      if (!this.activeChat) {
        this.createNewChat();
      }
    }
    this._saveChatsToStorage();
  }

  // --- Local Storage ---
  private _loadChatsFromStorage() {
    try {
      const storedChats = localStorage.getItem(this.CHAT_STORAGE_KEY);
      if (storedChats) {
        this.allChats = JSON.parse(storedChats);
        this.allChats.forEach(chat => {
          chat.createdAt = new Date(chat.createdAt);
          chat.messages.forEach(msg => msg.timestamp = new Date(msg.timestamp));
        });
      }
    } catch (e) {
      console.error("Failed to load or parse chats from localStorage", e);
      this.allChats = [];
    }

    if (this.allChats.length > 0) {
      this.selectChat(this.allChats[0].id);
    } else {
      this.createNewChat();
    }
  }

  private _saveChatsToStorage() {
    try {
      localStorage.setItem(this.CHAT_STORAGE_KEY, JSON.stringify(this.allChats));
    } catch (e) {
      console.error("Failed to save chats to localStorage", e);
    }
  }

  // --- Message Sending & Processing ---
  sendMessage() {
    this.isListening = false; 
    this.closeDetailModal();

    const userMessageText = this.currentMessage.trim();
    if (!userMessageText || this.isLoading || !this.activeChat) return;

    // --- CHANGED: Assemble history payload ---
    const recentMessages = this.activeChat.messages.slice(-4); // Get last 4 messages
    const historyPayload: HistoryPayloadMessage[] = recentMessages.map(msg => {
        const role = msg.isUser ? 'user' : 'bot';
        let content = '';
        if (msg.type === 'text') {
            content = msg.text;
        } else if (msg.type === 'chart' || msg.type === 'table') {
            // Send the original raw response for context
            content = msg.rawAnswer;
        }
        return { role, content };
    });
    
    if (this.activeChat.title === 'New Chat' && this.activeChat.messages.length === 1) {
      this.activeChat.title = userMessageText.substring(0, 35) + (userMessageText.length > 35 ? '...' : '');
    }

    this.activeChat.messages.push({ type: 'text', isUser: true, text: userMessageText, timestamp: new Date() });
    this.currentMessage = '';
    this.isLoading = true;
    this.scrollToBottom();
    this._saveChatsToStorage();

    // CHANGED: Pass history payload to the service
    this.chatbotService.getBotResponse(userMessageText, historyPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Pass the raw answer string for processing and storage
        this.processBotResponse(response.answer);
        this._saveChatsToStorage();
      },
      error: (error) => {
        this.isLoading = false;
        if (this.activeChat) {
          this.activeChat.messages.push({ type: 'text', isUser: false, text: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() });
          this._saveChatsToStorage();
        }
        console.error('Error getting bot response:', error);
      }
    });
  }

  private processBotResponse(answer: string) {
    if (!this.activeChat) return;

    const chartJson = this.parseChartJson(answer);
    if (chartJson) {
      // CHANGED: Pass the raw `answer` string to be stored
      this.addChartMessage(chartJson, answer);
      return;
    }

    const tableData = this.parseMarkdownTable(answer);
    if (tableData) {
      // CHANGED: Pass the raw `answer` string to be stored
      this.addTableMessage(tableData, answer);
      return;
    }

    this.activeChat.messages.push({ type: 'text', isUser: false, text: answer, timestamp: new Date() });
  }

  private parseChartJson(text: string): ApiChartData | null {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    if (match?.[1]) {
      try { return JSON.parse(match[1]); } catch (e) { console.error('Failed to parse chart JSON:', e); return null; }
    }
    return null;
  }
  
  // CHANGED: Function signature updated to accept rawAnswer
  private addChartMessage(apiChartData: ApiChartData, rawAnswer: string) {
    if (!this.activeChat) return;
  
    if (apiChartData.explanation) {
      this.activeChat.messages.push({
        type: 'text',
        isUser: false,
        text: apiChartData.explanation,
        timestamp: new Date(),
      });
    }
  
    const chartType = apiChartData.chartType || 'bar';
    const vibrantColors = [ /* ... colors ... */ 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'];
    const backgroundColors = apiChartData.chartData.map((_, i) => vibrantColors[i % vibrantColors.length]);
    const borderColors = backgroundColors.map(c => c.replace(/0\.\d+/, '1'));
  
    const newChartMessage: ChartMessage = {
      type: 'chart',
      isUser: false,
      timestamp: new Date(),
      chartType,
      rawAnswer: rawAnswer, // Store the raw answer
      chartData: {
        labels: apiChartData.chartData.map(d => d.label),
        datasets: [{
          data: apiChartData.chartData.map(d => d.value),
          label: apiChartData.chartTitle,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1.5
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: ['pie', 'doughnut'].includes(chartType) },
          title: { display: true, text: apiChartData.chartTitle, font: { size: 16 } }
        },
        scales: (['bar', 'line'].includes(chartType)) ? { y: { beginAtZero: true } } : undefined
      }
    };
  
    this.activeChat.messages.push(newChartMessage);
    this.openDetailModal(newChartMessage);
  }

  private parseMarkdownTable(text: string): { headers: string[]; rows:string[][] } | null {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.startsWith('|'));
    if (lines.length < 2 || !lines[1].includes('---')) return null;
    const cleanCell = (cell: string) => cell.trim();
    const headers = lines[0].split('|').slice(1, -1).map(cleanCell);
    const rows = lines.slice(2).map(line => line.split('|').slice(1, -1).map(cleanCell));
    if (headers.length === 0 || rows.some(row => row.length !== headers.length)) return null;
    return { headers, rows };
  }

  // CHANGED: Function signature updated to accept rawAnswer
  private addTableMessage(tableData: { headers: string[]; rows: string[][] }, rawAnswer: string) {
    if (!this.activeChat) return;
    
    const newTableMessage: TableMessage = {
      type: 'table',
      isUser: false,
      timestamp: new Date(),
      tableData,
      rawAnswer: rawAnswer // Store the raw answer
    };
    this.activeChat.messages.push(newTableMessage);
    
    this.openDetailModal(newTableMessage);
  }

  // --- PDF Upload Modal Logic (no changes needed here) ---
  onFileUploadClick() { this.isUploadModalVisible = true; }
  closeUploadModal() {
    this.isUploadModalVisible = false; this.password = ''; this.selectedFile = null;
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }
  onFileSelected(event: Event) { this.selectedFile = (event.target as HTMLInputElement).files?.[0] || null; }
  submitUploadForm() {
    if (this.password && this.selectedFile) {
      const formData = new FormData();
      formData.append('password', this.password); formData.append('file', this.selectedFile);
      this.chatbotService.uploadPDF(formData).subscribe({
        next: (res) => { if (res.status === 200) { alert('PDF uploaded successfully!'); this.closeUploadModal(); } },
        error: (err) => { console.error('File upload failed:', err); alert('Failed to upload PDF. See console for details.'); }
      });
    } else { alert('Please select a PDF file and enter the password.'); }
  }

  private scrollToBottom(): void {
    if (this.messageContainer?.nativeElement) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }

  downloadTableAsCsv() {
    // 1. Check if we actually have table data open
    if (!this.modalContent || this.modalContent.type !== 'table' || !this.modalContent.data) {
      return;
    }

    const data = this.modalContent.data; // { headers: string[], rows: string[][] }
    
    // 2. Helper function to escape special characters (commas, quotes, newlines)
    const escapeCsvCell = (cell: any): string => {
      if (cell === null || cell === undefined) {
        return '';
      }
      const text = String(cell);
      // If data contains commas, quotes, or newlines, wrap in quotes and escape existing quotes
      if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    // 3. Construct CSV content
    // Create Header Row
    const csvContent = [
      data.headers.map(escapeCsvCell).join(','),
      // Create Data Rows
      ...data.rows.map((row: any[]) => row.map(escapeCsvCell).join(','))
    ].join('\n');

    // 4. Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    // Generate a filename with a timestamp
    link.setAttribute('download', `table_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}