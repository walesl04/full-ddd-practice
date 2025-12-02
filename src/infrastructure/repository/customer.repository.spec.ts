import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "src/domain/entity/Customer";
import Address from "src/domain/entity/Address";
import CustomerRepository from "./Customer.repository";

describe('Customer repository test', () => {

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

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  })

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it('should create a customer', async () => {
    const customerRespository = new CustomerRepository();
    const customer = new Customer("1", "Customer 01");
    const address = new Address("Street 01", 123, "Zipcode 01", "City 01");
    customer.Address = address
    await customerRespository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: '1' } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: '1',
      name: 'Customer 01',
      street: address.street,
      number: address.number,
      zipcode: address.zip,
      city: address.city,
      active: customer.isActive,
      rewardPoints: customer.rewardPoints,
    });
  })

  it('should update a customer', async () => {
    const customerRespository = new CustomerRepository();
    const customer = new Customer("1", "Customer 01");
    const address = new Address("Street 01", 123, "Zipcode 01", "City 01");
    customer.Address = address
    await customerRespository.create(customer);

    customer.changeName("Customer 02");
    const address2 = new Address("Street 02", 456, "Zipcode 02", "City 02");
    customer.Address = address2;
    customer.activate();
    customer.addRewardPoints(10);

    await customerRespository.update(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: '1' } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: '1',
      name: 'Customer 02',
      street: address2.street,
      number: address2.number,
      zipcode: address2.zip,
      city: address2.city,
      active: customer.isActive,
      rewardPoints: customer.rewardPoints,
    });
  })
  it('should find a customer', async () => {
    const customerRespository = new CustomerRepository();
    const customer = new Customer("1", "Customer 01");
    const address = new Address("Street 01", 123, "Zipcode 01", "City 01");
    customer.Address = address
    await customerRespository.create(customer);

    const foundCustomer = await customerRespository.find("1");

    expect(foundCustomer).toStrictEqual(customer);
  })

  it('should throw an error when customer is not found', async () => {
    const customerRespository = new CustomerRepository();

    expect(async () => {
      await customerRespository.find("999");
    }).rejects.toThrow("Customer not found");
  });
  it('should find all customer', async () => {
    const customerRespository = new CustomerRepository();
    const customer1 = new Customer("1", "Customer 01");
    const address1 = new Address("Street 01", 123, "Zipcode 01", "City 01");
    customer1.Address = address1
    await customerRespository.create(customer1);

    const customer2 = new Customer("2", "Customer 02");
    const address2 = new Address("Street 02", 456, "Zipcode 02", "City 02");
    customer2.Address = address2
    await customerRespository.create(customer2);

    const customers = await customerRespository.findAll();

    expect(customers).toHaveLength(2);
    expect(customers).toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);
  });
})

