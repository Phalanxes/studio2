'use client';

import { Button } from '@/components/ui/button';
import {
  StoryboardProvider,
  useStoryboard,
} from '@/components/storyboard-provider';
import Storyboard from '@/components/storyboard';
import { Film, Loader2, Download } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { compileVideoAction } from '@/app/actions/compile-video';

function PageContent() {
  const { scenes } = useStoryboard();
  const { toast } = useToast();
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledVideoUrl, setCompiledVideoUrl] = useState<string | null>(null);

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompiledVideoUrl(null);

    const scenesWithoutAudio = scenes.filter(s => !s.audio.url);
    if (scenesWithoutAudio.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Cannot Compile',
        description: 'Please generate audio for all scenes before compiling.',
      });
      setIsCompiling(false);
      return;
    }

    toast({
      title: 'Starting Compilation',
      description:
        'This may take a few minutes. A new video will be generated from your script.',
    });

    try {
      const result = await compileVideoAction(scenes);

      if (result.success && result.videoDataUri) {
        setCompiledVideoUrl(result.videoDataUri);
        toast({
          title: 'Compilation Complete!',
          description: 'Your storyboard video is ready.',
        });
      } else {
        throw new Error(
          result.error || 'An unknown error occurred during compilation.'
        );
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Compilation Failed',
        description: error.message,
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="font-headline text-2xl font-bold tracking-tight">
              StoryFlow Studio
            </h1>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleCompile}
              disabled={isCompiling}
            >
              {isCompiling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Film className="mr-2 h-4 w-4" />
              )}
              {isCompiling ? 'Compiling...' : 'Compile Video'}
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Storyboard />
        {compiledVideoUrl && (
          <div className="mt-8 rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Compiled Video</h2>
            <video
              src={compiledVideoUrl}
              controls
              className="w-full rounded-md"
            />
            <a
              href={compiledVideoUrl}
              download="storyboard-video.mp4"
              className="mt-4 inline-block w-full"
            >
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </Button>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <StoryboardProvider>
      <PageContent />
    </StoryboardProvider>
  );
}
