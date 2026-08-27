export interface Review {
  id: string;
  name: string;
  company: string | null;
  country: string;
  rating: number;
  review: string;
  avatar_url: string | null;
  created_at: string;
}

// Shown only when there are zero approved reviews yet (e.g. right after
// launch, before real clients have left one). Once you approve real reviews
// in Supabase, this fallback is never used — real reviews always take
// priority. Safe to delete this array once you have 3+ real reviews.
export const placeholderReviews: Review[] = [
  {
    id: "placeholder-1",
    name: "Client Name",
    company: "Company",
    country: "USA",
    rating: 5,
    review: "Placeholder quote — swap in a real client's words about lead quality or communication.",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "placeholder-2",
    name: "Client Name",
    company: "Company",
    country: "UK",
    rating: 5,
    review: "Placeholder quote — swap in a real client's words about cost per lead or booked calls.",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "placeholder-3",
    name: "Client Name",
    company: "Company",
    country: "Australia",
    rating: 5,
    review: "Placeholder quote — swap in a real client's words about overall experience.",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
];
