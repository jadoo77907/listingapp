'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getSupabase } from '../../lib/supabaseClient'

interface LoadFromUrlProps {
  onDataLoaded: (data: any) => void;
}

export function LoadFromUrl({ onDataLoaded }: LoadFromUrlProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = getSupabase()

  const handleLoadFromUrl = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('process-property-url', {
        body: { url }
      })

      if (error) throw error

      if (!data) {
        throw new Error('No data received from server')
      }

      onDataLoaded(data)
      toast({
        title: "Success",
        description: "Property data loaded successfully",
      })
    } catch (error) {
      console.error('Error loading from URL:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load property data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex space-x-2">
      <Input
        type="url"
        placeholder="Enter property listing URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-grow"
      />
      <Button onClick={handleLoadFromUrl} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load'}
      </Button>
    </div>
  )
}

