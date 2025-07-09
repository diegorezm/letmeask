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

const createRoomFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

type CreateRoom = z.infer<typeof createRoomFormSchema>;

export function CreateRoomForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createRoomMutation = useMutation(
    trpc.rooms.create.mutationOptions({
      onSuccess: () => {
        const roomsQueryKey = trpc.rooms.findAll.queryKey();
        queryClient
          .invalidateQueries({
            queryKey: roomsQueryKey,
          })
          // biome-ignore lint/suspicious/noConsole: <idk>
          .catch((e) => console.error(e));
      },
    })
  );
  const createRoomForm = useForm<CreateRoom>({
    resolver: zodResolver(createRoomFormSchema),
    defaultValues: {
      name: '',
      description: undefined,
    },
  });

  async function handleCreateRoom(data: CreateRoom) {
    await createRoomMutation.mutateAsync(data);
    createRoomForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crie uma sala</CardTitle>
        <CardDescription>
          Crie uma sala e comece a receber suas respostas!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...createRoomForm}>
          <form
            className="space-y-4"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nome da sala</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da sala..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={createRoomForm.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Room description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descrição da sala... (opcional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button disabled={createRoomMutation.isPending}>Enviar</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
