import Product from "./Product";

describe("product unit test", () => {
  it("should throw error when ID is empty", () => {
    expect(() => new Product("", "lapis", 2.5)).toThrow("ID is required!");
  })

  it("should throw error when Name is empty", () => {
    expect(() => new Product("123", "", 2.5)).toThrow("Name is required!");
  })

  it("should throw error when Price is empty", () => {
    expect(() => new Product("123", "lapis", 0)).toThrow("Price must be greater than 0!");
  })
});
