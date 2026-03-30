import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Guides from "./pages/Guides";
import Checklist from "./pages/Checklist";
import SOS from "./pages/SOS";
import EmergencyMap from "./pages/Map";
import Contacts from "./pages/Contacts";
import Timer from "./pages/Timer";
import CompassPage from "./pages/Compass";
import Alerts from "./pages/Alerts";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <div className="App bg-black min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/sos" element={<SOS />} />
            <Route path="/map" element={<EmergencyMap />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/compass" element={<CompassPage />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
          <Navigation />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
