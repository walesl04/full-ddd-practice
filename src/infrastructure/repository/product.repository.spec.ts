import { Sequelize } from "sequelize-typescript";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./Product.repository";
import Product from "../../domain/entity/Product";

describe('Product repository test', () => {

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

    await sequelize.addModels([ProductModel]);
    await sequelize.sync(); // para criar as tabelas e relacionamentos automatico apos informar os models
  })

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it('should create a product', async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 01", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: '1' } });
    expect(productModel.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 01',
      price: 100
    })
  })

  it('should update a product', async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 01", 100);

    await productRepository.create(product);

    product.changePrice(150);
    await productRepository.update(product);

    const productModel = await ProductModel.findOne({ where: { id: '1' } });
    expect(productModel.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 01',
      price: 150
    })
  })
  it('should find a product', async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 01", 100);

    await productRepository.create(product);

    const foundProduct = await productRepository.find("1");

    expect(foundProduct).toStrictEqual(new Product("1", "Product 01", 100));  
  })
  it('should find a product', async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product 01", 100);
    const product2 = new Product("2", "Product 02", 200);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const products = await productRepository.findAll();

    expect(products).toHaveLength(2);
    expect(products).toContainEqual(new Product("1", "Product 01", 100));
    expect(products).toContainEqual(new Product("2", "Product 02", 200));
  });
})

