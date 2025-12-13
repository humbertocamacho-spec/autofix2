export interface User {
  id: number;
  name: string;
  email: string;
  password: string; 
  phone: string;
  address: string | null; 
  role_id: number;
  photo_url: string | null; 
  gender_id: number | null; 
  role_name: string;
}