import { createFileRoute } from "@tanstack/react-router";

import { PermissionsPage } from "@/features/permissions/pages/PermissionsPage";

export const Route = createFileRoute("/_app/permissions/")({
  component: PermissionsPage,
});
