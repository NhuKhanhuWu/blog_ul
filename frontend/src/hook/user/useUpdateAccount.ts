/** @format */

import { useMutation } from "@tanstack/react-query";
import { updateAccount } from "../../api/user.api";
import { useAppDispatch } from "../shared/reduxHooks";
import { getMeThunk } from "../../redux/auth.slice";

function useUpdateAccount() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: updateAccount,

    onSuccess: async () => {
      // Immediately synchronize the user state in Redux
      await dispatch(getMeThunk());
    },
  });
}

export default useUpdateAccount;
