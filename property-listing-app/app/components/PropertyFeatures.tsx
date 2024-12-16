import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface PropertyFeaturesProps {
  hasPool: boolean;
  setHasPool: (value: boolean) => void;
  hasBuiltInBraai: boolean;
  setHasBuiltInBraai: (value: boolean) => void;
  hasBalcony: boolean;
  setHasBalcony: (value: boolean) => void;
  hasSecurityPost: boolean;
  setHasSecurityPost: (value: boolean) => void;
  hasAircon: boolean;
  setHasAircon: (value: boolean) => void;
  hideAddress: boolean;
  setHideAddress: (value: boolean) => void;
}

export function PropertyFeatures({
  hasPool, setHasPool,
  hasBuiltInBraai, setHasBuiltInBraai,
  hasBalcony, setHasBalcony,
  hasSecurityPost, setHasSecurityPost,
  hasAircon, setHasAircon,
  hideAddress, setHideAddress
}: PropertyFeaturesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasPool"
          checked={hasPool}
          onCheckedChange={(checked) => setHasPool(checked as boolean)}
        />
        <Label htmlFor="hasPool">Has Pool</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasBuiltInBraai"
          checked={hasBuiltInBraai}
          onCheckedChange={(checked) => setHasBuiltInBraai(checked as boolean)}
        />
        <Label htmlFor="hasBuiltInBraai">Has Built-in Braai</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasBalcony"
          checked={hasBalcony}
          onCheckedChange={(checked) => setHasBalcony(checked as boolean)}
        />
        <Label htmlFor="hasBalcony">Has Balcony</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasSecurityPost"
          checked={hasSecurityPost}
          onCheckedChange={(checked) => setHasSecurityPost(checked as boolean)}
        />
        <Label htmlFor="hasSecurityPost">Has Security Post</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasAircon"
          checked={hasAircon}
          onCheckedChange={(checked) => setHasAircon(checked as boolean)}
        />
        <Label htmlFor="hasAircon">Has Air Conditioning</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hideAddress"
          checked={hideAddress}
          onCheckedChange={(checked) => setHideAddress(checked as boolean)}
        />
        <Label htmlFor="hideAddress">Hide Address</Label>
      </div>
    </div>
  )
}

