"use client"

const features = [
  { icon: "🔓", text: "Unblock any website or app" },
  { icon: "🛡️", text: "VLESS+Reality — undetectable protocol" },
  { icon: "🌍", text: "Servers in Russia, Europe & Asia" },
  { icon: "♾️", text: "Unlimited traffic, no speed limits" },
  { icon: "🚫", text: "No logs, no ads, no tracking" },
]

const steps = [
  'Tap "Redeem on iPhone" above',
  "Sign in with your Apple ID",
  "FoxyWall installs automatically",
  "Open the app & connect 🚀",
]

export function ReferPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center">
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,107,53,0.15)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[440px] w-full px-5 text-center">
        <div className="pt-16 mb-8">
          <div className="text-7xl mb-4 animate-bounce">🦊</div>
          <div className="inline-block bg-gradient-to-r from-[#ff6b35] to-[#ff8f35] text-white text-[13px] font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            🎁 Your friend sent you a gift
          </div>
          <h1 className="text-[32px] font-extrabold leading-tight mb-3">
            Get <span className="text-[#ff6b35]">30 days</span> of FoxyWall VPN
          </h1>
          <p className="text-[#999] text-base leading-relaxed">Unblock everything. Stay private. No credit card needed.</p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1008] to-[#111] border-2 border-[#ff6b35] rounded-[20px] p-8 mb-6">
          <div className="text-[#ff6b35] text-sm font-semibold uppercase tracking-widest mb-2">Your gift</div>
          <div className="text-5xl font-extrabold mb-1">30 days</div>
          <div className="text-[#666] text-sm">FoxyWall VPN Premium • Free</div>
        </div>

        <a
          href="https://apps.apple.com/redeem?ctx=offercodes&id=6757646633&code=FOXY30"
          className="block w-full py-[18px] bg-gradient-to-r from-[#ff6b35] to-[#ff8f35] text-white rounded-[14px] text-lg font-bold text-center no-underline mb-3 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(255,107,53,0.3)] transition-all"
        >
          🍎 Redeem on iPhone
        </a>

        <a
          href="https://play.google.com/store/apps/details?id=com.theholylabs.rock"
          className="block w-full py-4 bg-[#1a1a1a] border-2 border-[#333] text-white rounded-[14px] text-base font-semibold text-center no-underline mb-8 hover:border-[#ff6b35] transition-colors"
        >
          🤖 Get on Android
        </a>

        <div className="text-left mb-8">
          <h3 className="text-sm text-[#666] uppercase tracking-widest mb-4">What you get</h3>
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-[#1a1a1a] last:border-b-0">
              <div className="text-xl w-8 text-center">{f.icon}</div>
              <div className="text-[15px] text-[#ccc]">{f.text}</div>
            </div>
          ))}
        </div>

        <div className="text-left bg-[#111] rounded-2xl p-6 mb-8">
          <h3 className="text-sm text-[#666] uppercase tracking-widest mb-4">How to redeem</h3>
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3 mb-3 last:mb-0">
              <div className="w-7 h-7 bg-[#ff6b35] rounded-full flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
              <div className="text-[15px] text-[#ccc] pt-[3px]">{s}</div>
            </div>
          ))}
        </div>

        <div className="py-6 pb-10 text-[#333] text-xs">
          <p>
            FoxyWall VPN by{" "}
            <a href="https://holylabs.net" className="text-[#666] no-underline">
              Holylabs Ltd
            </a>
          </p>
          <p className="mt-2">
            <a href="https://apps.apple.com/app/id6757646633" className="text-[#666] no-underline">
              App Store
            </a>
            {" · "}
            <a href="https://play.google.com/store/apps/details?id=com.theholylabs.rock" className="text-[#666] no-underline">
              Google Play
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
