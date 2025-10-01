'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
interface Image {
  src: string;
  alt?: string;
}
interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: Image[];
}
export function ZoomParallax({
  images
}: ZoomParallaxProps) {
  const container = useRef(null);
  const {
    scrollYProgress
  } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];
  return <div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{images.map(({
        src,
        alt
      }, index) => {
        const scale = scales[index % scales.length];
        return;
      })}
			</div>
		</div>;
}