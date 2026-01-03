import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MessageService, ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-feed-back-suggestion',
  templateUrl: './feed-back-suggestion.component.html',
  styleUrls: ['./feed-back-suggestion.component.css']
})
export class FeedBackSuggestionComponent implements OnInit {
  feedbackForm: FormGroup = this.initForm();
  orgName: any;
  userObj: any;
  isSubmitting = false;
  locationName: string = '';
  logInUserId: any;
  selectedContentType: string = 'Feedback';


  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public commonService: CommonService,
    private stroarge: StorageService,
    private messageService: MessageService

    ) {}

  ngOnInit(): void {
    this.orgName = localStorage.getItem('orgName');
    this.locationName = localStorage.getItem('locationName') || '';
    this.logInUserId = this.commonService.getNumberFromLocalStorage(this.stroarge.getLocalStorage('userObj').userdto?.rowId);


    const userData = localStorage.getItem('userObj');
    if (userData) {
      this.userObj = JSON.parse(userData);
      
      if (this.userObj && this.userObj.userdto) {
        this.feedbackForm.patchValue({
          userName: this.userObj.userdto.userName || this.userObj.userdto.firstName + ' ' + this.userObj.userdto.lastName,
          userMailId: this.userObj.userdto.emailID
        });
      }
    }
  }

  private initForm(): FormGroup {
    return this.fb.group({
      userName: ['', Validators.required],
      userMailId: ['', [Validators.required, Validators.email]],
      feedback: ['', Validators.required]
    });
  }

  submitFeedback(): void {
    if (this.feedbackForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const requestObj = {
        rowId: 0,
        createdBy: this.logInUserId,
        createdDate: new Date().toISOString(),
        updatedBy: this.logInUserId,
        updatedDate: new Date().toISOString(),
        organisationName: this.orgName || '',
        username: this.feedbackForm.value.userName,
        locationName: this.locationName,
        contentType: this.selectedContentType,
        content: this.feedbackForm.value.feedback,
        userMailId: this.feedbackForm.value.userMailId,
        isRespondMailSent: false
      };
      
      this.commonService.InsertUpdateFeedbackandSuggestions(requestObj).subscribe({
        next: (response) => {
          this.feedbackForm.reset();
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'FeedBack/Suggestion Inserted successfully' });
          this.selectedContentType = 'Feedback';
          this.router.navigate([`/${this.orgName}/home`]);
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.feedbackForm.controls).forEach(key => {
        const control = this.feedbackForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
