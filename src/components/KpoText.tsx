// KPO lettering (brand/README.md, "KPO-Schreibweise"): caps, -5 % tracking,
// weight changes letter by letter between Regular, Semibold and Bold, never the same twice in a row.
// Seeded by the text, so server and client render the same pattern.

const WEIGHTS = [400, 600, 700];

function weightsFor(text: string): number[] {
  let seed = 0;
  for (const ch of text) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  let prev = -1;
  return Array.from(text, (ch) => {
    if (ch === " ") return 400;
    const options = WEIGHTS.map((_, i) => i).filter((i) => i !== prev);
    prev = options[Math.floor(next() * options.length)];
    return WEIGHTS[prev];
  });
}

export function KpoText({ text }: { text: string }) {
  const upper = text.toUpperCase();
  const weights = weightsFor(upper);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="tracking-[-0.05em]">
        {Array.from(upper, (ch, i) => (
          <span key={i} style={{ fontWeight: weights[i] }}>
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}
