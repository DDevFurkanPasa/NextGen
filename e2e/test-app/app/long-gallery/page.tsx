import Image from 'next/image';

export default function LongGalleryPage() {
  const images = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <main className="min-h-[3000px]">
      <h1>Long Gallery</h1>
      <div className="grid grid-cols-3 gap-4">
        {images.map((i) => (
          <Image
            key={i}
            src={i % 2 === 0 ? '/next.svg' : '/vercel.svg'}
            alt={`Image ${i}`}
            width={200}
            height={200}
            data-strapi-image="true"
            loading="lazy"
          />
        ))}
      </div>
    </main>
  );
}
