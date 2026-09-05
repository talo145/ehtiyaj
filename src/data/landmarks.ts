import type { Landmark } from "@/types";

/** صور معالم المحافظات — مصدرها ويكيميديا كومنز، ومعها نص الاعتماد. */
export const landmarks: Record<string, Landmark> = {
  عرعر: {
    src: "/landmarks/arar.jpg",
    caption: "برج عرعر",
    credit: "ويكيميديا كومنز · CC BY-SA 4.0",
  },
  رفحاء: {
    src: "/landmarks/rafha.jpg",
    caption: "محطة ضخ رفحاء · 1952",
    credit: "ويكيميديا كومنز · ملك عام",
  },
  طريف: {
    src: "/landmarks/turaif.jpg",
    caption: "محطة الرياطين · التابلاين 1956",
    credit: "ويكيميديا كومنز · ملك عام",
  },
  العويقيلة: {
    src: "/landmarks/uwayqilah.jpg",
    caption: "قليب شداد",
    credit: "ويكيميديا كومنز · CC BY-SA 4.0",
  },
};
