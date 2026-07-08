type ButtonProps = {
  children: React.ReactNode;
};

export function Button({ children }: ButtonProps) {
  return (
    <button
      style={{
        padding: "12px 20px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}