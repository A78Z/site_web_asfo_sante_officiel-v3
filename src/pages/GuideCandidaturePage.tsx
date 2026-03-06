import React from 'react';
import { BookOpen, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuideCandidaturePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans pb-24">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* En-tête de la page */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center border-2 border-teal-100">
                        <BookOpen className="text-teal-600" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Guide de candidature
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Consultez les informations complètes sur la Campagne Médicale ASFO Santé 2026 et les critères de sélection des villages.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://drive.google.com/file/d/1eHtz0EjORY4bpZAWP3bAvPxooIz_kjwb/view"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
                        >
                            <Download size={20} />
                            Télécharger le PDF interactif
                        </a>
                        <Link
                            to="/candidature"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition"
                        >
                            Aller au formulaire
                        </Link>
                    </div>
                </div>

                {/* Corps du guide (Style Article / Institutional) */}
                <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 prose prose-lg prose-teal max-w-none">
                    <p className="lead text-xl text-gray-600 font-medium pb-6 border-b border-gray-100 mb-8">
                        Dans le cadre de l’organisation de la 27ème édition de la Grande Campagne Médicale de l'ASFO pré-prévue pour Août 2026, les Amicales des étudiants, représentant leur localité dans le département de Podor, sont invitées à soumettre leur candidature.
                    </p>

                    <h2 className="text-teal-800 flex items-center gap-3">
                        <AlertTriangle className="text-teal-600" /> 1. Critères d'éligibilité
                    </h2>
                    <p>
                        Les dossiers seront rigoureusement étudiés par la Commission Planification et Logistique sur la base de critères spécifiques :
                    </p>
                    <ul>
                        <li><strong>Critères sanitaires :</strong> L'état des infrastructures locales, les besoins urgents de la population en soins médicaux.</li>
                        <li><strong>Critères géographiques :</strong> L'enclavement, la distance par rapport aux centres hospitaliers régionaux.</li>
                        <li><strong>Critères organisationnels :</strong> La capacité d'accueil de l'amicale, la disponibilité des logements pour l'équipe médicale (minimum 100 personnes).</li>
                    </ul>

                    <h2 className="text-teal-800 flex items-center gap-3 mt-12">
                        <CheckCircle className="text-teal-600" /> 2. Pièces à fournir
                    </h2>
                    <p>
                        Tout dossier incomplet sera automatiquement rejeté. Voici les pièces constitutives du dossier de candidature, à regrouper en <strong>un seul fichier PDF</strong> :
                    </p>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 not-prose mb-8">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                <span className="text-gray-700">Une <strong>lettre de candidature officielle</strong> adressée au Président de l'ASFO.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                <span className="text-gray-700">Une <strong>note de présentation géographique</strong> détaillée de la localité.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                <span className="text-gray-700">Une <strong>note sur la situation sanitaire</strong> soulignant les besoins majeurs à prendre en charge.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                <span className="text-gray-700">Preuve de paiement des <strong>frais de dossier (20 000 FCFA)</strong> non remboursables.</span>
                            </li>
                        </ul>
                    </div>

                    <h2 className="text-teal-800 flex items-center gap-3 mt-12">
                        <Clock className="text-teal-600" /> 3. Calendrier et dépôt
                    </h2>
                    <p>
                        Les candidatures doivent être déposées exclusivement via le portail en ligne. La période de dépôt est généralement comprise entre Mars et Avril précédant l'édition.
                    </p>
                    <blockquote>
                        <p className="font-semibold text-red-600">
                            Aucun dossier physique ne sera traité, et tout dépôt soumis au-delà de la date limite verra l'Amicale disqualifiée.
                        </p>
                    </blockquote>

                    <hr className="my-10" />

                    <h3>Contacts et assistance</h3>
                    <p>
                        Pour toute difficulté lors de la constitution ou la soumission du dossier, vous pouvez contacter la commission :
                    </p>
                    <ul>
                        <li>Email : <a href="mailto:asfosante@gmail.com">asfosante@gmail.com</a></li>
                        <li>Téléphone : +221 71 040 17 60 / +221 77 090 88 49</li>
                    </ul>
                </article>

                {/* Bouton de retour en bas */}
                <div className="text-center pt-6">
                    <Link
                        to="/candidature"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white text-lg font-bold rounded-xl hover:bg-teal-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Déposer une candidature maintenant
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default GuideCandidaturePage;
