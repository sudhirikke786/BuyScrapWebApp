export class PurchaseOrder {
    rowID: number = 0;
    customerID: number = 0;
    locID: number = 0;
    status: string = 'PENDING';
    totalAmount: number = 0.00;
    createdBy: number = 0;
    updatedBy: number = 0;
    createdDate: any;
    updatedDate: any;
    customerName: string = '';
     carrier: string = ''
    driverlicense: string = ''
    licenseplate: string = ''
    truck: string = '';
    make: string = '';
    model: string = '';
    driverName: string = '';
    note: string = '';
    lstPurchaseOrderMaterials: any;
}
