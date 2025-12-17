export interface PendingTicket {
    id: number;

    client_id: number;
    client_name?: string;

    car_id: number;
    car_name?: string;

    partner_id: number;
    partner_name?: string;
    partner_phone?: string;
    logo_url?: string;

    date: string;
    time?: string;
    notes?: string;
}