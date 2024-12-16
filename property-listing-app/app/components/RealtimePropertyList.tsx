'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '../../lib/supabaseClient'
import PropertyList from './PropertyList'
import Pagination from './Pagination'
import ImageGalleryDialog from './ImageGalleryDialog'
import { Property } from '../types/property'


interface RealtimePropertyListProps {
  onEditProperty: (id: string) => void;
}

export default function RealtimePropertyList({ onEditProperty }: RealtimePropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPropertyImages, setSelectedPropertyImages] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const pageSize = 9;

  useEffect(() => {
    const fetchProperties = async () => {
      const supabase = getSupabase();
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else if (data) {
        setProperties(data);
        setTotalPages(Math.ceil((count || 0) / pageSize));
      }
    };

    fetchProperties();

    const supabase = getSupabase();
    const channel = supabase
      .channel('realtime properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        fetchProperties();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [page]);

  const handleViewImages = async (id: string) => {
    const supabase = getSupabase();
  
    const { data, error } = await supabase
      .from('properties')
      .select('main_image, additional_images')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property images:', error);
      setSelectedPropertyImages([]);
    } else if (data) {
      const allImages = [data.main_image, ...(data.additional_images || [])];
      const imageUrls = allImages.filter(url => url && url.trim() !== '');
      console.log('Retrieved image URLs:', imageUrls);
      setSelectedPropertyImages(imageUrls);
      setIsGalleryOpen(true);
    } else {
      setSelectedPropertyImages([]);
    }
  };

  return (
    <div className="space-y-8">
      <PropertyList 
        properties={properties} 
        onEditProperty={onEditProperty} 
        onViewImages={handleViewImages}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      <ImageGalleryDialog 
        images={selectedPropertyImages} 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  )
}

