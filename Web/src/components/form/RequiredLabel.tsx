import type { RequiredLabelProps } from "../../types/required_label";

// Required label component
export function RequiredLabel({
  children,
  required = false,
}: RequiredLabelProps) {
  return (
    <label className="text-sm font-semibold text-gray-600 mb-1 block">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}