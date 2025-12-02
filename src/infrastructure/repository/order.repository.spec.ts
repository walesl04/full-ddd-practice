import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./Customer.repository";
import ProductRepository from "./Product.repository";
import OrderRepository from "./OrderRepository.repository";
import Customer from "../../domain/entity/Customer";
import Address from "../../domain/entity/Address";
import Product from "../../domain/entity/Product";
import OrderItem from "../../domain/entity/OrderItem";
import Order from "../../domain/entity/Order";

describe('Order repository test', () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: {
        force: true,
      }
    });

    await sequelize.addModels([CustomerModel, ProductModel, OrderItemModel, OrderModel]);
    await sequelize.sync();
  })

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it('should create a new order', async () => {
    const customerRespository = new CustomerRepository()
    const customer = new Customer("1", "Customer 01");
    const address = new Address("Street 01", 123, "Zipcode 01", "City 01");
    customer.Address = address
    await customerRespository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 01", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("1", "1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({ where: { id: "1" }, include: ["items"] });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customerId: "1",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          productId: orderItem.productId,
          quantity: orderItem.quantity,
          orderId: "1"
        }
      ]
    });
  });

})

