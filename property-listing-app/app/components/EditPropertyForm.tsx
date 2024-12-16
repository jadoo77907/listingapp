'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '../../lib/supabaseClient'
import { generateEmbedding } from '../../lib/gemini'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  floor_size_sqm: number;
  main_image: string;
  additional_images: string[];
  is_published: boolean;
  created_by: string;
}

interface EditPropertyFormProps {
  propertyId: string;
  onPropertyUpdated: () => void;
}

export default function EditPropertyForm({ propertyId, onPropertyUpdated }: EditPropertyFormProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    floorSize: '',
    isPublished: false
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = getSupabase();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        fetchProperty();
      } else {
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    checkAuth();
  }, [supabase.auth, router, propertyId]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('No property found');

      setProperty(data);
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        bedrooms: data.bedrooms.toString(),
        bathrooms: data.bathrooms.toString(),
        floorSize: data.floor_size_sqm.toString(),
        isPublished: data.is_published
      });
    } catch (error) {
      console.error('Error in fetchProperty:', error);
      toast({
        title: "Error",
        description: "Failed to fetch property details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPublished: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    if (e.target.files) {
      if (isMain) {
        setMainImage(e.target.files[0]);
      } else {
        setAdditionalImages(Array.from(e.target.files));
      }
    }
  };

  const uploadImages = async () => {
    try {
      let mainImagePath = property?.main_image || '';
      if (mainImage) {
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(`main/${Date.now()}-${mainImage.name}`, mainImage);

        if (error) throw error;
        mainImagePath = data.path;
      }

      const newAdditionalImagePaths = await Promise.all(additionalImages.map(async (image) => {
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(`additional/${Date.now()}-${image.name}`, image);

        if (error) throw error;
        return data.path;
      }));

      return { mainImagePath, newAdditionalImagePaths };
    } catch (error) {
      console.error('Error in uploadImages:', error);
      throw error;
    }
  };

  const updateProperty = async (mainImagePath: string, newAdditionalImagePaths: string[]) => {
    try {
      const updatedAdditionalImages = [...(property?.additional_images || []), ...newAdditionalImagePaths];

      const { data, error } = await supabase
        .from('properties')
        .update({ 
          title: formData.title, 
          description: formData.description, 
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseFloat(formData.bathrooms),
          floor_size_sqm: parseFloat(formData.floorSize),
          main_image: mainImagePath,
          additional_images: updatedAdditionalImages,
          is_published: formData.isPublished,
        })
        .eq('id', propertyId)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Failed to update property: ${error.message}`);
      }
      if (!data || data.length === 0) throw new Error('No data returned after update');

      return data[0];
    } catch (error) {
      console.error('Error in updateProperty:', error);
      throw error;
    }
  };

  const updateEmbedding = async (updatedProperty: Property) => {
    try {
      const embeddingText = `${updatedProperty.title} ${updatedProperty.description}`;
      const embedding = await generateEmbedding(embeddingText);

      if (embedding) {
        const { error } = await supabase
          .from('property_embeddings')
          .upsert({
            id: propertyId,
            embedding,
            text_content: embeddingText
          });

        if (error) {
          console.error('Supabase embedding update error:', error);
          throw new Error(`Failed to update embedding: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error in updateEmbedding:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to edit a property.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    setIsLoading(true);
    console.log('Starting property update...');

    try {
      console.log('Uploading images...');
      const { mainImagePath, newAdditionalImagePaths } = await uploadImages();
      console.log('Images uploaded successfully');

      console.log('Updating property...');
      const updatedProperty = await updateProperty(mainImagePath, newAdditionalImagePaths);
      console.log('Property updated successfully:', updatedProperty);

      console.log('Updating embedding...');
      await updateEmbedding(updatedProperty);
      console.log('Embedding updated successfully');

      toast({
        title: "Success!",
        description: "Property updated successfully.",
      });
      onPropertyUpdated();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', error.stack);
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4">
        <p>You must be logged in to edit a property.</p>
        <Button onClick={() => router.push('/login')}>Go to Login</Button>
      </div>
    );
  }

  if (!property) {
    return <div className="p-4">Property not found.</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorSize">Floor Size (sqm)</Label>
              <Input
                id="floorSize"
                name="floorSize"
                type="number"
                value={formData.floorSize}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainImage">Main Image</Label>
            <Input
              id="mainImage"
              type="file"
              onChange={(e) => handleImageUpload(e, true)}
              accept="image/*"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalImages">Additional Images</Label>
            <Input
              id="additionalImages"
              type="file"
              onChange={(e) => handleImageUpload(e, false)}
              multiple
              accept="image/*"
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isPublished">Publish Property</Label>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Updating...' : 'Update Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

