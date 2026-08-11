import { isDemoMode } from "@/lib/demo-mode"

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js"
const MAX_RETRIES = 2

interface RazorpayHandlerResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  order_id: string
  handler: (response: RazorpayHandlerResponse) => void
  modal?: {
    ondismiss?: () => void
  }
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: (response: unknown) => void) => void
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

function installDemoRazorpay(): void {
  class DemoRazorpay implements RazorpayInstance {
    constructor(private readonly options: RazorpayOptions) {}

    open() {
      window.setTimeout(() => {
        this.options.handler({
          razorpay_order_id: this.options.order_id,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: "demo_signature",
        })
      }, 400)
    }

    on() {}
  }

  window.Razorpay = DemoRazorpay as unknown as RazorpayConstructor
}

function appendScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    )

    if (existing) {
      if (window.Razorpay) {
        resolve()
        return
      }

      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Razorpay script")),
        { once: true }
      )
      return
    }

    const script = document.createElement("script")
    script.src = RAZORPAY_SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Razorpay script"))
    document.head.appendChild(script)
  })
}

async function loadExternalRazorpayScript(): Promise<boolean> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await appendScript()
      return !!window.Razorpay
    } catch {
      if (attempt === MAX_RETRIES) {
        return false
      }
      await new Promise((resolve) => window.setTimeout(resolve, 800 * (attempt + 1)))
    }
  }

  return false
}

export async function loadRazorpayScript(): Promise<{
  loaded: boolean
  isDemoGateway: boolean
}> {
  if (typeof window === "undefined") {
    return { loaded: false, isDemoGateway: false }
  }

  if (window.Razorpay) {
    return { loaded: true, isDemoGateway: false }
  }

  const hasLiveKey = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim()

  if (hasLiveKey) {
    const loaded = await loadExternalRazorpayScript()
    if (loaded) {
      return { loaded: true, isDemoGateway: false }
    }
  }

  if (isDemoMode()) {
    installDemoRazorpay()
    return { loaded: true, isDemoGateway: true }
  }

  return { loaded: false, isDemoGateway: false }
}
