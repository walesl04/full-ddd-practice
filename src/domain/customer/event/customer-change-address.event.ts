import EventInterface from "../../@shared/event/event.interface";

export default class CustomerChangeAddressEvent implements EventInterface {
  dataTimeOcurred: Date;
  eventData: any;

  constructor(data: any) {
    this.dataTimeOcurred = new Date();
    this.eventData = data;
  }
}
