// Edit this file to add, remove, or reorder hero image slides.
// Keep 3–6 slides for best pacing. See README.md for image size/format specs.
//
// `src` must point to a file inside /public/hero/ (e.g. "/hero/hero-1.jpg").
// `alt` is for accessibility/SEO — describe what's literally in the image.
// `caption` is the short line shown over the image in the hero.

export interface HeroSlide {
  src: string;
  alt: string;
  caption: string;
}

export const heroSlides: HeroSlide[] = [
  {
    src: "/hero/hero-1.jpg",
    alt: "Solar panels being installed on a US residential roof",
    caption: "Get more solar installation leads",
  },
  {
    src: "/hero/hero-2.jpg",
    alt: "Technician performing a solar panel system checkup",
    caption: "Get more solar checkup & maintenance leads",
  },
  {
    src: "/hero/hero-3.jpg",
    alt: "Worker cleaning solar panels on a rooftop",
    caption: "Get hired for solar panel cleaning jobs",
  },
  {
    src: "/hero/hero-4.jpg",
    alt: "Lithium battery storage unit installed next to a home",
    caption: "Get more panel & battery upgrade leads",
  },
  {
    src: "/hero/hero-5.jpg",
    alt: "Homeowner reviewing solar options with a consultant",
    caption: "Get more solar sales leads",
  },
];
