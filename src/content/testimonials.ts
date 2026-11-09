import type { Localized } from "./types";

export type Testimonial = {
  /** The client's own words. Only add real quotes, with the client's permission. */
  quote: Localized;
  name: Localized;
  /** e.g. "Owner, Aser Watch". */
  role: Localized;
  /** Slug of the project it is about; the quote also shows on that project's page. */
  project?: string;
};

export const testimonials: Testimonial[] = [];
