import { UserDetailsPage } from "@/features/users/pages/userDetailsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/users/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();

  return <UserDetailsPage userId={id} />;
}
