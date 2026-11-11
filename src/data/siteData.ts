/**
 * Central content store for Minevam Kigobe Church.
 *
 * The public website and the admin panel both read from this module.
 * Content is persisted in `localStorage` so the admin can edit, upload and
 * delete items without a backend. When no saved data exists the defaults
 * below are used.
 */

import heroChurchImage from "@/assets/hero-church.jpg";
import communityImage from "@/assets/community.jpg";
import choirImage from "@/assets/choir.jpg";
import youthImage from "@/assets/youth.jpg";
import sermonImage from "@/assets/sermon.jpg";

export const STORAGE_KEYS = {
  sermons: "mk.sermons",
  events: "mk.events",
  announcements: "mk.announcements",
  gallery: "mk.gallery",
  ministries: "mk.ministries",
  leadership: "mk.leadership",
  settings: "mk.settings",
  donation: "mk.donation",
  prayerRequests: "mk.prayerRequests",
  messages: "mk.messages",
  subscribers: "mk.subscribers",
  donations: "mk.donations",
  activity: "mk.activity",
  media: "mk.media",
  videoSources: "mk.videoSources",
  externalVideos: "mk.externalVideos",
  adminCredentials: "mk.adminCredentials",
  session: "mk.adminSession",
} as const;

export const DATA_CHANGED_EVENT = "mk:data-changed";

export type Sermon = {
  id: string;
  title: string;
  pastor: string;
  date: string;
  series: string;
  thumbnail: string;
  description: string;
  youtubeId: string;
};

export type ChurchEvent = {
  id: string;
  month: string;
  day: string;
  title: string;
  time: string;
  location: string;
  category: string;
  description: string;
};

