import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class MessageServiceService {

  constructor(private messageService: MessageService,) { }


showSuccess(msg:any) {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
}

showInfo(msg:any) {
    this.messageService.add({severity:'info', summary: 'Info', detail: 'Message Content'});
}

showWarn(msg:any) {
    this.messageService.add({severity:'warn', summary: 'Warn', detail: 'Message Content'});
}

showError(msg:any) {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Message Content'});
}
}
