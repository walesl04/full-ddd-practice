import Address from "../../entity/Address";
import Customer from "../../entity/Customer";
import CustomerChangeAddressEvent from "../customer/customer-change-address.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import EnviaConsoleLog2Handler from "../customer/handler/envia-console-log-1-handler";
import EnviaConsoleLog1Handler from "../customer/handler/envia-console-log-2-handler";
import EnviaConsoleLogHandler from "../customer/handler/envia-console-log-handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created-handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe('Domain events tests', () => {
  
  it('should register an event handler', () => {
    
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined();
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(1);
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].at(0)).toMatchObject(eventHandler);
    
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].at(0)).toMatchObject(eventHandler);

    eventDispatcher.unregister('ProductCreatedEvent', eventHandler);
    
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined();
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(0);

  });

  it('should unregister all event handler', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].at(0)).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyHandler = jest.spyOn(eventHandler, 'handle')

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].at(0)).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'Product 01',
      description: 'Product 01 description',
      price: 10.0
    });

    eventDispatcher.notify(productCreatedEvent);

    expect(spyHandler).toHaveBeenCalled();
  })

  // -------------------------------------------------------

  it('should notify customer handlers new customer created', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const spyHandler1 = jest.spyOn(eventHandler1, 'handle')
    const spyHandler2 = jest.spyOn(eventHandler2, 'handle')

    eventDispatcher.register('CustomerCreatedEvent', eventHandler1);
    eventDispatcher.register('CustomerCreatedEvent', eventHandler2);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].at(0)).toMatchObject(eventHandler1);
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].at(1)).toMatchObject(eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: 1,
      name: 'Customer name',
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyHandler1).toHaveBeenCalled();
    expect(spyHandler2).toHaveBeenCalled();
  })

  // Abordagem básica UM
  it('should notify customer change address', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyHandler = jest.spyOn(eventHandler, 'handle')

    eventDispatcher.register('CustomerChangeAddressEvent', eventHandler);

    // O ideal aqui, seria isso ser tratado por uma Service junto a um broker de eventos, por isso que no exemplo foi usado um eventmitter2
    // e mesmo assim, no exemplo também foi necessário criar um service para chamar o publish dos eventos para notificar
    const customer = new Customer("123", "John");
    const address = new Address("rua tste", 2, "98498498", "City");
    customer.changeAddress(address);

    expect(eventDispatcher.getEventHandlers['CustomerChangeAddressEvent'].at(0)).toMatchObject(eventHandler);

    const customerChangeAddressEvent = new CustomerChangeAddressEvent({
      id: customer.id,
      name: customer.name,
      address
    });

    eventDispatcher.notify(customerChangeAddressEvent);

    expect(spyHandler).toHaveBeenCalled();
  })

  // Abordagem básica DOIS
  it('should notify customer change address with method with coupling', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyHandler = jest.spyOn(eventHandler, 'handle')

    eventDispatcher.register('CustomerChangeAddressEvent', eventHandler);

    // Para facilitar o uso, passamos a instancia do dispatcher para o customer informar quando e quais eventos deve ser disparado
    // mais uma vez, essa lógica não deveria está no Customer como pede no desafio, e sim em um Service.
    const customer = new Customer("123", "John", eventDispatcher);
    const address = new Address("rua teste", 2, "98498498", "City");
    customer.changeAddress(address);

    expect(eventDispatcher.getEventHandlers['CustomerChangeAddressEvent'].at(0)).toMatchObject(eventHandler);

    expect(spyHandler).toHaveBeenCalled();
  })

})
