"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Én prik på kortet. Koordinaterne er allerede rundet af på serveren.
export type MapPoint = {
  href: string;
  latitude: number;
  longitude: number;
  title: string;
  price: string;
};

// Kort over søgeresultaterne: én prik pr. bolig, klik viser pris og link.
export default function SearchMap({
  points,
  label,
}: {
  points: MapPoint[];
  label: string;
}) {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    // Leaflet virker kun i browseren, så den hentes først her.
    import("leaflet").then((L) => {
      if (cancelled || !mapElement.current) return;
      map = L.map(mapElement.current, {
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      for (const point of points) {
        // Pop-up'en bygges som rigtige elementer (ikke HTML-tekst), så en titel aldrig kan blive til kode.
        const popup = document.createElement("a");
        popup.href = point.href;
        popup.className = "flex flex-col";
        const price = document.createElement("strong");
        // Tegnene \u2066 og \u2069 holder prisen i rigtig rækkefølge på arabisk (som <bdi>).
        price.textContent = `\u2066${point.price}\u2069`;
        const title = document.createElement("span");
        title.textContent = point.title;
        popup.append(price, title);

        L.circleMarker([point.latitude, point.longitude], {
          radius: 9,
          color: "#ffffff",
          weight: 2,
          fillColor: "#047857",
          fillOpacity: 1,
        })
          .bindPopup(popup)
          .addTo(map);
      }

      // Zoom, så alle prikker kan ses.
      map.fitBounds(
        points.map((p) => [p.latitude, p.longitude]),
        { padding: [30, 30], maxZoom: 13 },
      );
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [points]);

  // "isolate" holder kortet under andre elementer, fx menuer.
  return (
    <div
      ref={mapElement}
      role="region"
      aria-label={label}
      className="isolate h-72 w-full overflow-hidden rounded-2xl bg-stone-100 sm:h-96"
    />
  );
}
