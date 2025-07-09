import type { RoomsFindAllOutput } from '@letmeask/trpc-client/types';
import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
        <CardTitle>Recent rooms</CardTitle>
        <CardDescription>Quick access to your latest rooms!</CardDescription>
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
                        {formatDistanceToNow(new Date(r.createdAt))} ago
                      </Badge>
                      <Badge className="text-xs" variant="secondary">
                        {r.questionCount} Question(s)
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost">
                    <span className="text-md ">Enter</span>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
