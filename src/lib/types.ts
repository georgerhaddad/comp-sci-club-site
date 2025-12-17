export interface ILocation {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
}

export interface IEvent {
  id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd?: Date;
  image: string;
  onlineUrl?: string;
  onlinePlatform?: string;
  isFeatured?: boolean;
  location?: ILocation;
}

