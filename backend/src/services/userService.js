import userRepository from '../data/repositories/userRepository.js';
import bcrypt from 'bcryptjs';

class UserService {
  async register({ name, email, password, role }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('User already exists');
    const hashed = await bcrypt.hash(password, 10);
    return userRepository.create({ name, email, password: hashed, role });
  }

  async authenticate(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    return user;
  }

  async getById(id) {
    return userRepository.findById(id);
  }
}

export default new UserService(); 