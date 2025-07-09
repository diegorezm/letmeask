import { useTRPC } from '@letmeask/trpc-client';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { GoBackButton } from '@/components/go-back-button';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/rooms/$roomId/record')({
  component: RouteComponent,
});

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function';

function RouteComponent() {
  const { roomId } = Route.useParams();
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const trpc = useTRPC();
  const uploadAudioMutation = useMutation(
    trpc.rooms.uploadAudio.mutationOptions()
  );

  async function uploadAudio(audio: Blob) {
    const bff = await audio.arrayBuffer();
    const data = Array.from(new Uint8Array(bff));

    await uploadAudioMutation.mutateAsync({
      roomId,
      data,
    });
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('Your browser does not support this feature.');
      return;
    }
    try {
      setIsRecording(true);
      const audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44_100,
        },
      });

      recorderRef.current = new MediaRecorder(audio, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 64_000,
      });

      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          // biome-ignore lint/suspicious/noConsole: <a>
          console.log(e.data);
          uploadAudio(e.data);
        }
      };
      recorderRef.current.onstart = () => {
        setIsRecording(true);
      };

      recorderRef.current.onstop = () => {
        setIsRecording(false);
      };

      recorderRef.current.start();
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <pls>
      console.error(error);
      alert('Something went wrong!');
      setIsRecording(false);
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-2 py-2">
      <nav>
        <GoBackButton />
      </nav>
      <section className="flex min-h-full flex-col items-center justify-center gap-4 transition-transform delay-200">
        {isRecording ? (
          <Button onClick={stopRecording} variant={'outline'}>
            Parar a gravação
          </Button>
        ) : (
          <Button onClick={startRecording}>Começar a gravação</Button>
        )}

        {uploadAudioMutation.isPending && (
          <p className="text-muted-foreground text-sm">Fazendo o upload....</p>
        )}

        {uploadAudioMutation.isError && (
          <p className="text-destructive text-sm">
            {uploadAudioMutation.error.message}
            {JSON.stringify(uploadAudioMutation.error)}
          </p>
        )}

        <div className="text-muted-foreground text-sm">ou</div>

        <input
          accept="audio/*"
          className="file:rounded-md file:border-none file:bg-muted file:px-4 file:py-2 file:text-muted-foreground file:text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadAudio(file);
            }
          }}
          type="file"
        />
      </section>
    </main>
  );
}
