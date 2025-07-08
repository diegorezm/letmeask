import { useTRPC } from '@letmeask/trpc-client';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const trpc = useTRPC();
  const rooms = useQuery(trpc.rooms.findAll.queryOptions());

  return (
    <div className="text-center">
      <p className="text-6xl">test</p>
      {JSON.stringify(rooms.data, null, 4)}
    </div>
  );
}
