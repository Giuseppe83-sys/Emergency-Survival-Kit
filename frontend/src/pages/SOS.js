import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { Input } from '../components/ui/input';
import { Flashlight, FlashlightOff, Volume2, VolumeX, Send } from 'lucide-react';

// Morse code mapping
const morseCode = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

const SOS = () => {
  const { t } = useLanguageContext();
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isSendingMorse, setIsSendingMorse] = useState(false);
  const [customMessage, setCustomMessage] = useState('SOS');
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [useSound, setUseSound] = useState(true);
  
  const trackRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const morseIntervalRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      stopMorse();
    };
  }, []);

  // Try to get torch access
  const initTorch = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      trackRef.current = track;
      return true;
    } catch (error) {
      console.log('Torch not available:', error);
      return false;
    }
  }, []);

  // Toggle torch
  const toggleTorch = useCallback(async (on) => {
    if (trackRef.current && trackRef.current.getCapabilities()?.torch) {
      try {
        await trackRef.current.applyConstraints({
          advanced: [{ torch: on }]
        });
        return true;
      } catch (error) {
        console.log('Torch error:', error);
        return false;
      }
    }
    return false;
  }, []);

  // Play beep sound
  const playBeep = useCallback((duration) => {
    if (!useSound || !audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.5;
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  }, [useSound]);

  // Toggle flashlight manually
  const handleFlashlightToggle = async () => {
    if (!trackRef.current) {
      await initTorch();
    }
    
    const newState = !flashlightOn;
    const success = await toggleTorch(newState);
    
    if (success || !trackRef.current) {
      setFlashlightOn(newState);
      if (newState && useSound) {
        playBeep(100);
      }
    }
  };

  // Convert text to morse and signal it
  const sendMorseMessage = useCallback(async (message) => {
    if (isSendingMorse) return;
    
    await initTorch();
    setIsSendingMorse(true);
    
    const DOT_DURATION = 200;
    const DASH_DURATION = 600;
    const SYMBOL_GAP = 200;
    const LETTER_GAP = 600;
    const WORD_GAP = 1400;
    
    const upperMessage = message.toUpperCase();
    const signals = [];
    
    for (const char of upperMessage) {
      const morse = morseCode[char];
      if (morse) {
        if (morse === '/') {
          signals.push({ type: 'pause', duration: WORD_GAP });
        } else {
          for (let i = 0; i < morse.length; i++) {
            const symbol = morse[i];
            signals.push({
              type: 'on',
              symbol: symbol,
              duration: symbol === '.' ? DOT_DURATION : DASH_DURATION
            });
            if (i < morse.length - 1) {
              signals.push({ type: 'off', duration: SYMBOL_GAP });
            }
          }
          signals.push({ type: 'off', duration: LETTER_GAP });
        }
      }
    }
    
    let index = 0;
    
    const processSignal = async () => {
      if (index >= signals.length || !isSendingMorse) {
        setIsSendingMorse(false);
        setFlashlightOn(false);
        setCurrentSymbol('');
        await toggleTorch(false);
        return;
      }
      
      const signal = signals[index];
      
      if (signal.type === 'on') {
        setCurrentSymbol(signal.symbol);
        setFlashlightOn(true);
        await toggleTorch(true);
        playBeep(signal.duration);
      } else {
        setCurrentSymbol('');
        setFlashlightOn(false);
        await toggleTorch(false);
      }
      
      index++;
      morseIntervalRef.current = setTimeout(processSignal, signal.duration);
    };
    
    processSignal();
  }, [isSendingMorse, initTorch, toggleTorch, playBeep]);

  // Stop morse transmission
  const stopMorse = useCallback(() => {
    if (morseIntervalRef.current) {
      clearTimeout(morseIntervalRef.current);
      morseIntervalRef.current = null;
    }
    setIsSendingMorse(false);
    setFlashlightOn(false);
    setCurrentSymbol('');
    toggleTorch(false);
  }, [toggleTorch]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMorse();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [stopMorse]);

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="sos-page">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 border-b border-[#333333]">
        <h1 
          className="text-2xl font-bold uppercase tracking-tight"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {t('sosFlashlight')}
        </h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Main SOS Button */}
        <button
          onClick={() => isSendingMorse ? stopMorse() : sendMorseMessage('SOS')}
          data-testid="sos-trigger-button"
          className={`w-full h-32 text-4xl font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
            isSendingMorse 
              ? 'bg-[#FF3B30] animate-pulse shadow-[0_0_60px_rgba(255,59,48,0.6)]' 
              : 'bg-[#FF3B30] hover:bg-[#FF5249]'
          }`}
        >
          {isSendingMorse ? t('stopMorse') : 'SOS'}
        </button>

        {/* Current Symbol Display */}
        {isSendingMorse && (
          <div 
            className="text-center py-8 bg-[#111111] border border-[#333333]"
            data-testid="morse-symbol-display"
          >
            <div className="text-[#A1A1AA] text-sm uppercase tracking-widest mb-2">
              {t('sendingMorse')}
            </div>
            <div 
              className="text-8xl font-mono"
              style={{ color: flashlightOn ? '#FF3B30' : '#333333' }}
            >
              {currentSymbol || '·'}
            </div>
          </div>
        )}

        {/* Manual Flashlight Toggle */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleFlashlightToggle}
            disabled={isSendingMorse}
            data-testid="flashlight-toggle"
            className={`h-24 flex flex-col items-center justify-center gap-2 border transition-all ${
              flashlightOn && !isSendingMorse
                ? 'bg-[#FFCC00] border-[#FFCC00] text-black'
                : 'bg-[#111111] border-[#333333] text-white hover:border-white'
            } ${isSendingMorse ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {flashlightOn ? (
              <Flashlight size={32} strokeWidth={2} />
            ) : (
              <FlashlightOff size={32} strokeWidth={2} />
            )}
            <span className="text-sm font-bold uppercase tracking-wider">
              {flashlightOn ? t('flashlightOn') : t('flashlightOff')}
            </span>
          </button>

          <button
            onClick={() => setUseSound(!useSound)}
            data-testid="sound-toggle"
            className={`h-24 flex flex-col items-center justify-center gap-2 border transition-all ${
              useSound
                ? 'bg-[#111111] border-[#34C759] text-[#34C759]'
                : 'bg-[#111111] border-[#333333] text-[#52525B]'
            }`}
          >
            {useSound ? (
              <Volume2 size={32} strokeWidth={2} />
            ) : (
              <VolumeX size={32} strokeWidth={2} />
            )}
            <span className="text-sm font-bold uppercase tracking-wider">
              Sound {useSound ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Custom Message */}
        <div className="bg-[#111111] border border-[#333333] p-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA] mb-3">
            {t('customMessage')}
          </h3>
          <div className="flex gap-2">
            <Input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value.slice(0, 20))}
              placeholder="Enter message..."
              disabled={isSendingMorse}
              data-testid="custom-message-input"
              className="flex-1 h-14 px-4 bg-black border-2 border-[#333333] text-white placeholder:text-[#52525B] focus:border-white focus:ring-0 rounded-none uppercase"
            />
            <button
              onClick={() => sendMorseMessage(customMessage)}
              disabled={isSendingMorse || !customMessage.trim()}
              data-testid="send-custom-message"
              className="h-14 w-14 bg-[#FF3B30] text-white flex items-center justify-center hover:bg-[#FF5249] disabled:bg-[#333333] disabled:text-[#52525B] transition-colors"
            >
              <Send size={24} strokeWidth={2} />
            </button>
          </div>
          
          {/* Morse Preview */}
          <div className="mt-3 p-3 bg-black border border-[#222222]">
            <span className="text-xs text-[#52525B] uppercase tracking-wider block mb-1">
              Morse Code Preview:
            </span>
            <span className="font-mono text-lg text-white tracking-widest">
              {customMessage.toUpperCase().split('').map(char => morseCode[char] || '').join(' ')}
            </span>
          </div>
        </div>

        {/* Morse Code Reference */}
        <div className="bg-[#111111] border border-[#333333] p-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA] mb-3">
            Morse Code Reference
          </h3>
          <div className="grid grid-cols-4 gap-2 text-sm font-mono">
            <div className="text-center p-2 bg-black">
              <span className="text-[#FF3B30]">SOS</span>
              <span className="text-[#52525B] block text-xs">···---···</span>
            </div>
            <div className="text-center p-2 bg-black">
              <span className="text-white">A</span>
              <span className="text-[#52525B] block text-xs">·−</span>
            </div>
            <div className="text-center p-2 bg-black">
              <span className="text-white">B</span>
              <span className="text-[#52525B] block text-xs">−···</span>
            </div>
            <div className="text-center p-2 bg-black">
              <span className="text-white">C</span>
              <span className="text-[#52525B] block text-xs">−·−·</span>
            </div>
          </div>
          <p className="text-xs text-[#52525B] mt-3 text-center">
            · = short (dot) | − = long (dash)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SOS;
