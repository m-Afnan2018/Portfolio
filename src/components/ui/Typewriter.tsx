"use client";

import { useEffect, useState } from "react";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";
import { playSound } from "@/lib/sound";

/** Types and deletes through a list of phrases, with a blinking block caret. */
export function Typewriter({ words, className, start = true }: { words: readonly string[]; className?: string; start?: boolean }) {
  const reduced = useReducedMotionFlag();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!start || reduced) return;
    const word = words[index % words.length];
    let delay = deleting ? 28 : 55 + Math.random() * 60;
    if (!deleting && text === word) delay = 1800;
    if (deleting && text === "") delay = 300;
    const t = setTimeout(() => {
      if (!deleting && text === word) return setDeleting(true);
      if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
        return;
      }
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      if (!deleting) playSound("key");
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, start, reduced]);

  const shown = reduced ? words[0] : text;
  return (
    <span className={className}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {shown}
        <span className="caret ml-1" />
      </span>
    </span>
  );
}
