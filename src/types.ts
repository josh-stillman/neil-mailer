import { ObjectId } from 'bson';

export interface User {
  _id: ObjectId;
  email: string;
  createdAt: string;
  confirmed: boolean;
}
