export default function SongInfo({ title, artist }) {
  if (!title) return null;

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-[--text-secondary] max-w-[60%] whitespace-nowrap overflow-hidden text-ellipsis text-center">
      <span>{title}</span>
      {artist && <span className="opacity-70"> - {artist}</span>}
    </div>
  );
}
