export interface Weather {
  id?: string;
  backId?: string;
  name?: string;
  key?: number;
  day: string;
  image?: string;
  temp: number;
  status: string;
}

export interface Favorite {
  key: number,
  name:string
}
