import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
  
  const DailySummary = ({ dailyData }) => {
    return (
      <div className="flex-1">
        <h2 className="text-xl font-bold bg-dark p-2">Daily Summary Data</h2>
        <Accordion type="single" collapsible>
          {dailyData.map((data, index) => (
            <AccordionItem key={`item-${index}`} value={`item-${index}`}>
              <AccordionTrigger>
                {new Date(data[0].date).toLocaleString()} {/* Show date for the accordion header */}
              </AccordionTrigger>
  
              {data.map((newData) => (
                <AccordionContent key={newData.id}>
                  <div className="">
                    <Alert type="warning" className="mb-1">
                      <AlertDescription>
                        Average Temperature: {newData.avgTemp} °C
                      </AlertDescription>
                      <AlertDescription>
                        Max Temperature: {newData.maxTemp} °C
                      </AlertDescription>
                      <AlertDescription>
                        Min Temperature: {newData.minTemp} °C
                      </AlertDescription>
                      <AlertDescription>
                        Dominant Condition: {newData.dominantWeather}
                      </AlertDescription>
                    </Alert>
                  </div>
                </AccordionContent>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );  
  };
  
  export default DailySummary;
  