import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./Customer.repository";
import ProductRepository from "./Product.repository";
import OrderRepository from "./OrderRepository.repository";
import Address from "../../domain/customer/value-object/Address";
import OrderItem from "../../domain/checkout/entity/OrderItem";
import Order from "../../domain/checkout/entity/Order";
import Customer from "../../domain/customer/entity/Customer";
import Product from "../../domain/product/entity/Product";

async function auxRepoCreateOrder() {
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
  return { order, orderItem, product, address, customer, orderRepository }
}

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
    const { order, orderItem } = await auxRepoCreateOrder();

    const orderModel = await OrderModel.findOne({ where: { id: "1" }, include: ["items"] });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
          order_id: "1"
        }
      ]
    });
  });

  it('should update a order', async () => {
    const { order, orderRepository } = await auxRepoCreateOrder();
    const productRepository = new ProductRepository();
    const product = new Product("2", "Product 02", 85);
    await productRepository.create(product);

    order.items.push(new OrderItem('2', product.name, product.price, product.id, 2));
    await orderRepository.update(order);

    const orderModel = await orderRepository.find(order.id);
    expect(orderModel).toStrictEqual(order);
  })

  it('should find a order', async () => {
    const { order, orderRepository } = await auxRepoCreateOrder();

    const orderModel = await orderRepository.find("1");

    expect(orderModel).toStrictEqual(order);
  })

  it('should find all orders', async () => {
    const { order: order1, customer, orderRepository } = await auxRepoCreateOrder();

    const productRepository = new ProductRepository();
    const product = new Product("2", "Product 02", 85);
    await productRepository.create(product);

    const order2Item = new OrderItem("2", product.name, product.price, product.id, 2);
    const order2 = new Order("2", customer.id, [order2Item]);
    await orderRepository.create(order2)

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  })

})

