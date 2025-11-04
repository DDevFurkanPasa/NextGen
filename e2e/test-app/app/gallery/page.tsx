import Image from 'next/image';

export default function GalleryPage() {
  return (
    <main>
      <h1>Gallery</h1>
      <div className="grid grid-cols-3 gap-4">
        <Image
          src="/next.svg"
          alt="Image 1"
          width={200}
          height={200}
          data-strapi-image="true"
        />
        <Image
          src="/vercel.svg"
          alt="Image 2"
          width={200}
          height={200}
          data-strapi-image="true"
        />
        <Image
          src="/next.svg"
          alt="Image 3"
          width={200}
          height={200}
          data-strapi-image="true"
        />
      </div>
    </main>
  );
}
