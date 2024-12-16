'use client'

import { useState } from 'react'
import { getSupabase } from '../../lib/supabaseClient'
import { generateEmbedding } from '../../lib/gemini'
import PropertyCard from './PropertyCard'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Property } from '../types/property'
import { PostgrestError } from '@supabase/supabase-js'

export default function PropertySearch() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Property[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

async function handleSearch(e: React.FormEvent) {
  e.preventDefault()
  if (!query.trim()) {
    toast({
      title: "Error",
      description: "Please enter a search query",
      variant: "destructive",
    })
    return
  }

  setIsSearching(true)

  try {
    console.log('Generating embedding for query:', query)
    const queryEmbedding = await generateEmbedding(query)
    console.log('Query embedding generated successfully')

    console.log('Fetching properties from Supabase')
    const supabase = getSupabase()
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*, property_embeddings!inner(*)')

  if (propertiesError) {
    console.error('Supabase error:', propertiesError)
    throw new Error(`Failed to fetch properties: ${propertiesError.message}`)
  }

  if (!properties || properties.length === 0) {
    console.log('No properties found in the database')
    setSearchResults([])
    toast({
      title: "No properties found",
      description: "There are no properties in the database.",
      variant: "destructive",
    })
    return
  }

  console.log(`Found ${properties.length} properties`)

  // Calculate similarity scores
  const propertiesWithScores = properties.map((property) => {
    if (!property.property_embeddings || !property.property_embeddings.embedding) {
      console.error('Property missing embedding:', property.id)
      return null
    }
    const embedding = property.property_embeddings.embedding
    
    // Calculate cosine similarity
    const dotProduct = queryEmbedding.reduce((sum: number, val: number, i: number) => 
      sum + val * embedding[i], 0
    )
    const magnitude1 = Math.sqrt(queryEmbedding.reduce((sum: number, val: number) => 
      sum + val * val, 0
    ))
    const magnitude2 = Math.sqrt(embedding.reduce((sum: number, val: number) => 
      sum + val * val, 0
    ))
    const similarity = dotProduct / (magnitude1 * magnitude2)

    return {
      ...property,
      similarity
    }
  }).filter(Boolean)

  // Sort by similarity score and take top 5 results
  const rankedResults = propertiesWithScores
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)

  console.log(`Ranked results:`, rankedResults)

  setSearchResults(rankedResults)

  if (rankedResults.length === 0) {
    toast({
      title: "No matches found",
      description: "Try adjusting your search terms.",
      variant: "destructive",
    })
  }
} catch (error) {
  console.error('Error searching properties:', error)
  let errorMessage = "An unexpected error occurred. Please try again."
  if (error instanceof Error) {
    errorMessage = error.message
    console.error('Error details:', error.stack)
  }
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  })
} finally {
  setIsSearching(false)
}
}

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search properties..."
          className="flex-grow transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary"
        />
        <Button
          type="submit"
          disabled={isSearching}
          className="transition-all duration-300 ease-in-out hover:bg-primary-600"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((property) => (
          <PropertyCard
            key={property.id}
            {...property}
            onEdit={() => {}}
            onViewImages={() => {}}
          />
        ))}
      </div>
    </div>
  )
}

