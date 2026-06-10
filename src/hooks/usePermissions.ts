export const usePermissions = () => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  console.log(permissions, "111 permisioons");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const hasPermission = (permission: string) => permissions.includes(permission);
  const hasRole = (role: string) => roles.includes(role);
  return {
    permissions,
    roles,
    hasPermission,
    hasRole,
  };
};
