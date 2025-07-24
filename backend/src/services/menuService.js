import menuRepository from '../data/repositories/menuRepository.js';

class MenuService {
  async getAllMenuItems() {
    return menuRepository.getAll();
  }

  async getMenuItemById(id) {
    return menuRepository.getById(id);
  }

  async createMenuItem(data) {
    // Add business logic/validation here if needed
    return menuRepository.create(data);
  }

  async updateMenuItem(id, data) {
    // Add business logic/validation here if needed
    return menuRepository.update(id, data);
  }

  async deleteMenuItem(id) {
    return menuRepository.delete(id);
  }
}

export default new MenuService(); 