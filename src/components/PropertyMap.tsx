"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Kort med en cirkel omkring boligens omtrentlige placering (ikke en præcis nål).
export default function PropertyMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    // Leaflet virker kun i browseren, så den hentes først her.
    import("leaflet").then((L) => {
      if (cancelled || !mapElement.current) return;
      map = L.map(mapElement.current, {
        center: [latitude, longitude],
        zoom: 14,
        // Undgå at kortet "stjæler" scroll med musehjulet eller én finger på mobil.
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);
      L.circle([latitude, longitude], {
        radius: 600,
        color: "#047857",
        fillOpacity: 0.2,
      }).addTo(map);
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [latitude, longitude]);

  // "isolate" holder kortet under de faste kontaktknapper nederst.
  return (
    <div
      ref={mapElement}
      className="isolate h-64 w-full overflow-hidden rounded-2xl bg-stone-100 sm:h-80"
    />
  );
}
