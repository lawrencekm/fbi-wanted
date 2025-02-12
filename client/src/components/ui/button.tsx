export const Button = ({ children, variant, ...props }: { children: React.ReactNode, variant?: string }) => {
    const className = variant === "outline" ? "border border-gray-500 px-4 py-2" : "bg-blue-500 text-white px-4 py-2";
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  };
  