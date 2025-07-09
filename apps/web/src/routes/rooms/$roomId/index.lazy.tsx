import { useTRPC } from '@letmeask/trpc-client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { AudioLinesIcon, ChevronLeft } from 'lucide-react';
import { CreateQuestionForm } from '@/components/create-question-form';
import { Loader } from '@/components/loader';
import { QuestionsList } from '@/components/questions-list';
import { Button } from '@/components/ui/button';
import { GoBackButton } from '@/components/go-back-button';

export const Route = createLazyFileRoute('/rooms/$roomId/')({
  component: RouteComponent,
  pendingComponent: () => <Loader />,
});

function RouteComponent() {
  const { roomId } = Route.useParams();

  const trpc = useTRPC();

  const roomQuery = useSuspenseQuery(
    trpc.rooms.findById.queryOptions({ id: roomId })
  );

  const room = roomQuery.data;

  const questionQuery = useSuspenseQuery(
    trpc.questions.findByRoomId.queryOptions({ roomId: room.id })
  );

  const questions = questionQuery.data;

  return (
    <main className="mx-auto flex h-full max-w-4xl flex-col gap-6">
      <nav className="flex justify-between">
        <div>
          <GoBackButton />
        </div>
        <div>
          <Link params={{ roomId }} to="/rooms/$roomId/record">
            <Button variant={'outline'}>
              <AudioLinesIcon className="size-5" />
              Gravar audio
            </Button>
          </Link>
        </div>
      </nav>

      <div>
        <h1 className="font-semibold text-lg">{room.name}</h1>
        {room.description && (
          <p className="text-muted-foreground">{room.description}</p>
        )}
      </div>
      <section className="space-y-8">
        <CreateQuestionForm roomId={room.id} />
        <QuestionsList questions={questions} />
      </section>
    </main>
  );
}
