import React from 'react';
import {
  Camera, Video, Mic, Bell, Flame, Search, X, ChevronLeft, ChevronRight,
  CheckSquare, Plus, Coins, Wallet, Home, Trophy, Medal, Gem,
  CreditCard, Building2, Lightbulb, Upload, CheckCircle, Share2,
  Settings, Lock, Mail, FileText, HelpCircle, Trash2, Eye,
  BarChart3, Users, MapPin, Clock, Star, ArrowUp, ArrowDown,
  Ban, Send, Image,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

const ICON_MAP = {
  camera: Camera,
  video: Video,
  mic: Mic,
  bell: Bell,
  flame: Flame,
  search: Search,
  x: X,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  checkSquare: CheckSquare,
  plus: Plus,
  coins: Coins,
  wallet: Wallet,
  home: Home,
  trophy: Trophy,
  medal: Medal,
  gem: Gem,
  creditCard: CreditCard,
  building: Building2,
  lightbulb: Lightbulb,
  upload: Upload,
  checkCircle: CheckCircle,
  share: Share2,
  settings: Settings,
  lock: Lock,
  mail: Mail,
  fileText: FileText,
  helpCircle: HelpCircle,
  trash: Trash2,
  eye: Eye,
  barChart: BarChart3,
  users: Users,
  mapPin: MapPin,
  clock: Clock,
  star: Star,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  ban: Ban,
  send: Send,
  image: Image,
};

export function Icon({ name, size = 20, color = colors.text, style, strokeWidth = 1.5 }) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} style={style} />;
}

export { ICON_MAP };
