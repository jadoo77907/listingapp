'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabaseClient'

export default function SupabaseConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase.from('properties').select('count').single()
        
        if (error) throw error

        setConnectionStatus(`Connected successfully. Found ${data.count} properties.`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setConnectionStatus('Connection failed')
      }
    }

    checkConnection()
  }, [])

  return (
    <div>
      <p className={`text-lg ${connectionStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
        {connectionStatus}
      </p>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  )
}

