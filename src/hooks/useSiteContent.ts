import { useEffect, useState } from "react";
import {
  DATA_CHANGED_EVENT,
  getAnnouncements,
  getDonation,
  getEvents,
  getGallery,
  getLeadership,
  getMinistries,
  getSermons,
  getSettings,
  type Announcement,
  type ChurchEvent,
  type DonationSettings,
  type GalleryPhoto,
  type Leader,
  type Ministry,
  type Sermon,
  type SiteSettings,
} from "@/data/siteData";

function useContent<T>(getter: () => T): T {
  const [value, setValue] = useState<T>(getter);

  useEffect(() => {
    const refresh = () => setValue(getter());
    window.addEventListener(DATA_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

export const useSiteSermons = (): Sermon[] => useContent(getSermons);
export const useSiteEvents = (): ChurchEvent[] => useContent(getEvents);
export const useSiteAnnouncements = (): Announcement[] => useContent(getAnnouncements);
export const useSiteGallery = (): GalleryPhoto[] => useContent(getGallery);
export const useSiteMinistries = (): Ministry[] => useContent(getMinistries);
export const useSiteLeadership = (): Leader[] => useContent(getLeadership);
export const useSiteSettings = (): SiteSettings => useContent(getSettings);
export const useSiteDonation = (): DonationSettings => useContent(getDonation);
