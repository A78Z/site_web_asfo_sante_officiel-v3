import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Building2,
  Mail,
  Shield,
  Bell,
  Newspaper,
  MessageSquare,
  Save,
  Loader2,
  CheckCircle,
  Upload,
  ImageIcon,
  Globe,
  Phone,
  MapPin,
  Key,
  Lock,
  Clock,
  ToggleLeft,
  X,
} from 'lucide-react';
import { queryObjects, updateObject, createObject, uploadFile } from '../lib/parse';

const CLASS_NAME = 'SiteSettings';

interface SiteSettings {
  objectId: string;
  siteName: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  logo?: { __type: 'File'; name: string; url: string };
  favicon?: { __type: 'File'; name: string; url: string };
  defaultImage?: { __type: 'File'; name: string; url: string };
  contactEmail: string;
  notifEmail: string;
  newsletterEmail: string;
  newsletterEnabled: boolean;
  doubleOptIn: boolean;
  emailNotificationsEnabled: boolean;
  newRequestNotification: boolean;
  secureAuth: boolean;
  limitAdminAccess: boolean;
  lastLogin?: { __type: 'Date'; iso: string } | string;
  updatedAt: string;
}

type TabId = 'general' | 'email' | 'security' | 'notifications' | 'newsletter' | 'messages';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Settings;
}

const tabs: Tab[] = [
  { id: 'general', label: 'Général', icon: Building2 },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'newsletter', label: 'Newsletter', icon: Newspaper },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

/* ──────────── Toggle component ──────────── */
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }> = ({
  checked,
  onChange,
  label,
  description,
}) => (
  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition hover:bg-gray-50">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-teal-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </label>
);

