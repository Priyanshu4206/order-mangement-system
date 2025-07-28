import { LoaderCircle } from "lucide-react";

const LoadingSpinner = ({ message = "Loading...", size = 48 }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoaderCircle
        size={size}
        className="text-primary-500 animate-spin mb-4"
      />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
