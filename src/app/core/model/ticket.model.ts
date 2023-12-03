export class Ticket {
    rowId: number = 0;
    createdBy: number = 0;
    createdDate: any;
    updatedBy: number = 0;
    updatedDate: any;
    customerId: number = 0;
    ticketId: number = 0;
    status: string = 'OPEN';
    amount: number = 0.000;
    balanceAmount: number = 0.000;
    roundingAmount: number = 0.000;
    ticketAmount: number = 0.000;
    paidAmount: number = 0.000;
    dateOpened: any;
    dateClosed: any;
    customerName: string = '';
    user: any;
    adjustmentAmount: number = 0.000;
    adjustmentNote: any;
    locID: number = 0;
    holdAmount: any;
    voidBy: number = 0;
    parentTicketID: any;
    voidFlag: any;
    flagCustomer: boolean = false;
    isParent: boolean = false;
    isSelected: boolean = false;
    voidReason: any;
    voidDate: any;
    isCOD: boolean = false;
    isCODDone: boolean = false;
    codDoneDate: any;
    codDescription: any;
    sellerSignature: any;
    lstttransactionMasterDTO: any;
}
