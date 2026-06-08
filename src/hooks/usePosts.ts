import { useCallback, useMemo } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import type { Post } from "@/types/post";

export function usePosts() {
  const { get, update, loaded } = useSiteContent();

  const posts: Post[] = useMemo(() => {
    const raw = get("posts_json", "");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [get]);

  const save = useCallback(
    async (next: Post[]) => {
      await update("posts_json", JSON.stringify(next));
    },
    [update],
  );

  return { posts, save, loaded };
}
