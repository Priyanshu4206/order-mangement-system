import create from 'zustand';
import { fetchMenu, placeOrder, login as apiLogin, getCurrentUser } from '../api';

const useStore = create((set, get) => ({
  menu: [],
  cart: [],
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  fetchMenu: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await fetchMenu();
      set({ menu: resp.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  clearCart: () => set({ cart: [] }),
  placeOrder: async (tableId) => {
    set({ loading: true, error: null });
    try {
      const items = get().cart.map((item) => ({ menuItemId: item.id, quantity: item.quantity || 1 }));
      const resp = await placeOrder({ tableId, items });
      set({ cart: [], loading: false });
      return resp;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const resp = await apiLogin(email, password);
      localStorage.setItem('token', resp.data.token);
      localStorage.setItem('user', JSON.stringify(resp.data.user));
      set({ token: resp.data.token, user: resp.data.user, loading: false });
      return resp;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
  fetchCurrentUser: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const resp = await getCurrentUser(token);
      set({ user: resp.data });
      localStorage.setItem('user', JSON.stringify(resp.data));
    } catch (err) {
      set({ error: err.message });
    }
  },
  isAdmin: () => get().user && get().user.role === 'admin',
  isKitchen: () => get().user && get().user.role === 'kitchen',
  isAuthenticated: () => !!get().token,
}));

export default useStore; 