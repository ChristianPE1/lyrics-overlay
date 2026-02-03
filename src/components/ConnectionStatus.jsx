export default function ConnectionStatus({ isConnected }) {
  return (
    <div 
      className="absolute top-2.5 left-3 w-2 h-2 rounded-full transition-colors duration-300"
      style={{ backgroundColor: isConnected ? 'var(--accent-color)' : 'red' }}
      title={isConnected ? "Connected" : "Disconnected"} 
    />
  );
}
