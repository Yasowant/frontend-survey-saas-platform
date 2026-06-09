import { UsersPage } from "@/features/users/pages/usersPage";
import { createFileRoute } from "@tanstack/react-router";

// import { UsersPage } from "@/features/users/pages/UsersPage";

export const Route = createFileRoute("/_app/users/")({
  component: UsersPage,
});
