export type PostType = "photo" | "certificate" | "project" | "event";

export interface PostMedia {
  s3_key: string;
  width: number;
  height: number;
  blurhash: string;
  mime: string;
}

export interface Post {
  id: string;
  title: string;
  caption: string;
  type: PostType;
  tags: string[];
  issuer?: string;
  issue_date?: string;
  credential_url?: string;
  credential_id?: string;
  media: PostMedia[];
  created_at: string; // ISO
  published: boolean;
}

export const POST_TYPES: { value: PostType; label: string }[] = [
  { value: "photo", label: "Photo" },
  { value: "certificate", label: "Certificate" },
  { value: "project", label: "Project" },
  { value: "event", label: "Event" },
];
