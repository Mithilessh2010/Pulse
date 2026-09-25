type AuthFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  rightElement?: React.ReactNode;
  onChange: (value: string) => void;
};

export default function AuthField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  rightElement,
  onChange,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium text-[#AEB4AF]">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-[#F4F1EA] outline-none transition placeholder:text-[#3E4D68] focus:border-[#2F7D68]/70 focus:bg-white/[0.055] focus:shadow-[0_0_0_3px_rgba(47,125,104,0.14)] ${
            rightElement ? "pr-12" : ""
          }`}
        />
        {rightElement ? (
          <div className="absolute inset-y-0 right-2 flex items-center">{rightElement}</div>
        ) : null}
      </div>
    </label>
  );
}
