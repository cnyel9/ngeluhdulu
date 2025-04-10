// Types for complaints app

export type Feeling = 'kesel' | 'sedih' | 'capek' | 'bingung' | 'bete';

export type Complaint = {
  id: string;
  text: string;
  feeling: Feeling;
  createdAt: string;
};

export type FeelingCount = {
  feeling: Feeling;
  count: number;
};

export type DailyMoodData = {
  date: string;
  kesel: number;
  sedih: number;
  capek: number;
  bingung: number;
  bete: number;
};