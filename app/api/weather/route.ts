import { db } from "@/lib/db";
import { startOfDay,format } from "date-fns";
import { fromZonedTime,toZonedTime } from "date-fns-tz";
import { NextResponse } from "next/server";
export interface WeatherData {
    city: string;
    main: string;
    temperature: number;
    feelsLike: number;
    timestamp: Number; // or Date if you prefer to work with Date objects
  }
  
  // If you want to represent the whole request body
  export interface WeatherRequest {
    data: WeatherData[];
  }
export async function POST(request: Request) {
    try {
        const params: WeatherRequest = await request.json(); // Parse JSON from the request body
        const {data} = params;
        const weatherRecords = await Promise.all(
            data.map(async (element) => {
              const { city, main, temperature, feelsLike, timestamp } = element;
              
              return await db.weather.create({
                data: {
                  city,
                  main,
                  temperature,
                  feelsLike,
                  timestamp: new Date(Number(timestamp)*1000),
                },
              });
            })
          );
      
    
        // Example response
        return NextResponse.json({ message: 'Data received successfully!', data: weatherRecords }, { status: 200 });
      } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
      }
}

export async function GET(request: Request) {
  try {
      const url = new URL(request.url);
      
      // Get the city from the query parameters
      let city = url.searchParams.get('city'); 
      if(!city)city = '';    
      const date = new Date();
      const beginningOfDayIST = startOfDay(date); // Get the beginning of the day in IST
      const beginningOfDayUTC = fromZonedTime(beginningOfDayIST, 'Asia/Kolkata'); 
      const weatherRecords = await db.dailyWeatherSummary.findMany({
                              where:{
                                city: city
                              },
                              select: {
                               avgTemp: true,
                               date:true,
                              },
                              orderBy:{
                                date: 'desc'
                              },
                            });
                            const recordsByDate: { [date: string]: {avgTemp: number, date: Date} } = weatherRecords.reduce((acc, record) => {
                              const dateKey = record.date.toISOString().slice(0, 10); // Get date in YYYY-MM-DD format
                              console.log(dateKey);
                              if (!acc[dateKey]) {
                                console.log(dateKey);
                                acc[dateKey] = record; // Store the record if it's the latest for the date
                              }
                              return acc;
                            }, {} as { [date: string]: {avgTemp: number, date: Date} });
                            const uniqueDailyRecords = Object.values(recordsByDate);
                            uniqueDailyRecords.sort((a, b) => {
                              return a.date > b.date ? 1 : -1; 
                            });
                            const formattedRecords = uniqueDailyRecords.map(record => {
                              const istTime = format(toZonedTime(new Date(record.date), 'Asia/Kolkata'), 'd MMM');
                          
                              return {
                                temp: record.avgTemp,
                                time: istTime, 
                              };
                            });
      return NextResponse.json({ message: 'Data received successfully!', data: formattedRecords }, { status: 200 });
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}