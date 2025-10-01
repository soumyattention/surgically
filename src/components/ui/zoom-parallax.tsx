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

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];

					// Mobile-first positioning - ensuring no overlap with proper spacing
					const positionClasses = [
						// Image 0 (center top)
						'[&>div]:!-top-[5vh] [&>div]:!left-0',
						// Image 1 (top right)
						'[&>div]:!-top-[8vh] [&>div]:!left-[48vw] md:[&>div]:!-top-[30vh] md:[&>div]:!left-[5vw]',
						// Image 2 (middle left)
						'[&>div]:!top-[30vh] [&>div]:!-left-[48vw] md:[&>div]:!-top-[10vh] md:[&>div]:!-left-[25vw]',
						// Image 3 (middle right)
						'[&>div]:!top-[30vh] [&>div]:!left-[48vw] md:[&>div]:!top-0 md:[&>div]:!left-[27.5vw]',
						// Image 4 (bottom left)
						'[&>div]:!top-[68vh] [&>div]:!-left-[48vw] md:[&>div]:!top-[27.5vh] md:[&>div]:!left-[5vw]',
						// Image 5 (bottom center)
						'[&>div]:!top-[68vh] [&>div]:!left-0 md:[&>div]:!top-[27.5vh] md:[&>div]:!-left-[22.5vw]',
						// Image 6 (bottom right)
						'[&>div]:!top-[68vh] [&>div]:!left-[48vw] md:[&>div]:!top-[22.5vh] md:[&>div]:!left-[25vw]',
					];

					// Consistent sizes with 3:4 aspect ratio
					const sizeClasses = [
						// Image 0
						'w-[40vw] md:w-[25vw]',
						// Image 1
						'w-[40vw] md:w-[35vw]',
						// Image 2
						'w-[40vw] md:w-[20vw]',
						// Image 3
						'w-[40vw] md:w-[25vw]',
						// Image 4
						'w-[40vw] md:w-[20vw]',
						// Image 5
						'w-[40vw] md:w-[30vw]',
						// Image 6
						'w-[40vw] md:w-[15vw]',
					];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${positionClasses[index] || ''}`}
						>
							<div className={`relative aspect-[3/4] rounded-lg overflow-hidden ${sizeClasses[index] || 'w-[40vw] md:w-[25vw]'}`}>
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover"
								/>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
