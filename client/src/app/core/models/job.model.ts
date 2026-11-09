export interface JobItem {
  id: string;
  title: string;
  company: string;
  logo: string;
  country: string;
  countryCode: string;
  city: string;
  field: string;
  jobType: string;
  workplaceType: string;
  experienceLevel: string;
  salaryRange: string;
  deadline: string;
  postedTimeAgo: string;
  source: string;
  isHot: boolean;
  isNew: boolean;
  description: string;
  requirements: string[];
  applyUrl: string;
  applyEmail: string;
}

export interface AvailableCountry {
  code: string;
  name: string;
  flag: string;
  isDefault: boolean;
  cities: string[];
  jobCount?: number;
}

export interface BotAskResponse {
  success: boolean;
  botReply: string;
  matchedJobsCount: number;
  matchedJobs: JobItem[];
  quickActions: string[];
}
