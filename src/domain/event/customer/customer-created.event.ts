import EventInterface from "../@shared/event.interface";

export default class CustomerCreatedEvent implements EventInterface {
  dataTimeOcurred: Date;
  eventData: any;

  constructor(data: any) {
    this.dataTimeOcurred = new Date();
    this.eventData = data;
  }
}
