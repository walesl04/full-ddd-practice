import EventDispatcherInterface from "../event/@shared/event-dispatcher.interface";
import CustomerChangeAddressEvent from "../event/customer/customer-change-address.event";
import type Address from "./Address";

class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = true;
  private _rewardPoints: number = 0;
  private _dispatcher: EventDispatcherInterface;

  constructor(id: string, name: string, dispatcher?: EventDispatcherInterface) {
    this._id = id;
    this._name = name;
    this._dispatcher = dispatcher;
    this.validate();
  }

  validate() {
    if (this._name.length == 0) {
      throw new Error("Name is required!");
    }
    if (this._id.length == 0) {
      throw new Error("ID is required!");
    }
  }

  get id() {
    return this._id;
  }

  get isActive() {
    return this._active;
  }

  get name() {
    return this._name;
  }

  get rewardPoints() {
    return this._rewardPoints;
  }

  set Address(address: Address) {
    this._address = address;
  }

  changeAddress(address: Address) {
    this._address = address;
    if (this._dispatcher) {
      const customerChangeAddressEvent = new CustomerChangeAddressEvent({
        id: this.id,
        name: this.name,
        address
      });
      this._dispatcher.notify(customerChangeAddressEvent);
    }
  }

  get Address() {
    return this._address;
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  activate() {
    if (!this._address) {
      throw new Error("Address is required to activate!");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }
}

export default Customer;