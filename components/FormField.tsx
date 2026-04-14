type FormFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  hint?: string;
  example?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  selectOptions?: { value: string; label: string }[];
  required?: boolean;
};

export default function FormField({
  id,
  label,
  placeholder,
  hint,
  example,
  value,
  onChange,
  error,
  type = "text",
  selectOptions,
  required = true,
}: FormFieldProps) {
  const baseInputClassName =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition duration-200 placeholder:text-muted/65 focus:border-navy focus:ring-4 focus:ring-navy/10";

  const textareaClassName =
    "min-h-40 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] leading-7 text-ink outline-none transition duration-200 placeholder:text-muted/65 focus:border-navy focus:ring-4 focus:ring-navy/10";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-bold text-navy">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
        {hint && (
          <span className="text-xs text-muted" title={hint}>
            ℹ️ {hint}
          </span>
        )}
      </div>

      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={textareaClassName}
        />
      ) : type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClassName}
        >
          <option value="">Seçiniz...</option>
          {selectOptions?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseInputClassName}
        />
      )}

      {example && (
        <p className="text-xs text-muted/70">
          <span className="font-semibold">Örnek:</span> {example}
        </p>
      )}

      {error && <p className="text-xs text-danger">❌ {error}</p>}
    </div>
  );
}
