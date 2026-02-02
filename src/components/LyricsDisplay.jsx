export default function LyricsDisplay({ currentLyric, nextLyric }) {
  return (
    <div className="text-center w-full px-2.5">
      <div 
        className="font-semibold text-[--text-primary] leading-snug animate-fade-in wrap-break-word"
        style={{ fontSize: "var(--font-size-current)", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
      >
        {currentLyric}
      </div>
      {nextLyric && (
        <div 
          className="text-[--text-secondary] mt-1.5 leading-tight wrap-break-word"
          style={{ fontSize: "var(--font-size-next)" }}
        >
          {nextLyric}
        </div>
      )}
    </div>
  );
}
