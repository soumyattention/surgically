export interface Procedure {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
}

export const PROCEDURES: Procedure[] = [
  {
    id: "rhinoplasty",
    name: "Rhinoplasty",
    description: "Nose reshaping",
    icon: "👃",
    prompt: "Subtly reshape the nose in the provided photo to have a straighter bridge and a more refined, slightly lifted tip. Ensure the result is natural-looking and harmonious with the other facial features. The skin texture and lighting must remain consistent with the original image. Only modify the nose.",
  },
  {
    id: "lip-filler",
    name: "Lip Filler",
    description: "Lip enhancement",
    icon: "💋",
    prompt: "In the provided photo, perform a lip filler simulation. The goal is to make both the upper and lower lips noticeably thicker and fuller. Significantly increase the volume of both lips to create a plump, well-defined look. Ensure the result appears natural and maintains the original lip texture and color. The rest of the face and background must remain completely unchanged.",
  },
  {
    id: "botox",
    name: "Botox",
    description: "Wrinkle reduction",
    icon: "✨",
    prompt: "In the provided image, simulate the effects of Botox injections. Smooth out the dynamic wrinkles on the forehead (horizontal lines), between the eyebrows (glabellar or '11' lines), and at the corners of the eyes ('crow's feet'). The skin in these areas should look smoother and more relaxed, while maintaining a natural expression. Crucially, the original skin color, complexion, and texture must be preserved perfectly. Features like freckles and hyperpigmentation must remain completely unchanged. Do not freeze the face or alter other features.",
  },
  {
    id: "hair-transplant",
    name: "Hair Transplant",
    description: "Hair restoration",
    icon: "💇",
    prompt: "Simulate a hair transplant with maximal, transformative results. The person must have A LOT of hair. Cover the entire scalp, especially the frontal hairline and crown, with an abundance of thick, dense, short hair. There should be absolutely no bald spots anywhere on the head. Completely erase any sign of a receding hairline, replacing it with a strong, low, and perfectly full hairline. The final result must be a super dense, full head of hair that looks completely restored and youthful, styled in a short haircut. Ensure the new hair's color and texture blend flawlessly with any existing hair. Do not change any other part of the image.",
  },
  {
    id: "brow-lift",
    name: "Brow Lift",
    description: "Forehead lift",
    icon: "🔺",
    prompt: "Significantly elevate the position of the eyebrows in the image to create a visibly more alert, open, and youthful appearance. The lift should be noticeable but still look natural. Smooth the deep horizontal wrinkles on the forehead and reduce frown lines between the brows. Add very fine, well-hidden incision scars just within the frontal hairline. Do not change the eye shape or any other facial features.",
  },
  {
    id: "face-contouring",
    name: "Face Contouring",
    description: "V-Line reshaping",
    icon: "💎",
    prompt: "Subtly contour the facial structure in the provided photo to create a more defined jawline and a slimmer, more 'V-shaped' lower face. Reduce buccal fat for a less rounded cheek appearance. The result should look natural and harmonious with the rest of the facial features, without altering skin texture or other identifiable characteristics.",
  },
  {
    id: "chin-surgery",
    name: "Chin Surgery",
    description: "Genioplasty",
    icon: "🎭",
    prompt: "Perform a subtle chin augmentation (genioplasty) in the provided photo. Project the chin slightly forward to create a more balanced and defined lower facial profile. Ensure the new chin contour blends seamlessly with the jawline. The rest of the face, including the lips and neck, must remain unchanged.",
  },
  {
    id: "mole-removal",
    name: "Mole Removal",
    description: "Skin lesion removal",
    icon: "⚕️",
    prompt: "In the location of the prominent mole on the cheek, replace it with clear, smooth skin and a tiny, faded, flat white scar that is barely visible. The skin texture must be perfectly blended. The rest of the face and background must remain identical.",
  },
  {
    id: "cleft-lip-repair",
    name: "Cleft Lip Repair",
    description: "Corrective surgery",
    icon: "🩹",
    prompt: "In the provided photo, repair the unilateral cleft lip. Close the gap in the upper lip, create a symmetrical and natural-looking Cupid's bow, and align the base of the nose. Add a very thin, faded vertical scar from the nostril down through the lip, making it appear as a natural philtral column. Ensure the rest of the face remains completely unchanged.",
  },
  {
    id: "chemical-peel",
    name: "Chemical Peel",
    description: "Skin resurfacing",
    icon: "🌟",
    prompt: "Simulate the effect of a medium-depth chemical peel on the face in the photo. Significantly reduce the appearance of fine lines, minor acne scars, and uneven pigmentation. The resulting skin should appear smoother and more radiant. Crucially, the new skin surface must look completely natural and not AI-generated. It must retain a realistic skin texture, with visible pores, and avoid an overly smooth, 'airbrushed', or fake appearance. Avoid changing any facial features or structure.",
  },
];
