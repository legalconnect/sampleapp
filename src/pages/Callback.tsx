import { useEffect } from "react";
import { userManager } from "../AuthManager";

export default function Callback() {

  useEffect(() => {
    userManager.signinRedirectCallback().then(() => {
      window.location.href = "/";
    });
  }, []);
  return <></>;
}
