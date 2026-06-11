import * as roleApi from "../api/role.api";

export const roleService = {
  createRoles: roleApi.createRoles,
  getRoles: roleApi.getRoles,
  getRoleById: roleApi.getRoleById,
  updateRoleById: roleApi.updateRoleById,
  deleteRoleById: roleApi.deleteRoleById,
};
