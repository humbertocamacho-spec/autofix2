export interface Ticket {
    id: number;
    client_id: number;
    client_fullname?: string;
    car_id: number;
    car_name?: string;
    partner_id: number;
    partner_name?: string;
    partner_phone?: string;
    logo_url?: string;
    date: string;
    notes?: string;
}