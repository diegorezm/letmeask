import { zodResolver } from '@hookform/resolvers/zod';
import { useTRPC } from '@letmeask/trpc-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const createQuestionFormSchema = z.object({
  question: z.string().min(1).max(1024),
  roomId: z.string().uuid(),
});

type CreateQuestion = z.infer<typeof createQuestionFormSchema>;

type Props = {
  roomId: string;
};

export function CreateQuestionForm({ roomId }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createQuestionsMutation = useMutation(
    trpc.questions.create.mutationOptions({
      onSuccess: () => {
        const questionsQueryKey = trpc.questions.findByRoomId.queryKey({
          roomId,
        });
        queryClient
          .invalidateQueries({
            queryKey: questionsQueryKey,
          })
          // biome-ignore lint/suspicious/noConsole: <idk>
          .catch((e) => console.error(e));
      },
      onMutate: (m) => {
        const questionsQueryKey = trpc.questions.findByRoomId.queryKey({
          roomId: m.roomId,
        });

        const questions = queryClient.getQueryData(questionsQueryKey);
        const questionsArray = questions ?? [];
        queryClient.setQueryData(questionsQueryKey, [
          {
            id: crypto.randomUUID().toString(),
            roomId: m.roomId,
            question: m.question,
            answer: null,
            createdAt: new Date().toISOString(),
          },
          ...questionsArray,
        ]);
      },
    })
  );

  const createQuestionForm = useForm<CreateQuestion>({
    resolver: zodResolver(createQuestionFormSchema),
    defaultValues: {
      question: '',
      roomId,
    },
  });

  async function handleCreateQuestion(data: CreateQuestion) {
    await createQuestionsMutation.mutateAsync(data);
    createQuestionForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faça sua pergunta!</CardTitle>
        <CardDescription>Pergunte o que quiser sobre o audio!</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...createQuestionForm}>
          <form
            className="space-y-2"
            onSubmit={createQuestionForm.handleSubmit(handleCreateQuestion)}
          >
            <FormField
              control={createQuestionForm.control}
              name="question"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Sua pergunta</FormLabel>
                    <FormControl>
                      <Textarea
                        cols={4}
                        disabled={
                          createQuestionsMutation.isPending ||
                          createQuestionForm.formState.isSubmitting
                        }
                        placeholder="ex. Como o hook 'useState' functiona?"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={createQuestionForm.control}
              name="roomId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input {...field} hidden />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <Button
              disabled={
                createQuestionsMutation.isPending ||
                createQuestionForm.formState.isSubmitting
              }
            >
              Enviar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
