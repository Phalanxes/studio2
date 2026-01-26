'use client';

import { useStoryboard } from './storyboard-provider';
import SceneRow from './scene-row';
import { Card, CardContent } from '@/components/ui/card';

export default function Storyboard() {
  const { scenes } = useStoryboard();

  return (
    <div className="space-y-4">
      <div className="hidden grid-cols-[80px_1fr_1fr_80px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground md:grid">
        <div>Time</div>
        <div>Visuals</div>
        <div>Audio</div>
        <div className="text-right">Actions</div>
      </div>
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
    </div>
  );
}
