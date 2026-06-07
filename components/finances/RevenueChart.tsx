"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DailyRevenueChartSkeleton } from "./FinanceSkeleton";
import { DailyRevenue } from "@/types/finance";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { useMemo, useState } from "react";

interface DailyRevenueChartProps {
  data: DailyRevenue[];
  isLoading: boolean;
  onDaysChange: (days: number) => void;
  days: number;
  formatCurrency: (amount: number) => string;
}

export const DailyRevenueChart = ({
  data,
  isLoading,
  onDaysChange,
  days,
  formatCurrency,
}: DailyRevenueChartProps) => {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Always show last 7 days for the chart (clean and simple)
  const chartData = useMemo(() => {
    if (!data.length) return [];
    return data.slice(-7);
  }, [data]);

  // Calculate metrics
  const totalRevenue = useMemo(
    () => data.reduce((sum, day) => sum + day.revenue, 0),
    [data],
  );

  const averageRevenue = data.length ? totalRevenue / data.length : 0;

  const lastDayRevenue = data[data.length - 1]?.revenue || 0;
  const previousDayRevenue = data[data.length - 2]?.revenue || 0;
  const trend = lastDayRevenue - previousDayRevenue;

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  // Get simple day labels
  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // NOW we can have conditional returns
  if (isLoading) return <DailyRevenueChartSkeleton />;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Revenue Overview
          </CardTitle>
          <p className="text-2xl font-bold mt-2">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs text-gray-500">Total ({days} days)</p>
        </div>
        <select
          className="text-sm border rounded-md px-2 py-1 bg-white"
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
        </select>
      </CardHeader>

      <CardContent>
        {/* Mini stats row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500">Average daily</p>
            <p className="text-lg font-semibold">
              {formatCurrency(averageRevenue)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Best day</p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(Math.max(...data.map((d) => d.revenue)))}
            </p>
          </div>
        </div>

        {/* Trend pill */}
        <div className="flex items-center justify-center mb-6">
          <div
            className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
            ${
              trend > 0
                ? "bg-emerald-50 text-emerald-700"
                : trend < 0
                  ? "bg-rose-50 text-rose-700"
                  : "bg-gray-50 text-gray-700"
            }
          `}
          >
            {trend > 0 ? (
              <>
                <TrendingUp className="h-4 w-4" />
                <span>Up {formatCurrency(trend)} from yesterday</span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="h-4 w-4" />
                <span>
                  Down {formatCurrency(Math.abs(trend))} from yesterday
                </span>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4" />
                <span>No change from yesterday</span>
              </>
            )}
          </div>
        </div>

        {/* Chart with hover tooltips */}
        <div className="relative h-48 mt-4">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-100 h-0" />
            ))}
          </div>

          {/* Hover tooltip */}
          {hoveredIndex !== null && chartData[hoveredIndex] && (
            <div
              className="absolute bg-white shadow-lg rounded-lg p-2 z-10 border min-w-[120px]"
              style={{
                left: `${(hoveredIndex / (chartData.length - 1)) * 100}%`,
                top: "30px",
                transform: "translateX(-50%)",
              }}
            >
              <p className="text-xs text-gray-500">
                {getDayLabel(chartData[hoveredIndex].date)}
              </p>
              <p className="text-sm font-bold text-primary">
                {formatCurrency(chartData[hoveredIndex].revenue)}
              </p>
            </div>
          )}

          {/* Chart area */}
          <div className="absolute inset-0 flex items-end">
            <svg
              className="w-full h-40"
              preserveAspectRatio="none"
              viewBox="0 0 100 40"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Area under the line (subtle gradient) */}
              <polygon
                points={`
                  0,40
                  ${chartData
                    .map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 100;
                      const y = 40 - (d.revenue / maxRevenue) * 35;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  100,40
                `}
                fill="rgba(59, 130, 246, 0.1)"
              />

              {/* Line */}
              <polyline
                points={chartData
                  .map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 100;
                    const y = 40 - (d.revenue / maxRevenue) * 35;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="drop-shadow-sm"
              />

              {/* Invisible hover areas */}
              {chartData.map((d, i) => {
                const x = (i / (chartData.length - 1)) * 100;
                return (
                  <rect
                    key={i}
                    x={x - 5}
                    y="0"
                    width="10"
                    height="40"
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(i)}
                    className="cursor-pointer"
                  />
                );
              })}

              {/* Data points */}
              {chartData.map((d, i) => {
                const x = (i / (chartData.length - 1)) * 100;
                const y = 40 - (d.revenue / maxRevenue) * 35;
                const isToday = i === chartData.length - 1;
                const isHovered = hoveredIndex === i;

                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isHovered ? "1.5" : isToday ? "1.2" : "0.8"}
                    fill={
                      isHovered
                        ? "rgb(59, 130, 246)"
                        : isToday
                          ? "rgb(59, 130, 246)"
                          : "white"
                    }
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="1.5"
                    className="drop-shadow-sm transition-all duration-150"
                    onMouseEnter={() => setHoveredIndex(i)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-1">
          {chartData.map((day, i) => (
            <span
              key={day.date}
              className={`text-[10px] ${hoveredIndex === i ? "text-primary font-bold" : "text-gray-500"} cursor-pointer transition-colors`}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              {getDayLabel(day.date)}
            </span>
          ))}
        </div>

        {/* Simple explanation */}
        <p className="text-[10px] text-gray-400 mt-4 text-center border-t pt-3">
          Last 7 days shown. Hover over points to see exact amounts.
        </p>
      </CardContent>
    </Card>
  );
};
