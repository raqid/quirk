export type DataType = 'photo' | 'video' | 'audio';

export interface Dataset {
  id: string;
  name: string;
  type: DataType;
  count: number;
  countLabel: string;
  geography: string;
  quality: number;
  pricePerUnit: number;
  unit: string;
  description: string;
  devices: string[];
  dateRange: string;
  geoDistribution: { country: string; count: number }[];
  qualityDistribution: { range: string; count: number }[];
  pricingTiers: { label: string; quantity: number; pricePerUnit: number; total: number }[];
}

export const DATASETS: Dataset[] = [
  {
    id: 'south-asian-street-scenes',
    name: 'South Asian Street Scenes',
    type: 'photo',
    count: 45000,
    countLabel: '45K photos',
    geography: '12 countries',
    quality: 92,
    pricePerUnit: 0.02,
    unit: 'image',
    description: 'High-quality street photography from South Asia capturing everyday life, markets, and urban environments across 12 countries.',
    devices: ['iPhone', 'Android', 'DSLR', 'Mirrorless'],
    dateRange: '2023-01 to 2024-12',
    geoDistribution: [
      { country: 'India', count: 18000 },
      { country: 'Bangladesh', count: 8000 },
      { country: 'Pakistan', count: 7000 },
      { country: 'Nepal', count: 4000 },
      { country: 'Sri Lanka', count: 3000 },
      { country: 'Others', count: 5000 },
    ],
    qualityDistribution: [
      { range: '90–100', count: 28000 },
      { range: '80–89', count: 12000 },
      { range: '70–79', count: 4000 },
      { range: '<70', count: 1000 },
    ],
    pricingTiers: [
      { label: 'Starter', quantity: 1000, pricePerUnit: 0.02, total: 20 },
      { label: 'Growth', quantity: 10000, pricePerUnit: 0.016, total: 160 },
      { label: 'Scale', quantity: 50000, pricePerUnit: 0.012, total: 600 },
    ],
  },
  {
    id: 'multilingual-voice-bangla',
    name: 'Multilingual Voice — Bangla',
    type: 'audio',
    count: 8000,
    countLabel: '8K clips',
    geography: 'Native speakers',
    quality: 88,
    pricePerUnit: 0.15,
    unit: 'clip',
    description: 'Native Bangla speech recordings across regional dialects, including Standard, Noakhali, Sylheti, and Chittagong variants.',
    devices: ['iPhone', 'Android', 'USB Mic'],
    dateRange: '2023-06 to 2024-11',
    geoDistribution: [
      { country: 'Bangladesh', count: 5200 },
      { country: 'West Bengal', count: 1800 },
      { country: 'Assam', count: 600 },
      { country: 'Diaspora', count: 400 },
    ],
    qualityDistribution: [
      { range: '90–100', count: 2800 },
      { range: '80–89', count: 3200 },
      { range: '70–79', count: 1600 },
      { range: '<70', count: 400 },
    ],
    pricingTiers: [
      { label: 'Starter', quantity: 500, pricePerUnit: 0.15, total: 75 },
      { label: 'Growth', quantity: 2000, pricePerUnit: 0.12, total: 240 },
      { label: 'Scale', quantity: 8000, pricePerUnit: 0.09, total: 720 },
    ],
  },
  {
    id: 'kitchen-activities-video',
    name: 'Kitchen Activities Video',
    type: 'video',
    count: 12000,
    countLabel: '12K clips',
    geography: '8 countries',
    quality: 95,
    pricePerUnit: 0.5,
    unit: 'clip',
    description: '30–60 second cooking and kitchen activity clips covering diverse cuisines, tools, and techniques from professional and home cooks.',
    devices: ['iPhone', 'Android', 'GoPro', 'DSLR'],
    dateRange: '2023-03 to 2024-10',
    geoDistribution: [
      { country: 'India', count: 4000 },
      { country: 'Nigeria', count: 2500 },
      { country: 'Mexico', count: 2000 },
      { country: 'Vietnam', count: 1500 },
      { country: 'Others', count: 2000 },
    ],
    qualityDistribution: [
      { range: '90–100', count: 8400 },
      { range: '80–89', count: 2800 },
      { range: '70–79', count: 600 },
      { range: '<70', count: 200 },
    ],
    pricingTiers: [
      { label: 'Starter', quantity: 500, pricePerUnit: 0.5, total: 250 },
      { label: 'Growth', quantity: 3000, pricePerUnit: 0.4, total: 1200 },
      { label: 'Scale', quantity: 12000, pricePerUnit: 0.3, total: 3600 },
    ],
  },
  {
    id: 'industrial-workspace-photos',
    name: 'Industrial Workspace Photos',
    type: 'photo',
    count: 25000,
    countLabel: '25K photos',
    geography: 'Factories worldwide',
    quality: 85,
    pricePerUnit: 0.03,
    unit: 'image',
    description: 'Factory floors, warehouses, and industrial sites across manufacturing, logistics, and construction sectors.',
    devices: ['DSLR', 'Mirrorless', 'iPhone', 'Android'],
    dateRange: '2022-09 to 2024-08',
    geoDistribution: [
      { country: 'China', count: 9000 },
      { country: 'Germany', count: 5000 },
      { country: 'USA', count: 4500 },
      { country: 'India', count: 4000 },
      { country: 'Others', count: 2500 },
    ],
    qualityDistribution: [
      { range: '90–100', count: 8000 },
      { range: '80–89', count: 12000 },
      { range: '70–79', count: 4000 },
      { range: '<70', count: 1000 },
    ],
    pricingTiers: [
      { label: 'Starter', quantity: 1000, pricePerUnit: 0.03, total: 30 },
      { label: 'Growth', quantity: 10000, pricePerUnit: 0.024, total: 240 },
      { label: 'Scale', quantity: 25000, pricePerUnit: 0.018, total: 450 },
    ],
  },
  {
    id: 'urban-traffic-footage',
    name: 'Urban Traffic Footage',
    type: 'video',
    count: 18000,
    countLabel: '18K clips',
    geography: '15 cities',
    quality: 90,
    pricePerUnit: 0.35,
    unit: 'clip',
    description: 'Dashcam and street-level traffic footage from 15 major cities, covering intersections, highways, and pedestrian zones.',
    devices: ['Dashcam', 'GoPro', 'iPhone', 'Android'],
    dateRange: '2023-01 to 2024-12',
    geoDistribution: [
      { country: 'India', count: 5000 },
      { country: 'Indonesia', count: 3500 },
      { country: 'Brazil', count: 3000 },
      { country: 'Egypt', count: 2500 },
      { country: 'Others', count: 4000 },
    ],
    qualityDistribution: [
      { range: '90–100', count: 9000 },
      { range: '80–89', count: 6500 },
      { range: '70–79', count: 2000 },
      { range: '<70', count: 500 },
    ],
    pricingTiers: [
      { label: 'Starter', quantity: 500, pricePerUnit: 0.35, total: 175 },
      { label: 'Growth', quantity: 5000, pricePerUnit: 0.28, total: 1400 },
      { label: 'Scale', quantity: 18000, pricePerUnit: 0.21, total: 3780 },
    ],
  },
  {
    id: 'conversational-speech-hindi',
    name: 'Conversational Speech — Hindi',
    type: 'audio',
    count: 15000,
    countLabel: '15K clips',
    geography: 'Regional dialects',
    quality: 91,
    pricePerUnit: 0.12,
    unit: 'clip',
    description: 'Natural conversational Hindi speech across Awadhi, Braj, Bhojpuri, and Standard Hindi dialects, collected in real-world environments.',
    devices: ['iPhone', 'Android', 'USB Mic', 'Lavalier'],
    dateRange: '2023-04 to 2024-11',
    geoDistribution: [
      { country: 'Uttar Pradesh', count: 6000 },
      { country: 'Bihar', count: 3500 },
      { country: 'Rajasthan', count: 2500 },
      { country: 'Madhya Pradesh', count: 2000 },
      { country: 'Others', count: 1000 },
    ],
    qualityDistribution: [
      { range: '90–100', count: 7500 },
      { range: '80–89', count: 5500 },
      { range: '70–79', count: 1500 },
      { range: '<70', count: 500 },
    ],
    pricingTiers: [
      { label: 'Starter', quantity: 1000, pricePerUnit: 0.12, total: 120 },
      { label: 'Growth', quantity: 5000, pricePerUnit: 0.096, total: 480 },
      { label: 'Scale', quantity: 15000, pricePerUnit: 0.072, total: 1080 },
    ],
  },
];

