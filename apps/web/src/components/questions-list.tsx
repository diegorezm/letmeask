import type { QuestionsFindByRoomIdOutput } from '@letmeask/trpc-client/types';
import { BotIcon, Loader2, MessageCircleIcon } from 'lucide-react';

type Props = {
  questions: QuestionsFindByRoomIdOutput;
};

export function QuestionsList({ questions }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {questions.map((q) => (
        <div
          className="flex w-full flex-col gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg"
          key={q.id}
        >
          <div className="flex items-center gap-2">
            <MessageCircleIcon className="size-6" />
            <div>
              <h1 className="font-bold text-md">Question</h1>
              <p className="text-muted-foreground text-sm">{q.question}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BotIcon className="size-6" />
            <div>
              <h1 className="font-bold text-md">Question</h1>
              <p className="text-muted-foreground text-sm">
                {q.answer === null ? (
                  <Loader2 className="mt-1 size-4 animate-spin" />
                ) : (
                  <p className="text-muted-foreground text-sm">{q.answer}</p>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