export type Announcement = {
  id: string;
  text: string;
};

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export type Ministry = {
  id: string;
  name: string;
  description: string;
  members: string;
  contact: string;
  image: string;
  icon: string;
  color: string;
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

export type SiteSettings = {
  churchName: string;
  churchNameAccent: string;
  church: string;
  tagline: string;
  location: string;
  heroBadge: string;
  address: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  officeHours: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  youtube: string;
  mapEmbedUrl: string;
  heroImage: string;
  aboutImage: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  mission: string;
  vision: string;
  values: string;
  footerVerse: string;
};

export type DonationProvider = {
  payTo: string;
  accountName: string;
  instructions: string;
};

export type DonationSettings = {
  lumicash: DonationProvider;
  ecocash: DonationProvider;
};

export type PrayerRequestEntry = {
  id: string;
  name: string;
  email: string;
  prayerType: string;
  request: string;
  isPrivate: boolean;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type NewsletterSubscriber = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type DonationRecord = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  amount: number;
  provider: string;
  transactionId: string;
  message: string;
  createdAt: string;
};

export type ActivityLogEntry = {
  id: string;
  action: string;
  target: string;
  createdAt: string;
};

export type AdminCredentials = {
  username: string;
  password: string;
};

export type MediaFile = {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  createdAt: string;
};

export type ExternalVideoProvider = "youtube" | "facebook";

export type ExternalVideo = {
  id: string;
  provider: ExternalVideoProvider;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  embedUrl?: string;
  author?: string;
};

export type VideoSourceSettings = {
  youtubeEnabled: boolean;
  youtubeChannelId: string;
  youtubeHandle: string;
  youtubeApiKey: string;
  facebookEnabled: boolean;
  facebookPageUrl: string;
  facebookPageId: string;
  facebookAccessToken: string;
  corsProxy: string;
};

export type VideoFeedCache = {
  videos: ExternalVideo[];
  syncedAt: string;
};

/* -------------------------------------------------------------------------- */
/*                                  Defaults                                  */
/* -------------------------------------------------------------------------- */

export const defaultSermons: Sermon[] = [
  {
    id: "sermon-1",
    youtubeId: "Cs3hR6gEirI",
    title: "Culte du Dimanche le 02-08-2026",
    pastor: "Pasteur Pie",
    date: "02 Août 2026",
    series: "Dimanche Service",
    thumbnail: "https://i.ytimg.com/vi/Cs3hR6gEirI/hqdefault.jpg",
    description:
      "Dernier message de Minevam Kigobe Church pour renforcer votre foi et votre vie de prière.",
  },
  {
    id: "sermon-2",
    youtubeId: "AoPhDkD4Ekw",
    title: "UBUZIMA BUTUMBEREYE INTSINZI",
    pastor: "Pasteur Anaclet",
    date: "02 Août 2026",
    series: "Sermon",
    thumbnail: "https://i.ytimg.com/vi/AoPhDkD4Ekw/hqdefault.jpg",
    description:
      "Un message puissant sur la victoire, la foi et la transformation personnelle.",
  },
  {
    id: "sermon-3",
    youtubeId: "huHt-zfk0vg",
    title:
      "Nashaka kumenyekana cane, gutunga, bituma nja muvyubupfumu - Intahe ya Emery NDABARUSHIMANA",
    pastor: "Pasteur Pie",
    date: "28 Juillet 2026",
    series: "Enseignement",
    thumbnail: "https://i.ytimg.com/vi/huHt-zfk0vg/hqdefault.jpg",
    description:
      "Une réflexion sur les priorités, les tentations et la marche dans la lumière de Dieu.",
  },
  {
    id: "sermon-4",
    youtubeId: "te81XahwdY0",
    title: "Croissance Spirituelle et Puissance de la Parole",
    pastor: "Diacre Eloge",
    date: "24 Juillet 2026",
    series: "Vie Chrétienne",
    thumbnail: "https://i.ytimg.com/vi/te81XahwdY0/hqdefault.jpg",
    description:
      "Un message d'encouragement pour grandir dans la foi et marcher avec assurance.",
  },
];

export const defaultEvents: ChurchEvent[] = [
  {
    id: "event-1",
    month: "MAR",
    day: "02",
    title: "Journée de Prière et de Jeûne",
    time: "6:00 AM – 6:00 PM",
    location: "Salle principale de l'Église",
    category: "Spiritual",
    description:
      "Une journée entière consacrée à la prière, au jeûne et à l'intercession pour l'église et la nation.",
  },
  {
    id: "event-2",
    month: "MAR",
    day: "15",
    title: "Soirée des Jeunes",
    time: "3:00 PM – 9:00 PM",
    location: "Centre Communautaire Kigobe",
    category: "Youth",
    description:
      "Une soirée de louange, de témoignages et de fellowship pour la jeunesse de l'église.",
  },
  {
    id: "event-3",
    month: "MAR",
    day: "23",
    title: "Action Sociale et Évangélisation",
    time: "9:00 AM – 1:00 PM",
    location: "Quartier Kinyinya, Bujumbura",
    category: "Outreach",
    description:
      "Distribution de vivres et partage de l'Évangile auprès des familles vulnérables du quartier.",
  },
  {
    id: "event-4",
    month: "APR",
    day: "05",
    title: "Culte de Résurrection",
    time: "7:00 AM & 10:30 AM",
    location: "Église Principale & en plein air",
    category: "Celebration",
    description:
      "Un culte spécial pour célébrer la résurrection de Jésus-Christ avec toute la communauté.",
  },
  {
    id: "event-5",
    month: "APR",
    day: "19",
    title: "Gala de Collecte de Fonds",
    time: "6:00 PM – 10:00 PM",
    location: "Hôtel Club du Lac Tanganyika",
    category: "Fundraising",
    description:
      "Une soirée de gala pour soutenir les projets de construction et de mission de l'église.",
  },
  {
    id: "event-6",
    month: "MAI",
    day: "10",
    title: "Journée Communautaire",
    time: "10:00 AM – 5:00 PM",
    location: "Parc de Bujumbura",
    category: "Community",
    description:
      "Une journée de sport, de jeux et de convivialité ouverte à toute la communauté.",
  },
];

export const defaultAnnouncements: Announcement[] = [
  { id: "ann-1", text: "Rejoignez-nous chaque dimanche à 8h00 et 10h30 pour les cultes." },
  { id: "ann-2", text: "La réunion de prière a lieu chaque mercredi à 18h00." },
  { id: "ann-3", text: "Les inscriptions pour le camp de la jeunesse sont ouvertes." },
  { id: "ann-4", text: "Le groupe de chorale répète chaque vendredi à 17h00." },
];

export const defaultGallery: GalleryPhoto[] = [
  {
    id: "gallery-1",
    src: heroChurchImage,
    alt: "Culte du dimanche",
    caption: "Culte du dimanche",
  },
  {
    id: "gallery-2",
    src: choirImage,
    alt: "Chorale de l'église",
    caption: "Chorale & Louange",
  },
  {
    id: "gallery-3",
    src: youthImage,
    alt: "Ministère des jeunes",
    caption: "Ministère des Jeunes",
  },
  {
    id: "gallery-4",
    src: communityImage,
    alt: "Vie communautaire",
    caption: "Communauté & Fellowship",
  },
  {
    id: "gallery-5",
    src: sermonImage,
    alt: "Prédication",
    caption: "La Parole prêchée",
  },
];

export const defaultMinistries: Ministry[] = [
  {
    id: "ministry-choir",
    name: "Chorale",
    description:
      "Une équipe passionnée qui conduit l'église dans la louange et l'adoration chaque semaine.",
    members: "45 membres",
    contact: "chorale@minervamkigobe.bi",
    image: choirImage,
    icon: "Music",
    color: "from-primary/80 to-accent/80",
  },
  {
    id: "ministry-youth",
    name: "Jeunesse",
    description:
      "Un espace dynamique où les jeunes grandissent dans la foi et servent avec leurs talents.",
    members: "120 membres",
    contact: "jeunesse@minervamkigobe.bi",
    image: youthImage,
    icon: "Users",
    color: "from-secondary/80 to-secondary-light/80",
  },
  {
    id: "ministry-outreach",
    name: "Action Sociale",
    description:
      "Nous apportons l'amour du Christ aux personnes vulnérables à travers des actions concrètes.",
    members: "60 membres",
    contact: "outreach@minervamkigobe.bi",
    image: communityImage,
    icon: "Heart",
    color: "from-red-500/80 to-primary/80",
  },
  {
    id: "ministry-kids",
    name: "Enfants",
    description:
      "Un ministère dédié à l'éducation biblique et à l'épanouissement des plus petits.",
    members: "80 membres",
    contact: "enfants@minervamkigobe.bi",
    image: "",
    icon: "Baby",
    color: "from-accent/80 to-primary-light/80",
  },
  {
    id: "ministry-missions",
    name: "Missions",
    description:
      "Nous soutenons la diffusion de l'Évangile au Burundi et au-delà de nos frontières.",
    members: "30 membres",
    contact: "missions@minervamkigobe.bi",
    image: "",
    icon: "Globe",
    color: "from-secondary-dark/80 to-secondary/80",
  },
  {
    id: "ministry-sunday-school",
    name: "École du Dimanche",
    description:
      "Un enseignement biblique structuré pour toutes les tranches d'âge chaque dimanche.",
    members: "100 membres",
    contact: "education@minervamkigobe.bi",
    image: "",
    icon: "BookOpen",
    color: "from-primary-dark/80 to-secondary/80",
  },
];

export const defaultLeadership: Leader[] = [
  { id: "leader-1", name: "Pasteur Aime Prosper", role: "Pasteur Principal", initials: "AP" },
  { id: "leader-2", name: "Pasteur Anaclet", role: "Pasteur Associé", initials: "AA" },
  { id: "leader-3", name: "Pasteur Pie", role: "Pasteur Associé", initials: "PP" },
  { id: "leader-4", name: "Diacre Eloge", role: "Diacre", initials: "EL" },
];

export const defaultSettings: SiteSettings = {
  churchName: "Minevam",
  churchNameAccent: "Kigobe",
  church: "Church",
  tagline: "Building Faith, Nurturing Community, Changing Lives",
  location: "Bujumbura, Burundi",
  heroBadge: "Welcome to Our Family",
  address: "Quartier Kigobe, Avenue de la Mission\nBujumbura, Burundi",
  phone1: "+257 61 234 567",
  phone2: "+257 79 345 678",
  email1: "info@minervamkigobe.bi",
  email2: "pasteur@minervamkigobe.bi",
  officeHours: "Mon – Fri: 8:00 AM – 5:00 PM\nSaturday: 9:00 AM – 1:00 PM",
  whatsapp: "250783783357",
  facebook: "https://facebook.com/MinevamKigobe",
  instagram: "https://instagram.com/MinevamKigobe",
  youtube: "https://youtube.com/@MinevamKigobe",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63760.57!2d29.35!3d-3.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c183d8d5f6a6b5%3A0x0!2sBujumbura%2C+Burundi!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  heroImage: heroChurchImage,
  aboutImage: communityImage,
  aboutParagraph1:
    "Founded in 2004 in the heart of Bujumbura, Minevam Kigobe Church began with a small group of believers committed to sharing God's love throughout Burundi. Over two decades, we have grown into a vibrant community of over 1,200 members united by faith, hope, and love.",
  aboutParagraph2:
    "Our church is rooted in the belief that every person has immeasurable worth and potential. We strive to be a place where all are welcome, all are valued, and all can experience transformation through the power of God's Word and community.",
  mission:
    "To love God wholeheartedly and serve our community with compassion, bringing transformation to every life we touch in Bujumbura and beyond.",
  vision:
    "To be a beacon of hope and light for all of Burundi — a church that raises disciples who impact their generation and leave a lasting spiritual legacy.",
  values:
    "Faith, Family, Fellowship, and Service. We believe in the power of community united by love, worship, and a shared commitment to serve one another.",
  footerVerse:
    "« Car Dieu a tant aimé le monde qu'il a donné son Fils unique. » — Jean 3:16",
};

export const defaultDonation: DonationSettings = {
  lumicash: {
    payTo: "+257 00 000 000",
    accountName: "Minevam Kigobe Church",
    instructions:
      "Open Lumicash → Send Money → enter the number → enter amount → add the reference in message.",
  },
  ecocash: {
    payTo: "+257 00 000 000",
    accountName: "Minevam Kigobe Church",
    instructions:
      "Open Ecocash → Send Money → enter the number → enter amount → add the reference in message.",
  },
};

export const defaultAdminCredentials: AdminCredentials = {
  username: "admin",
  password: "kigobe2024",
};

export const defaultVideoSources: VideoSourceSettings = {
  youtubeEnabled: true,
  youtubeChannelId: "UC2izHHVAdji27tW8F-8JkeA",
  youtubeHandle: "MinevamKigobe",
  youtubeApiKey: "",
  facebookEnabled: true,
  facebookPageUrl: "https://facebook.com/MinevamKigobe",
  facebookPageId: "",
  facebookAccessToken: "",
  corsProxy:
    "https://api.allorigins.win/raw?url=\nhttps://api.codetabs.com/v1/proxy?quest=",
};

/* -------------------------------------------------------------------------- */
/*                              Storage helpers                               */
/* -------------------------------------------------------------------------- */

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT, { detail: { key } }));
  } catch (error) {
    console.error("Failed to persist data", key, error);
  }
}

