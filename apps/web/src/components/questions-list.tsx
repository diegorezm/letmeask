import type {
  QuestionsFindByIdOutput,
  QuestionsFindByRoomIdOutput,
} from '@letmeask/trpc-client/types';
import { formatDistanceToNow } from 'date-fns';
import { BotIcon, Loader2, MessageCircleIcon } from 'lucide-react';

type QuestionListProps = {
  questions: QuestionsFindByRoomIdOutput;
};

export function QuestionsList({ questions }: QuestionListProps) {
  return (
    <div className="flex flex-col gap-4">
      {questions.map((q) => (
        <QuestionItem key={q.id} question={q} />
      ))}
    </div>
  );
}

type QuestionItemProps = {
  question: QuestionsFindByIdOutput;
};

function QuestionItem({ question }: QuestionItemProps) {
  return (
    <div
      className="flex w-full flex-col gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg"
      key={question.id}
    >
      <div className="flex items-center gap-2">
        <MessageCircleIcon className="size-6" />
        <div>
          <h1 className="font-bold text-md">Pergunta</h1>
          <p className="text-muted-foreground text-sm">{question.question}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <BotIcon className="size-6" />
        <div>
          <h1 className="font-bold text-md">Resposta</h1>
          {question.answer === null ? (
            <Loader2 className="mt-1 size-4 animate-spin" />
          ) : (
            <p className="text-muted-foreground text-sm">{question.answer}</p>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        há {formatDistanceToNow(new Date(question.createdAt))}
      </p>
    </div>
  );
}
