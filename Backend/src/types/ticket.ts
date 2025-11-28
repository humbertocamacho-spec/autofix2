export interface Ticket {
    id?: number;
    client_id: number;
    car_id: number;
    partner_id: number;
    date: string;     
    notes?: string;
}
