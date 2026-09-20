/** @format */

import { useMutation } from "@tanstack/react-query";
import { updateAccount } from "../../api/user.api";

function useUpdateAccount() {
  return useMutation({
    mutationFn: updateAccount,
  });
}

export default useUpdateAccount;
