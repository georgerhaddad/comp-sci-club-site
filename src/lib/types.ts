export interface ILocation {
  street: string;
  city: string;
  state: string;
  zip: number;
  country: string;
}

export interface IEvent {
  title: string;
  description: string;
  dateStart: Date;
  dateEnd?: Date;
  location: ILocation
  id: string;
  src: string;
  isFeatured: boolean;
}
