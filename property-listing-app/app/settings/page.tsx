import SupabaseConnectionStatus from '../../components/SupabaseConnectionStatus'

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
        <SupabaseConnectionStatus />
      </div>
    </div>
  )
}

