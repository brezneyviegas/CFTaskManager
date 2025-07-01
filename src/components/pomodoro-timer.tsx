
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

const PRESETS = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '25 min', value: 25 },
];

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initializeAudio = () => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSound = () => {
    const audioCtx = audioContextRef.current;
    if (!audioCtx) return;

    // Check if context is suspended and resume it
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playSound();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    initializeAudio();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const setTimer = (minutes: number) => {
    const newTime = minutes * 60;
    setInitialTime(newTime);
    setTimeLeft(newTime);
    setIsActive(false);
  };
  
  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const minutes = parseInt(e.target.value, 10);
      if (!isNaN(minutes) && minutes > 0) {
          setCustomMinutes(minutes);
          setTimer(minutes);
      }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  const handleTabChange = (value: string) => {
    if(value !== 'custom'){
        setTimer(Number(value))
    } else {
        setTimer(customMinutes)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
        initializeAudio();
        setIsOpen(open);
    }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Pomodoro Timer">
          <Clock className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2 text-center">
            <h4 className="font-medium leading-none">Pomodoro Timer</h4>
            <p className="text-sm text-muted-foreground">Focus on your tasks.</p>
          </div>
          <div className="text-center text-5xl font-mono font-bold tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <Tabs defaultValue="25" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              {PRESETS.map(preset => (
                <TabsTrigger key={preset.value} value={String(preset.value)}>
                  {preset.label}
                </TabsTrigger>
              ))}
               <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="custom">
                <div className="flex items-center space-x-2 mt-2">
                    <Input 
                        type="number" 
                        id="custom-minutes" 
                        value={customMinutes}
                        onChange={handleCustomTimeChange}
                        className="w-full"
                        min="1"
                    />
                    <Label htmlFor="custom-minutes">minutes</Label>
                </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-center space-x-2">
            <Button onClick={toggleTimer} className="w-24">
              {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
