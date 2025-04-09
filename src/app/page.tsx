import { fetchStationData } from "@/services/stationService";
import { StationData } from "@/types/StationData";
import { useState } from "react";
import { Suspense } from "react";
import StationSearch from "@/components/StationSearch";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <StationSearch />
      </Suspense>
    </div>
  );
}
