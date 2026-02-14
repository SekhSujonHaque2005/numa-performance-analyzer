export default function Heatmap({ matrix }) {
  if (!matrix) return null;

  const max = Math.max(...matrix.flat());

  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <h2 className="mb-4 font-semibold">NUMA Latency Heatmap</h2>

      <div className="grid grid-cols-4 gap-2">
        {matrix.flat().map((val, i) => {
          const intensity = val / max;
          return (
            <div
              key={i}
              className="p-4 text-center rounded text-sm font-bold"
              style={{
                backgroundColor: `rgba(239,68,68,${intensity})`
              }}
            >
              {val}
            </div>
          );
        })}
      </div>
    </div>
  );
}
