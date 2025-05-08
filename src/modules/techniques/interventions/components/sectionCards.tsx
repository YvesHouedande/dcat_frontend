import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-100 to-green-100/20 opacity-50 pointer-events-none"></div>
        <CardHeader className="relative">
          <CardDescription>Contrats</CardDescription>
          <CardTitle className="@[250px]/card:text-5xl text-2xl font-bold tabular-nums">
            34
          </CardTitle>
          <div className="absolute right-4 top-4"></div>
        </CardHeader>
      </Card>

      {/* <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">$1,250.00</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card> */}

      <Card className="@container/card relative overflow-hidden">
        {/* Subtle green gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-100 to-green-800/20 opacity-50 pointer-events-none"></div>

        <CardHeader className="relative z-10">
          <CardDescription>Produits utilisés</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            45
            <div className="text-sm font-normal mt-2">total: 2,345</div>
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm relative z-10">
          <div className="line-clamp-1 flex gap-2 font-medium">
            par rapport au mois dernier <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            En hausse de +12.5 % sur cette période
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-100 to-red-800/20 opacity-50 pointer-events-none"></div>
        <CardHeader className="relative">
          <CardDescription>Interventions</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            35
            <div className="text-sm font-normal mt-2">total: 345</div>
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            par rapport au mois dernier <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            En baisse de 20 % sur cette période
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
