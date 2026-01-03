import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
@Component({
  selector: 'app-superadmin-suggestion',
  templateUrl: './superadmin-suggestion.component.html',
  styleUrls: ['./superadmin-suggestion.component.css']
})
export class SuperadminSuggestionComponent implements OnInit{
getSuggestions: any [] =[];

constructor(private route:ActivatedRoute,
  private router: Router,
    public commonService: CommonService,){

}

ngOnInit(){
this.getSuggestionsDetails();
}

getSuggestionsDetails(){
  const paramObj = {};
  this.commonService.getFeedbackSuggestions(paramObj).subscribe(
    (data) =>{
      this.getSuggestions = data.body.data.filter((item:any) =>
      item.contentType === 'Suggestion'
      );
    },
    (error) => {
      console.error('Error fetching Suggestion:', error);
    }
  );
}
}
