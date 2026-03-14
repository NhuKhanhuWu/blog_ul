/** @format */

import { useEffect } from "react";
import { useAppDispatch } from "../hook/reduxHooks";
import { logoutThunk } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

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
