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

					// Mobile-first positioning with desktop overrides
					const positionClasses = [
						// Image 0 (center)
						'',
						// Image 1 (top left on desktop, top on mobile)
						'[&>div]:!-top-[15vh] [&>div]:!left-[3vw] md:[&>div]:!-top-[30vh] md:[&>div]:!left-[5vw]',
						// Image 2 (left on desktop, left on mobile)
						'[&>div]:!top-[5vh] [&>div]:!-left-[20vw] md:[&>div]:!-top-[10vh] md:[&>div]:!-left-[25vw]',
						// Image 3 (right on desktop, right on mobile)
						'[&>div]:!top-[2vh] [&>div]:!left-[20vw] md:[&>div]:!top-0 md:[&>div]:!left-[27.5vw]',
						// Image 4 (bottom left on desktop, bottom left on mobile)
						'[&>div]:!top-[25vh] [&>div]:!left-[2vw] md:[&>div]:!top-[27.5vh] md:[&>div]:!left-[5vw]',
						// Image 5 (bottom far left on desktop, bottom left on mobile)
						'[&>div]:!top-[28vh] [&>div]:!-left-[18vw] md:[&>div]:!top-[27.5vh] md:[&>div]:!-left-[22.5vw]',
						// Image 6 (bottom right on desktop, bottom right on mobile)
						'[&>div]:!top-[23vh] [&>div]:!left-[22vw] md:[&>div]:!top-[22.5vh] md:[&>div]:!left-[25vw]',
					];

					// Mobile-first sizes with desktop overrides
					const sizeClasses = [
						// Image 0 (center)
						'h-[28vh] w-[35vw] md:h-[25vh] md:w-[25vw]',
						// Image 1
						'h-[32vh] w-[40vw] md:h-[30vh] md:w-[35vw]',
						// Image 2
						'h-[36vh] w-[28vw] md:h-[45vh] md:w-[20vw]',
						// Image 3
						'h-[28vh] w-[32vw] md:h-[25vh] md:w-[25vw]',
						// Image 4
						'h-[26vh] w-[28vw] md:h-[25vh] md:w-[20vw]',
						// Image 5
						'h-[24vh] w-[36vw] md:h-[25vh] md:w-[30vw]',
						// Image 6
						'h-[18vh] w-[22vw] md:h-[15vh] md:w-[15vw]',
					];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center p-2 md:p-0 ${positionClasses[index] || ''}`}
						>
							<div className={`relative aspect-[3/4] rounded-lg overflow-hidden ${sizeClasses[index] || 'h-[28vh] w-[35vw] md:h-[25vh] md:w-[25vw]'}`}>
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
