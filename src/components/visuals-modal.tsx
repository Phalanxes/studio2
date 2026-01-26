'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { stockVideos } from '@/lib/data';
import type { Scene, StockVideo } from '@/lib/types';
import { useStoryboard } from './storyboard-provider';
import { Upload, Sparkles, Film, Loader2 } from 'lucide-react';
import { generateAiVideo } from '@/ai/flows/generate-ai-video-from-prompt';
import { useToast } from '@/hooks/use-toast';

interface VisualsModalProps {
  scene: Scene;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisualsModal({ scene, open, onOpenChange }: VisualsModalProps) {
  const { updateSceneVisual } = useStoryboard();
  const [prompt, setPrompt] = useState(scene.visual.prompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSelectStock = (video: StockVideo) => {
    updateSceneVisual(scene.id, {
      type: 'stock',
      url: video.url,
      thumbnailUrl: video.thumbnailUrl,
    });
    onOpenChange(false);
  };

  const handleGenerateVideo = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const result = await generateAiVideo({ prompt });
      updateSceneVisual(scene.id, {
        type: 'generated',
        url: result.videoDataUri,
        prompt: prompt,
      });
      toast({
        title: 'Video Generated!',
        description: 'Your AI-generated video clip is ready.',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to generate video:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'There was an error generating your video. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Select Visual for Scene</DialogTitle>
          <DialogDescription>
            Choose from stock videos, upload your own, or generate one with AI.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="stock" className="flex min-h-0 flex-grow flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stock">
              <Film className="mr-2 h-4 w-4" />
              Stock B-Roll
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="generate">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="mt-4 flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {stockVideos.map(video => (
                  <button
                    key={video.id}
                    onClick={() => handleSelectStock(video)}
                    className="group block"
                  >
                    <Card className="overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-primary/50">
                      <CardContent className="relative aspect-video p-0">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.description}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={video.imageHint}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-2 text-center text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <p>{video.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload" className="mt-4 flex-grow">
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">
                Drag & drop your video
              </h3>
              <p className="text-muted-foreground">or click to browse</p>
              <Button variant="outline" className="mt-4">
                Browse Files
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Feature coming soon. Upload will be handled by Firebase Storage.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="mt-4 flex-grow">
            <div className="flex h-full flex-col justify-center space-y-4">
              <p className="text-muted-foreground">
                Describe the video you want to generate. Be as descriptive as
                possible.
              </p>
              <Textarea
                placeholder="e.g., 'A cinematic shot of a futuristic city at night, with flying cars and neon lights.'"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="font-code h-32"
              />
              <Button
                onClick={handleGenerateVideo}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Video
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
