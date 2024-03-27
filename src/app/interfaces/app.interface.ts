export interface IApp {
  id: string;
  name: string;
  description: string;
  url: string;
  extra: {
    image?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
