import React from 'react';

// Auto-mock for lucide-react to avoid loading the massive icon bundle
export default new Proxy({}, {
  get: (_target, name: string) => (props: Record<string, unknown>) => (
    React.createElement('svg', { 'data-testid': `icon-${name}`, ...props })
  ),
});

// Named exports via proxy - this proxy will be spread-imported
const handler: ProxyHandler<Record<string, unknown>> = {
  get: (_target, name: string) => (props: Record<string, unknown>) =>
    React.createElement('svg', { 'data-testid': `icon-${name}`, ...props }),
};

export const LayoutDashboard = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-LayoutDashboard', ...props });
export const Database = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-Database', ...props });
export const FolderOpen = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-FolderOpen', ...props });
export const ShoppingCart = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-ShoppingCart', ...props });
export const Settings = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-Settings', ...props });
export const Menu = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-Menu', ...props });
export const X = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-X', ...props });
export const Zap = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-Zap', ...props });
export const ClipboardList = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-ClipboardList', ...props });
export const Camera = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-Camera', ...props });
export const DollarSign = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-DollarSign', ...props });
export const TrendingUp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-TrendingUp', ...props });
export const Shield = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-Shield', ...props });
export const Wallet = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-Wallet', ...props });
export const Globe = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-Globe', ...props });
export const CheckCircle = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-CheckCircle', ...props });
export const FileText = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-FileText', ...props });
export const ArrowUpRight = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-ArrowUpRight', ...props });
export const ArrowDownRight = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'icon-ArrowDownRight', ...props });
