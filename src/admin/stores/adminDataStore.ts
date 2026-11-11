import { useCallback, useEffect, useState } from "react";
import {
  DATA_CHANGED_EVENT,
  STORAGE_KEYS,
  defaultAnnouncements,
  defaultDonation,
  defaultEvents,
  defaultGallery,
  defaultLeadership,
  defaultMinistries,
  defaultSermons,
  defaultSettings,
  defaultVideoSources,
  generateId,
  getActivity,
  getAnnouncements,
  getDonation,
  getDonationRecords,
  getEvents,
  getGallery,
  getLeadership,
  getMedia,
  getMessages,
  getMinistries,
  getPrayerRequests,
  getSermons,
  getSettings,
  getSubscribers,
  getVideoFeedCache,
  getVideoSources,
  logActivity,
  nowIso,
  readStore,
  writeStore,
  type ActivityLogEntry,
  type Announcement,
  type ChurchEvent,
  type ContactMessage,
  type DonationRecord,
  type DonationSettings,
  type GalleryPhoto,
  type Leader,
  type MediaFile,
  type Ministry,
  type NewsletterSubscriber,
  type PrayerRequestEntry,
  type Sermon,
  type SiteSettings,
  type VideoFeedCache,
  type VideoSourceSettings,
} from "@/data/siteData";

function useStoreSubscription() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener(DATA_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
}

/** Generic CRUD hook backed by localStorage. */
export function useCollection<T extends { id: string }>(
  storageKey: string,
  getter: () => T[],
) {
  useStoreSubscription();
  const items = getter();

  const save = useCallback(
    (next: T[]) => {
      writeStore(storageKey, next);
    },
    [storageKey],
  );

  const add = useCallback(
    (item: Omit<T, "id"> & { id?: string }) => {
      const created = { ...item, id: item.id ?? generateId(storageKey) } as T;
      const current = getter();
      writeStore(storageKey, [created, ...current]);
      return created;
    },
    [getter, storageKey],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      const current = getter();
      writeStore(
        storageKey,
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [getter, storageKey],
  );

  const remove = useCallback(
    (id: string) => {
      const current = getter();
      writeStore(
        storageKey,
        current.filter((item) => item.id !== id),
      );
    },
    [getter, storageKey],
  );

  return { items, save, add, update, remove };
}

export function useSermons() {
  return useCollection<Sermon>(STORAGE_KEYS.sermons, getSermons);
}

export function useEvents() {
  return useCollection<ChurchEvent>(STORAGE_KEYS.events, getEvents);
}

export function useAnnouncements() {
  return useCollection<Announcement>(STORAGE_KEYS.announcements, getAnnouncements);
}

export function useGallery() {
  return useCollection<GalleryPhoto>(STORAGE_KEYS.gallery, getGallery);
}

export function useMinistries() {
  return useCollection<Ministry>(STORAGE_KEYS.ministries, getMinistries);
}

export function useLeadership() {
  return useCollection<Leader>(STORAGE_KEYS.leadership, getLeadership);
}

export function useSettings() {
  useStoreSubscription();
  const settings = getSettings();
  const saveSettings = useCallback((next: SiteSettings) => {
    writeStore(STORAGE_KEYS.settings, next);
    logActivity("updated", "site settings");
  }, []);
  return { settings, saveSettings };
}

export function useDonationSettings() {
  useStoreSubscription();
  const donation = getDonation();
  const saveDonation = useCallback((next: DonationSettings) => {
    writeStore(STORAGE_KEYS.donation, next);
    logActivity("updated", "donation settings");
  }, []);
  return { donation, saveDonation };
}

export function usePrayerRequests() {
  return useCollection<PrayerRequestEntry>(STORAGE_KEYS.prayerRequests, getPrayerRequests);
}

export function useMessages() {
  const collection = useCollection<ContactMessage>(STORAGE_KEYS.messages, getMessages);
  const markRead = useCallback(
    (id: string, read: boolean) => collection.update(id, { read }),
    [collection],
  );
  return { ...collection, markRead };
}

export function useSubscribers() {
  return useCollection<NewsletterSubscriber>(STORAGE_KEYS.subscribers, getSubscribers);
}

export function useDonationRecords() {
  return useCollection<DonationRecord>(STORAGE_KEYS.donations, getDonationRecords);
}

export function useMedia() {
  return useCollection<MediaFile>(STORAGE_KEYS.media, getMedia);
}

export function useVideoSources() {
  useStoreSubscription();
  const sources = getVideoSources();
  const saveSources = useCallback((next: VideoSourceSettings) => {
    writeStore(STORAGE_KEYS.videoSources, next);
    logActivity("updated", "video feed settings");
  }, []);
  const resetSources = useCallback(() => {
    writeStore(STORAGE_KEYS.videoSources, defaultVideoSources);
    logActivity("restored", "video feed settings");
  }, []);
  return { sources, saveSources, resetSources };
}

export function useVideoFeedCache() {
  useStoreSubscription();
  const cache = getVideoFeedCache();
  const clearCache = useCallback(() => {
    writeStore(STORAGE_KEYS.externalVideos, {
      videos: [],
      syncedAt: "",
    } satisfies VideoFeedCache);
    logActivity("cleared", "video feed cache");
  }, []);
  return { cache, clearCache };
}

export function useActivityLog() {
  useStoreSubscription();
  return getActivity();
}

export function useStorageStats() {
  useStoreSubscription();
  const collections = {
    sermons: getSermons().length,
    events: getEvents().length,
    announcements: getAnnouncements().length,
    gallery: getGallery().length,
    ministries: getMinistries().length,
    leadership: getLeadership().length,
    prayerRequests: getPrayerRequests().length,
    messages: getMessages().length,
    subscribers: getSubscribers().length,
    donations: getDonationRecords().length,
    media: getMedia().length,
  };

  let usedBytes = 0;
  if (typeof window !== "undefined") {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        const raw = window.localStorage.getItem(key);
        if (raw) usedBytes += raw.length * 2;
      });
    } catch {
      usedBytes = 0;
    }
  }

  return { collections, usedBytes };
}

