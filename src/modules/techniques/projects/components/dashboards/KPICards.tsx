import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

// 🔹 Définition des types des props
interface KPICardProps {
  title: string;
  value: string | number;
  percentage: number;
  trend: "up" | "down";
}

const KPICard: React.FC<KPICardProps> = ({ title, value, percentage, trend }) => {
  const isPositive = trend === "up";

  return (
    <Card className="flex-1 min-w-[220px] border rounded-lg shadow-sm">
      <CardHeader className="relative pb-4">
        <CardDescription className="text-sm truncate">{title}</CardDescription>
        <CardTitle className="mt-1 text-2xl font-semibold">{value}</CardTitle>
        <div className="absolute right-4 top-4">
          <Badge
            variant="outline"
            className={`flex w-16 gap-1 rounded-lg text-xs ${
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
            {percentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 pt-0 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">{isPositive ? "Tendance en hausse" : "Tendance en baisse"}</span>
          {isPositive ? (
            <TrendingUpIcon className="size-4 text-green-600 dark:text-green-400" />
          ) : (
            <TrendingDownIcon className="size-4 text-red-600 dark:text-red-400" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default KPICard;
