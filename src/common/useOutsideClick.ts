import React, { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: Function,
) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };
    const md = (evt) => callback(evt);

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", md);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", md);
    };
  }, [ref, callback]);
};
