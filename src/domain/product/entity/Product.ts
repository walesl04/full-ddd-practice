export default class Product {
  private _id: string;
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  validate() {
    if (this._id.length == 0) {
      throw new Error("ID is required!");
    }
    if (this._name.length == 0) {
      throw new Error("Name is required!");
    }
    if (this._price <= 0) {
      throw new Error("Price must be greater than 0!");
    }
  }

  get price() {
    return this._price;
  }

  changePrice(newPrice: number) {
    this._price = newPrice
  }
}