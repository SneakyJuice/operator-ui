export default function HarnessPostView() {
  return (
    <div className="flex flex-col h-full w-full bg-[#0a1e2a] overflow-hidden">
      {/* Header bar */}
      <div className="shrink-0 px-6 py-3 border-b border-[#1a4a62] flex items-center justify-between">
        <div>
          <div className="text-[10px] text-[#4a7a94] uppercase tracking-widest mb-0.5">Thought Leadership</div>
          <div className="text-sm font-semibold text-[#f0f0f0]">Harness Engineering — The Other Half of AI That Actually Matters</div>
        </div>
        <a
          href="/harness-post.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] px-3 py-1.5 rounded bg-[#ECAB23]/10 text-[#ECAB23] border border-[#ECAB23]/30 hover:bg-[#ECAB23]/20 transition-colors font-semibold shrink-0 ml-4"
        >
          Open Standalone ↗
        </a>
      </div>

      {/* Iframe embed */}
      <iframe
        src="/harness-post.html"
        title="Harness Engineering Post"
        className="flex-1 w-full border-0"
        style={{ background: '#f5f6f8' }}
      />
    </div>
  )
}
