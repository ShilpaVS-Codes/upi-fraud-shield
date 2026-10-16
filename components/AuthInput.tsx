type AuthInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  secret?: boolean;
  maxLength?: number;
};

export default function AuthInput({
  label,
  value,
  onChange,
  placeholder,
  secret = false,
  maxLength,
}: AuthInputProps) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-900 mb-1">
        {label}
      </span>
      <input
        type={secret ? "password" : "tel"}
        inputMode="numeric"
        autoComplete="off"
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-safepay-purple tracking-widest placeholder:tracking-normal placeholder:text-gray-300"
      />
    </label>
  );
}