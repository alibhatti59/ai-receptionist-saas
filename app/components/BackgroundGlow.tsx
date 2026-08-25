export default function BackgroundGlow() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base dark layer */}
            <div className="absolute inset-0 bg-slate-950" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Glowing orbs */}
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[120px]" />

            {/* Soft vignette so content stays readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60" />
        </div>
    )
}