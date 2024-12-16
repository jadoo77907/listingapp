import PropertyCard from './PropertyCard'
import { Property } from '../types/property'

interface PropertyListProps {
  properties: Property[];
  onEditProperty: (id: string) => void;
  onViewImages: (id: string) => void;
}

export default function PropertyList({ properties, onEditProperty, onViewImages }: PropertyListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          description={property.description}
          price={property.price}
          streetAddress={property.street_address}
          city={property.city}
          state={property.state}
          zipCode={property.zip_code}
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          floorSizeSqm={property.floor_size_sqm}
          mainImage={property.main_image}
          additionalImages={property.additional_images || []}
          hasPool={property.has_pool}
          hasBuiltInBraai={property.has_built_in_braai}
          hasBalcony={property.has_balcony}
          hasSecurityPost={property.has_security_post}
          hasAircon={property.has_aircon}
          viewType={property.view_type || undefined}
          levelCount={property.level_count}
          status={property.status}
          hideAddress={property.hide_address}
          isPublished={property.is_published}
          onEdit={onEditProperty}
          onViewImages={onViewImages}
        />
      ))}
    </div>
  )
}

