import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BasicPropertyInfoProps {
  title: string;
  setTitle: (value: string) => void;
  streetAddress: string;
  setStreetAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  zipCode: string;
  setZipCode: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  floorSize: string;
  setFloorSize: (value: string) => void;
  levelCount: string;
  setLevelCount: (value: string) => void;
}

export function BasicPropertyInfo({
  title, setTitle,
  streetAddress, setStreetAddress,
  city, setCity,
  state, setState,
  zipCode, setZipCode,
  price, setPrice,
  bedrooms, setBedrooms,
  bathrooms, setBathrooms,
  floorSize, setFloorSize,
  levelCount, setLevelCount
}: BasicPropertyInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Input
          id="bedrooms"
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input
          id="bathrooms"
          type="number"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="floorSize">Floor Size (sqm)</Label>
        <Input
          id="floorSize"
          type="number"
          value={floorSize}
          onChange={(e) => setFloorSize(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="levelCount">Number of Levels</Label>
        <Input
          id="levelCount"
          type="number"
          value={levelCount}
          onChange={(e) => setLevelCount(e.target.value)}
          required
          className="w-full"
        />
      </div>
    </div>
  )
}

