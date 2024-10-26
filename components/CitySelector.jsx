import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"; // Ensure this path is correct
  
  const CitySelector = ({ cities, selectedCity, onChange }) => {
    return (
      <Select value={selectedCity} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {cities?.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };
  
  export default CitySelector;
  