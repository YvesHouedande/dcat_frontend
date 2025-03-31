"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
const chartData = [
  { date: "2024-04-01", intervention: 222 },
  { date: "2024-04-02", intervention: 97 },
  { date: "2024-04-03", intervention: 167 },
  { date: "2024-04-04", intervention: 242 },
  { date: "2024-04-05", intervention: 373 },
  { date: "2024-04-06", intervention: 301 },
  { date: "2024-04-07", intervention: 245 },
  { date: "2024-04-08", intervention: 409 },
  { date: "2024-04-09", intervention: 59 },
  { date: "2024-04-10", intervention: 261 },
  { date: "2024-04-11", intervention: 327 },
  { date: "2024-04-12", intervention: 292 },
  { date: "2024-04-13", intervention: 342 },
  { date: "2024-04-14", intervention: 137 },
  { date: "2024-04-15", intervention: 120 },
  { date: "2024-04-16", intervention: 138 },
  { date: "2024-04-17", intervention: 446 },
  { date: "2024-04-18", intervention: 364 },
  { date: "2024-04-19", intervention: 243 },
  { date: "2024-04-20", intervention: 89 },
  { date: "2024-04-21", intervention: 137 },
  { date: "2024-04-22", intervention: 224 },
  { date: "2024-04-23", intervention: 138 },
  { date: "2024-04-24", intervention: 387 },
  { date: "2024-04-25", intervention: 215 },
  { date: "2024-04-26", intervention: 75 },
  { date: "2024-04-27", intervention: 383 },
  { date: "2024-04-28", intervention: 122 },
  { date: "2024-04-29", intervention: 315 },
  { date: "2024-04-30", intervention: 454 },
  { date: "2024-05-01", intervention: 165 },
  { date: "2024-05-02", intervention: 293 },
  { date: "2024-05-03", intervention: 247 },
  { date: "2024-05-04", intervention: 385 },
  { date: "2024-05-05", intervention: 481 },
  { date: "2024-05-06", intervention: 498 },
  { date: "2024-05-07", intervention: 388 },
  { date: "2024-05-08", intervention: 149 },
  { date: "2024-05-09", intervention: 227 },
  { date: "2024-05-10", intervention: 293 },
  { date: "2024-05-11", intervention: 335 },
  { date: "2024-05-12", intervention: 197 },
  { date: "2024-05-13", intervention: 197 },
  { date: "2024-05-14", intervention: 448 },
  { date: "2024-05-15", intervention: 473 },
  { date: "2024-05-16", intervention: 338 },
  { date: "2024-05-17", intervention: 499 },
  { date: "2024-05-18", intervention: 315 },
  { date: "2024-05-19", intervention: 235 },
  { date: "2024-05-20", intervention: 177 },
  { date: "2024-05-21", intervention: 82 },
  { date: "2024-05-22", intervention: 81 },
  { date: "2024-05-23", intervention: 252 },
  { date: "2024-05-24", intervention: 294 },
  { date: "2024-05-25", intervention: 201 },
  { date: "2024-05-26", intervention: 213 },
  { date: "2024-05-27", intervention: 420 },
  { date: "2024-05-28", intervention: 233 },
  { date: "2024-05-29", intervention: 78 },
  { date: "2024-05-30", intervention: 340 },
  { date: "2024-05-31", intervention: 178 },
  { date: "2024-06-01", intervention: 178 },
  { date: "2024-06-02", intervention: 470 },
  { date: "2024-06-03", intervention: 103 },
  { date: "2024-06-04", intervention: 439 },
  { date: "2024-06-05", intervention: 88 },
  { date: "2024-06-06", intervention: 294 },
  { date: "2024-06-07", intervention: 323 },
  { date: "2024-06-08", intervention: 385 },
  { date: "2024-06-09", intervention: 438 },
  { date: "2024-06-10", intervention: 155 },
  { date: "2024-06-11", intervention: 92 },
  { date: "2024-06-12", intervention: 492 },
  { date: "2024-06-13", intervention: 81 },
  { date: "2024-06-14", intervention: 426 },
  { date: "2024-06-15", intervention: 307 },
  { date: "2024-06-16", intervention: 371 },
  { date: "2024-06-17", intervention: 475 },
  { date: "2024-06-18", intervention: 107 },
  { date: "2024-06-19", intervention: 341 },
  { date: "2024-06-20", intervention: 408 },
  { date: "2024-06-21", intervention: 169 },
  { date: "2024-06-22", intervention: 317 },
  { date: "2024-06-23", intervention: 480 },
  { date: "2024-06-24", intervention: 132 },
  { date: "2024-06-25", intervention: 141 },
  { date: "2024-06-26", intervention: 434 },
  { date: "2024-06-27", intervention: 448 },
  { date: "2024-06-28", intervention: 149 },
  { date: "2024-06-29", intervention: 103 },
  { date: "2024-06-30", intervention: 446 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  intervention: {
    label: "intervention",
    color: "hsl(var(--chart-6))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Total des interventions</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total pour les 3 derniers mois
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              3 derniers mois
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              30 derniers jours
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              7 derniers jours
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillintervention" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-intervention)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-intervention)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="intervention"
              type="natural"
              fill="url(#fillintervention)"
              stroke="var(--color-intervention)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
