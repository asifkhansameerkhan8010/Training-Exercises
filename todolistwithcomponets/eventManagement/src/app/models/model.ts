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
    agenda?:Agenda;
  }

  export interface Agenda{
    agenda:string;
    start:string;
    end:string;
  }
  
  export interface Guest{
    id:string;
    name:string;
    email:string;
    guestrsvp:string;
  }