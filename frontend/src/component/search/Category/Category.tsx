/** @format */

import { useFormContext } from "react-hook-form";
import { ICategoryInput, TSearchFormValues } from "../../../types/search.type";

const MAX_CATEGORY = 5;

export function Category({ category, selectedIds }: ICategoryInput) {
  const { setValue, setError, clearErrors } =
    useFormContext<TSearchFormValues>();
  const isChecked = selectedIds.includes(category._id);

  const handleChange = () => {
    if (selectedIds.length >= MAX_CATEGORY) {
      setError("categories", {
        type: "max",
        message: "You can only select up to 5 categories at a time",
      });
      return;
    }

    if (isChecked) {
      // Nếu đang chọn thì bỏ chọn
      setValue(
        "categories",
        selectedIds.filter((id) => id !== category._id),
      );
    } else {
      // Nếu chưa chọn thì thêm vào
      setValue("categories", [...selectedIds, category._id]);
      clearErrors("categories");
    }
  };

  return (
    <div className="checkbox">
      <input
        id={category._id}
        type="checkbox"
        value={category._id}
        // make sure checkbox always in right state when search
        checked={isChecked}
        onChange={handleChange}
      />
      <label htmlFor={category._id}>{category.name}</label>
    </div>
  );
}
