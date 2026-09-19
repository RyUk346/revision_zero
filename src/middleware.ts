export { default } from "next-auth/middleware";

// Protect every /admin route except the login page (the login page is excluded
// by the negative lookahead so unauthenticated users can reach it).
export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
