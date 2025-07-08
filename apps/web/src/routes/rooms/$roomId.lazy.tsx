import { useTRPC } from '@letmeask/trpc-client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createLazyFileRoute('/rooms/$roomId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();

  const trpc = useTRPC();
  const roomQuery = useSuspenseQuery(
    trpc.rooms.findById.queryOptions({ id: roomId })
  );

  const room = roomQuery.data;

  return (
    <div className="flex flex-col gap-6 px-4 py-2">
      <Link to="/rooms">
        <Button>
          <ChevronLeft className="size-5" />
          Go back
        </Button>
      </Link>
      {JSON.stringify(room, null, 4)}!
    </div>
  );
}
