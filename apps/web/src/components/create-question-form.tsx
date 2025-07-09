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
    })
  );

  const createRoomForm = useForm<CreateQuestion>({
    resolver: zodResolver(createQuestionFormSchema),
    defaultValues: {
      question: '',
      roomId,
    },
  });

  async function handleCreateQuestion(data: CreateQuestion) {
    await createQuestionsMutation.mutateAsync(data);
    createRoomForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask your question!</CardTitle>
        <CardDescription>
          Ask anything you want about the video!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...createRoomForm}>
          <form
            className="space-y-2"
            onSubmit={createRoomForm.handleSubmit(handleCreateQuestion)}
          >
            <FormField
              control={createRoomForm.control}
              name="question"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Your question</FormLabel>
                    <FormControl>
                      <Textarea
                        cols={4}
                        placeholder="ex. How did he do that???"
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
              control={createRoomForm.control}
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
            <Button disabled={createQuestionsMutation.isPending}>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
