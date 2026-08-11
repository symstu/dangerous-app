import { ethers } from "ethers"

export async function getConnectedBrowserProvider(): Promise<{
  provider: ethers.BrowserProvider
  chainId: number
} | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    return null
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[]

    if (!accounts.length) {
      return null
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const network = await provider.getNetwork()
    return { provider, chainId: Number(network.chainId) }
  } catch {
    return null
  }
}

export function isMetaMaskSessionError(reason: unknown): boolean {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
        ? reason
        : ""

  return (
    message.includes("Failed to connect to MetaMask") ||
    message.includes("Error restoring session")
  )
}

export function suppressMetaMaskSessionRejections(): void {
  if (typeof window === "undefined") return

  const handler = (event: PromiseRejectionEvent) => {
    if (isMetaMaskSessionError(event.reason)) {
      event.preventDefault()
    }
  }

  window.addEventListener("unhandledrejection", handler)
}
