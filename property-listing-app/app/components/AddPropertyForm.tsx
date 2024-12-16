'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '../../lib/supabaseClient'
import { generatePropertyDescription, generateEmbedding } from '../../lib/gemini'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadFromUrl } from './LoadFromUrl'
import { BasicPropertyInfo } from './BasicPropertyInfo'
import { PropertyFeatures } from './PropertyFeatures'
import { AdditionalPropertyDetails } from './AdditionalPropertyDetails'
import { PropertyImageUpload } from './PropertyImageUpload'
import { AdditionalCosts } from './AdditionalCosts'

export default function AddPropertyForm() {
  const [title, setTitle] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [floorSize, setFloorSize] = useState('')
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [hasPool, setHasPool] = useState(false)
  const [hasBuiltInBraai, setHasBuiltInBraai] = useState(false)
  const [hasBalcony, setHasBalcony] = useState(false)
  const [hasSecurityPost, setHasSecurityPost] = useState(false)
  const [hasAircon, setHasAircon] = useState(false)
  const [viewType, setViewType] = useState('')
  const [levelCount, setLevelCount] = useState('')
  const [amenities, setAmenities] = useState('')
  const [locationFeatures, setLocationFeatures] = useState('')
  const [kitchenFeatures, setKitchenFeatures] = useState('')
  const [bathroomFeatures, setBathroomFeatures] = useState('')
  const [investmentPotential, setInvestmentPotential] = useState('')
  const [style, setStyle] = useState('')
  const [status, setStatus] = useState('available')
  const [hideAddress, setHideAddress] = useState(false)
  const [ratesAndTaxes, setRatesAndTaxes] = useState('0')
  const [bodyCorporateFee, setBodyCorporateFee] = useState('')
  const [parkingLotPrice, setParkingLotPrice] = useState('')
  const [additionalCosts, setAdditionalCosts] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [suburb, setSuburb] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [erfSize, setErfSize] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [levy, setLevy] = useState('0')

  const { toast } = useToast()
  const router = useRouter()
  const supabase = getSupabase()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.push('/login')
      }
    }
    checkAuth()
  }, [supabase.auth, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isAuthenticated) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a property.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    setIsLoading(true)

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      // Upload main image
      let mainImagePath = ''
      if (mainImage) {
        const { data: mainImageData, error: mainImageError } = await supabase.storage
          .from('property-images')
          .upload(`main/${Date.now()}-${mainImage.name}`, mainImage)

        if (mainImageError) throw mainImageError
        mainImagePath = mainImageData.path
      }

      // Upload additional images
      const additionalImagePaths = await Promise.all(additionalImages.map(async (image) => {
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(`additional/${Date.now()}-${image.name}`, image)

        if (error) throw error
        return data.path
      }))

      // Insert property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert([{
          title,
          street_address: streetAddress,
          city,
          state,
          zip_code: zipCode,
          description,
          price: parseFloat(price) || 0,
          bedrooms: parseInt(bedrooms),
          bathrooms: parseFloat(bathrooms),
          floor_size_sqm: parseFloat(floorSize),
          main_image: mainImagePath,
          has_pool: hasPool,
          has_built_in_braai: hasBuiltInBraai,
          has_balcony: hasBalcony,
          has_security_post: hasSecurityPost,
          has_aircon: hasAircon,
          view_type: viewType,
          level_count: parseInt(levelCount),
          amenities,
          location_features: locationFeatures,
          kitchen_features: kitchenFeatures,
          bathroom_features: bathroomFeatures,
          investment_potential: investmentPotential,
          style,
          status,
          hide_address: hideAddress,
          rates_and_taxes: parseFloat(ratesAndTaxes) || 0,
          body_corporate_fee: bodyCorporateFee ? parseFloat(bodyCorporateFee) : null,
          parking_lot_price: parkingLotPrice ? parseFloat(parkingLotPrice) : null,
          additional_costs: additionalCosts ? JSON.parse(additionalCosts) : null,
          additional_images: additionalImagePaths,
          is_published: isPublished,
          created_by: user?.id,
          suburb,
          province,
          postal_code: postalCode,
          erf_size_sqm: parseFloat(erfSize),
          property_type: propertyType,
          levy: parseFloat(levy) || 0,
        }])
        .select()

      if (propertyError) throw propertyError

      if (propertyData && propertyData[0]) {
        const embeddingText = `${title} ${description}`
        const embedding = await generateEmbedding(embeddingText)

        if (embedding) {
          const { error: embeddingError } = await supabase
            .from('property_embeddings')
            .insert([{
              id: propertyData[0].id,
              embedding,
              text_content: embeddingText
            }])

          if (embeddingError) {
            console.error('Error inserting embedding:', embeddingError)
          }
        }
      }

      toast({
        title: "Success!",
        description: "Property added successfully.",
      })

      // Reset form fields
      setTitle('')
      setStreetAddress('')
      setCity('')
      setState('')
      setZipCode('')
      setDescription('')
      setPrice('0')
      setBedrooms('')
      setBathrooms('')
      setFloorSize('')
      setMainImage(null)
      setAdditionalImages([])
      setHasPool(false)
      setHasBuiltInBraai(false)
      setHasBalcony(false)
      setHasSecurityPost(false)
      setHasAircon(false)
      setViewType('')
      setLevelCount('')
      setAmenities('')
      setLocationFeatures('')
      setKitchenFeatures('')
      setBathroomFeatures('')
      setInvestmentPotential('')
      setStyle('')
      setStatus('available')
      setHideAddress(false)
      setRatesAndTaxes('0')
      setBodyCorporateFee('')
      setParkingLotPrice('')
      setAdditionalCosts('')
      setIsPublished(false)
      setSuburb('')
      setProvince('')
      setPostalCode('')
      setErfSize('')
      setPropertyType('')
      setLevy('0')

    } catch (error) {
      console.error('Error adding property:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadedData = (data: any) => {
    setTitle(data.title || '')
    setDescription(data.description || '')
    setPrice(data.price?.toString() || '0')
    setBedrooms(data.bedrooms?.toString() || '')
    setBathrooms(data.bathrooms?.toString() || '')
    setFloorSize(data.floor_size_sqm?.toString() || '')
    // Add more fields as necessary
  }

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <LoadFromUrl onDataLoaded={handleLoadedData} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicPropertyInfo
            title={title}
            setTitle={setTitle}
            streetAddress={streetAddress}
            setStreetAddress={setStreetAddress}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            zipCode={zipCode}
            setZipCode={setZipCode}
            price={price}
            setPrice={setPrice}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            floorSize={floorSize}
            setFloorSize={setFloorSize}
            levelCount={levelCount}
            setLevelCount={setLevelCount}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb</Label><Label htmlFor="suburb">Suburb</Label>
              <Input
                id="suburb"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="erfSize">Erf Size (sqm)</Label>
              <Input
                id="erfSize"
                type="number"
                value={erfSize}
                onChange={(e) => setErfSize(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Input
              id="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ratesAndTaxes">Rates and Taxes (per month)</Label>
              <Input
                id="ratesAndTaxes"
                type="number"
                value={ratesAndTaxes}
                onChange={(e) => setRatesAndTaxes(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="levy">Levy (per month)</Label>
              <Input
                id="levy"
                type="number"
                value={levy}
                onChange={(e) => setLevy(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full"
            />
          </div>

          <PropertyImageUpload
            onMainImageChange={setMainImage}
            onAdditionalImagesChange={setAdditionalImages}
          />

          <PropertyFeatures
            hasPool={hasPool}
            setHasPool={setHasPool}
            hasBuiltInBraai={hasBuiltInBraai}
            setHasBuiltInBraai={setHasBuiltInBraai}
            hasBalcony={hasBalcony}
            setHasBalcony={setHasBalcony}
            hasSecurityPost={hasSecurityPost}
            setHasSecurityPost={setHasSecurityPost}
            hasAircon={hasAircon}
            setHasAircon={setHasAircon}
            hideAddress={hideAddress}
            setHideAddress={setHideAddress}
          />

          <AdditionalPropertyDetails
            viewType={viewType}
            setViewType={setViewType}
            status={status}
            setStatus={setStatus}
            amenities={amenities}
            setAmenities={setAmenities}
            locationFeatures={locationFeatures}
            setLocationFeatures={setLocationFeatures}
            kitchenFeatures={kitchenFeatures}
            setKitchenFeatures={setKitchenFeatures}
            bathroomFeatures={bathroomFeatures}
            setBathroomFeatures={setBathroomFeatures}
            investmentPotential={investmentPotential}
            setInvestmentPotential={setInvestmentPotential}
            style={style}
            setStyle={setStyle}
          />

          <AdditionalCosts
            ratesAndTaxes={ratesAndTaxes}
            setRatesAndTaxes={setRatesAndTaxes}
            bodyCorporateFee={bodyCorporateFee}
            setBodyCorporateFee={setBodyCorporateFee}
            parkingLotPrice={parkingLotPrice}
            setParkingLotPrice={setParkingLotPrice}
            additionalCosts={additionalCosts}
            setAdditionalCosts={setAdditionalCosts}
          />

          <div className="space-y-2">
            <Label htmlFor="isPublished">Publish Property</Label>
            <Checkbox
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(checked as boolean)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

