import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';

export default function CandidaturePopup() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const seen = localStorage.getItem("asfo_candidature_popup");
        if (!seen) {
            // Add a short delay so it feels natural when arriving on the site
            const timer = setTimeout(() => {
                setOpen(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem("asfo_candidature_popup", "true");
    };

    const handleApply = () => {
        handleClose();
        navigate('/candidature');
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen: boolean) => {
            if (!isOpen) {
                handleClose();
            } else {
                setOpen(true);
            }
        }}>
            <DialogContent className="sm:max-w-md w-[95vw] rounded-2xl mx-auto p-0 overflow-hidden border-none shadow-2xl z-[100]">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex flex-col items-center justify-center text-white relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 ring-4 ring-white/10 shadow-inner">
                        <span className="text-3xl">🚑</span>
                    </div>
                    <DialogTitle className="text-xl md:text-2xl font-bold text-center leading-tight">
                        Grande Campagne Médicale ASFO 2026
                    </DialogTitle>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6 bg-white">
                    <DialogDescription className="text-center text-gray-600 text-base md:text-lg leading-relaxed">
                        Les villages du <strong>département de Podor</strong> sont invités à soumettre leur candidature pour accueillir la prochaine caravane médicale ASFO.
                    </DialogDescription>

                    <div className="bg-teal-50 border border-teal-100 p-5 rounded-xl flex items-start gap-4 shadow-sm">
                        <Calendar className="text-teal-600 shrink-0 mt-0.5" size={24} />
                        <p className="text-teal-900 text-sm md:text-base font-medium leading-relaxed">
                            <span className="font-bold text-teal-800 uppercase tracking-wide text-xs mb-1 block">Dépôt des dossiers</span>
                            Du 05 mars au 05 avril 2026
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:space-x-0">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:flex-1 border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl py-6 font-semibold"
                        onClick={handleClose}
                    >
                        Plus tard
                    </Button>
                    <Button
                        type="button"
                        className="w-full sm:flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl hover:shadow-teal-600/20 rounded-xl py-6 font-semibold transition-all duration-300 transform hover:-translate-y-0.5"
                        onClick={handleApply}
                    >
                        Déposer une candidature
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
