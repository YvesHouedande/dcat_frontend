import { useEffect, useRef } from "react";

export function useRenderTrace(name: string) {
    const count = useRef(0);
    useEffect(() => {
      count.current += 1;
      console.log(`${name} rendered ${count.current} times`);
    });
  }
  