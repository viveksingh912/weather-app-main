import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Alert, AlertDescription } from "./ui/alert";
import { format } from "date-fns";
const DATE_FORMAT = "d MMM yyyy, HH:mm:ss";

const CurrentWeather = ({ weatherData , setSelectedCity, scale}) => (
  <div className="flex-1">
  <h2 className="text-xl font-bold bg-dark p-2">Current Weather</h2> {/* Change bg-white to match your body background */}
  {
    weatherData.map((data) => (
    <Alert key={data.id} type="warning" className="mb-4" onClick={()=>{setSelectedCity(data.city)}}>
      <div className="flex flex-row justify-between">
        <AlertDescription className="text-lg font-semibold"> {data.city}</AlertDescription>
        <AlertDescription className="text-lg font-semibold"> {format(new Date(data.timestamp), DATE_FORMAT)}</AlertDescription>
      </div>
      <AlertDescription>Current Temperature: {data.temperature} °{scale}</AlertDescription>
      <AlertDescription>It feels like: {data.feelsLike} °{scale}</AlertDescription>
      <AlertDescription>Current Weather: {data.main}</AlertDescription>
      {/* <AlertDescription>Dominant Condition: {data.dominantCondition}</AlertDescription> */}
    </Alert>
  ))
}
  </div>
);

export default CurrentWeather;