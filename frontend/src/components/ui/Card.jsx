import { cn } from "../../utils/cn";

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