export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/* -------------------------------------------------------------------------- */
/*                              Typed accessors                               */
/* -------------------------------------------------------------------------- */

export const getSermons = () => readStore<Sermon[]>(STORAGE_KEYS.sermons, defaultSermons);
export const getEvents = () => readStore<ChurchEvent[]>(STORAGE_KEYS.events, defaultEvents);
export const getAnnouncements = () =>
  readStore<Announcement[]>(STORAGE_KEYS.announcements, defaultAnnouncements);
export const getGallery = () => readStore<GalleryPhoto[]>(STORAGE_KEYS.gallery, defaultGallery);
export const getMinistries = () =>
  readStore<Ministry[]>(STORAGE_KEYS.ministries, defaultMinistries);
export const getLeadership = () =>
  readStore<Leader[]>(STORAGE_KEYS.leadership, defaultLeadership);
const LEGACY_WHATSAPP_NUMBER = "25764433144";
export const getSettings = () => {
  const settings = readStore<SiteSettings>(STORAGE_KEYS.settings, defaultSettings);
  if (settings.whatsapp === LEGACY_WHATSAPP_NUMBER) {
    return { ...settings, whatsapp: defaultSettings.whatsapp };
  }
  return settings;
};
export const getDonation = () =>
  readStore<DonationSettings>(STORAGE_KEYS.donation, defaultDonation);
