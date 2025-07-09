import { useTRPC } from '@letmeask/trpc-client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { CreateRoomForm } from '@/components/create-room-form';
import { Loader } from '@/components/loader';
import { RecentRooms } from '@/components/recent-rooms';

export const Route = createLazyFileRoute('/rooms/')({
  component: RouteComponent,
  pendingComponent: () => <Loader />,
});

function RouteComponent() {
  const trpc = useTRPC();
  const roomsQuery = useSuspenseQuery(trpc.rooms.findAll.queryOptions({}));
  const rooms = roomsQuery.data;

  return (
    <main className="mx-auto h-full w-full max-w-4xl space-y-8">
      <h1 className="font-semibold text-2xl">Rooms</h1>
      <div className="grid grid-cols-2 gap-2">
        <CreateRoomForm />
        <RecentRooms rooms={rooms} />
      </div>
    </main>
  );
}
