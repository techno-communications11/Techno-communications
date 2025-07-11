function Button({ label, onClick, variant, icon, disabled, type = "button",code, loading, loadingLabel }) {
  return (
    <button
      onClick={onClick}
      className={`btn ${variant}  flex text-white items-center gap-2`}
      type={type}
      disabled={disabled}
      style={{backgroundColor:code}}
    >
      {icon && icon}
      {loading ? loadingLabel || "Loading..." : label}
    </button>
  );
}
export default Button