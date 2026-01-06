import Address from "../value-object/Address";
import Customer from "./Customer"

describe("Customer unit test", () => {
  it("should throw error when ID is empty", () => {
    expect(() => new Customer("", "name")).toThrow("ID is required!");
  })

  it("should throw error when Name is empty", () => {
    expect(() => new Customer("3211212", "")).toThrow("Name is required!");
  })

  it("should change name", () => {
    const customer = new Customer("123", "John");
    customer.changeName("Jane");
    expect(customer.name).toEqual("Jane");
  })

  it("should activate customer", () => {
    const customer = new Customer("123", "John");
    const address = new Address("rua tste", 2, "98498498", "City");
    customer.Address = address;
    customer.activate();
    expect(customer.isActive).toBeTruthy();
  })

  it("should deactivate customer", () => {
    const customer = new Customer("123", "John");
    const address = new Address("rua tste", 2, "98498498", "City");
    customer.Address = address;
    customer.deactivate();
    expect(customer.isActive).toBeFalsy();
  })

  it("should throw erro in the activate customer", () => {
    expect(() => {
      const customer = new Customer("123", "John");
      customer.activate();
    }).toThrow("Address is required to activate!");
  })
});
