function Button({ label, onClick, variant, icon, disabled, type = "button", loading, loadingLabel }) {
  return (
    <button
      onClick={onClick}
      className={`btn ${variant} text-white flex items-center gap-2`}
      type={type}
      disabled={disabled}
    >
      {icon && icon}
      {loading ? loadingLabel || "Loading..." : label}
    </button>
  );
}
export default Button