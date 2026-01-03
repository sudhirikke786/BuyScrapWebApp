import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

// --- Interfaces ---

interface PlaceholderToken {
  id: string;
  label: string;
  placeholder: string;
  color: string;
}

interface DocumentElement {
  id:string;
  type: 'text' | 'placeholder';
  content: string;
  placeholder?: string;
  position: { x: number; y: number };
  fontSize?: number;
  width?: number;
}

interface PaperSize {
  name: string;
  width: number;
  height: number;
}

interface FullTemplateData {
  htmlContent: string;
  backgroundImage: string | null;
  canvasWidthInches: number;
  canvasHeightInches: number;
  documentElements: DocumentElement[];
}

@Component({
  selector: 'app-document-builder',
  template: `
   <p-toast></p-toast> 
    <div class="document-builder-container">
      <div class="document-area">
        <div class="toolbar">
          <!-- File and Clear Group -->
          <div class="toolbar-group">
            <button (click)="clearDocument()" class="toolbar-btn">Clear</button>
            <div class="file-input-wrapper">
              <label for="fileUpload" class="toolbar-btn-choose-file">Choose file</label>
              <input id="fileUpload" type="file" accept="image/*" (change)="onImageUpload($event)" style="display: none;">
              <span class="file-name">{{ fileName }}</span>
            </div>
          </div>

          <!-- Size and Dimensions Group -->
          <div class="toolbar-group">
            <label class="size-label">Size:</label>
            <select [(ngModel)]="selectedPaperSize" (ngModelChange)="onPaperSizeChange()" class="size-select">
                <option *ngFor="let size of paperSizes" [value]="size.name">{{ size.name }}</option>
            </select>
            <div class="dimension-inputs">
              <label>W:</label>
              <input type="number" [(ngModel)]="canvasWidthInches" class="dim-input" [disabled]="selectedPaperSize === 'Custom'" (ngModelChange)="onDimensionChange()">
              <label>H:</label>
              <input type="number" [(ngModel)]="canvasHeightInches" class="dim-input" [disabled]="selectedPaperSize === 'Custom'" (ngModelChange)="onDimensionChange()">
              <span>in</span>
            </div>
          </div>

          <!-- Save and Print Group -->
          <div class="toolbar-group save-load-group">
            <button (click)="saveTemplate()" class="toolbar-btn save-btn">Save</button>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="canvas-wrapper">
          <div
            #documentCanvas class="document-canvas"
            (drop)="onDrop($event)" (dragover)="onDragOver($event)"
            [style.backgroundImage]="backgroundImage ? 'url(' + backgroundImage + ')' : 'none'"
            [style.backgroundSize]="'contain'" [style.backgroundRepeat]="'no-repeat'" [style.backgroundPosition]="'center'"
            [style.width.px]="canvasWidthInches * 96" [style.height.px]="canvasHeightInches * 96">
            <div
              *ngFor="let element of documentElements; trackBy: trackElement"
              [attr.data-id]="element.id"
              class="document-element"
              [class.placeholder-element]="element.type === 'placeholder'"
              [class.text-label-element]="element.type === 'text'"
              [style.left.px]="element.position.x"
              [style.top.px]="element.position.y"
              [style.fontSize.px]="element.fontSize"
              [style.width.px]="element.width"
              (mousedown)="startDragging(element, $event)">
              <!-- Content for all elements -->
              <div class="content-wrapper" [class.monospace-font]="element.type === 'placeholder'">
                {{ element.content }}
              </div>
              <!-- Controls available for all elements -->
              <div class="resize-handle" (mousedown)="startResizing(element, $event)"></div>
              <button (click)="removeElement(element.id)" class="remove-btn">×</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
          <h3>Placeholders</h3>
          <div class="placeholder-list">
              <div *ngFor="let token of placeholderTokens" class="placeholder-token"
                  draggable="true" (dragstart)="onDragStart($event, token)">
                  <span class="token-label">{{ token.label }}</span>
                  <code class="token-placeholder">{{ token.placeholder }}</code>
              </div>
          </div>

          <!-- Add Label Section -->
          <div class="add-custom-item">
              <h4>Add Label</h4>
              <input type="text" placeholder="Your custom text here" [(ngModel)]="newLabelText" class="input-field" (keyup.enter)="addLabel()">
              <button (click)="addLabel()" class="add-btn">Add Label</button>
          </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 90vh;
    }
    .document-builder-container {
      display: flex; height: 90vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8f9fa;
    }
    .sidebar {
      width: 280px; background: #fff; color: #212529; padding: 20px;
      border-left: 1px solid #dee2e6; overflow-y: auto;
      display: flex; flex-direction: column;
    }
    .sidebar h3, .sidebar h4 {
      margin: 0 0 15px 0; font-weight: 500; color: #495057;
      border-bottom: 1px solid #dee2e6; padding-bottom: 10px;
    }
    .placeholder-list { margin-bottom: 30px; }
    .placeholder-token {
      display: block; padding: 10px; margin-bottom: 8px; border-radius: 4px;
      cursor: grab; border: 1px solid #b3d7ff; background-color: #e9f5ff;
      transition: box-shadow 0.2s;
    }
    .placeholder-token:hover { box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); }
    .token-label {
      display: block; font-weight: 600; font-size: 14px; color: #0d6efd;
      margin-bottom: 4px;
    }
    .token-placeholder {
      display: block;
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12px; color: #495057; background: #fff; padding: 4px 6px;
      border-radius: 3px; border: 1px solid #ced4da;
    }
    .add-custom-item {
      border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: auto;
    }
    .input-field {
      width: 100%; padding: 8px; margin-bottom: 8px; border-radius: 4px;
      border: 1px solid #ced4da; font-size: 14px;
      box-sizing: border-box;
    }
    .add-btn {
      width: 100%; padding: 10px; background: #0d6efd; color: white;
      border: none; border-radius: 4px; cursor: pointer; font-size: 14px;
    }
    .add-btn:hover { background: #0b5ed7; }
    .document-area {
      flex: 1; display: flex; flex-direction: column; overflow: hidden;
    }
    .toolbar {
      padding: 10px 20px; background: #fff; border-bottom: 1px solid #dee2e6;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
      flex-wrap: wrap;
      gap: 15px;
    }
    .toolbar-group { display: flex; align-items: center; gap: 10px; }
    .toolbar-btn {
      padding: 8px 16px; border: 1px solid #ced4da; background-color: #fff;
      color: #212529; border-radius: 4px; cursor: pointer; font-size: 14px;
      transition: background-color 0.2s;
    }
    .toolbar-btn:hover { background-color: #f8f9fa; }
    .toolbar-btn-choose-file {
      padding: 8px 16px; background: #0d6efd; border: 1px solid #ced4da; color: white;
      border-radius: 4px; cursor: pointer; font-size: 14px;
      transition: background-color 0.2s;
    }
    .toolbar-btn-choose-file:hover { background-color: #0b5ed7; }
    .file-input-wrapper { display: flex; align-items: center; }
    .file-name { color: #6c757d; margin-left: 10px; font-size: 14px; }
    .size-label {
      font-size: 14px; color: #495057; font-weight: 500;
    }
    .size-select {
      padding: 8px; border-radius: 4px; border: 1px solid #ced4da;
      font-size: 14px; background-color: #fff;
    }
    .dimension-inputs {
      display: flex; align-items: center; gap: 5px; color: #495057;
    }
    .dimension-inputs label { font-size: 14px; margin-left: 5px; }
    .dim-input {
      width: 55px; padding: 8px; border-radius: 4px;
      border: 1px solid #ced4da; font-size: 14px;
    }
    .dim-input:disabled {
      background-color: #e9ecef; cursor: not-allowed; color: #6c757d;
    }
    .canvas-wrapper {
      flex: 1; display: flex; justify-content: center; align-items: flex-start;
      overflow: auto; padding: 20px; background-color: #e9ecef;
    }
    .document-canvas {
      position: relative; background: white; border: 1px solid #dee2e6;
      border-radius: 4px; overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); flex-shrink: 0;
    }
    .document-element {
      position: absolute; cursor: move; user-select: none; z-index: 1;
      box-sizing: border-box; border-radius: 4px; padding: 2px 6px;
      display: block;
      word-wrap: break-word;
    }
    .placeholder-element {
      background: rgba(227, 242, 253, 0.7);
      border: 1px dashed #0d6efd;
    }
    .text-label-element {
      background: rgba(232, 245, 233, 0.7);
      border: 1px dashed #28a745;
      font-weight: bold;
    }
    .content-wrapper {
    }
    .monospace-font {
      font-family: monospace;
      font-weight: 600;
    }
    .remove-btn {
      position: absolute; top: -10px; right: -10px; width: 20px; height: 20px;
      border-radius: 50%; background: #dc3545; color: white; border: none;
      cursor: pointer; font-size: 12px; display: flex; align-items: center;
      justify-content: center; z-index: 2;
    }
    .resize-handle {
      position: absolute; width: 12px; height: 12px;
      bottom: -2px; right: -2px; cursor: se-resize;
      background-color: #0d6efd; border: 1px solid white; border-radius: 2px;
    }
    .toolbar-group.save-load-group {
      gap: 8px;
    }
    .save-btn {
      background-color: #0d6efd; border-color: #0d6efd; color: white;
    }
    .save-btn:hover { background-color: #0b5ed7; }
  `]
})
export class DocumentBuilderComponent implements OnInit {
  @ViewChild('documentCanvas', { static: true }) documentCanvas!: ElementRef;

