export class TicketDocument {
    rowID: number = 0;
    itemRowID: number = 0;
    itemLocalID: number = 0;
    ticketID: number = 0;
    locID: number = 0;
    materialID: number = 0;
    itemMaterialID: number = 0;
    description: string = '';
    images: string = '';
    materialImages: string = '';
    createdBy: number = 0;
    createdDate: any;
    updatedBy: number = 0;
    updatedDate: any;
    isDeleted: boolean = false;
}
