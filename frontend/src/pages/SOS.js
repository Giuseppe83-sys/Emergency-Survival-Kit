import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { useContacts, useLocalStorage } from '../hooks/useLocalStorage';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  Flashlight, 
  FlashlightOff, 
  Volume2, 
  VolumeX, 
  Send,
  Phone,
  MessageSquare,
  MapPin,
  Siren,
  X,
  Plus,
  Navigation,
  Share2,
  AlertTriangle
} from 'lucide-react';

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
  const [contacts] = useContacts();
  const [emergencyNumbers, setEmergencyNumbers] = useLocalStorage('survival-kit-emergency-numbers', []);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isSendingMorse, setIsSendingMorse] = useState(false);
  const [customMessage, setCustomMessage] = useState('SOS');
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [useSound, setUseSound] = useState(true);
  const [sirenActive, setSirenActive] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [showAddNumber, setShowAddNumber] = useState(false);
  const [newNumber, setNewNumber] = useState({ name: '', phone: '' });
  
  const trackRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const sirenOscillatorRef = useRef(null);
  const sirenIntervalRef = useRef(null);
  const morseIntervalRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      stopMorse();
      stopSiren();
    };
  }, []);

  // Get user location
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocalizzazione non supportata');
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocatingUser(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Impossibile ottenere la posizione. Controlla i permessi.');
        setLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Get location on mount
  useEffect(() => {
    getLocation();
  }, [getLocation]);

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

  // Start siren alarm
  const startSiren = useCallback(() => {
    if (!audioContextRef.current || sirenActive) return;
    
    setSirenActive(true);
    
    let frequency = 800;
    let rising = true;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.8;
    
    oscillator.start();
    sirenOscillatorRef.current = oscillator;
    
    // Modulate frequency for siren effect
    sirenIntervalRef.current = setInterval(() => {
      if (rising) {
        frequency += 20;
        if (frequency >= 1200) rising = false;
      } else {
        frequency -= 20;
        if (frequency <= 600) rising = true;
      }
      oscillator.frequency.value = frequency;
    }, 30);
  }, [sirenActive]);

  // Stop siren alarm
  const stopSiren = useCallback(() => {
    if (sirenOscillatorRef.current) {
      sirenOscillatorRef.current.stop();
      sirenOscillatorRef.current = null;
    }
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    setSirenActive(false);
  }, []);

  // Make emergency call
  const makeCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Send emergency SMS with location
  const sendEmergencySMS = () => {
    if (!userLocation) {
      alert('Posizione non disponibile. Riprova.');
      getLocation();
      return;
    }

    const allContacts = [...contacts, ...emergencyNumbers];
    if (allContacts.length === 0) {
      alert('Nessun contatto di emergenza salvato!');
      return;
    }

    const mapsLink = `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
    const message = `🆘 EMERGENZA! Ho bisogno di aiuto!\n\n📍 La mia posizione:\n${mapsLink}\n\nCoordinate: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}\nPrecisione: ~${Math.round(userLocation.accuracy)}m`;
    
    // Open SMS app with first contact (user can add more)
    const phoneNumbers = allContacts.map(c => c.phone).join(',');
    window.location.href = `sms:${phoneNumbers}?body=${encodeURIComponent(message)}`;
  };

  // Share location
  const shareLocation = async () => {
    if (!userLocation) {
      alert('Posizione non disponibile. Riprova.');
      getLocation();
      return;
    }

    const mapsLink = `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
    const shareText = `🆘 EMERGENZA - La mia posizione: ${mapsLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Posizione di Emergenza',
          text: shareText,
          url: mapsLink
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          copyToClipboard(mapsLink);
        }
      }
    } else {
      copyToClipboard(mapsLink);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link posizione copiato negli appunti!');
    }).catch(() => {
      alert(`Link: ${text}`);
    });
  };

  // Add emergency number
  const addEmergencyNumber = () => {
    if (!newNumber.name.trim() || !newNumber.phone.trim()) return;
    
    setEmergencyNumbers(prev => [...prev, {
      id: `emergency-${Date.now()}`,
      name: newNumber.name.trim(),
      phone: newNumber.phone.trim()
    }]);
    setNewNumber({ name: '', phone: '' });
    setShowAddNumber(false);
  };

  // Remove emergency number
  const removeEmergencyNumber = (id) => {
    setEmergencyNumbers(prev => prev.filter(n => n.id !== id));
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMorse();
      stopSiren();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [stopMorse, stopSiren]);

  const allEmergencyContacts = [...emergencyNumbers, ...contacts];

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
        
        {/* Location Status */}
        <div className="flex items-center gap-2 mt-2">
          <Navigation size={14} className={userLocation ? 'text-[#34C759]' : 'text-[#FF9500]'} />
          <span className="text-xs text-[#A1A1AA]">
            {locatingUser ? 'Localizzazione...' : 
             userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 
             'Posizione non disponibile'}
          </span>
          {!userLocation && !locatingUser && (
            <button 
              onClick={getLocation}
              className="text-xs text-[#007AFF] underline"
            >
              Riprova
            </button>
          )}
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 space-y-4">
          
          {/* SIREN ALARM - Most prominent */}
          <button
            onClick={() => sirenActive ? stopSiren() : startSiren()}
            data-testid="siren-button"
            className={`w-full h-24 text-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-4 ${
              sirenActive 
                ? 'bg-[#FF3B30] animate-pulse shadow-[0_0_60px_rgba(255,59,48,0.6)]' 
                : 'bg-[#FF9500] hover:bg-[#FFa020]'
            }`}
          >
            <Siren size={36} strokeWidth={2.5} />
            {sirenActive ? 'FERMA SIRENA' : 'ALLARME SIRENA'}
          </button>

          {/* Main SOS Morse Button */}
          <button
            onClick={() => isSendingMorse ? stopMorse() : sendMorseMessage('SOS')}
            data-testid="sos-trigger-button"
            className={`w-full h-20 text-3xl font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
              isSendingMorse 
                ? 'bg-[#FF3B30] animate-pulse shadow-[0_0_40px_rgba(255,59,48,0.5)]' 
                : 'bg-[#FF3B30] hover:bg-[#FF5249]'
            }`}
          >
            {isSendingMorse ? 'STOP MORSE' : 'SOS MORSE'}
          </button>

          {/* Current Symbol Display */}
          {isSendingMorse && (
            <div 
              className="text-center py-4 bg-[#111111] border border-[#333333]"
              data-testid="morse-symbol-display"
            >
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mb-1">
                {t('sendingMorse')}
              </div>
              <div 
                className="text-6xl font-mono"
                style={{ color: flashlightOn ? '#FF3B30' : '#333333' }}
              >
                {currentSymbol || '·'}
              </div>
            </div>
          )}

          {/* Emergency Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Send Emergency SMS */}
            <button
              onClick={sendEmergencySMS}
              data-testid="emergency-sms-btn"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-[#34C759] text-white hover:bg-[#2DB14A] transition-colors active:scale-[0.98]"
            >
              <MessageSquare size={28} strokeWidth={2} />
              <span className="text-xs font-bold uppercase tracking-wider">SMS Emergenza</span>
            </button>

            {/* Share Location */}
            <button
              onClick={shareLocation}
              data-testid="share-location-btn"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-[#007AFF] text-white hover:bg-[#0A84FF] transition-colors active:scale-[0.98]"
            >
              <Share2 size={28} strokeWidth={2} />
              <span className="text-xs font-bold uppercase tracking-wider">Condividi Posizione</span>
            </button>

            {/* Flashlight Toggle */}
            <button
              onClick={handleFlashlightToggle}
              disabled={isSendingMorse}
              data-testid="flashlight-toggle"
              className={`h-20 flex flex-col items-center justify-center gap-2 border transition-all ${
                flashlightOn && !isSendingMorse
                  ? 'bg-[#FFCC00] border-[#FFCC00] text-black'
                  : 'bg-[#111111] border-[#333333] text-white hover:border-white'
              } ${isSendingMorse ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {flashlightOn ? (
                <Flashlight size={28} strokeWidth={2} />
              ) : (
                <FlashlightOff size={28} strokeWidth={2} />
              )}
              <span className="text-xs font-bold uppercase tracking-wider">
                {flashlightOn ? 'Torcia ON' : 'Torcia OFF'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setUseSound(!useSound)}
              data-testid="sound-toggle"
              className={`h-20 flex flex-col items-center justify-center gap-2 border transition-all ${
                useSound
                  ? 'bg-[#111111] border-[#34C759] text-[#34C759]'
                  : 'bg-[#111111] border-[#333333] text-[#52525B]'
              }`}
            >
              {useSound ? (
                <Volume2 size={28} strokeWidth={2} />
              ) : (
                <VolumeX size={28} strokeWidth={2} />
              )}
              <span className="text-xs font-bold uppercase tracking-wider">
                Suono {useSound ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Emergency Call Numbers */}
          <div className="bg-[#111111] border border-[#333333] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA]">
                Chiamata Rapida
              </h3>
              <button
                onClick={() => setShowAddNumber(!showAddNumber)}
                className="text-[#007AFF] hover:text-[#0A84FF] transition-colors"
                data-testid="add-emergency-number-btn"
              >
                {showAddNumber ? <X size={20} /> : <Plus size={20} />}
              </button>
            </div>

            {/* Add Number Form */}
            {showAddNumber && (
              <div className="mb-4 p-3 bg-black border border-[#333333] space-y-2">
                <Input
                  type="text"
                  placeholder="Nome (es. Mamma)"
                  value={newNumber.name}
                  onChange={(e) => setNewNumber(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 bg-black border-[#333333] text-white placeholder:text-[#52525B] rounded-none"
                />
                <Input
                  type="tel"
                  placeholder="Numero telefono"
                  value={newNumber.phone}
                  onChange={(e) => setNewNumber(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-12 bg-black border-[#333333] text-white placeholder:text-[#52525B] rounded-none"
                />
                <button
                  onClick={addEmergencyNumber}
                  disabled={!newNumber.name.trim() || !newNumber.phone.trim()}
                  className="w-full h-12 bg-[#34C759] text-white font-bold uppercase tracking-wider disabled:bg-[#333333] disabled:text-[#52525B]"
                >
                  Aggiungi
                </button>
              </div>
            )}

            {/* Default Emergency Numbers */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => makeCall('112')}
                data-testid="call-112"
                className="h-16 bg-[#FF3B30] text-white flex flex-col items-center justify-center hover:bg-[#FF5249] transition-colors active:scale-[0.98]"
              >
                <Phone size={20} strokeWidth={2.5} />
                <span className="text-sm font-bold">112</span>
              </button>
              <button
                onClick={() => makeCall('118')}
                data-testid="call-118"
                className="h-16 bg-[#FF3B30] text-white flex flex-col items-center justify-center hover:bg-[#FF5249] transition-colors active:scale-[0.98]"
              >
                <Phone size={20} strokeWidth={2.5} />
                <span className="text-sm font-bold">118</span>
              </button>
              <button
                onClick={() => makeCall('115')}
                data-testid="call-115"
                className="h-16 bg-[#FF9500] text-white flex flex-col items-center justify-center hover:bg-[#FFa020] transition-colors active:scale-[0.98]"
              >
                <Phone size={20} strokeWidth={2.5} />
                <span className="text-sm font-bold">115</span>
              </button>
            </div>

            {/* User's Emergency Numbers */}
            {emergencyNumbers.length > 0 && (
              <div className="space-y-2 mb-3">
                <p className="text-xs text-[#52525B] uppercase tracking-wider">I tuoi numeri:</p>
                {emergencyNumbers.map((contact) => (
                  <div 
                    key={contact.id}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() => makeCall(contact.phone)}
                      data-testid={`call-${contact.id}`}
                      className="flex-1 h-14 bg-[#1A1A1A] border border-[#333333] text-white flex items-center justify-between px-4 hover:border-[#34C759] transition-colors active:scale-[0.98]"
                    >
                      <span className="font-medium">{contact.name}</span>
                      <div className="flex items-center gap-2 text-[#34C759]">
                        <span className="text-sm">{contact.phone}</span>
                        <Phone size={18} />
                      </div>
                    </button>
                    <button
                      onClick={() => removeEmergencyNumber(contact.id)}
                      className="h-14 w-14 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#52525B] hover:text-[#FF3B30] hover:border-[#FF3B30] transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Contacts from Contacts Page */}
            {contacts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-[#52525B] uppercase tracking-wider">Dai contatti salvati:</p>
                <div className="grid grid-cols-2 gap-2">
                  {contacts.slice(0, 4).map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => makeCall(contact.phone)}
                      data-testid={`call-contact-${contact.id}`}
                      className="h-14 bg-[#1A1A1A] border border-[#333333] text-white flex items-center justify-center gap-2 px-3 hover:border-[#34C759] transition-colors active:scale-[0.98]"
                    >
                      <Phone size={16} className="text-[#34C759]" />
                      <span className="text-sm font-medium truncate">{contact.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom Morse Message */}
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
                Morse Code:
              </span>
              <span className="font-mono text-lg text-white tracking-widest">
                {customMessage.toUpperCase().split('').map(char => morseCode[char] || '').join(' ')}
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#FF9500] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#A1A1AA]">
                <p className="font-bold text-white mb-1">Funzioni SOS:</p>
                <ul className="space-y-1">
                  <li>• <strong>Sirena</strong>: Allarme sonoro ad alto volume</li>
                  <li>• <strong>SMS Emergenza</strong>: Invia la tua posizione ai contatti</li>
                  <li>• <strong>Condividi Posizione</strong>: Link Google Maps</li>
                  <li>• <strong>Chiamata Rapida</strong>: 112 (Emergenze), 118 (Ambulanza), 115 (Pompieri)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SOS;
