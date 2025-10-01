import React from 'react';

export const Component = () => {
  // Images for the infinite scroll with procedure names
  const images = [
    { url: "https://ik.imagekit.io/soumya3301/44.png?updatedAt=1759293129386", name: "Hair Transplant" },
    { url: "https://ik.imagekit.io/soumya3301/47.png?updatedAt=1759293129654", name: "Rhinoplasty" },
    { url: "https://ik.imagekit.io/soumya3301/45.png?updatedAt=1759293129629", name: "Botox" },
    { url: "https://ik.imagekit.io/soumya3301/46.png?updatedAt=1759293129536", name: "Chin Surgery" },
    { url: "https://ik.imagekit.io/soumya3301/48.png?updatedAt=1759293127882", name: "Cleft Lips" },
    { url: "https://ik.imagekit.io/soumya3301/43.png?updatedAt=1759293129618", name: "Facelift" }
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 20s linear infinite;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>
      
      <div className="w-full py-16 overflow-hidden">
        {/* Scrolling images container */}
        <div className="w-full flex items-center justify-center">
          <div className="scroll-container w-full">
            <div className="infinite-scroll flex gap-6 w-max">
              {duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden shadow-2xl relative"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Progressive gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Procedure name */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-white font-semibold text-lg md:text-xl lg:text-2xl">
                      {image.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};