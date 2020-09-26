export interface PlanillaInfo {
  trip:string;
  price_online: number;
  type_bus: string;
  planta_alta: Array<any>;
  planta_baja: Array<any>;
  departure_time:string,
  departure_date:any,
  terminal_origin:string,
  terminal_destination:string,
  carril:string,
  ocupados : number,
}
