import type { ComponentType, ReactNode } from "react"
import Link from "next/link"
import { Monitor, ShieldCheck, Server, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "FoxyWall for Windows — Enterprise",
  description: "FoxyWall for Windows is deployed by IT to managed corporate devices.",
}

export default function EnterprisePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-foreground">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Monitor className="h-3.5 w-3.5" /> Windows · Enterprise
      </div>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        FoxyWall for Windows
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The Windows client is an <strong>enterprise deployment</strong> — provisioned by
        your IT team to company-managed devices, not a public consumer download.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <Feature icon={Server} title="Central fleet dashboard">
          Every enrolled device reports in — platform, status, location, and version — to one admin view.
        </Feature>
        <Feature icon={ShieldCheck} title="Zero-touch enrollment">
          Workers install once; the device provisions automatically. No setup steps, managed by policy.
        </Feature>
        <Feature icon={Monitor} title="Windows-native">
          Built on WinUI 3 with the same secure account system as the iOS and Android apps.
        </Feature>
      </div>

      <div className="mt-12 rounded-2xl border border-border p-8">
        <h2 className="text-xl font-semibold">Deploy to your organization</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enterprise deployment is provisioned per organization. Contact us to get the
          installer and your provisioning code.
        </p>
        <a
          href="mailto:enterprise@foxywall.xyz?subject=FoxyWall%20Windows%20Enterprise"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          Contact enterprise sales
        </a>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Managed devices act as part of the corporate network per your organization&apos;s
        IT and privacy policy.
      </p>
    </main>
  )
}

function Feature({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-border p-5">
      <Icon className="h-5 w-5 text-primary" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  )
}
