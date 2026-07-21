import { supabase } from "./supabase";
import type { SprintState } from "./types";
import { loadState, normalizeLoadedState, saveState } from "./store";

export async function fetchSprintState(userId: string): Promise<SprintState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("sprint_states")
    .select("state")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load sprint state", error.message);
    return null;
  }
  if (!data?.state) return null;
  return normalizeLoadedState(data.state);
}

export async function persistSprintState(userId: string, state: SprintState) {
  saveState(state, userId);
  if (!supabase) return;

  const { error } = await supabase.from("sprint_states").upsert(
    {
      user_id: userId,
      state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) console.error("Failed to save sprint state", error.message);
}

export function localStateForUser(userId: string | null) {
  return loadState(userId);
}
