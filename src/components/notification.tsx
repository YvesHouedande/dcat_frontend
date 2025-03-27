import {
  DropdownMenu,
  DropdownMenuContent,
  //   DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { Inbox } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function Notification() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="cursor-pointer">
          <Bell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 h-screen">
        <DropdownMenuLabel className="font-semibold ">
          Notification
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-1 text-zinc-400">
          <div className="flex flex-col w-full items-center justify-center pt-32 lg:pt-60 ">
            <Inbox size={48}/>
            <Label >Vous êtes à jour</Label>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
