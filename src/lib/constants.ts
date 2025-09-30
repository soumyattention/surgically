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
    prompt: "Apply realistic rhinoplasty changes to this photo. Refine the nose bridge, adjust the tip, and create natural-looking proportions while maintaining the person's facial harmony. The result should look like a professional after-surgery result with natural healing, proper lighting, and realistic skin texture.",
  },
  {
    id: "lip-filler",
    name: "Lip Filler",
    description: "Lip enhancement",
    icon: "💋",
    prompt: "Add natural-looking lip filler enhancement to this photo. Increase lip volume subtly, create better definition, and enhance the cupid's bow while maintaining natural proportions. The result should look professionally done with even, natural-looking fullness and realistic texture.",
  },
  {
    id: "hair-transplant",
    name: "Hair Transplant",
    description: "Hair restoration",
    icon: "💇",
    prompt: "Show realistic hair transplant results on this photo. Add natural-looking hair density to thinning or balding areas, create a natural hairline with varied hair direction, and blend seamlessly with existing hair. The result should look like 6-12 months post-procedure with natural hair growth patterns.",
  },
  {
    id: "botox",
    name: "Botox",
    description: "Wrinkle reduction",
    icon: "✨",
    prompt: "Apply natural Botox results to this photo. Smooth forehead lines, reduce crow's feet, and soften frown lines while maintaining natural facial expressions. The skin should look refreshed and youthful but not frozen, with realistic texture and lighting.",
  },
  {
    id: "blepharoplasty",
    name: "Blepharoplasty",
    description: "Eyelid surgery",
    icon: "👁️",
    prompt: "Show realistic blepharoplasty results on this photo. Remove excess eyelid skin, reduce puffiness, and create a more youthful, alert eye appearance. Maintain natural eye shape while opening up the eye area. Results should look naturally healed with subtle improvements.",
  },
  {
    id: "brow-lift",
    name: "Brow Lift",
    description: "Forehead lift",
    icon: "🔺",
    prompt: "Apply realistic brow lift results to this photo. Elevate the eyebrows to a natural position, smooth forehead wrinkles, and create a more alert, youthful appearance. The lift should look natural, not overly surprised, with realistic skin texture and proper facial proportions.",
  },
  {
    id: "face-contouring",
    name: "Face Contouring",
    description: "Facial reshaping",
    icon: "💎",
    prompt: "Apply professional facial contouring results to this photo. Enhance cheekbones, refine jawline, and create better facial definition through realistic fat reduction and repositioning. The result should look naturally sculpted with proper shadows, highlights, and realistic skin texture.",
  },
  {
    id: "chin-surgery",
    name: "Chin Surgery",
    description: "Chin augmentation",
    icon: "🎭",
    prompt: "Show realistic chin augmentation or reduction results on this photo. Create better facial balance and profile harmony through chin reshaping. Maintain natural proportions with the rest of the face, realistic skin texture, and natural-looking post-surgical results.",
  },
  {
    id: "cleft-lip-repair",
    name: "Cleft Lip Repair",
    description: "Corrective surgery",
    icon: "🩹",
    prompt: "Show realistic cleft lip repair results on this photo. Reconstruct the lip with natural symmetry, proper muscle alignment, and minimal scarring. The result should show professional surgical correction with natural lip shape, texture, and movement potential.",
  },
  {
    id: "mole-removal",
    name: "Mole Removal",
    description: "Skin lesion removal",
    icon: "⚕️",
    prompt: "Show realistic mole removal results on this photo. Remove visible moles or skin lesions with minimal scarring. The treated area should blend naturally with surrounding skin, showing realistic healing with proper skin tone and texture matching.",
  },
  {
    id: "tummy-tuck",
    name: "Tummy Tuck",
    description: "Abdominoplasty",
    icon: "🏋️",
    prompt: "Show realistic tummy tuck results on this photo. Create a flatter, more toned abdominal appearance through realistic fat and skin removal. Maintain natural body proportions, realistic skin texture, and natural-looking post-surgical contours.",
  },
  {
    id: "liposuction",
    name: "Liposuction",
    description: "Fat removal",
    icon: "💪",
    prompt: "Apply realistic liposuction results to this photo. Remove excess fat from targeted areas to create better body contours and proportions. The result should show natural-looking fat reduction with smooth transitions, realistic skin texture, and proper body symmetry.",
  },
  {
    id: "chemical-peel",
    name: "Chemical Peel",
    description: "Skin resurfacing",
    icon: "🌟",
    prompt: "Show realistic chemical peel results on this photo. Improve skin texture, reduce fine lines, even out skin tone, and create a more radiant complexion. The skin should look refreshed and rejuvenated with natural glow, reduced imperfections, and realistic texture.",
  },
];