  // --- State Properties ---
  apiBaseUrl = environment.ocrUrl;
  canvasWidthInches = 8.5;
  canvasHeightInches = 11;
  fileName = 'No file selected';
  backgroundImage: string | null = null;
  documentElements: DocumentElement[] = [];
  paperSizes: PaperSize[] = [
    { name: 'Letter 8.5 x 11', width: 8.5, height: 11 },
    { name: 'Legal 8.5 x 14', width: 8.5, height: 14 },
    { name: 'Ledger/Tabloid 11 x 17', width: 11, height: 17 },
    { name: 'Custom', width: 0, height: 0 }
  ];
  selectedPaperSize: string = 'Letter 8.5 x 11';
  placeholderTokens: PlaceholderToken[] = [
    { id: '1', label: 'Payee Name', placeholder: '{{payee_name}}', color: '' },
    { id: '2', label: 'Company Name', placeholder: '{{company_name}}', color: '' },
    { id: '3', label: 'Date', placeholder: '{{date}}', color: '' },
    { id: '4', label: 'Company Address', placeholder: '{{company_address}}', color: '' },
    { id: '5', label: 'Amount', placeholder: '{{amount}}', color: '' },
    { id: '6', label: 'Amount in words', placeholder: '{{amount_in_words}}', color: '' },
    { id: '7', label: 'Memo', placeholder: '{{memo}}', color: '' },
    { id: '8', label: 'Check Issued Date(MM/dd/yyyy)', placeholder: '{{check_issued_date}}', color: '' },
    { id: '9', label: 'Print Date', placeholder: '{{print_date}}', color: '' }
  ];
  newLabelText = '';

