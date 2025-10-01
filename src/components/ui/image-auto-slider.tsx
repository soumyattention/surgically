import React from 'react';

export const Component = () => {
  // Images for the infinite scroll
  const images = [
    "https://ik.imagekit.io/soumya3301/44.png?updatedAt=1759293129386",
    "https://ik.imagekit.io/soumya3301/47.png?updatedAt=1759293129654",
    "https://ik.imagekit.io/soumya3301/45.png?updatedAt=1759293129629",
    "https://ik.imagekit.io/soumya3301/46.png?updatedAt=1759293129536",
    "https://ik.imagekit.io/soumya3301/48.png?updatedAt=1759293127882",
    "https://ik.imagekit.io/soumya3301/43.png?updatedAt=1759293129618"
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
                  className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};