"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'en' | 'es' | 'fr' | 'ar' | 'pt' | 'sw';

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    'nav.deals': 'Deals',
    'nav.library': 'Library',
    'nav.templates': 'Templates',
    'nav.resolve': 'Resolve',
    'nav.settings': 'Settings',
    'dashboard.title': 'Deals.',
    'dashboard.subtitle': 'Your Command Center',
    'dashboard.allDeals': 'All Deals',
    'dashboard.toSign': 'To Sign',
    'dashboard.value': 'Value',
    'dashboard.help': 'Help',
    'contracts.title': 'All Deals.',
    'contracts.newAgreement': 'New Agreement',
    'templates.title': 'Styles.',
    'templates.createNew': 'Create New',
    'settings.title': 'Settings.',
    'guidance.title': 'Guidance.',
    'library.title': 'Library.',
    'common.verified': 'Verified',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.delete': 'Delete',
    'common.search': 'Search...',
    'signature.title': 'Sign Here',
    'signature.draw': 'Draw',
    'signature.type': 'Type',
    'signature.confirm': 'Confirm Signature',
    'payment.progress': 'Payment Progress',
    'payment.nextDue': 'Next Payment Due',
    'payment.markPaid': 'Mark Paid',
    'dispute.title': 'Resolve a Dispute',
    'import.title': 'Import a Chat',
    'import.subtitle': 'Turn any conversation into a contract',
    'pdf.generate': 'Generate PDF',
    'pdf.download': 'Download',
    'enhance.title': 'Agreement Visuals',
    'enhance.subtitle': 'Professional themes for any device',
    'notification.title': 'Notifications',
    'notification.markAllRead': 'Mark All Read',
    'brand.tagline': 'Secured Agreements.',
  },
  es: {
    'nav.deals': 'Acuerdos',
    'nav.library': 'Biblioteca',
    'nav.templates': 'Plantillas',
    'nav.resolve': 'Resolver',
    'nav.settings': 'Ajustes',
    'dashboard.title': 'Acuerdos.',
    'dashboard.subtitle': 'Tu Centro de Control',
    'dashboard.allDeals': 'Todos',
    'dashboard.toSign': 'Por Firmar',
    'dashboard.value': 'Valor',
    'dashboard.help': 'Ayuda',
    'contracts.title': 'Todos los Acuerdos.',
    'contracts.newAgreement': 'Nuevo Acuerdo',
    'templates.title': 'Estilos.',
    'templates.createNew': 'Crear Nuevo',
    'settings.title': 'Ajustes.',
    'guidance.title': 'Guía.',
    'library.title': 'Biblioteca.',
    'common.verified': 'Verificado',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.delete': 'Eliminar',
    'common.search': 'Buscar...',
    'signature.title': 'Firma Aquí',
    'signature.draw': 'Dibujar',
    'signature.type': 'Escribir',
    'signature.confirm': 'Confirmar Firma',
    'payment.progress': 'Progreso de Pago',
    'payment.nextDue': 'Próximo Pago',
    'payment.markPaid': 'Marcar Pagado',
    'dispute.title': 'Resolver Disputa',
    'import.title': 'Importar Chat',
    'import.subtitle': 'Convierte cualquier conversación en contrato',
    'pdf.generate': 'Generar PDF',
    'pdf.download': 'Descargar',
    'enhance.title': 'Agreement Visuals',
    'enhance.subtitle': 'Motor de Mejora Visual',
    'notification.title': 'Notificaciones',
    'notification.markAllRead': 'Marcar Todo Leído',
    'brand.tagline': 'Del Apretón al Acuerdo.',
  },
  fr: {
    'nav.deals': 'Accords',
    'nav.library': 'Bibliothèque',
    'nav.templates': 'Modèles',
    'nav.resolve': 'Résoudre',
    'nav.settings': 'Paramètres',
    'dashboard.title': 'Accords.',
    'dashboard.subtitle': 'Votre Centre de Commande',
    'dashboard.allDeals': 'Tous',
    'dashboard.toSign': 'À Signer',
    'dashboard.value': 'Valeur',
    'dashboard.help': 'Aide',
    'contracts.title': 'Tous les Accords.',
    'contracts.newAgreement': 'Nouvel Accord',
    'common.verified': 'Vérifié',
    'common.loading': 'Chargement...',
    'brand.tagline': 'De la Poignée au Contrat.',
  },
  ar: {
    'nav.deals': 'الصفقات',
    'nav.library': 'المكتبة',
    'nav.templates': 'القوالب',
    'nav.resolve': 'حل',
    'nav.settings': 'الإعدادات',
    'dashboard.title': 'الصفقات.',
    'dashboard.allDeals': 'الكل',
    'dashboard.toSign': 'للتوقيع',
    'dashboard.value': 'القيمة',
    'dashboard.help': 'مساعدة',
    'common.verified': 'موثق',
    'common.loading': 'جاري التحميل...',
    'brand.tagline': 'من المصافحة إلى الاتفاق.',
  },
  pt: {
    'nav.deals': 'Acordos',
    'nav.library': 'Biblioteca',
    'nav.templates': 'Modelos',
    'nav.resolve': 'Resolver',
    'nav.settings': 'Configurações',
    'dashboard.title': 'Acordos.',
    'dashboard.allDeals': 'Todos',
    'dashboard.toSign': 'Para Assinar',
    'dashboard.value': 'Valor',
    'dashboard.help': 'Ajuda',
    'common.verified': 'Verificado',
    'common.loading': 'Carregando...',
    'brand.tagline': 'Do Aperto ao Acordo.',
  },
  sw: {
    'nav.deals': 'Mikataba',
    'nav.library': 'Maktaba',
    'nav.templates': 'Violezo',
    'nav.resolve': 'Suluhisha',
    'nav.settings': 'Mipangilio',
    'dashboard.title': 'Mikataba.',
    'dashboard.allDeals': 'Yote',
    'dashboard.toSign': 'Kusaini',
    'dashboard.value': 'Thamani',
    'dashboard.help': 'Msaada',
    'common.verified': 'Imethibitishwa',
    'common.loading': 'Inapakia...',
    'brand.tagline': 'Kutoka Mkono hadi Mkataba.',
  },
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string): string => {
    return TRANSLATIONS[locale]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const AVAILABLE_LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
];
