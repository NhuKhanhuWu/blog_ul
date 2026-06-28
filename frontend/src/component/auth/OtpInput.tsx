/** @format */

// src/components/auth/OtpInputField.tsx
import React, { useRef } from "react";
import {
  useController,
  Control,
  FieldValues,
  PathValue,
  Path,
} from "react-hook-form";
import styles from "./AuthInput.module.scss";

interface OtpInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  length?: number;
}

function OtpInputField<T extends FieldValues>({
  name,
  control,
  length = 6,
}: OtpInputFieldProps<T>) {
  // Connect this component to React Hook Form's state via useController
  const {
    field: { value = "", onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: "" as PathValue<T, Path<T>>,
  });

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Convert the string value from form state into an array of characters
  const otpArray = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // Numeric only
    if (!val) return;

    const newOtpArray = [...otpArray];
    // Take only the last character if someone inputs multiple characters in one box
    newOtpArray[index] = val.substring(val.length - 1);
    const combinedValue = newOtpArray.join("");
    onChange(combinedValue);

    // Auto-focus next input box
    if (index < length - 1 && val) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      const newOtpArray = [...otpArray];

      if (!otpArray[index] && index > 0) {
        // If current field is already empty, clear the previous box and move focus back
        newOtpArray[index - 1] = "";
        onChange(newOtpArray.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current box
        newOtpArray[index] = "";
        onChange(newOtpArray.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      // Focus the last filled box or the very last input box
      const focusIndex =
        pastedData.length === length ? length - 1 : pastedData.length;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <>
      <div className={styles.optContainer}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={otpArray[index] || ""}
            onChange={(e) => handleInputChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={styles.otpCell}
          />
        ))}
      </div>
      {error && <span className="error-mgs">{error.message}</span>}
    </>
  );
}

export default OtpInputField;
