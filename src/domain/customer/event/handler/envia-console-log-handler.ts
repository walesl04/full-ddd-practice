import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerChangeAddressEvent> {
  handle(event: CustomerChangeAddressEvent): void {
    const data = event.eventData;
    console.log(`Endereço do cliente: ${data.id}, ${data.name} alterado para: ${data.address.fullAddress}`)
  }
}
