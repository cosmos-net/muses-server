export interface IProjectSchema {
  id: string;
  name: string;
  description: string;
  ecosystem: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
