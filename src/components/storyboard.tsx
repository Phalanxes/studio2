'use client';

import { useStoryboard } from './storyboard-provider';
import SceneRow from './scene-row';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

export default function Storyboard() {
  const { scenes, addScene } = useStoryboard();

  return (
    <div className="space-y-4">
      <div className="hidden grid-cols-[80px_1fr_1fr_80px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground md:grid">
        <div>Time</div>
        <div>Visuals</div>
        <div>Audio</div>
        <div className="text-right">Actions</div>
      </div>
      {scenes.length > 0 ? (
        <div className="space-y-4">
          {scenes
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map(scene => (
              <Card key={scene.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <SceneRow scene={scene} />
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
          <h3 className="text-xl font-semibold">Empty Storyboard</h3>
          <p className="mt-2 mb-4 text-muted-foreground">
            Add a scene to get started.
          </p>
          <Button onClick={() => addScene(-1)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Scene
          </Button>
        </div>
      )}
    </div>
  );
}
