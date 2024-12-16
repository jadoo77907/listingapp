import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AdditionalCostsProps {
  ratesAndTaxes: string;
  setRatesAndTaxes: (value: string) => void;
  bodyCorporateFee: string;
  setBodyCorporateFee: (value: string) => void;
  parkingLotPrice: string;
  setParkingLotPrice: (value: string) => void;
  additionalCosts: string;
  setAdditionalCosts: (value: string) => void;
}

export function AdditionalCosts({
  ratesAndTaxes,
  setRatesAndTaxes,
  bodyCorporateFee,
  setBodyCorporateFee,
  parkingLotPrice,
  setParkingLotPrice,
  additionalCosts,
  setAdditionalCosts
}: AdditionalCostsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ratesAndTaxes">Rates and Taxes</Label>
          <Input
            id="ratesAndTaxes"
            type="number"
            value={ratesAndTaxes}
            onChange={(e) => setRatesAndTaxes(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bodyCorporateFee">Body Corporate Fee</Label>
          <Input
            id="bodyCorporateFee"
            type="number"
            value={bodyCorporateFee}
            onChange={(e) => setBodyCorporateFee(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parkingLotPrice">Parking Lot Price</Label>
          <Input
            id="parkingLotPrice"
            type="number"
            value={parkingLotPrice}
            onChange={(e) => setParkingLotPrice(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalCosts">Additional Costs (JSON)</Label>
        <Textarea
          id="additionalCosts"
          value={additionalCosts}
          onChange={(e) => setAdditionalCosts(e.target.value)}
          rows={3}
          className="w-full"
          placeholder='{"cost1": 100, "cost2": 200}'
        />
      </div>
    </>
  )
}

