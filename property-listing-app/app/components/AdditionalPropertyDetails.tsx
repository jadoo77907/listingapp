import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdditionalPropertyDetailsProps {
  viewType: string;
  setViewType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  amenities: string;
  setAmenities: (value: string) => void;
  locationFeatures: string;
  setLocationFeatures: (value: string) => void;
  kitchenFeatures: string;
  setKitchenFeatures: (value: string) => void;
  bathroomFeatures: string;
  setBathroomFeatures: (value: string) => void;
  investmentPotential: string;
  setInvestmentPotential: (value: string) => void;
  style: string;
  setStyle: (value: string) => void;
}

export function AdditionalPropertyDetails({
  viewType, setViewType,
  status, setStatus,
  amenities, setAmenities,
  locationFeatures, setLocationFeatures,
  kitchenFeatures, setKitchenFeatures,
  bathroomFeatures, setBathroomFeatures,
  investmentPotential, setInvestmentPotential,
  style, setStyle
}: AdditionalPropertyDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="viewType">View Type</Label>
          <Input
            id="viewType"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities</Label>
          <Textarea
            id="amenities"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            rows={3}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="locationFeatures">Location Features</Label>
          <Textarea
            id="locationFeatures"
            value={locationFeatures}
            onChange={(e) => setLocationFeatures(e.target.value)}
            rows={3}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="kitchenFeatures">Kitchen Features</Label>
          <Textarea
            id="kitchenFeatures"
            value={kitchenFeatures}
            onChange={(e) => setKitchenFeatures(e.target.value)}
            rows={3}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathroomFeatures">Bathroom Features</Label>
          <Textarea
            id="bathroomFeatures"
            value={bathroomFeatures}
            onChange={(e) => setBathroomFeatures(e.target.value)}
            rows={3}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="investmentPotential">Investment Potential</Label>
        <Textarea
          id="investmentPotential"
          value={investmentPotential}
          onChange={(e) => setInvestmentPotential(e.target.value)}
          rows={3}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="style">Style</Label>
        <Input
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full"
        />
      </div>
    </>
  )
}

