interface Props { title: string; desc: string; icon: string }
export default function PlaceholderView({ title, desc, icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-[#888]">{title}</h3>
      <p className="text-sm text-[#444] mt-2 max-w-xs">{desc}</p>
      <div className="mt-4 text-[10px] text-[#333] font-mono px-3 py-1.5 bg-[#111] border border-[#1e1e1e] rounded-lg">
        Coming in P2
      </div>
    </div>
  )
}
