import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="privacy-page">
      {/* Header */}
      <header className="sticky top-0 bg-black z-10 px-4 pt-6 pb-4 border-b border-[#333333]">
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="w-10 h-10 flex items-center justify-center border border-[#333333] hover:border-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 
            className="text-xl font-bold uppercase tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Privacy Policy
          </h1>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="p-4 space-y-6 text-[#A1A1AA]">
          {/* Header */}
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#FF3B30] flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Emergency Survival Kit</h2>
            <p className="text-sm mt-2">Informativa sulla Privacy</p>
            <p className="text-xs text-[#52525B] mt-1">Ultimo aggiornamento: Aprile 2026</p>
          </div>

          {/* Content */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">1. Titolare del Trattamento</h3>
            <p>
              Il titolare del trattamento dei dati è:<br />
              <strong className="text-white">Giuseppe Di Giorgio</strong><br />
              Email: <a href="mailto:digiorgio.giu@gmail.com" className="text-[#007AFF] hover:underline">digiorgio.giu@gmail.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">2. Dati Raccolti</h3>
            <p>
              <strong className="text-white">Emergency Survival Kit è un'app che rispetta la tua privacy.</strong>
            </p>
            <p>
              L'applicazione <strong className="text-[#34C759]">NON raccoglie, NON trasmette e NON memorizza</strong> alcun dato personale sui nostri server.
            </p>
            <p>
              Tutti i dati inseriti nell'app (contatti di emergenza, checklist, marcatori sulla mappa) sono memorizzati <strong className="text-white">esclusivamente sul tuo dispositivo</strong> tramite la tecnologia localStorage del browser.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">3. Dati Memorizzati Localmente</h3>
            <p>L'app memorizza sul tuo dispositivo:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Preferenze di lingua</li>
              <li>Contatti di emergenza inseriti</li>
              <li>Stato della checklist Go-Bag</li>
              <li>Marcatori personalizzati sulla mappa</li>
              <li>Numeri di emergenza personalizzati</li>
              <li>Impostazioni del timer</li>
            </ul>
            <p>
              Questi dati <strong className="text-white">non lasciano mai il tuo dispositivo</strong> e non sono accessibili a noi o a terze parti.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">4. Permessi Richiesti</h3>
            <p>L'app può richiedere i seguenti permessi:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Geolocalizzazione</strong>: Per mostrare la tua posizione sulla mappa e trovare i rifugi più vicini. La posizione NON viene mai trasmessa a server esterni.</li>
              <li><strong className="text-white">Fotocamera/Torcia</strong>: Per la funzione SOS flashlight. Nessuna foto o video viene registrato.</li>
              <li><strong className="text-white">Orientamento dispositivo</strong>: Per la funzione bussola.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">5. Servizi di Terze Parti</h3>
            <p>L'app utilizza i seguenti servizi esterni:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">CARTO Basemaps</strong>: Per le mappe. Soggetto alla privacy policy di CARTO.</li>
              <li><strong className="text-white">National Weather Service (NWS)</strong>: Per gli alert meteo negli USA.</li>
              <li><strong className="text-white">GDACS</strong>: Per gli alert di disastri globali.</li>
            </ul>
            <p>
              Quando utilizzi queste funzionalità, il tuo indirizzo IP potrebbe essere visibile ai rispettivi servizi secondo le loro policy.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">6. Funzionalità Offline</h3>
            <p>
              L'app è progettata per funzionare <strong className="text-white">100% offline</strong>. 
              Le guide di sopravvivenza, la checklist e il database dei rifugi sono disponibili senza connessione internet.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">7. Sicurezza dei Dati</h3>
            <p>
              Poiché tutti i dati sono memorizzati localmente sul tuo dispositivo, la sicurezza dipende dalle impostazioni di sicurezza del tuo dispositivo (PIN, password, biometria).
            </p>
            <p>
              Ti consigliamo di mantenere il tuo dispositivo protetto con un codice di accesso.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">8. Cancellazione dei Dati</h3>
            <p>
              Puoi cancellare tutti i dati dell'app in qualsiasi momento:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cancellando i dati dell'app dalle impostazioni del dispositivo</li>
              <li>Cancellando la cache del browser</li>
              <li>Disinstallando l'applicazione</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">9. Minori</h3>
            <p>
              L'app non è destinata a minori di 13 anni. Non raccogliamo consapevolmente dati da minori.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">10. Modifiche alla Privacy Policy</h3>
            <p>
              Ci riserviamo il diritto di modificare questa privacy policy. Le modifiche saranno pubblicate in questa pagina con la data di aggiornamento.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">11. Contatti</h3>
            <p>
              Per domande sulla privacy, contattaci a:<br />
              <a href="mailto:digiorgio.giu@gmail.com" className="text-[#007AFF] hover:underline">digiorgio.giu@gmail.com</a>
            </p>
          </section>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-[#1A1A1A] border border-[#333333]">
            <h3 className="text-sm font-bold text-[#FF9500] mb-2">⚠️ DISCLAIMER</h3>
            <p className="text-xs">
              Emergency Survival Kit è un'applicazione di supporto informativo. 
              Le guide e le informazioni fornite sono a scopo educativo e non sostituiscono 
              la formazione professionale, i servizi di emergenza o il parere medico. 
              In caso di emergenza reale, contatta sempre i servizi di emergenza locali (112, 118, 115).
            </p>
          </div>

          {/* Footer */}
          <div className="text-center py-6 text-xs text-[#52525B]">
            <p>© 2026 Giuseppe Di Giorgio</p>
            <p>Emergency Survival Kit - Tutti i diritti riservati</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicy;
