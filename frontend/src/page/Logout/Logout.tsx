/** @format */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hook/shared/reduxHooks";
import { logoutThunk } from "../../redux/auth.slice";

function Logout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutThunk());
    navigate("/");
  }, [dispatch, navigate]);

  return <></>;
}

export default Logout;
