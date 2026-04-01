export function PrimaryButton({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
}) {
  return (
    <button
      type={type}
      className={`primary-button ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
