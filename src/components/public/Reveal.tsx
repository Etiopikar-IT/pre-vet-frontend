import { useEffect, useRef, useState, type JSX, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as any;

  return (
    <Component
      ref={ref as any}
      className={`transition-all duration-700 ease-[cubic-bezier(.2,.7,.3,1)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-[22px] opacity-0"
      } ${className}`}
    >
      {children}
    </Component>
  );
}