export const getPrayerRequests = () =>
  readStore<PrayerRequestEntry[]>(STORAGE_KEYS.prayerRequests, []);
export const getMessages = () => readStore<ContactMessage[]>(STORAGE_KEYS.messages, []);
export const getSubscribers = () =>
  readStore<NewsletterSubscriber[]>(STORAGE_KEYS.subscribers, []);
export const getDonationRecords = () =>
  readStore<DonationRecord[]>(STORAGE_KEYS.donations, []);
export const getActivity = () => readStore<ActivityLogEntry[]>(STORAGE_KEYS.activity, []);
export const getMedia = () => readStore<MediaFile[]>(STORAGE_KEYS.media, []);
export const getAdminCredentials = () =>
  readStore<AdminCredentials>(STORAGE_KEYS.adminCredentials, defaultAdminCredentials);
export const getVideoSources = () =>
  readStore<VideoSourceSettings>(STORAGE_KEYS.videoSources, defaultVideoSources);
export const getVideoFeedCache = () =>
  readStore<VideoFeedCache>(STORAGE_KEYS.externalVideos, { videos: [], syncedAt: "" });

export function logActivity(action: string, target: string): void {
  const entries = getActivity();
  const entry: ActivityLogEntry = {
    id: generateId("log"),
    action,
    target,
    createdAt: nowIso(),
  };
  writeStore(STORAGE_KEYS.activity, [entry, ...entries].slice(0, 100));
}

export function resetAllContent(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key === STORAGE_KEYS.adminCredentials) return;
    window.localStorage.removeItem(key);
  });
  window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT, { detail: { key: "*" } }));
}
