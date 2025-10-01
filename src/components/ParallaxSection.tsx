import React from 'react';
import Lenis from '@studio-freight/lenis';
import { ZoomParallax } from "@/components/ui/zoom-parallax";

export function ParallaxSection() {
  React.useEffect(() => {
    const lenis = new Lenis();
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Medical consultation room',
    },
    {
      src: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Aesthetic clinic interior',
    },
    {
      src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Medical technology',
    },
    {
      src: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Professional consultation',
    },
    {
      src: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Surgical planning',
    },
    {
      src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Medical professionals',
    },
    {
      src: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Patient care excellence',
    },
  ];

  return <ZoomParallax images={images} />;
}
