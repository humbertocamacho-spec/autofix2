export interface Partner {
    id: number;
    user_id: number;
    name: string;
    whatsapp: string;
    phone: string;
    location: string;
    latitude: string;
    longitude: string;
    land_use_permit: boolean;
    scanner_handling: boolean;
    logo_url: string;
    description?: string;
    priority: number;
    distance?: number;
    services?: string[];
    deleted_at?: string | null;
    specialities?: string;
}