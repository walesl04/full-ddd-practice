import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

interface EventHandlerList {
  [eventName: string]: EventHandlerInterface[]
}

export default class EventDispatcher implements EventDispatcherInterface {

  private eventHandlers: EventHandlerList = {};

  get getEventHandlers(): EventHandlerList {
    return this.eventHandlers;
  }

  notify(event: EventInterface): void {
    const eventName = event.constructor.name;
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName].forEach((eventHandler) => {
        eventHandler.handle(event)
      })
    }
  }

  register(eventName: string, eventhandler: EventHandlerInterface): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(eventhandler);
  }

  unregister(eventName: string, eventhandler: EventHandlerInterface): void {
    const handlersEvent = this.eventHandlers[eventName]
    if (handlersEvent) {
      const index = handlersEvent.indexOf(eventhandler);
      if (index !== -1) {
        this.eventHandlers[eventName].splice(index, 1);
      }
    }
  }

  unregisterAll(): void {
    this.eventHandlers = {};
  }
}