import { Loader2 } from 'lucide-react';

export function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-12 animate-spin" />
    </div>
  );
}
