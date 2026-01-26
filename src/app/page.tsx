import { Button } from '@/components/ui/button';
import { StoryboardProvider } from '@/components/storyboard-provider';
import Storyboard from '@/components/storyboard';
import { Film } from 'lucide-react';

export default function Home() {
  return (
    <StoryboardProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <h1 className="font-headline text-2xl font-bold tracking-tight">
                StoryFlow Studio
              </h1>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Film className="mr-2 h-4 w-4" />
                Compile Video
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Storyboard />
        </main>
      </div>
    </StoryboardProvider>
  );
}
