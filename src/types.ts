import { ObjectId } from 'bson';

export interface User {
  name?: string;
  _id: ObjectId;
  email: string;
  createdAt: string;
  confirmed: boolean;
  phoneNumber?: string;
}

export interface EmailDetails {
  subject: string;
  imgLink: string;
  header: string;
  body: string;
  showTime: string;
  calendarLink: string;
  venue: string;
  mapLink: string;
}