export function useActivityCollection() {
  useStoreSubscription();
  const items = getActivity();
  const clear = useCallback(() => {
    writeStore(STORAGE_KEYS.activity, [] as ActivityLogEntry[]);
  }, []);
  return { items, clear };
}

/* -------------------------------------------------------------------------- */
/*                             File / image helpers                           */
/* -------------------------------------------------------------------------- */

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB per image

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Only image files can be uploaded."));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      reject(new Error("Image is too large. Please upload files smaller than 2 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportAllContent(): Record<string, unknown> {
  const videoSources = getVideoSources();
  return {
    exportedAt: nowIso(),
    sermons: getSermons(),
    events: getEvents(),
    announcements: getAnnouncements(),
    gallery: getGallery(),
    ministries: getMinistries(),
    leadership: getLeadership(),
    settings: getSettings(),
    donation: getDonation(),
    prayerRequests: getPrayerRequests(),
    messages: getMessages(),
    subscribers: getSubscribers(),
    donations: getDonationRecords(),
    media: getMedia(),
    // Secrets are intentionally left out of backups.
    videoSources: { ...videoSources, youtubeApiKey: "", facebookAccessToken: "" },
  };
}

export function restoreDefaults(scope: "all" | "sermons" | "events" | "announcements" | "gallery" | "ministries" | "leadership" | "settings" | "donation"): void {
  const map = {
    sermons: () => writeStore(STORAGE_KEYS.sermons, defaultSermons),
    events: () => writeStore(STORAGE_KEYS.events, defaultEvents),
    announcements: () => writeStore(STORAGE_KEYS.announcements, defaultAnnouncements),
    gallery: () => writeStore(STORAGE_KEYS.gallery, defaultGallery),
    ministries: () => writeStore(STORAGE_KEYS.ministries, defaultMinistries),
    leadership: () => writeStore(STORAGE_KEYS.leadership, defaultLeadership),
    settings: () => writeStore(STORAGE_KEYS.settings, defaultSettings),
    donation: () => writeStore(STORAGE_KEYS.donation, defaultDonation),
  };

  if (scope === "all") {
    Object.values(map).forEach((fn) => fn());
    logActivity("restored", "all default content");
  } else {
    map[scope]();
    logActivity("restored", `${scope} defaults`);
  }
}

export const ALL_IMAGE_KEYS = [
  { key: "heroImage", label: "Hero image" },
  { key: "aboutImage", label: "About image" },
] as const;

export type CollectionName = keyof typeof STORAGE_KEYS;
