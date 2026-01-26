'use client';

import Image from 'next/image';
import { useStoryboard } from './storyboard-provider';
import type { Scene } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { voicePersonas } from '@/lib/data';
import {
  Clock,
  Plus,
  Video,
  Mic,
  Film,
  Trash2,
  Speaker,
  Loader2,
} from 'lucide-react';
import { VisualsModal } from './visuals-modal';
import { useState } from 'react';
import { generateTtsAudio } from '@/ai/flows/generate-tts-audio';
import { useToast } from '@/hooks/use-toast';

export default function SceneRow({ scene }: { scene: Scene }) {
  const { addScene, deleteScene, updateSceneAudio, updateScene } =
    useStoryboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const { toast } = useToast();

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value, 10);
    if (!isNaN(newDuration) && newDuration > 0) {
      updateScene(scene.id, { duration: newDuration });
    }
  };

  const formatDuration = (seconds: number) => {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  };

  const handleGenerateAudio = async () => {
    if (!scene.audio.scriptText) {
      toast({
        variant: 'destructive',
        title: 'Empty Script',
        description: 'Please enter some script text to generate audio.',
      });
      return;
    }
    setIsGeneratingAudio(true);
    try {
      const voice = voicePersonas.find(v => v.id === scene.audio.voiceId);
      if (!voice?.apiVoiceName) {
        throw new Error(
          'Selected voice is not configured for API generation.'
        );
      }

      const result = await generateTtsAudio({
        scriptText: scene.audio.scriptText,
        voiceName: voice.apiVoiceName,
      });

      updateSceneAudio(scene.id, { url: result.audioDataUri });
      toast({
        title: 'Audio Generated!',
        description: 'The audio for this scene is ready.',
      });
    } catch (error) {
      console.error('Failed to generate audio:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'There was an error generating your audio. Please try again.',
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-4 p-4 md:grid-cols-[80px_1fr_1fr_80px]">
      {/* Time Column */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground md:hidden">
          <Clock className="h-4 w-4" /> Time
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            value={scene.duration}
            onChange={handleDurationChange}
            className="pl-9"
            aria-label="Scene duration in seconds"
          />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {formatDuration(scene.duration)}
        </p>
      </div>

      {/* Visuals Column */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground md:hidden">
          <Video className="h-4 w-4" /> Visuals
        </label>
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative flex w-full aspect-video items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 text-muted-foreground transition-colors hover:border-primary"
        >
          {scene.visual.type === 'empty' && (
            <div className="flex flex-col items-center gap-2">
              <Film className="h-8 w-8" />
              <span className="text-sm">Add Visual</span>
            </div>
          )}
          {scene.visual.thumbnailUrl &&
            (scene.visual.type === 'stock' ||
              scene.visual.type === 'upload') && (
              <Image
                src={scene.visual.thumbnailUrl}
                alt="Scene visual thumbnail"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint="stock video"
              />
            )}
          {scene.visual.url && scene.visual.type === 'generated' && (
            <video
              key={scene.visual.url}
              src={scene.visual.url}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </button>
        <VisualsModal
          scene={scene}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>

      {/* Audio Column */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground md:hidden">
          <Mic className="h-4 w-4" /> Audio
        </label>
        <Textarea
          value={scene.audio.scriptText}
          onChange={e =>
            updateSceneAudio(scene.id, { scriptText: e.target.value })
          }
          placeholder="Type script for this scene..."
          className="min-h-[120px]"
        />
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Select
            value={scene.audio.voiceId}
            onValueChange={value =>
              updateSceneAudio(scene.id, { voiceId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voicePersonas.map(voice => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerateAudio}
            disabled={isGeneratingAudio || !scene.audio.scriptText}
            variant="outline"
            size="icon"
            aria-label="Generate audio"
          >
            {isGeneratingAudio ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Speaker />
            )}
          </Button>
        </div>
        {scene.audio.url && (
          <div className="pt-2">
            <audio src={scene.audio.url} controls className="w-full" />
          </div>
        )}
      </div>

      {/* Actions Column */}
      <div className="flex h-full items-center justify-end md:justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addScene(scene.orderIndex)}
          aria-label="Add new scene after this one"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteScene(scene.id)}
          aria-label="Delete this scene"
        >
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
