export interface Users{
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    events?: { [key: string]: Event };
    receivedInvitations?: Invitation[];
    sentInvitations?: Invitation[]; 
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
    invitations?: Invitation[];
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

  export interface Invitation {
    inviteeEmail: string;   
    inviteeName?: string;   
    status: 'pending' | 'accepted' | 'rejected';
    sentBy: string;        
    sentAt: Date;           
    responseAt?: Date;     
    eventId: string;
  }
  