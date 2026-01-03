import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

// This interface defines the structure of the data you'll pass for printing.
// The property names (e.g., 'name', 'company') should match the
// text inside your placeholders (e.g., {{name}}, {{company}}).
export interface PrintData {
  [key: string]: string | number;
}

// Interface for the raw template data from the server
interface FullTemplateData {
  htmlContent: string;
  // We don't need the other properties for this service, but they come with the response.
}

@Injectable({
  providedIn: 'root' // This makes the service available app-wide
})
export class TemplatePrintService {
  private apiBaseUrl = environment.ocrUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches a template, replaces its placeholders with provided data, and triggers printing.
   * @param printData An object where keys match the template's placeholders (e.g., { name: 'John Doe', amount: 123.45 })
   */
  public async print(printData: PrintData): Promise<void> {
    const clientName = localStorage.getItem('orgName');
    const locationName = localStorage.getItem('locationName');

    if (!clientName || !locationName) {
      throw new Error('Client (orgName) or Location (locationName) not found in local storage.');
    }

    try {
      // 1. Fetch the raw template HTML from the backend
      const url = `${this.apiBaseUrl}/check-printing/templates/${clientName}/${locationName}`;
      const template = await lastValueFrom(this.http.get<FullTemplateData>(url));
      let finalHtml = template.htmlContent;

      // 2. Replace all placeholders with actual data
      for (const key in printData) {
        if (Object.prototype.hasOwnProperty.call(printData, key)) {
          // Using a regular expression with the 'g' flag to replace all occurrences
          const placeholder = new RegExp(`{{${key}}}`, 'g');
          finalHtml = finalHtml.replace(placeholder, String(printData[key]));
        }
      }

      // 3. Trigger the print dialog with the final, populated HTML
      this.triggerPrintDialog(finalHtml);

    } catch (error) {
      console.error('Error during the print process:', error);
      // Re-throw the error so the calling component can handle it (e.g., show an error message)
      throw error;
    }
  }

  /**
   * Creates an iframe and uses it to print the provided HTML content.
   * @param htmlContent The final HTML string to be printed.
   */
  private triggerPrintDialog(htmlContent: string): void {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();
    }

    printFrame.onload = () => {
      const frameWindow = printFrame.contentWindow;
      if (frameWindow) {
        frameWindow.focus();
        frameWindow.print();
        const cleanup = () => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        };
        frameWindow.onafterprint = cleanup;
        setTimeout(cleanup, 2000); // Fallback for browsers that don't fire onafterprint
      }
    };
  }
}