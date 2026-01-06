import Product from "../entity/Product";
import ProductService from "./product.service";

describe("Product service unit tests", () => {
  it("should change the prices of all products", () => {
    const p1 = new Product("123", "P1", 10);
    const p2 = new Product("124", "P2", 20);
    const prds = [p1, p2];

    ProductService.increasePrice(prds, 100);

    expect(p1.price).toBe(20);
    expect(p2.price).toBe(40);
  })
});
