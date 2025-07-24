import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Popconfirm, message } from 'antd';
import useStore from '../../store';
import { addMenuItem as apiAddMenuItem, updateMenuItem as apiUpdateMenuItem, deleteMenuItem as apiDeleteMenuItem, fetchMenu } from '../../api';

function MenuManager() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, item: null });
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const token = useStore(state => state.token);
  const isAdmin = useStore(state => state.isAdmin());

  const loadMenu = async () => {
    setLoading(true);
    try {
      const resp = await fetchMenu();
      setMenu(resp.data);
    } catch (err) {
      message.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMenu(); }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      values.price = Number(values.price);
      await apiAddMenuItem(values, token);
      message.success('Menu item added');
      setModalOpen(false);
      form.resetFields();
      loadMenu();
    } catch (err) {
      message.error('Failed to add menu item');
    }
  };

  const handleEdit = (item) => {
    setEditModal({ open: true, item });
    editForm.setFieldsValue({ ...item, price: Number(item.price) });
  };

  const handleEditSave = async () => {
    try {
      const values = await editForm.validateFields();
      values.price = Number(values.price);
      await apiUpdateMenuItem(editModal.item.id, values, token);
      message.success('Menu item updated');
      setEditModal({ open: false, item: null });
      loadMenu();
    } catch (err) {
      message.error('Failed to update menu item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteMenuItem(id, token);
      message.success('Menu item deleted');
      loadMenu();
    } catch (err) {
      message.error('Failed to delete menu item');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: p => `$${p.toFixed(2)}` },
    { title: 'Available', dataIndex: 'available', key: 'available', render: v => (v ? 'Yes' : 'No') },
    isAdmin && {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ].filter(Boolean);

  return (
    <div>
      {isAdmin && (
        <Button type="primary" onClick={() => { setModalOpen(true); form.resetFields(); }} style={{ marginBottom: 16 }}>
          Add Menu Item
        </Button>
      )}
      <Table columns={columns} dataSource={menu} rowKey="id" loading={loading} pagination={false} />
      <Modal
        title="Add Menu Item"
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => setModalOpen(false)}
        okText="Add"
      >
        <Form form={form} layout="vertical" initialValues={{ available: true, price: 0 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}><Input /></Form.Item>
          <Form.Item name="description" label="Description"><Input.TextArea /></Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number', min: 0, message: 'Please enter a valid price' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="available" label="Available" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="imageUrl" label="Image URL"><Input /></Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Menu Item"
        open={editModal.open}
        onOk={handleEditSave}
        onCancel={() => setEditModal({ open: false, item: null })}
        okText="Save"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}><Input /></Form.Item>
          <Form.Item name="description" label="Description"><Input.TextArea /></Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number', min: 0, message: 'Please enter a valid price' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="available" label="Available" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="imageUrl" label="Image URL"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MenuManager; 