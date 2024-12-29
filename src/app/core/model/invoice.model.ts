export class Invoice {
    rowId: number = 0;
    addressID:any;
    createdBy: number = 0;
    createdDate: any;
    updatedBy: number = 0;
    updatedDate: any;
    customerId: number = 0;
    invoiceId: number = 0;
    status: string = 'OPEN';
    amount: number = 0.000;
    balanceAmount: number = 0.000;
    roundingAmount: number = 0.000;
    totalAmount: number = 0.000;
    paidAmount: number = 0.000;
    dateOpened: any;
    dateClosed: any;
    customerName: string = '';
    locID: number = 0;
    holdAmount: any;
    isSelected: boolean = false;
    voidBy: number = 0;
    voidFlag: any;
    voidReason: any;
    voidDate: any;
    buyerSignature: any;
    lstttransactionMasterDTO: any;
}