export const RECENT_PURCHASES = [
  { dataset: 'Urban Traffic Footage', date: '2025-01-28', quantity: '5,000 clips', amount: '$1,750', status: 'Delivered' },
  { dataset: 'South Asian Street Scenes', date: '2025-01-21', quantity: '10K images', amount: '$200', status: 'Delivered' },
  { dataset: 'Kitchen Activities Video', date: '2025-01-15', quantity: '500 clips', amount: '$250', status: 'Delivered' },
  { dataset: 'Multilingual Voice — Bangla', date: '2025-01-09', quantity: '2,000 clips', amount: '$300', status: 'Processing' },
  { dataset: 'Industrial Workspace Photos', date: '2024-12-30', quantity: '10K images', amount: '$300', status: 'Delivered' },
];

export const PURCHASE_HISTORY = [
  { id: 'PUR-2025-0128', dataset: 'Urban Traffic Footage', date: '2025-01-28', quantity: '5,000 clips', amount: '$1,750', status: 'Delivered' },
  { id: 'PUR-2025-0121', dataset: 'South Asian Street Scenes', date: '2025-01-21', quantity: '10,000 images', amount: '$200', status: 'Delivered' },
  { id: 'PUR-2025-0115', dataset: 'Kitchen Activities Video', date: '2025-01-15', quantity: '500 clips', amount: '$250', status: 'Delivered' },
  { id: 'PUR-2025-0109', dataset: 'Multilingual Voice — Bangla', date: '2025-01-09', quantity: '2,000 clips', amount: '$300', status: 'Processing' },
  { id: 'PUR-2024-1230', dataset: 'Industrial Workspace Photos', date: '2024-12-30', quantity: '10,000 images', amount: '$300', status: 'Delivered' },
  { id: 'PUR-2024-1215', dataset: 'Conversational Speech — Hindi', date: '2024-12-15', quantity: '5,000 clips', amount: '$600', status: 'Delivered' },
  { id: 'PUR-2024-1201', dataset: 'Urban Traffic Footage', date: '2024-12-01', quantity: '3,000 clips', amount: '$1,050', status: 'Delivered' },
  { id: 'PUR-2024-1118', dataset: 'South Asian Street Scenes', date: '2024-11-18', quantity: '45,000 images', amount: '$540', status: 'Delivered' },
  { id: 'PUR-2024-1105', dataset: 'Kitchen Activities Video', date: '2024-11-05', quantity: '3,000 clips', amount: '$1,200', status: 'Delivered' },
  { id: 'PUR-2024-1020', dataset: 'Multilingual Voice — Bangla', date: '2024-10-20', quantity: '8,000 clips', amount: '$720', status: 'Delivered' },
];

export const AVAILABILITY_DATA = [
  { name: 'Photo', value: 60, color: '#00E676' },
  { name: 'Video', value: 25, color: '#448AFF' },
  { name: 'Audio', value: 15, color: '#FFB300' },
];
