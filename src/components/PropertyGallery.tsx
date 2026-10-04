import Image from "next/image";

// Billedgalleri, man kan swipe i på mobilen.
// Bygget med browserens egen "scroll-snap", så der ikke skal bruges JavaScript:
// billederne ligger på en række, og hvert swipe stopper præcist på næste billede.
export default function PropertyGallery({
  images,
  title,
  label,
}: {
  images: string[];
  title: string;
  label: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-stone-100">
      <div className="flex snap-x snap-mandatory overflow-x-auto">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[4/3] w-full shrink-0 snap-center sm:aspect-[16/9]"
          >
            <Image
              src={src}
              alt={`${title} (${i + 1}/${images.length})`}
              fill
              priority={i === 0}
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <span className="absolute bottom-3 end-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {label}
        </span>
      )}
    </div>
  );
}
