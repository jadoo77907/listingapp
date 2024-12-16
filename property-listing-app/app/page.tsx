'use client'

import { useState } from 'react'
import RealtimePropertyList from './components/RealtimePropertyList'
import AddPropertyForm from './components/AddPropertyForm'
import EditPropertyForm from './components/EditPropertyForm'
import PropertySearch from './components/PropertySearch'
import { PropertyImageGallery } from './components/PropertyImageGallery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabase } from '../lib/supabaseClient'
import { SidePanel } from './components/SidePanel'

export default function Home() {
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const handleEditProperty = (id: string) => {
    setEditingPropertyId(id);
    setIsSidePanelOpen(true);
  };

  const handlePropertyUpdated = () => {
    setEditingPropertyId(null);
    setIsSidePanelOpen(false);
  };

  const handleViewImages = async (id: string) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('properties')
      .select('main_image, additional_images')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property images:', error);
      setPropertyImages([]);
    } else if (data) {
      const allImages = [data.main_image, ...(data.additional_images || [])];
      const imageUrls = await Promise.all(allImages.map(async (imagePath: string) => {
        const { data } = supabase.storage.from('property-images').getPublicUrl(imagePath);
        return data.publicUrl;
      }));
      setPropertyImages(imageUrls.filter(Boolean));
    } else {
      setPropertyImages([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Find Your Dream Property</h1>
      <Tabs defaultValue="search" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Properties</TabsTrigger>
          <TabsTrigger value="list">Available Properties</TabsTrigger>
          <TabsTrigger value="add">Add Property</TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Search Properties</h2>
            <PropertySearch />
          </div>
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Available Properties</h2>
            <RealtimePropertyList onEditProperty={handleEditProperty} onViewImages={handleViewImages} />
          </div>
        </TabsContent>
        <TabsContent value="add" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Property</h2>
            <AddPropertyForm />
          </div>
        </TabsContent>
      </Tabs>

      <SidePanel isOpen={isSidePanelOpen} onClose={() => setIsSidePanelOpen(false)}>
        {editingPropertyId && (
          <EditPropertyForm propertyId={editingPropertyId} onPropertyUpdated={handlePropertyUpdated} />
        )}
      </SidePanel>
    </div>
  )
}

