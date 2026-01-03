import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

// Declare the webkitSpeechRecognition property to avoid TypeScript errors
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  recognition: any;
  isStoppedSpeechRecog = false;
  public textAvailable$ = new Subject<string>();

  constructor(private _ngZone: NgZone) {
    this.init();
  }

  init() {
    // Check if browser supports the API
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.interimResults = false; // Set to true if you want real-time typing
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false; // Stop after one sentence

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Use NgZone to ensure Angular detects the change
        this._ngZone.run(() => {
          this.textAvailable$.next(transcript);
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        this.stop();
      };

      this.recognition.onend = () => {
        this.isStoppedSpeechRecog = true;
      };
    } else {
      console.error("Browser does not support webkitSpeechRecognition");
    }
  }

  start() {
    this.isStoppedSpeechRecog = false;
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}