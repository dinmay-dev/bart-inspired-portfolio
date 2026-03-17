import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface ContentMap {
  [key: string]: string;
}

let globalCache: ContentMap = {};
let listeners: Array<() => void> = [];
let fetched = false;
let fetching = false;

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

async function fetchAllContent() {
  if (fetching) return;
  fetching = true;
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value");
    if (error) throw error;
    const map: ContentMap = {};
    data?.forEach((row) => {
      map[row.key] = row.value;
    });
    globalCache = map;
    fetched = true;
    notifyListeners();
  } catch (err) {
    console.error("Failed to fetch site content:", err);
  } finally {
    fetching = false;
  }
}

export function useSiteContent() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    if (!fetched && !fetching) {
      fetchAllContent();
    }
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const get = useCallback(
    (key: string, fallback: string = "") => globalCache[key] ?? fallback,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalCache]
  );

  const update = useCallback(async (key: string, value: string) => {
    // Optimistic update
    globalCache = { ...globalCache, [key]: value };
    notifyListeners();

    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) {
      console.error("Failed to update content:", error);
      // Refetch on error
      await fetchAllContent();
      throw error;
    }
  }, []);

  const refresh = useCallback(() => {
    fetched = false;
    fetchAllContent();
  }, []);

  const getImageUrl = useCallback((path: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const uploadImage = useCallback(async (file: File, path: string) => {
    const { error } = await supabase.storage
      .from("site-images")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    return data.publicUrl;
  }, []);

  return { get, update, refresh, getImageUrl, uploadImage, loaded: fetched };
}
