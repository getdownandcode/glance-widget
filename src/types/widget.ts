export type WidgetSize = 'small' | 'medium' | 'large' | 'lock_rect' | 'lock_circle';

export type WidgetType = 
  | 'clock_dual'
  | 'weather_forecast'
  | 'calendar_events'
  | 'battery_system'
  | 'fitness_rings'
  | 'music_player'
  | 'quote_inspiration'
  | 'photo_frame'
  | 'quick_launcher'
  | 'hybrid_dash';

export type BgType = 'glass' | 'solid' | 'gradient' | 'mesh';

export interface WidgetTheme {
  id: string;
  name: string;
  bgType: BgType;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  glassBlur: number;
  glassOpacity: number;
  glassBorder: boolean;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  fontFamily: 'sans' | 'mono' | 'serif' | 'rounded';
  borderRadius: number;
  shadow: 'none' | 'subtle' | 'soft' | 'glow';
}

export interface WeatherData {
  city: string;
  temperature: number;
  unit: 'C' | 'F';
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Thunderstorm' | 'Snowy' | 'Windy' | 'Night Clear';
  high: number;
  low: number;
  humidity: number;
  windMph: number;
  forecast: Array<{
    time: string;
    temp: number;
    icon: 'sunny' | 'cloudy' | 'rain' | 'snow';
  }>;
}

export interface ClockData {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  style: 'digital' | 'analog' | 'minimal';
  primaryCity: string;
  secondaryCity: string;
  secondaryOffset: number; // e.g. +9 for Tokyo
}

export interface CalendarData {
  title: string;
  currentDayName: string;
  currentDayNumber: number;
  monthName: string;
  year: number;
  nextEventTitle: string;
  nextEventTime: string;
  nextEventLocation: string;
  secondEventTitle: string;
  secondEventTime: string;
}

export interface BatteryData {
  phoneLevel: number;
  isPhoneCharging: boolean;
  watchLevel: number;
  isWatchCharging: boolean;
  budsLevel: number;
  isBudsCharging: boolean;
  storageUsedPct: number;
}

export interface FitnessData {
  moveCalories: number;
  moveGoal: number;
  exerciseMinutes: number;
  exerciseGoal: number;
  standHours: number;
  standGoal: number;
  stepsCount: number;
  distanceKm: number;
}

export interface MusicData {
  songTitle: string;
  artistName: string;
  albumName: string;
  isPlaying: boolean;
  progressPercent: number;
  albumArtUrl: string;
}

export interface QuoteData {
  quote: string;
  author: string;
  category: string;
}

export interface PhotoData {
  imageUrl: string;
  caption: string;
  dateLabel: string;
  filter: 'none' | 'warm' | 'noir' | 'film';
}

export interface QuickLauncherData {
  items: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
}

export interface WidgetConfig {
  id: string;
  name: string;
  type: WidgetType;
  size: WidgetSize;
  theme: WidgetTheme;
  weather: WeatherData;
  clock: ClockData;
  calendar: CalendarData;
  battery: BatteryData;
  fitness: FitnessData;
  music: MusicData;
  quote: QuoteData;
  photo: PhotoData;
  quickLauncher: QuickLauncherData;
}

export type PhoneDevice = 'iphone16pro' | 'pixel9' | 'samsung_s24' | 'minimal';

export interface WallpaperOption {
  id: string;
  name: string;
  style: string;
  isCustom?: boolean;
}
