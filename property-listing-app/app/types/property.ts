export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  street_address: string;
  suburb: string;
  city: string;
  province: string;
  postal_code: string;
  bedrooms: number;
  bathrooms: number;
  floor_size_sqm: number;
  erf_size_sqm: number;
  main_image: string;
  additional_images: string[];
  has_pool: boolean;
  has_built_in_braai: boolean;
  has_balcony: boolean;
  has_security_post: boolean;
  has_aircon: boolean;
  view_type: string | null;
  level_count: number;
  status: string;
  hide_address: boolean;
  is_published: boolean;
  property_type: string;
  rates_and_taxes: number;
  levy: number;
}

