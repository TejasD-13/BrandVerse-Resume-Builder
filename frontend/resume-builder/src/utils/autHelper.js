export const logoutAndRedirect = () => {
  // Remove token cookie
  document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
  window.dispatchEvent(new Event("forceLogout")); // 👈 triggers UserProvider cleanup
  window.location.href = "/";
};
