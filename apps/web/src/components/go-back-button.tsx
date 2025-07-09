import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { ChevronLeft, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GoBackButton() {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  if (canGoBack) {
    return (
      <Button onClick={() => router.history.back()} variant={'outline'}>
        <ChevronLeft className="size-5" />
        Voltar
      </Button>
    );
  }

  return (
    <Link to="/">
      <Button variant={'outline'}>
        <ChevronLeft className="size-5" />
        Voltar
      </Button>
    </Link>
  );
}
