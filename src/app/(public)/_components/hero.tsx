"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const useMounted = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

const codeSnippets = [
  { text: "const club = new CSClub();", x: 5, y: 15 },
  { text: "function innovate() {", x: 75, y: 25 },
  { text: "  return future;", x: 80, y: 35 },
  { text: "}", x: 85, y: 45 },
  { text: "import { creativity } from 'mjc';", x: 2, y: 70 },
  { text: "await learn(together);", x: 70, y: 80 },
];

const FloatingCode = ({
  text,
  x,
  y,
  delay,
}: {
  text: string;
  x: number;
  y: number;
  delay: number;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="absolute font-mono text-xs text-primary/70 transition-all duration-1000 ease-out sm:text-sm dark:text-primary/40"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {text}
    </div>
  );
};

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Animated grid */}
    <div
      className="absolute inset-0 opacity-15 dark:opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(var(--color-primary) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
    {/* Glowing orbs */}
    <div className="absolute left-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl dark:bg-primary/5" />
    <div
      className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-primary/30 blur-3xl dark:bg-primary/10"
      style={{ animationDelay: "1s" }}
    />
  </div>
);

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [text]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span className="font-mono text-primary">
      {displayText}
      <span
        className={`ml-0.5 inline-block h-[1em] w-[3px] translate-y-[2px] bg-primary transition-opacity ${cursorVisible ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
};

const Hero = () => {
  const mounted = useMounted();

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      <GridBackground />

      {/* Floating code snippets */}
      {mounted &&
        codeSnippets.map((snippet, i) => (
          <FloatingCode
            key={i}
            text={snippet.text}
            x={snippet.x}
            y={snippet.y}
            delay={i * 300 + 500}
          />
        ))}

      {/* Main content */}
      <div className="container relative z-10 mx-auto flex min-h-[calc(100dvh-3rem)] lg:min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-20">
        {/* Title */}
        <h1
          className={`mb-6 text-center text-4xl font-bold tracking-tight text-foreground transition-all duration-700 delay-100 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <span className="block text-balance">Modesto Junior College</span>
          <span className="block text-balance">
            <TypewriterText text="Computer Science" />
          </span>
          <span className="text-balance">Club</span>
        </h1>

        {/* Description */}
        <p
          className={`mb-10 max-w-xl text-center text-lg text-muted-foreground transition-all duration-700 delay-200 md:text-xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          A community of coders, builders, and innovators at Modesto Junior
          College.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col gap-4 sm:flex-row transition-all duration-700 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <Button
            size="lg"
            className="group relative overflow-hidden px-8 text-lg font-semibold"
            asChild
          >
            <Link target="_blank" rel="noopener noreferrer" href="https://discord.gg/VbnQxKkSDt">
              <span className="relative z-10">Join Our Discord</span>
              <div className="absolute inset-0 -translate-x-full bg-foreground/20 transition-transform group-hover:translate-x-0" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border bg-transparent px-8 text-lg font-semibold text-foreground hover:bg-secondary hover:text-foreground"
            asChild
          >
            <Link href="/events">View Events</Link>
          </Button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
