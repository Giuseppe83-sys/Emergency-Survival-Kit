import React, { useState } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { useContacts } from '../hooks/useLocalStorage';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  Phone, 
  Plus, 
  Trash2, 
  Edit2, 
  User,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

const Contacts = () => {
  const { t } = useLanguageContext();
  const [contacts, setContacts] = useContacts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', relationship: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) return;

    if (editingId) {
      setContacts(prev => 
        prev.map(contact => 
          contact.id === editingId 
            ? { ...contact, ...formData }
            : contact
        )
      );
      setEditingId(null);
    } else {
      const newContact = {
        id: `contact-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString()
      };
      setContacts(prev => [...prev, newContact]);
    }

    setFormData({ name: '', phone: '', relationship: '' });
    setShowForm(false);
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship || ''
    });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleDelete = (contactId) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', phone: '', relationship: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="contacts-page">
      {/* Header */}
      <header className="sticky top-0 bg-black z-10 px-4 pt-6 pb-4 border-b border-[#333333]">
        <div className="flex items-center justify-between">
          <h1 
            className="text-2xl font-bold uppercase tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {t('emergencyContacts')}
          </h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              data-testid="add-contact-btn"
              className="h-12 px-4 bg-[#FF3B30] text-white flex items-center gap-2 font-bold uppercase tracking-wider text-sm hover:bg-[#FF5249] transition-colors"
            >
              <Plus size={20} strokeWidth={2.5} />
              {t('addContact')}
            </button>
          )}
        </div>
      </header>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="p-4 bg-[#111111] border-b border-[#333333]">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-[#A1A1AA] uppercase tracking-widest block mb-2">
                {t('name')} *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                required
                data-testid="contact-name-input"
                className="w-full h-14 px-4 bg-black border-2 border-[#333333] text-white placeholder:text-[#52525B] focus:border-white focus:ring-0 rounded-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#A1A1AA] uppercase tracking-widest block mb-2">
                {t('phone')} *
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 234 567 8900"
                required
                data-testid="contact-phone-input"
                className="w-full h-14 px-4 bg-black border-2 border-[#333333] text-white placeholder:text-[#52525B] focus:border-white focus:ring-0 rounded-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#A1A1AA] uppercase tracking-widest block mb-2">
                {t('relationship')}
              </label>
              <Input
                type="text"
                value={formData.relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                placeholder="Family, Friend, Doctor..."
                data-testid="contact-relationship-input"
                className="w-full h-14 px-4 bg-black border-2 border-[#333333] text-white placeholder:text-[#52525B] focus:border-white focus:ring-0 rounded-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={cancelForm}
                data-testid="cancel-contact-btn"
                className="flex-1 h-14 bg-[#111111] border-2 border-[#333333] text-white font-bold uppercase tracking-wider hover:border-white transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} />
                {t('cancel')}
              </button>
              <button
                type="submit"
                data-testid="save-contact-btn"
                className="flex-1 h-14 bg-[#34C759] text-white font-bold uppercase tracking-wider hover:bg-[#2DB14A] transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} />
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contacts List */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-[#111111] border border-[#333333] flex items-center justify-center mb-4">
              <AlertCircle size={40} className="text-[#52525B]" />
            </div>
            <p className="text-[#A1A1AA] text-lg">{t('noContacts')}</p>
            <p className="text-[#52525B] text-sm mt-2">
              Add emergency contacts to quickly reach them
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-[#111111] border border-[#333333] p-4"
                data-testid={`contact-card-${contact.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center">
                      <User size={24} className="text-[#A1A1AA]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{contact.name}</h3>
                      {contact.relationship && (
                        <p className="text-xs text-[#52525B] uppercase tracking-wider">
                          {contact.relationship}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="w-10 h-10 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                      data-testid={`edit-contact-${contact.id}`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="w-10 h-10 flex items-center justify-center text-[#52525B] hover:text-[#FF3B30] hover:bg-[#1A1A1A] transition-colors"
                      data-testid={`delete-contact-${contact.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCall(contact.phone)}
                  data-testid={`call-contact-${contact.id}`}
                  className="w-full h-14 mt-4 bg-[#34C759] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-[#2DB14A] transition-colors active:scale-[0.98]"
                >
                  <Phone size={20} strokeWidth={2.5} />
                  {contact.phone}
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Contacts;
