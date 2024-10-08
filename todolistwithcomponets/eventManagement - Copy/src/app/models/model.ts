export interface Users{
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    events?: { [key: string]: Event };
}

export interface Event {
    id: string;  
    title: string;
    date: string;
    location: string;
    description?: string;
    status: string;
    category: string;
    guests?: Guest[];
  }
  
  export interface Guest{
    id:string;
    name:string;
    email:string;
    guestrsvp:string;
  }