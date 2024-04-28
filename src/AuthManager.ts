import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import authConfig from "./authConfig";

export const userManager = new UserManager({
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  ...authConfig,
});

export const authorize = () => {
  userManager.signinRedirect({ state: "a2123a67ff11413fa19217a9ea0fbad5" });
};
