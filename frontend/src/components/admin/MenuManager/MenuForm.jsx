import {
  DollarSign,
  FileText,
  Image as ImageIcon,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Switch from "../../ui/Switch";

const MenuForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    available: initialData?.available ?? true,
    imageUrl: initialData?.imageUrl || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) < 0
    ) {
      newErrors.price = "Valid price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await onSubmit({
      ...formData,
      price: Number(formData.price),
    });

    if (!result.success) {
      setErrors({ submit: result.error });
    }
    setIsSubmitting(false);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Item Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Enter item name"
            error={!!errors.name}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Enter item description"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Price *
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="0.00"
            error={!!errors.price}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-error">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <ImageIcon className="inline h-4 w-4 mr-1" />
            Image URL
          </label>
          <Input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <label className="text-sm font-medium text-foreground">
                Available for Order
              </label>
              <p className="text-sm text-muted-foreground">
                Toggle to make this item available to customers
              </p>
            </div>
            <Switch
              checked={formData.available}
              onChange={(checked) => updateField("available", checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Item"
            : "Add Item"}
        </Button>
      </div>
    </form>
  );
};

export default MenuForm;
