import { useState, useEffect } from "react";
import { fetchMenu, addMenuItem, updateMenuItem, deleteMenuItem } from "../api";
import useStore from "../store";

export const useMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useStore((state) => state.token);

  const loadMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMenu();
      setMenu(response.data);
    } catch (err) {
      setError("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const addMenuItemHandler = async (itemData) => {
    try {
      await addMenuItem(itemData, token);
      await loadMenu();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to add menu item" };
    }
  };

  const updateMenuItemHandler = async (itemId, itemData) => {
    try {
      await updateMenuItem(itemId, itemData, token);
      await loadMenu();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to update menu item" };
    }
  };

  const removeMenuItem = async (itemId) => {
    try {
      await deleteMenuItem(itemId, token);
      await loadMenu();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to delete menu item" };
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  return {
    menu,
    loading,
    error,
    loadMenu,
    addMenuItem: addMenuItemHandler,
    updateMenuItem: updateMenuItemHandler,
    removeMenuItem,
  };
};
