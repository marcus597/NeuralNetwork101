import type { Metadata } from "next";
import { PizzaNetworkLab } from "@/components/exhibit/PizzaNetworkLab";
import { MuseumHeader, MuseumPage } from "@/components/shell/MuseumShell";

export const metadata: Metadata = {
  title: "Build a Pizza Brain",
  description:
    "Watch a tiny team of decision-makers figure out if something is pizza — no math required.",
};

export default function NetworkPage() {
  return (
    <MuseumPage>
      <MuseumHeader
        emoji="🍕"
        title="Build a Pizza Brain"
        subtitle="Let's build a tiny brain that learns what a pizza is — one simple checker at a time."
      />
      <PizzaNetworkLab />
    </MuseumPage>
  );
}
