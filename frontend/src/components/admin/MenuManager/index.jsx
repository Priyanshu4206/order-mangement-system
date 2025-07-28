import { Plus, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useMenu } from "../../../hooks/useMenu";
import useStore from "../../../store";
import Alert from "../../ui/Alert";
import Button from "../../ui/Button";
import EmptyState from "../../ui/EmptyState";
import LoadingSpinner from "../../ui/LoadingSpinner";
import Modal from "../../ui/Modal";
import MenuForm from "./MenuForm";
import MenuTable from "./MenuTable";

const MenuManager = () => {
  const { menu, loading, error, addMenuItem, updateMenuItem, removeMenuItem } =
    useMenu();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const isAdmin = useStore((state) => state.isAdmin());

  const handleAdd = async (itemData) => {
    const result = await addMenuItem(itemData);
    if (result.success) {
      setShowAddModal(false);
    }
    return result;
  };

  const handleEdit = async (itemData) => {
    const result = await updateMenuItem(editingItem.id, itemData);
    if (result.success) {
      setEditingItem(null);
    }
    return result;
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?"))
      return;
    await removeMenuItem(itemId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="mb-6">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Menu Management
          </h2>
          <p className="text-muted-foreground">{menu.length} menu items</p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Menu Item
          </Button>
        )}
      </div>

      {menu.length === 0 ? (
        <EmptyState
          title="No menu items"
          description="Start by adding your first menu item"
          icon={<UtensilsCrossed className="h-12 w-12 text-muted-foreground" />}
          action={
            isAdmin && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            )
          }
        />
      ) : (
        <MenuTable
          menu={menu}
          onEdit={setEditingItem}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}

      {/* Add Menu Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Menu Item"
        size="lg"
      >
        <MenuForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Menu Item Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Menu Item"
        size="lg"
      >
        <MenuForm
          initialData={editingItem}
          onSubmit={handleEdit}
          onCancel={() => setEditingItem(null)}
        />
      </Modal>
    </div>
  );
};

export default MenuManager;
