import Order from "./Order";
import OrderItem from "./OrderItem";

describe("Order unit test", () => {
  it("should throw error when ID is empty", () => {
    expect(() => new Order("", "1232", [])).toThrow("ID is required!");
  })

  it("should throw error when CustomerID is empty", () => {
    expect(() => new Order("321321", "", [])).toThrow("CustomerID is required!");
  })

  it("should throw error when Items is empty", () => {
    expect(() => new Order("123", "321321", [])).toThrow("Items must be greater than 0!");
  })
});
