import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { useTimerPresets } from '../hooks/useLocalStorage';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const Timer = () => {
  const { t } = useLanguageContext();
  const [presets] = useTimerPresets();
  
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play alarm sound
  const playAlarm = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;

    const playBeep = (freq, duration, startTime) => {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'square';
      gainNode.gain.value = 0.3;
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContextRef.current.currentTime;
    // Play alarm pattern
    for (let i = 0; i < 3; i++) {
      playBeep(880, 0.15, now + i * 0.3);
      playBeep(660, 0.15, now + i * 0.3 + 0.15);
    }
  }, [soundEnabled]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds, playAlarm]);

  // Format time display
  const formatTime = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0')
    };
  };

  const displayTime = formatTime(remainingSeconds);
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  // Update total seconds when inputs change
  const updateTotalSeconds = useCallback(() => {
    const total = hours * 3600 + minutes * 60 + seconds;
    setTotalSeconds(total);
    setRemainingSeconds(total);
    setIsComplete(false);
  }, [hours, minutes, seconds]);

  // Handle input changes
  const handleTimeChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    
    switch (type) {
      case 'hours':
        setHours(Math.min(99, Math.max(0, numValue)));
        break;
      case 'minutes':
        setMinutes(Math.min(59, Math.max(0, numValue)));
        break;
      case 'seconds':
        setSeconds(Math.min(59, Math.max(0, numValue)));
        break;
      default:
        break;
    }
  };

  // Apply preset
  const applyPreset = (presetSeconds) => {
    const h = Math.floor(presetSeconds / 3600);
    const m = Math.floor((presetSeconds % 3600) / 60);
    const s = presetSeconds % 60;
    
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setTotalSeconds(presetSeconds);
    setRemainingSeconds(presetSeconds);
    setIsRunning(false);
    setIsComplete(false);
  };

  // Control functions
  const handleStart = () => {
    if (!isRunning && remainingSeconds === totalSeconds) {
      updateTotalSeconds();
    }
    if (remainingSeconds > 0) {
      setIsRunning(true);
      setIsComplete(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="timer-page">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 border-b border-[#333333]">
        <div className="flex items-center justify-between">
          <h1 
            className="text-2xl font-bold uppercase tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {t('countdownTimer')}
          </h1>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            data-testid="timer-sound-toggle"
            className={`w-12 h-12 flex items-center justify-center border transition-colors ${
              soundEnabled 
                ? 'border-[#34C759] text-[#34C759]'
                : 'border-[#333333] text-[#52525B]'
            }`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Time Display */}
        <div 
          className={`text-center py-8 bg-[#111111] border border-[#333333] ${
            isComplete ? 'border-[#FF3B30] animate-pulse' : ''
          }`}
          data-testid="timer-display"
        >
          {isComplete ? (
            <div className="text-[#FF3B30]">
              <div 
                className="text-6xl sm:text-7xl font-bold tracking-tighter"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {t('timerComplete')}
              </div>
            </div>
          ) : (
            <div 
              className="text-6xl sm:text-7xl font-bold tracking-tighter tabular-nums"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className={remainingSeconds < 60 ? 'text-[#FF3B30]' : 'text-white'}>
                {displayTime.hours}:{displayTime.minutes}:{displayTime.seconds}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-6 mx-4">
            <div className="h-2 bg-[#333333] overflow-hidden">
              <div 
                className="h-full bg-[#FF3B30] transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Time Input (only when not running) */}
        {!isRunning && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#A1A1AA] uppercase tracking-widest block mb-2 text-center">
                {t('hours')}
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={hours}
                onChange={(e) => handleTimeChange('hours', e.target.value)}
                data-testid="timer-hours-input"
                className="w-full h-16 text-center text-2xl font-bold bg-black border-2 border-[#333333] text-white focus:border-white focus:outline-none"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
            <div>
              <label className="text-xs text-[#A1A1AA] uppercase tracking-widest block mb-2 text-center">
                {t('minutes')}
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => handleTimeChange('minutes', e.target.value)}
                data-testid="timer-minutes-input"
                className="w-full h-16 text-center text-2xl font-bold bg-black border-2 border-[#333333] text-white focus:border-white focus:outline-none"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
            <div>
              <label className="text-xs text-[#A1A1AA] uppercase tracking-widest block mb-2 text-center">
                {t('seconds')}
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => handleTimeChange('seconds', e.target.value)}
                data-testid="timer-seconds-input"
                className="w-full h-16 text-center text-2xl font-bold bg-black border-2 border-[#333333] text-white focus:border-white focus:outline-none"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {isRunning ? (
            <button
              onClick={handlePause}
              data-testid="timer-pause-btn"
              className="h-20 bg-[#FFCC00] text-black font-bold text-xl uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-[#FFD633] transition-colors active:scale-[0.98]"
            >
              <Pause size={28} strokeWidth={2.5} />
              {t('pause')}
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={totalSeconds === 0 && remainingSeconds === 0}
              data-testid="timer-start-btn"
              className="h-20 bg-[#34C759] text-white font-bold text-xl uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-[#2DB14A] disabled:bg-[#333333] disabled:text-[#52525B] transition-colors active:scale-[0.98]"
            >
              <Play size={28} strokeWidth={2.5} />
              {t('start')}
            </button>
          )}
          <button
            onClick={handleReset}
            data-testid="timer-reset-btn"
            className="h-20 bg-[#111111] border-2 border-[#333333] text-white font-bold text-xl uppercase tracking-wider flex items-center justify-center gap-3 hover:border-white transition-colors active:scale-[0.98]"
          >
            <RotateCcw size={28} strokeWidth={2.5} />
            {t('reset')}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="bg-[#111111] border border-[#333333] p-4">
          <h3 className="text-xs text-[#A1A1AA] uppercase tracking-widest mb-3">
            {t('quickTimers')}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.seconds)}
                data-testid={`timer-preset-${preset.id}`}
                className="h-14 bg-black border border-[#333333] text-white font-bold uppercase hover:border-white transition-colors active:scale-[0.98]"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
