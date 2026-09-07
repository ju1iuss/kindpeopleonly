import Image from "next/image";

type AboutProps = {
  heading?: string;
  text: string;
  backgroundSrc: string;
};

export function About({
  heading = "About us",
  text,
  backgroundSrc,
}: AboutProps) {
  return (
    <section
      className="relative isolate overflow-hidden px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,11vw,9rem)]"
      id="about"
      aria-labelledby="about-heading"
    >
      <Image
        src={backgroundSrc}
        alt=""
        fill
        className="absolute inset-0 -z-20 object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg) 0%, rgba(14,13,18,0.78) 25%, rgba(14,13,18,0.78) 75%, var(--bg) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-[var(--max-w)]">
        <h2
          id="about-heading"
          className="mb-[clamp(1.25rem,3vw,2rem)] font-display text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-[0.98] uppercase"
        >
          {heading}
        </h2>
        <p className="m-0 max-w-[34rem] text-[clamp(1.05rem,2vw,1.25rem)] font-light leading-[1.7] text-ink">
          {text}
        </p>
      </div>
    </section>
  );
}
