import type Address from "./Address.js";

class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = true;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
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