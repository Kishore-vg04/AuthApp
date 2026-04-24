export default function Spinner({ fullscreen = false }) {
  const spinner = (
    <div className="spinner" aria-label="Loading">
      <div className="spinner-ring" />
    </div>
  );

  if (fullscreen) {
    return (
      <div className="spinner-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
}
