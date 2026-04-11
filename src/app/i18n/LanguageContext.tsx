import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  // Landing Page translations
  'hero.title.highlight': { en: 'Telemedicine', hi: 'टेलीमेडिसिन' },
  'hero.title.rest': { en: 'for everyone.', hi: 'हर किसी के लिए।' },
  'hero.subtitle': { 
      en: 'Connecting patients with top hospitals and doctors seamlessly. Subsidized care, real-time bed tracking, and instant unified records.', 
      hi: 'मरीजों को शीर्ष अस्पतालों और डॉक्टरों के साथ सहजता से जोड़ना। रियायती देखभाल, वास्तविक समय बिस्तर ट्रैकिंग, और तत्काल एकीकृत रिकॉर्ड।' 
  },
  'nav.patients': { en: 'Patients', hi: 'मरीज' },
  'nav.doctors': { en: 'Doctors', hi: 'डॉक्टर' },
  'nav.hospitals': { en: 'Hospitals', hi: 'अस्पताल' },
  'nav.about': { en: 'About Us', hi: 'हमारे बारे में' },
  'btn.book_appointment': { en: 'Book Appointment', hi: 'अपॉइंटमेंट बुक करें' },
  'btn.emergency': { en: 'Emergency Call', hi: 'आपातकालीन कॉल' },
  
  // Card translations
  'card.patient.title': { en: 'For Patients', hi: 'मरीजों के लिए' },
  'card.patient.desc': { en: 'Book instantly and secure subsidized healthcare access.', hi: 'तत्काल बुक करें और रियायती स्वास्थ्य सेवा सुरक्षित करें।' },
  'card.patient.btn': { en: 'Patient Portal', hi: 'रोगी पोर्टल' },
  
  'card.doctor.title': { en: 'For Doctors', hi: 'डॉक्टरों के लिए' },
  'card.doctor.desc': { en: 'Access unified digital records and seamlessly provide telemedicine.', hi: 'एकीकृत रिकॉर्ड एक्सेस करें और टेलीमेडिसिन प्रदान करें।' },
  'card.doctor.btn': { en: 'Doctor Portal', hi: 'डॉक्टर पोर्टल' },

  'card.hospital.title': { en: 'For Hospitals', hi: 'अस्पतालों के लिए' },
  'card.hospital.desc': { en: 'Manage available beds and track capacity in real-time.', hi: 'उपलब्ध बिस्तरों का प्रबंधन करें और क्षमता को ट्रैक करें।' },
  'card.hospital.btn': { en: 'Hospital Portal', hi: 'अस्पताल पोर्टल' },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
