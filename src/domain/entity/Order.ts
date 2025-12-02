import type OrderItem from "./OrderItem.js";

class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[] = [];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    console.log('customerId', this._customerId.length);
    this.validate();
    this._total = this.total();
  }

  get id() {
    return this._id;
  }

  get customerId() {
    return this._customerId;
  }

  get items() {
    return this._items;
  }

  validate() {
    if (this._customerId.length == 0) {
      console.log('chamou o throw')
      throw new Error("CustomerID is required!");
    }
    if (this._id.length == 0) {
      throw new Error("ID is required!");
    }
    if (this._items.length == 0) {
      throw new Error("Items must be greater than 0!");
    }
  }

  total() {
    return this._items.reduce((acc, item) => acc + item.total(), 0)
  }
}
export default Order;