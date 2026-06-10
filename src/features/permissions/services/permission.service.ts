import * as permissionApi from "../api/permission.api";

export const permissionService = {
  createPermisson: permissionApi.createPermission,
  getPermissions: permissionApi.getPermissions,
};
