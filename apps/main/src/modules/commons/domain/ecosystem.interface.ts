import { ObjectId } from 'mongodb';

export interface IEcosystemSchema {
  _id: ObjectId;
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
