import { EventType, RefType } from "@/types";
import { useEffect } from "react";

function useEventOutside(
  refs: RefType,
  callback: (event: Event) => void,
  events: EventType = ["mousedown", "touchstart"],
) {
  useEffect(() => {
    if (!refs) return;

    const listener = (event: Event) => {
      const refArray = Array.isArray(refs) ? refs : [refs];

      if (refArray.some((ref) => ref.current?.contains(event.target as Node))) {
        return;
      }

      callback(event);
    };

    const eventArray = Array.isArray(events) ? events : [events];

    eventArray.forEach((eventType) => {
      document.addEventListener(eventType, listener);
    });

    return () => {
      eventArray.forEach((eventType) => {
        document.removeEventListener(eventType, listener);
      });
    };
  }, [refs, callback, events]);
}

export default useEventOutside;
