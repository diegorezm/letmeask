import { useTRPC } from '@letmeask/trpc-client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/rooms/')({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const roomsQuery = useSuspenseQuery(trpc.rooms.findAll.queryOptions());
  const rooms = roomsQuery.data;

  return (
    <div className="px-4 py-2">
      <h1 className="font-semibold text-2xl">Rooms</h1>
      <ul>
        {rooms.map((r) => (
          <li key={r.id}>
            <Link params={{ roomId: r.id }} to="/rooms/$roomId">
              {r.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