  // --- Drag & Resize State ---
  draggedToken: PlaceholderToken | null = null;
  isDraggingElement = false;
  dragOffset = { x: 0, y: 0 };
  currentlyDragging: DocumentElement | null = null;
  isResizingElement = false;
  currentlyResizing: DocumentElement | null = null;
  initialResizePos = { x: 0, y: 0 };
  initialWidth = 150;
  initialFontSize = 14;

  constructor(private http: HttpClient, private messageService: MessageService) {}

  ngOnInit() {
    this.documentElements = [];
    this._loadTemplateFromServer();
  }

  private async _loadTemplateFromServer() {
    const clientName = localStorage.getItem('orgName');
    const locationName = localStorage.getItem('locationName');
    if (!clientName || !locationName) {
      console.log('Client/Location info not found. Starting with a blank template.');
      return;
    }
    const url = `${this.apiBaseUrl}/check-printing/templates/${clientName}/${locationName}`;
    try {
      const data = await lastValueFrom(this.http.get<FullTemplateData>(url));
      this.backgroundImage = data.backgroundImage;
      this.canvasWidthInches = data.canvasWidthInches;
      this.canvasHeightInches = data.canvasHeightInches;
      this.documentElements = data.documentElements;
      const matchedSize = this.paperSizes.find(
        s => s.width === data.canvasWidthInches && s.height === data.canvasHeightInches
      );
      this.selectedPaperSize = matchedSize ? matchedSize.name : 'Custom';
      
      // --- LOCALSTORAGE FIX: Apply saved widths after loading from server ---
      this._applyPersistedWidths();

      console.log('Template loaded successfully!');
    } catch (error: any) {
      if (error.status === 404) {
        console.log('No pre-existing template found. Starting with a blank canvas.');
      } else {
        console.error('Failed to load template:', error);
      }
    }
  }

