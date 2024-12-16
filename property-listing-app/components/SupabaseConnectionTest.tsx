'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('properties').select('count').single()
        
        if (error) throw error

        setConnectionStatus(`Connected successfully. Found ${data.count} properties.`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setConnectionStatus('Connection failed')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-2">Supabase Connection Status</h2>
      <p className={`text-lg ${connectionStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
        {connectionStatus}
      </p>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  )
}

