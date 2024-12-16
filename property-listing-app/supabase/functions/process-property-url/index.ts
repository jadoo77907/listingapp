import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'No URL provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const response = await fetch(url)
    const html = await response.text()

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // This is a basic example. You'll need to adjust the selectors based on the specific website structure
    const title = doc.querySelector('h1')?.textContent
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')
    const price = doc.querySelector('.price')?.textContent?.replace(/[^0-9.]/g, '')
    const bedrooms = doc.querySelector('.bedrooms')?.textContent?.replace(/[^0-9]/g, '')
    const bathrooms = doc.querySelector('.bathrooms')?.textContent?.replace(/[^0-9]/g, '')
    const floorSize = doc.querySelector('.floor-size')?.textContent?.replace(/[^0-9.]/g, '')

    const data = {
      title,
      description,
      price: price ? parseFloat(price) : null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      floor_size_sqm: floorSize ? parseFloat(floorSize) : null,
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process URL' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

