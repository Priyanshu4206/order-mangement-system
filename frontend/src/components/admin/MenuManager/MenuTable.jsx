import { Edit, Image as ImageIcon, Trash2 } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Table from "../../ui/Table";

const MenuTable = ({ menu, onEdit, onDelete, isAdmin }) => {
  console.log("MenuTable rendered with menu:", menu);
  const columns = [
    {
      key: "item",
      header: "Item",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="font-medium text-foreground">{item.name}</div>
            <div className="text-sm text-muted-foreground">ID: {item.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (description) => (
        <div className="max-w-xs line-clamp-2">
          {description || "No description"}
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      width: "100px",
      render: (price) => (
        <span className="font-semibold">{formatCurrency(price)}</span>
      ),
    },
    {
      key: "available",
      header: "Status",
      width: "120px",
      render: (available) => (
        <Badge variant={available ? "success" : "error"} size="sm">
          {available ? "Available" : "Unavailable"}
        </Badge>
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      key: "actions",
      header: "Actions",
      width: "150px",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="text-error hover:bg-error/10 p-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
        {menu.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description || "No description"}
                </p>
              </div>
              <Badge variant={item.available ? "success" : "error"} size="sm">
                {item.available ? "Available" : "Unavailable"}
              </Badge>
            </div>

            {item.imageUrl && (
              <div className="mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(item.price)}
              </span>

              {isAdmin && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="text-error hover:bg-error/10 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          data={menu}
          emptyMessage="No menu items found"
        />
      </div>
    </div>
  );
};

export default MenuTable;
