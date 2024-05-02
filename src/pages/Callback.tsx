import { useEffect } from "react";
import { userManager } from "../AuthManager";
import { useLocation } from "react-router-dom";

export default function Callback() {
  const { state } = useLocation();
  useEffect(() => {
    userManager.signinRedirectCallback().then(() => {
      window.location.href = "/";
    });
  }, []);
  return <></>;
}
