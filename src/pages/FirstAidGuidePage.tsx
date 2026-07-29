import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Copy,
  Facebook,
  MessageCircle,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import NotFoundPage from './NotFoundPage';
import {
  getFirstAidGuide,
  isPublishedFirstAidGuide,
} from '../data/firstAidGuides';

const warning =
  'Ce guide ne remplace pas une formation pratique aux premiers secours.';

const FirstAidGuidePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = getFirstAidGuide(slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isPublishedFirstAidGuide(guide)) {
      document.title = `${guide.title} | Gestes qui sauvent — ASFO`;
    }
  }, [guide]);

  if (!isPublishedFirstAidGuide(guide)) {
    return <NotFoundPage />;
  }

  const shareUrl = window.location.href;
  const shareText = `${guide.title} — ASFO`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const sections = [
    { title: 'Contexte', content: guide.context ? [guide.context] : [] },
    { title: 'Signes à reconnaître', content: guide.signs },
    { title: 'Actions à effectuer', content: guide.actions },
    { title: 'Actions à éviter', content: guide.actionsToAvoid },
    { title: 'Quand appeler les secours', content: guide.whenToCall },
  ];

  return (
    <article className="bg-gradient-to-b from-white via-[#f4fbfa] to-white px-4 py-16 text-slate-900 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-4xl">
        <Link to="/sante/gestes-qui-sauvent" className="text-sm font-bold text-teal-700 print:hidden">
          ← Retour aux gestes qui sauvent
        </Link>

        <header className="mt-8 border-b border-teal-100 pb-8">
          <img src="/logo.png" alt="ASFO" className="hidden h-14 w-14 object-contain print:block" />
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">{guide.category}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#123f38] sm:text-5xl">{guide.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{guide.description}</p>
        </header>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="font-semibold">{warning}</p>
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-extrabold text-[#123f38]">{section.title}</h2>
              {section.content.length === 1 && section.title === 'Contexte' ? (
                <p className="mt-4 leading-7 text-slate-700">{section.content[0]}</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {section.content.map((item) => (
                    <li key={item} className="flex items-start gap-3 leading-7 text-slate-700">
                      <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-teal-100 bg-white p-6">
          <h2 className="text-xl font-extrabold text-[#123f38]">Validation du contenu</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-slate-500">Relecteur qualifié</dt>
              <dd className="mt-1 text-slate-800">{guide.validation.reviewer?.name}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Qualification</dt>
              <dd className="mt-1 text-slate-800">{guide.validation.reviewer?.qualification}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Dernière validation</dt>
              <dd className="mt-1 text-slate-800">{guide.validation.validatedAt}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Sources</dt>
              <dd className="mt-1 text-slate-800">{guide.validation.sources.join(', ')}</dd>
            </div>
          </dl>
        </section>

        <div className="mt-8 flex flex-wrap gap-2 print:hidden" aria-label="Partager ou imprimer ce guide">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-800"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-800"
          >
            <Facebook className="h-4 w-4" /> Facebook
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-800"
          >
            <Copy className="h-4 w-4" /> {copied ? 'Lien copié' : 'Copier le lien'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-800"
          >
            <Printer className="h-4 w-4" /> Imprimer
          </button>
        </div>

        <p className="mt-10 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-600">{warning}</p>
      </div>
    </article>
  );
};

export default FirstAidGuidePage;
