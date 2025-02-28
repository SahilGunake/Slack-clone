export function Input({ value, onChange, placeholder, type = 'text', name, className = '' }) {
    return (
      <input
        value={value}
        onChange={onChange}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`p-2 border rounded-lg w-full ${className}`}
        required
      />
    );
  }
  
  export default Input;