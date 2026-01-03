export class SalesOrderItem {
    localRowId: number = 0;         
    rowID: number = 0;
    materialId: number = 0;
    gross: number = 0.00;
    tare: number = 0.00;
    net: number = 0.00;
    price: number = 0.00;
    amount: number = 0.00;
    materialNote: string = '';
    isActive: boolean = true;
    createdBy: number = 0;
    createdDate: any;
    updatedBy: number = 0;
    updatedDate: any;
    materialName: string = '';
    groupName: string = '';
}
