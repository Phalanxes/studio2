"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { initialScenes } from '@/lib/data';
import type { Scene } from '@/lib/types';

type StoryboardContextType = {
  scenes: Scene[];
  addScene: (afterIndex: number) => void;
  updateScene: (
    sceneId: string,
    updatedData: Partial<Scene> | ((scene: Scene) => Partial<Scene>)
  ) => void;
  updateSceneVisual: (sceneId: string, visual: Scene['visual']) => void;
  updateSceneAudio: (sceneId: string, audio: Partial<Scene['audio']>) => void;
};

const StoryboardContext = createContext<StoryboardContextType | null>(null);

export function StoryboardProvider({ children }: { children: React.ReactNode }) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setScenes(initialScenes);
    setIsMounted(true);
  }, []);

  const addScene = useCallback((afterIndex: number) => {
    const newScene: Scene = {
      id: `scene-${crypto.randomUUID()}`,
      orderIndex: afterIndex + 1,
      duration: 5,
      visual: { type: 'empty' },
      audio: { type: 'tts', scriptText: '', voiceId: 'male-deep' },
    };

    setScenes(prevScenes => {
      const newScenes = [...prevScenes];
      // Increment orderIndex of scenes that come after the new one
      for (let i = afterIndex + 1; i < newScenes.length; i++) {
        newScenes[i].orderIndex++;
      }
      newScenes.splice(afterIndex + 1, 0, newScene);
      return newScenes;
    });
  }, []);

  const updateScene = useCallback(
    (
      sceneId: string,
      updatedData: Partial<Scene> | ((scene: Scene) => Partial<Scene>)
    ) => {
      setScenes(prevScenes =>
        prevScenes.map(scene => {
          if (scene.id === sceneId) {
            const updates =
              typeof updatedData === 'function'
                ? updatedData(scene)
                : updatedData;
            return { ...scene, ...updates };
          }
          return scene;
        })
      );
    },
    []
  );

  const updateSceneVisual = useCallback(
    (sceneId: string, visual: Scene['visual']) => {
      updateScene(sceneId, { visual });
    },
    [updateScene]
  );

  const updateSceneAudio = useCallback(
    (sceneId: string, audio: Partial<Scene['audio']>) => {
      updateScene(sceneId, scene => ({
        audio: {
          ...scene.audio,
          ...audio,
        },
      }));
    },
    [updateScene]
  );

  const value = {
    scenes,
    addScene,
    updateScene,
    updateSceneVisual,
    updateSceneAudio,
  };

  if (!isMounted) return null;

  return (
    <StoryboardContext.Provider value={value}>
      {children}
    </StoryboardContext.Provider>
  );
}

export function useStoryboard() {
  const context = useContext(StoryboardContext);
  if (!context) {
    throw new Error('useStoryboard must be used within a StoryboardProvider');
  }
  return context;
}
