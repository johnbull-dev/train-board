import { fetchStationData, StationData } from "@/services/stationService";
import { useState } from "react";
import StationSearch from "@/components/StationSearch";
export default function Home() {


  
  return (
    <div>
      <StationSearch />
    </div>
  );
}
