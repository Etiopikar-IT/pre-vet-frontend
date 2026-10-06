import Reveal from "./Reveal";

export default function NoteSection() {
  return (
    <div
      className="mx-auto max-w-[1120px] border-b px-8 py-9 text-[14px] leading-relaxed"
      style={{
        borderColor: "var(--public-line)",
        color: "rgba(24,26,22,0.6)",
      }}
    >
      <Reveal>
        <strong style={{ color: "var(--public-ink)" }}>
          Worth knowing:
        </strong>{" "}
        a place in the talent pool doesn't guarantee a role — it
        guarantees visibility. Your profile is handled by the People
        &amp; Culture team under our data privacy and confidentiality
        policies, and access is limited to hiring managers with a
        genuine reason to see it.
      </Reveal>
    </div>
  );
}