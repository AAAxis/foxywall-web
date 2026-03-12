import { redirect } from "next/navigation"
import { defaultLanguage } from "@/lib/translations"

export default function ReferPage() {
  redirect(`/${defaultLanguage}/refer`)
}
