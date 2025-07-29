import React from 'react';

const EmptyState = ({ 
  title, 
  description, 
  icon, 
  action,
  className = '' 
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    
    // If icon is already a JSX element, render it directly
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    // If icon is a component reference, create a JSX element
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComponent = icon;
      return <IconComponent className="w-12 h-12 text-muted-foreground" />;
    }
    
    return null;
  };

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex justify-center mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;