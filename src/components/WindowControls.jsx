export default function WindowControls({ onSettings, onMinimize, onClose }) {
  const handleClick = (e, handler) => {
    e.preventDefault();
    e.stopPropagation();
    handler(e);
  };

  const btnBase = "w-[22px] h-[22px] border-none rounded-full bg-transparent cursor-pointer flex items-center justify-center transition-all duration-200";
  const btnColor = "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]";

  return (
    <div className="absolute top-1.5 right-2 flex gap-1 z-100">
      <button 
        className={`${btnBase} ${btnColor} hover:bg-[--accent-color] hover:text-white`}
        onClick={(e) => handleClick(e, onSettings)}
        onMouseDown={(e) => e.stopPropagation()}
        title="Settings"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      </button>
      <button 
        className={`${btnBase} ${btnColor} hover:bg-amber-500 hover:text-white`}
        onClick={(e) => handleClick(e, onMinimize)}
        onMouseDown={(e) => e.stopPropagation()}
        title="Minimize"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13H5v-2h14v2z"/>
        </svg>
      </button>
      <button 
        className={`${btnBase} ${btnColor} hover:bg-red-500 hover:text-white`}
        onClick={(e) => handleClick(e, onClose)}
        onMouseDown={(e) => e.stopPropagation()}
        title="Close"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  );
}
