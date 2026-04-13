import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  heroAPI,
  aboutAPI,
  contactAPI,
  educationAPI,
  skillsAPI,
  projectsAPI,
  volunteersAPI,
  settingsAPI,
  portfolioAPI,
} from '../services/api';

// ─── Types (unchanged from original) ───────────────────────────────────────

export type SectionsVisibility = {
  hero: boolean;
  about: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
  volunteering: boolean;
  contact: boolean;
};

export type ContactInfo = {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  twitter: string;
  facebook: string;
  whatsapp: string;
  address: string;
};

export type HeroInfo = {
  tagline: string;
  headline: string;
  description: string;
  primaryBtn: string;
  secondaryBtn: string;
  badgeNum: string;
  badgeText: string;
  badgeSubtext: string;
  imageUrl: string;
  cvUrl?: string;
};

export type AboutInfo = {
  introText: string;
  journeyP1: string;
  journeyP2: string;
};

export type EducationItem = {
  id: string;
  _id?: string;
  degree: string;
  institution: string;
  date: string;
  description: string;
  highlights: string[];
};

export type SkillCategory = {
  id: string;
  _id?: string;
  title: string;
  skills: string[];
};

export type ProjectItem = {
  id: string;
  _id?: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
  role: string;
  location: string;
  details: string[];
  tags: string[];
};

export type VolunteerItem = {
  id: string;
  _id?: string;
  title: string;
  organization: string;
  date: string;
  location: string;
  description: string;
  color: string;
};

// ─── Defaults (used as fallback while API loads) ────────────────────────────

const defaultVisibility: SectionsVisibility = {
  hero: true, about: true, education: true, skills: true,
  projects: true, certifications: true, volunteering: true, contact: true,
};

const defaultContact: ContactInfo = {
  email: '', phone: '', linkedin: '', github: '',
  twitter: '', facebook: '', whatsapp: '', address: '',
};

const defaultHero: HeroInfo = {
  tagline: '', headline: '', description: '',
  primaryBtn: 'View My Work', secondaryBtn: 'Download Resume',
  badgeNum: '', badgeText: '', badgeSubtext: '', imageUrl: '', cvUrl: ''
};

const defaultAbout: AboutInfo = { introText: '', journeyP1: '', journeyP2: '' };

// ─── Helper: normalize MongoDB _id to id ────────────────────────────────────

function normalizeId<T extends { _id?: string; id?: string }>(item: T): T & { id: string } {
  return { ...item, id: item._id || item.id || '' };
}

// ─── Context ────────────────────────────────────────────────────────────────

interface SiteContextType {
  // State
  sectionsVisibility: SectionsVisibility;
  contactInfo: ContactInfo;
  heroInfo: HeroInfo;
  aboutInfo: AboutInfo;
  educationList: EducationItem[];
  skillsList: SkillCategory[];
  projectsList: ProjectItem[];
  volunteerList: VolunteerItem[];
  isLoading: boolean;

  // Setters (persist to API)
  setSectionVisibility: (section: keyof SectionsVisibility, isVisible: boolean) => void;
  setContactInfo: (info: Partial<ContactInfo>) => void;
  setHeroInfo: (info: Partial<HeroInfo>) => void;
  setAboutInfo: (info: Partial<AboutInfo>) => void;
  setEducationList: (list: EducationItem[]) => void;
  setSkillsList: (list: SkillCategory[]) => void;
  setProjectsList: (list: ProjectItem[]) => void;
  setVolunteerList: (list: VolunteerItem[]) => void;

  // Refresh from API
  refreshData: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sectionsVisibility, setSectionsVisibilityState] = useState<SectionsVisibility>(defaultVisibility);
  const [contactInfo, setContactInfoState] = useState<ContactInfo>(defaultContact);
  const [heroInfo, setHeroInfoState] = useState<HeroInfo>(defaultHero);
  const [aboutInfo, setAboutInfoState] = useState<AboutInfo>(defaultAbout);
  const [educationList, setEducationListState] = useState<EducationItem[]>([]);
  const [skillsList, setSkillsListState] = useState<SkillCategory[]>([]);
  const [projectsList, setProjectsListState] = useState<ProjectItem[]>([]);
  const [volunteerList, setVolunteerListState] = useState<VolunteerItem[]>([]);

  // ── Fetch all data on mount (using aggregated endpoint) ──

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await portfolioAPI.getAll();
      const d = res.data as Record<string, unknown>;

      if (d.hero) setHeroInfoState(d.hero as HeroInfo);
      if (d.about) setAboutInfoState(d.about as AboutInfo);
      if (d.contact) setContactInfoState(d.contact as ContactInfo);
      if (d.sectionsVisibility) setSectionsVisibilityState({ ...defaultVisibility, ...(d.sectionsVisibility as SectionsVisibility) });

      if (Array.isArray(d.education)) setEducationListState((d.education as EducationItem[]).map(normalizeId));
      if (Array.isArray(d.skills)) setSkillsListState((d.skills as SkillCategory[]).map(normalizeId));
      if (Array.isArray(d.projects)) setProjectsListState((d.projects as ProjectItem[]).map(normalizeId));
      if (Array.isArray(d.volunteers)) setVolunteerListState((d.volunteers as VolunteerItem[]).map(normalizeId));
    } catch (error) {
      console.warn('Failed to fetch from API, using defaults:', error);
      // Keep defaults — site still renders with empty/default content
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ── Setters that persist to API ──

  const setSectionVisibility = useCallback((section: keyof SectionsVisibility, isVisible: boolean) => {
    setSectionsVisibilityState(prev => {
      const updated = { ...prev, [section]: isVisible };
      settingsAPI.update({ sectionsVisibility: updated }).catch(console.error);
      return updated;
    });
  }, []);

  const setContactInfo = useCallback((info: Partial<ContactInfo>) => {
    setContactInfoState(prev => {
      const updated = { ...prev, ...info };
      contactAPI.update(updated as unknown as Record<string, unknown>).catch(console.error);
      return updated;
    });
  }, []);

  const setHeroInfo = useCallback((info: Partial<HeroInfo>) => {
    setHeroInfoState(prev => {
      const updated = { ...prev, ...info };
      heroAPI.update(updated as unknown as Record<string, unknown>).catch(console.error);
      return updated;
    });
  }, []);

  const setAboutInfo = useCallback((info: Partial<AboutInfo>) => {
    setAboutInfoState(prev => {
      const updated = { ...prev, ...info };
      aboutAPI.update(updated as unknown as Record<string, unknown>).catch(console.error);
      return updated;
    });
  }, []);

  const setEducationList = useCallback((list: EducationItem[]) => {
    setEducationListState(list);
    // Sync full list: delete removed, create new, update existing
    // For simplicity, we re-save the entire list via individual calls
    // The admin pages handle individual CRUD via the api service directly
  }, []);

  const setSkillsList = useCallback((list: SkillCategory[]) => {
    setSkillsListState(list);
  }, []);

  const setProjectsList = useCallback((list: ProjectItem[]) => {
    setProjectsListState(list);
  }, []);

  const setVolunteerList = useCallback((list: VolunteerItem[]) => {
    setVolunteerListState(list);
  }, []);

  return (
    <SiteContext.Provider value={{
      sectionsVisibility, setSectionVisibility,
      contactInfo, setContactInfo,
      heroInfo, setHeroInfo,
      aboutInfo, setAboutInfo,
      educationList, setEducationList,
      skillsList, setSkillsList,
      projectsList, setProjectsList,
      volunteerList, setVolunteerList,
      isLoading,
      refreshData,
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
