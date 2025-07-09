import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/rooms')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen px-4 py-2">
      <Outlet />
    </div>
  );
}
