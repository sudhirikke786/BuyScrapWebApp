

import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
@Component({
  selector: 'app-superadmin-feedback',
  templateUrl: './superadmin-feedback.component.html',
  styleUrls: ['./superadmin-feedback.component.css']
  
})
export class SuperadminFeedbackComponent implements OnInit{
  getFeedbackSuggestions: any[] = [];
  

 

  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private fb:FormBuilder,
    private messageService: MessageService,
    private stroarge:StorageService,) { }
    
  ngOnInit() {
    this.getFeedbackSuggestionsDetails();
  }

  getFeedbackSuggestionsDetails() {
    const paramObj = {

    };
    this.commonService.getFeedbackSuggestions(paramObj).subscribe(
      (data) => {
        this.getFeedbackSuggestions = data.body.data.filter((item: any) => 
        item.contentType === 'Feedback'
        );
      },
      (error) => {
        console.error('Error fetching Feedback:', error);
      }
    );
  }
  
  back(){
    this.router.navigateByUrl(`/superadmin/home`);
  }
}
