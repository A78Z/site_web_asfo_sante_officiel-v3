export const CONTACT_DETAILS = {
  address: {
    line1: 'Faculté de Médecine et de Pharmacie',
    line2: 'Université Cheikh Anta Diop',
    line3: 'Dakar, Sénégal',
  },
  phone: {
    display: '+221 71 040 17 60',
    raw: '+221710401760',
  },
  email: 'contact@asfosante.org',
  hours: [
    { label: 'Lundi à vendredi', value: '9h00 – 17h00' },
    { label: 'Samedi', value: '9h00 – 13h00' },
    { label: 'Dimanche', value: 'Fermé' },
  ],
  whatsappUrl: 'https://wa.me/221710401760',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Facult%C3%A9+de+M%C3%A9decine+et+Pharmacie+Universit%C3%A9+Cheikh+Anta+Diop+Dakar+S%C3%A9n%C3%A9gal',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62006.89536104539!2d-17.484713556708586!3d14.689550456419578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec173352c4731b1%3A0x6cd9b937a1d5d0c!2sFacult%C3%A9%20de%20M%C3%A9decine%20et%20Pharmacie!5e0!3m2!1sfr!2ssn!4v1691489154389!5m2!1sfr!2ssn',
} as const;

export const CONTACT_SOCIAL_LINKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1EuuqYDYVc/?mibextid=wwXIfr',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/asfo.sante?igsh=aXBpZGNsNzMycmJ2&utm_source=qr',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@asfo.sante?_t=ZM-8xhjTZx6pUM&_r=1',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://youtube.com/@asfosante2751?si=lAoZeT1B4ztPWG6s',
  },
  {
    id: 'whatsapp-channel',
    label: 'Chaîne WhatsApp',
    href: 'https://whatsapp.com/channel/0029VbApa2jFSAtDZBz9pr1o',
  },
] as const;
