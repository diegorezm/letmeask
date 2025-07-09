import type { RoomsFindAllOutput } from '@letmeask/trpc-client/types';
import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Props = {
  rooms: RoomsFindAllOutput;
};

export function RecentRooms({ rooms }: Props) {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Salas recentes</CardTitle>
        <CardDescription>Acesso rápido a suas salas recentes!</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {rooms.map((r) => (
            <li className="hover:bg-accent/50" key={r.id}>
              <Link params={{ roomId: r.id }} to="/rooms/$roomId">
                <div className="flex w-full items-center justify-between rounded-md border px-4 py-2">
                  <div className="flex flex-col gap-1 font-medium text-md">
                    <span className="text-ellipsis">{r.name}</span>

                    <div className="space-x-2">
                      <Badge className="text-xs" variant="secondary">
                        há {formatDistanceToNow(new Date(r.createdAt))}
                      </Badge>
                      <Badge className="text-xs" variant="secondary">
                        {r.questionCount} Pergunta(s)
                      </Badge>
                    </div>
                  </div>
                  <div className="inline-flex items-center justify-center gap-1">
                    <span className="text-md ">Entrar</span>
                    <ChevronRight className="size-4" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