/* ──────────── Field wrapper ──────────── */
const Field: React.FC<{ label: string; children: React.ReactNode; icon?: typeof Mail }> = ({
  label,
  children,
  icon: Icon,
}) => (
  <div>
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
      {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100';

/* ════════════════════════════════════════ Page ════════════════════════════════════════ */
const AdminSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  /* form state */
  const [siteName, setSiteName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notifEmail, setNotifEmail] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [doubleOptIn, setDoubleOptIn] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [newRequestNotification, setNewRequestNotification] = useState(true);
  const [secureAuth, setSecureAuth] = useState(false);
  const [limitAdminAccess, setLimitAdminAccess] = useState(false);

  /* file previews */
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');
  const [defaultImagePreview, setDefaultImagePreview] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [defaultImageFile, setDefaultImageFile] = useState<File | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<SiteSettings>(CLASS_NAME, { limit: 1 });
      if (results.length > 0) {
        const s = results[0];
        setSettings(s);
        setSiteName(s.siteName || '');
        setDescription(s.description || '');
        setEmail(s.email || '');
        setPhone(s.phone || '');
        setAddress(s.address || '');
        setContactEmail(s.contactEmail || '');
        setNotifEmail(s.notifEmail || '');
        setNewsletterEmail(s.newsletterEmail || '');
        setNewsletterEnabled(s.newsletterEnabled ?? true);
        setDoubleOptIn(s.doubleOptIn ?? false);
        setEmailNotificationsEnabled(s.emailNotificationsEnabled ?? true);
        setNewRequestNotification(s.newRequestNotification ?? true);
        setSecureAuth(s.secureAuth ?? false);
        setLimitAdminAccess(s.limitAdminAccess ?? false);
        if (s.logo?.url) setLogoPreview(s.logo.url);
        if (s.favicon?.url) setFaviconPreview(s.favicon.url);
        if (s.defaultImage?.url) setDefaultImagePreview(s.defaultImage.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const data: Record<string, unknown> = {
        siteName,
        description,
        email,
        phone,
        address,
        contactEmail,
        notifEmail,
        newsletterEmail,
        newsletterEnabled,
        doubleOptIn,
        emailNotificationsEnabled,
        newRequestNotification,
        secureAuth,
        limitAdminAccess,
      };

      if (logoFile) {
        data.logo = await uploadFile(logoFile.name, logoFile);
      }
      if (faviconFile) {
        data.favicon = await uploadFile(faviconFile.name, faviconFile);
      }
      if (defaultImageFile) {
        data.defaultImage = await uploadFile(defaultImageFile.name, defaultImageFile);
      }

      if (settings?.objectId) {
        await updateObject(CLASS_NAME, settings.objectId, data);
      } else {
        await createObject(CLASS_NAME, data);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchSettings();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (
    setter: (f: File | null) => void,
    previewSetter: (u: string) => void,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const fmtDate = (d: unknown) => {
    if (!d) return '—';
    const iso = typeof d === 'object' && d !== null && 'iso' in d ? (d as { iso: string }).iso : String(d);
    return new Date(iso).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-3 text-sm text-gray-500">Chargement des paramètres...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="mt-1 text-sm text-gray-500">Configuration générale de la plateforme ASFO</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? 'Sauvegarde...' : saved ? 'Enregistré !' : 'Sauvegarder'}
        </button>
      </div>

      {/* Success banner */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3"
        >
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-700">Paramètres mis à jour avec succès</p>
        </motion.div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tabs sidebar */}
        <nav className="shrink-0 lg:w-56">
          <div className="rounded-xl border border-gray-200 bg-white p-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${
                    active
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-teal-600' : 'text-gray-400'}`} />
                  {t.label}
                </button>
              );
            })}
          </div>
          {settings?.updatedAt && (
            <p className="mt-3 px-2 text-[11px] text-gray-400">
              Dernière mise à jour : {fmtDate(settings.updatedAt)}
            </p>
          )}
        </nav>

        {/* Content area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            {/* ═══ GÉNÉRAL ═══ */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Informations du site</h2>
                  <p className="mt-0.5 text-sm text-gray-500">Informations principales de votre organisation</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nom de l'organisation" icon={Building2}>
                    <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Email principal" icon={Mail}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Téléphone" icon={Phone}>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Adresse" icon={MapPin}>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={inputCls}
                  />
                </Field>

                {/* Logo & images */}
                <div>
                  <h3 className="mb-3 text-sm font-bold text-gray-800">Logo et images</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Logo */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="mb-2 text-xs font-semibold text-gray-600">Logo du site</p>
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="mb-2 h-16 w-16 rounded-lg border border-gray-200 object-contain bg-white p-1" />
                      ) : (
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
                          <ImageIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleFileChange(setLogoFile, setLogoPreview)} className="w-full text-xs file:mr-2 file:rounded-md file:border-0 file:bg-teal-50 file:px-2 file:py-1 file:text-xs file:font-medium file:text-teal-700" />
                    </div>
                    {/* Favicon */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="mb-2 text-xs font-semibold text-gray-600">Favicon</p>
                      {faviconPreview ? (
                        <img src={faviconPreview} alt="Favicon" className="mb-2 h-16 w-16 rounded-lg border border-gray-200 object-contain bg-white p-1" />
                      ) : (
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
                          <Globe className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleFileChange(setFaviconFile, setFaviconPreview)} className="w-full text-xs file:mr-2 file:rounded-md file:border-0 file:bg-teal-50 file:px-2 file:py-1 file:text-xs file:font-medium file:text-teal-700" />
                    </div>
                    {/* Default image */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="mb-2 text-xs font-semibold text-gray-600">Image par défaut</p>
                      {defaultImagePreview ? (
                        <img src={defaultImagePreview} alt="Default" className="mb-2 h-16 w-16 rounded-lg border border-gray-200 object-cover bg-white" />
                      ) : (
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
                          <ImageIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleFileChange(setDefaultImageFile, setDefaultImagePreview)} className="w-full text-xs file:mr-2 file:rounded-md file:border-0 file:bg-teal-50 file:px-2 file:py-1 file:text-xs file:font-medium file:text-teal-700" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ EMAIL ═══ */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Paramètres email</h2>
                  <p className="mt-0.5 text-sm text-gray-500">Configurez les adresses email du système</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email admin" icon={Mail}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Email notifications" icon={Bell}>
                    <input type="email" value={notifEmail} onChange={(e) => setNotifEmail(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Email newsletter" icon={Newspaper}>
                    <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Email contact" icon={MessageSquare}>
                    <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Toggle
                  checked={emailNotificationsEnabled}
                  onChange={setEmailNotificationsEnabled}
                  label="Activer les notifications par email"
                  description="Recevoir un email lors de chaque nouvelle action sur la plateforme"
                />
              </div>
            )}

            {/* ═══ SÉCURITÉ ═══ */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Paramètres de sécurité</h2>
                  <p className="mt-0.5 text-sm text-gray-500">Gérez la sécurité de votre espace admin</p>
                </div>
                <Toggle
                  checked={secureAuth}
                  onChange={setSecureAuth}
                  label="Authentification sécurisée"
                  description="Exiger une vérification en deux étapes pour les connexions admin"
                />
                <Toggle
                  checked={limitAdminAccess}
                  onChange={setLimitAdminAccess}
                  label="Limiter l'accès admin"
                  description="Restreindre l'accès au dashboard aux adresses IP autorisées"
                />

                {/* Password change (UI only) */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-bold text-gray-800">Changer le mot de passe admin</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nouveau mot de passe" icon={Lock}>
                      <input type="password" placeholder="••••••••" className={inputCls} />
                    </Field>
                    <Field label="Confirmer le mot de passe" icon={Lock}>
                      <input type="password" placeholder="••••••••" className={inputCls} />
                    </Field>
                  </div>
                  <button className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-900">
                    <Key className="h-3.5 w-3.5" /> Mettre à jour le mot de passe
                  </button>
                </div>

                {/* Last login */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-5 py-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Dernière connexion admin</p>
                    <p className="text-xs text-gray-500">{fmtDate(settings?.lastLogin || settings?.updatedAt)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ NOTIFICATIONS ═══ */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Paramètres notifications</h2>
                  <p className="mt-0.5 text-sm text-gray-500">Configurez quand et comment recevoir des alertes</p>
                </div>
                <Toggle
                  checked={emailNotificationsEnabled}
                  onChange={setEmailNotificationsEnabled}
                  label="Notifications par email"
                  description="Recevoir un résumé des activités par email"
                />
                <Toggle
                  checked={newRequestNotification}
                  onChange={setNewRequestNotification}
                  label="Notification nouvelle demande"
                  description="Être notifié à chaque nouvelle candidature, demande bénévole ou message"
                />
              </div>
            )}

            {/* ═══ NEWSLETTER ═══ */}
            {activeTab === 'newsletter' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Paramètres newsletter</h2>
                  <p className="mt-0.5 text-sm text-gray-500">Gérez les options d'inscription à la newsletter</p>
                </div>
                <Toggle
                  checked={newsletterEnabled}
                  onChange={setNewsletterEnabled}
                  label="Activer l'abonnement newsletter"
                  description="Permettre aux visiteurs de s'inscrire à la newsletter depuis le site"
                />
                <Toggle
                  checked={doubleOptIn}
                  onChange={setDoubleOptIn}
                  label="Double confirmation (Double Opt-In)"
                  description="Envoyer un email de confirmation avant de valider l'inscription"
                />
                <Field label="Email d'envoi newsletter" icon={Newspaper}>
                  <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className={inputCls} />
                </Field>
              </div>
            )}

            {/* ═══ MESSAGES ═══ */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Paramètres messages</h2>
                  <p className="mt-0.5 text-sm text-gray-500">Configurez la réception des messages de contact</p>
                </div>
                <Field label="Email recevant les messages contact" icon={Mail}>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputCls} />
                </Field>
                <Toggle
                  checked={newRequestNotification}
                  onChange={setNewRequestNotification}
                  label="Notification nouvelle demande"
                  description="Recevoir une alerte email à chaque nouveau message contact"
                />
              </div>
            )}
          </motion.div>

          {/* Bottom save button (mobile friendly) */}
          <div className="mt-6 flex justify-end lg:hidden">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
