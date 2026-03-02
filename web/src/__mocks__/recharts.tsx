import React from 'react';

export const PieChart = ({ children }: { children?: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>;
export const Pie = (_props: Record<string, unknown>) => <div data-testid="pie" />;
export const Cell = (_props: Record<string, unknown>) => <div />;
export const Tooltip = (_props: Record<string, unknown>) => <div />;
export const Legend = (_props: Record<string, unknown>) => <div />;
export const ResponsiveContainer = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
export const BarChart = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
export const Bar = (_props: Record<string, unknown>) => <div />;
export const XAxis = (_props: Record<string, unknown>) => <div />;
export const YAxis = (_props: Record<string, unknown>) => <div />;
export const CartesianGrid = (_props: Record<string, unknown>) => <div />;
