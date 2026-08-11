import { NextRequest, NextResponse } from "next/server"

const COINGECKO_MARKETS_URL = "https://api.coingecko.com/api/v3/coins/markets"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const vsCurrency = searchParams.get("vs_currency") ?? "usd"
  const ids = searchParams.get("ids")
  const order = searchParams.get("order") ?? "market_cap_desc"
  const perPage = searchParams.get("per_page") ?? "20"
  const page = searchParams.get("page") ?? "1"
  const sparkline = searchParams.get("sparkline") ?? "false"

  const params = new URLSearchParams({
    vs_currency: vsCurrency,
    order,
    per_page: perPage,
    page,
    sparkline,
  })

  if (ids) {
    params.set("ids", ids)
  }

  try {
    const response = await fetch(`${COINGECKO_MARKETS_URL}?${params}`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch coin markets" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("CoinGecko proxy error:", error)
    return NextResponse.json(
      { error: "Failed to fetch coin markets" },
      { status: 500 }
    )
  }
}
