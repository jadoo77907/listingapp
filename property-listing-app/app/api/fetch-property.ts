import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    // This is a basic example. You'll need to adjust the selectors based on the specific website structure
    const title = $('h1').first().text().trim()
    const details = $('meta[name="description"]').attr('content') || ''
    const price = $('span.price').first().text().trim().replace(/[^0-9.]/g, '')
    const address = $('span.address').first().text().trim()

    return NextResponse.json({ title, details, price, address })
  } catch (error) {
    console.error('Error fetching property data:', error)
    return NextResponse.json({ error: 'Failed to fetch property data' }, { status: 500 })
  }
}

