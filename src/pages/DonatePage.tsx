import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, CheckCircle, Activity, Calendar, Loader2 } from 'lucide-react';

const AMOUNTS = [
  { value: 1000, label: '1 000' },
  { value: 2000, label: '2 000' },
  { value: 5000, label: '5 000' },
  { value: 10000, label: '10 000' },
  { value: 25000, label: '25 000' },
  { value: 50000, label: '50 000' },
];

const impactItems = [
  { amount: '1 000 F', description: 'Permet de fournir des médicaments essentiels à un patient' },
  { amount: '5 000 F', description: 'Finance une consultation médicale complète pour une personne' },
  { amount: '10 000 F', description: "Contribue à l'achat de matériel médical pour les missions" },
  { amount: '25 000 F', description: "Soutient une journée de sensibilisation dans un village" },
  { amount: '50 000 F', description: "Finance la formation d'un agent de santé communautaire" },
  { amount: '100 000 F', description: "Permet d'organiser une mission médicale d'une journée" },
];

const DonatePage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'ASFO | Faire un don';
  }, []);

  const currentAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  // TODO: Réactiver quand l'intégration Wave sera prête
  // const handleDonate = async () => {
  //   if (currentAmount < 100) {
  //     setError('Le montant minimum est de 100 FCFA');
  //     return;
  //   }
  //
  //   setLoading(true);
  //   setError('');
  //
  //   try {
  //     const response = await fetch('/api/wave/create-checkout', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         amount: currentAmount,
  //         donorName: donorName || 'Anonyme',
  //         donorPhone: donorPhone || null,
  //       }),
  //     });
  //
  //     const data = await response.json();
  //
  //     if (data.wave_launch_url) {
  //       window.location.href = data.wave_launch_url;
  //     } else {
  //       setError(data.error || 'Erreur lors de la création du paiement');
  //       setLoading(false);
  //     }
  //   } catch {
  //     setError('Erreur de connexion. Vérifiez votre internet.');
  //     setLoading(false);
  //   }
  // };

  const handleDonate = () => {
    setError('\u{1F6A7} Le paiement par Wave sera bient\u00f4t disponible. Merci de votre patience !');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-20 bg-teal-600">
        <div className="absolute inset-0 z-0">
          <img
            src="/41.webp"
            alt="ASFO medical mission"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-700/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Heart className="mr-2 text-red-300" size={16} />
              <span>Votre générosité sauve des vies</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Soutenez l'ASFO
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Votre don aide à fournir des soins médicaux gratuits aux populations du Fouta.
              Payez rapidement et en toute sécurité via Wave.
            </p>
          </div>
        </div>
      </div>

      {/* Donation Form Section */}
      <section id="donation-form" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Faites un don</h2>
                <div className="mx-auto lg:mx-0 mt-3 h-1 w-16 rounded-full bg-teal-500" />
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Choisissez un montant et payez instantanément via Wave.
                  100% de votre don finance nos missions médicales.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                {/* Amount grid */}
                <p className="text-sm font-medium text-gray-700 mb-3">Montant du don</p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {AMOUNTS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleAmountClick(value)}
                      className={`py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        selectedAmount === value && !customAmount
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                          : 'bg-gray-50 text-gray-800 border border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                      }`}
                    >
                      {label} F
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <p className="text-sm text-gray-500 mb-2">Ou saisissez un montant libre :</p>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-teal-400 transition-colors mb-5">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setError(''); }}
                    placeholder="Ex: 15000"
                    min="100"
                    className="flex-1 px-4 py-3 outline-none text-base"
                  />
                  <span className="px-4 py-3 bg-gray-50 text-gray-500 font-semibold text-sm border-l border-gray-200">
                    FCFA
                  </span>
                </div>

                {/* Donor info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Votre nom (optionnel)"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-teal-400 transition-colors"
                  />
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="Téléphone (optionnel)"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-teal-400 transition-colors"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Amount display */}
                <div className="mb-5 py-4 px-5 bg-teal-50 border border-teal-200 rounded-xl text-center">
                  <span className="text-gray-600 text-sm">Montant du don : </span>
                  <strong className="text-teal-700 text-2xl">
                    {currentAmount.toLocaleString('fr-FR')} FCFA
                  </strong>
                </div>

                {/* Wave button — temporairement désactivé */}
                <button
                  onClick={handleDonate}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white text-lg font-bold transition-all duration-300 opacity-60 cursor-not-allowed"
                  style={{
                    background: '#9ca3af',
                  }}
                >
                  <img src="/wave.webp" alt="Wave" className="h-6 w-6 rounded grayscale" />
                  Bient\u00f4t disponible
                </button>

                {/* TODO: Réactiver quand Wave sera prêt */}
                {/* <button
                  onClick={handleDonate}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white text-lg font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #1B9AD5, #00B4D8)',
                    boxShadow: loading ? 'none' : '0 4px 15px rgba(27,154,213,0.3)',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Redirection vers Wave...
                    </>
                  ) : (
                    <>
                      <img src="/wave.webp" alt="Wave" className="h-6 w-6 rounded" />
                      Faire un don via Wave
                    </>
                  )}
                </button> */}

                <p className="text-center text-xs text-gray-400 mt-4">
                  Paiement via Wave — bient\u00f4t disponible
                </p>
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-start mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 text-red-600">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Pourquoi donner ?</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Votre don finance nos missions médicales au Sénégal : médicaments, matériel médical et formation du personnel de santé local.
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Utilisation des dons</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      80% directement affectés aux missions, 15% aux frais de fonctionnement, 5% à la communication et collecte.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 text-green-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Transparence totale</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Des rapports d'activité détaillés vous permettent de suivre l'impact concret de votre contribution.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">Autres moyens de donner</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2.5 flex-shrink-0" />
                      Par virement bancaire (RIB sur demande)
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2.5 flex-shrink-0" />
                      Dons en nature (médicaments, matériel médical)
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2.5 flex-shrink-0" />
                      Contact : +221 71 040 17 60
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">L'impact de votre don</h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal-500" />
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Découvrez comment votre contribution fait une différence concrète sur le terrain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {impactItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-4 text-teal-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.amount}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;
