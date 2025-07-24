import orderRepository from '../data/repositories/orderRepository.js';

class OrderService {
  async placeOrder({ tableId, items }) {
    // Add business logic/validation here if needed
    return orderRepository.create({ tableId, items });
  }

  async getAllOrders() {
    return orderRepository.getAll();
  }

  async updateOrderStatus(id, status) {
    // Add business logic/validation here if needed
    return orderRepository.updateStatus(id, status);
  }

  async updateOrderPayment(id, { paymentStatus, paymentMethod }) {
    // Set paymentTimestamp if paid
    const paymentTimestamp = paymentStatus === 'paid' ? new Date() : null;
    return orderRepository.updatePayment(id, { paymentStatus, paymentMethod, paymentTimestamp });
  }

  async deleteOrder(id) {
    return orderRepository.delete(id);
  }
}

export default new OrderService(); 