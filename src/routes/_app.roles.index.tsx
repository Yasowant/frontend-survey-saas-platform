import { createFileRoute } from "@tanstack/react-router";
import { RolesPage } from "@/features/roles/pages/RolesPage";

export const Route = createFileRoute("/_app/roles/")({
  component: RolesPage,
});
