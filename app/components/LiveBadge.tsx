export default function LiveBadge({ label = 'Live' }: { label?: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {label}
        </span>
    )
}