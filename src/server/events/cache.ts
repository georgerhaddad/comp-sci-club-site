export const EVENTS_LIST_CACHE_TAG = "events";

export function getEventCacheTag(id: string) {
  return `event:${id}`;
}