  onPaperSizeChange() {
    if (this.selectedPaperSize === 'Custom') return;
    const selectedSize = this.paperSizes.find(size => size.name === this.selectedPaperSize);
    if (selectedSize) {
      this.canvasWidthInches = selectedSize.width;
      this.canvasHeightInches = selectedSize.height;
    }
  }

  onDimensionChange() {
    this.selectedPaperSize = 'Custom';
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => { this.backgroundImage = reader.result as string; };
      reader.readAsDataURL(file);
    } else {
      this.fileName = 'No file selected';
    }
  }

  onDragStart(event: DragEvent, token: PlaceholderToken) {
    this.draggedToken = token;
    event.dataTransfer?.setData('text/plain', token.placeholder);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.draggedToken) return;
    const rect = this.documentCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newElement: DocumentElement = {
      id: Date.now().toString(),
      type: 'placeholder',
      content: this.draggedToken.placeholder,
      placeholder: this.draggedToken.placeholder,
      position: { x, y },
      fontSize: 14,
    };

    if (this.draggedToken.placeholder === '{{company_address}}') {
      newElement.width = 250;
    }

    this.documentElements.push(newElement);
    this.draggedToken = null;
  }

  removeElement(elementId: string) {
    this.documentElements = this.documentElements.filter(el => el.id !== elementId);
  }

  clearDocument() {
    this.documentElements = [];
    this.backgroundImage = null;
    this.fileName = 'No file selected';
  }

  startDragging(element: DocumentElement, event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('remove-btn') || target.classList.contains('resize-handle')) return;
    this.isDraggingElement = true;
    this.currentlyDragging = element;
    const rect = this.documentCanvas.nativeElement.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left - element.position.x,
      y: event.clientY - rect.top - element.position.y
    };
    const onDrag = this.onElementDrag.bind(this);
    const onStop = this.stopDragging.bind(this);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onStop, { once: true });
  }

  onElementDrag(event: MouseEvent) {
    if (!this.isDraggingElement || !this.currentlyDragging) return;
    const rect = this.documentCanvas.nativeElement.getBoundingClientRect();
    this.currentlyDragging.position = {
      x: event.clientX - rect.left - this.dragOffset.x,
      y: event.clientY - rect.top - this.dragOffset.y
    };
  }

  stopDragging() {
    this.isDraggingElement = false;
    this.currentlyDragging = null;
  }

  startResizing(element: DocumentElement, event: MouseEvent) {
    event.stopPropagation();
    this.isResizingElement = true;
    this.currentlyResizing = element;
    this.initialResizePos = { x: event.clientX, y: event.clientY };

    this.initialWidth = element.width || 150;
    this.initialFontSize = element.fontSize || 14;

    const onResize = this.onElementResize.bind(this);
    const onStop = this.stopResizing.bind(this);
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', onStop, { once: true });
  }

  onElementResize(event: MouseEvent) {
    if (!this.isResizingElement || !this.currentlyResizing) return;
    
    const deltaX = event.clientX - this.initialResizePos.x;

    if (this.currentlyResizing.placeholder === '{{company_address}}') {
      const newWidth = this.initialWidth + deltaX;
      this.currentlyResizing.width = Math.max(50, newWidth);
    } else {
      const newSize = this.initialFontSize + (deltaX / 4);
      this.currentlyResizing.fontSize = Math.max(8, Math.min(150, newSize));
    }
  }
  
  stopResizing() {
    this.isResizingElement = false;
    this.currentlyResizing = null;
  }

  addLabel() {
    if (!this.newLabelText.trim()) return;
    const newElement: DocumentElement = {
      id: Date.now().toString(),
      type: 'text',
      content: this.newLabelText.trim(),
      position: { x: 20, y: 20 },
      fontSize: 14,
    };
    this.documentElements.push(newElement);
    this.newLabelText = '';
  }
  
  async saveTemplate() {
    // --- LOCALSTORAGE FIX: Persist widths before sending to server ---
    this._persistWidths();

    const clientName = localStorage.getItem('orgName');
    const locationName = localStorage.getItem('locationName');
    if (!clientName || !locationName) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Required client/location info not found.' });
      return;
    }
    const htmlContent = this.generatePrintableHtml();
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const editorState = {
      backgroundImage: this.backgroundImage,
      canvasWidthInches: this.canvasWidthInches,
      canvasHeightInches: this.canvasHeightInches,
      documentElements: this.documentElements
    };
    const formData = new FormData();
    formData.append('template_file', htmlBlob, 'template.html');
    formData.append('template_data_json', JSON.stringify(editorState));
    const url = `${this.apiBaseUrl}/check-printing/templates/${clientName}/${locationName}`;
    try {
      await lastValueFrom(this.http.post(url, formData));
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template saved successfully!' });
    } catch (error) {
      console.error('Failed to save template:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save the template.' });
    }
  }

  // --- LOCALSTORAGE FIX: New helper function to save widths ---
  private _persistWidths() {
    const widthsToSave: { [key: string]: number } = {};
    this.documentElements.forEach(element => {
      if (element.placeholder === '{{company_address}}' && element.width) {
        widthsToSave[element.id] = element.width;
      }
    });
    localStorage.setItem('checkTemplateWidths', JSON.stringify(widthsToSave));
  }

  // --- LOCALSTORAGE FIX: New helper function to apply saved widths ---
  private _applyPersistedWidths() {
    const savedWidths = JSON.parse(localStorage.getItem('checkTemplateWidths') || '{}');
    if (Object.keys(savedWidths).length > 0) {
      this.documentElements.forEach(element => {
        if (savedWidths[element.id]) {
          element.width = savedWidths[element.id];
        }
      });
    }
  }

  private generatePrintableHtml(): string {
    let elementsHtml = '';
    const bgStyle = this.backgroundImage ? `background-image: url('${this.backgroundImage}'); background-size: contain; background-repeat: no-repeat; background-position: center;` : '';
    for (const element of this.documentElements) {
      const fontFamily = element.type === 'placeholder' ? 'monospace' : 'sans-serif';
      const fontWeight = element.type === 'placeholder' ? '600' : 'normal';
      
      const widthStyle = element.width ? `width: ${element.width}px;` : '';
      const wrappingStyle = element.width ? 'word-wrap: break-word;' : 'white-space: nowrap;';
      
      const inlineStyle = `
        position: absolute;
        left: ${element.position.x}px; 
        top: ${element.position.y}px;
        font-size: ${element.fontSize || 14}px;
        font-family: ${fontFamily};
        font-weight: ${fontWeight};
        color: black;
        ${widthStyle}
        ${wrappingStyle}
      `.replace(/\s\s+/g, ' ').trim();
      elementsHtml += `<div style="${inlineStyle}">${element.content}</div>`;
    }
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"><title>Print Document</title>
          <style>
            @page { size: ${this.canvasWidthInches}in ${this.canvasHeightInches}in; margin: 0; }
            body { margin: 0; }
            .print-canvas { position: relative; width: 100%; height: 100%; background-color: white; ${bgStyle} }
          </style>
        </head>
        <body>
          <div class="print-canvas">${elementsHtml}</div>
        </body>
      </html>`;
  }

  trackElement(index: number, element: DocumentElement): string {
    return element.id;
  }
}