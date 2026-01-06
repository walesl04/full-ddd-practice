import Order from "../../domain/checkout/entity/Order";
import OrderItem from "../../domain/checkout/entity/OrderItem";
import OrderRepositoryInterface from "../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      })),
    }, {
      include: [{ association: "items" }]
    });
  }
  
  async update(entity: Order): Promise<void> {
    const order = await OrderModel.findOne({ 
      where: { id: entity.id }, 
      include: [{ association: "items" }]
    });

    if (!order) {
      throw new Error('not found order!')
    }
    
    await OrderModel.update({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
    }, {
      where: { id: entity.id },
    });
    const idsOrderItem = order.items.map(item => item.id);

    entity.items.map(async (item) => {
      if (idsOrderItem.includes(item.id)) {
        await OrderItemModel.update({
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity
        }, { where: { id: item.id } });
      } else {
        await OrderItemModel.create({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: order.id,
        })
      }
    });
  }

  async find(id: string): Promise<Order> {
    const entity = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }]
    });
    const items = entity.items?.map((itemEntity) => {
      const orderItem = new OrderItem(itemEntity.id, itemEntity.name, itemEntity.price, itemEntity.product_id, itemEntity.quantity)
      return orderItem;
    })
    return new Order(entity.id, entity.customer_id, items)
  }

  async findAll(): Promise<Order[]> {
    const ordersModels = await OrderModel.findAll({
      include: [{ association: "items" }]
    });
    return ordersModels.map<Order>((entity): Order => {
      const items = entity.items.map((itemEntity) => {
        const orderItem = new OrderItem(itemEntity.id, itemEntity.name, itemEntity.price, itemEntity.product_id, itemEntity.quantity)
        return orderItem;
      })

      const order = new Order(entity.id, entity.customer_id, items);
      return order;
    })
  }

}