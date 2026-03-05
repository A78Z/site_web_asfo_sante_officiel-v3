import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { queryObjects } from '../../lib/parse';

interface OfficialAnnouncement {
  objectId: string;
  title: string;
  description: string;
  image?: { __type: string; name: string; url: string };
  buttonText?: string;
  buttonLink?: string;
  contactPhone?: string;
  contactDeposit?: string;
  startDate?: { __type: string; iso: string };
  endDate?: { __type: string; iso: string };
  active: boolean;
}

const AdvertisementSection: React.FC = () => {
  const [ads, setAds] = useState<OfficialAnnouncement[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const fetchAds = useCallback(async () => {
    try {
      const { results } = await queryObjects<OfficialAnnouncement>('OfficialAnnouncements', {
        where: { active: true },
        order: '-startDate',
        limit: 10,
      });
      setAds(results);
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [ads.length]);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + ads.length) % ads.length);
  const next = () => setCurrent((c) => (c + 1) % ads.length);

  if (loading || ads.length === 0) return null;

  const ad = ads[current];
  const imageUrl = ad.image?.url || '/campagne-asfo-2026.jpeg';
  const isExternal = ad.buttonLink?.startsWith('http');
  const btnText = ad.buttonText || 'En savoir plus';

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-white to-teal-50/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
            <Megaphone className="h-3.5 w-3.5" />
            Annonce officielle
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Actualité <span className="text-teal-600">ASFO</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500">
            Restez informé des campagnes médicales, annonces et événements importants
          </p>
        </motion.div>

        {/* Ad card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-xl shadow-teal-900/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={ad.objectId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid items-stretch md:grid-cols-2"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 md:aspect-auto md:min-h-[480px]">
                  <img
                    src={imageUrl}
                    alt={ad.title}
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white/10" />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                  <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                    <Megaphone className="h-4 w-4" />
                    Annonce importante
                  </div>

                  <h3 className="mb-4 text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-4xl">
                    {ad.title}
                  </h3>

                  <p className="mb-8 text-base leading-relaxed text-gray-600 md:text-lg">
                    {ad.description}
                  </p>

                  {ad.buttonLink && (
                    <a
                      href={ad.buttonLink}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="group inline-flex w-fit items-center gap-2.5 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30"
                    >
                      {btnText}
                      {isExternal ? (
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      ) : (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </a>
                  )}

                  {/* Contact info */}
                  {(ad.contactPhone || ad.contactDeposit) && (
                    <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      {ad.contactPhone && (
                        <>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Renseignements</p>
                          <p className="text-sm font-medium text-gray-700">{ad.contactPhone}</p>
                        </>
                      )}
                      {ad.contactDeposit && (
                        <p className="mt-1 text-xs text-gray-500">Dépôt : {ad.contactDeposit}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            {ads.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur transition hover:bg-white hover:shadow-lg"
                  aria-label="Annonce précédente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur transition hover:bg-white hover:shadow-lg"
                  aria-label="Annonce suivante"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {ads.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {ads.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Annonce ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 bg-teal-600'
                      : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AdvertisementSection;
