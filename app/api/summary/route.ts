import { db } from "@/lib/db";
import { startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import {fromZonedTime} from "date-fns-tz"; 
import { DailyWeatherSummary } from "@prisma/client";
import { sendEmail } from "@/lib/mailer";
import { convert } from "@/lib/tempConvert";
export interface Summary {
    city: string;
    avgTemp: number; 
    maxTemp: number;
    minTemp: number;
    dominants: string[];
}
const formatWeatherSummary = (summaries : DailyWeatherSummary[]) => {
    return summaries.map((summary) => {
      return `
      Weather Summary for ${summary.city} on ${summary.date.toISOString().slice(0, 10)}:
  
      - Average Temperature: ${convert(summary.avgTemp, "C")}°C
      - Maximum Temperature: ${convert(summary.maxTemp, "C")}°C
      - Minimum Temperature: ${convert(summary.minTemp, "C")}°C
      - Dominant Weather: ${summary.dominantWeather}
      `;
    }).join('\n'); // Join all formatted strings with a new line
  };

export async function POST(request: Request) {
    try {
        const param = await request.json();
        const {email} = param;
        const date = new Date();
        const beginningOfDayIST = startOfDay(date); // Get the beginning of the day in IST
         const beginningOfDayUTC = fromZonedTime(beginningOfDayIST, 'Asia/Kolkata'); 
        const records =await db.weather.findMany({
            where: {
                timestamp: {
                    gte: new Date(beginningOfDayUTC),
                },
            },
        });
        let hash: Record<string, Summary> = {};
        records.forEach((records)=>{
            if(!hash[records.city]){
                hash[records.city]={
                    avgTemp: 0,
                    minTemp: 500,
                    maxTemp: 0,
                    city: '',
                    dominants: [] 
                }
            }
            hash[records.city].avgTemp+=records.temperature;
            hash[records.city].minTemp=Math.min(hash[records.city].minTemp, records.temperature);
            hash[records.city].maxTemp=Math.max(hash[records.city].maxTemp, records.temperature);
            hash[records.city].dominants.push(records.main);
        })
        const results = await Promise.all(
            Object.keys(hash).map(async (city) => {
                const summary = hash[city];
                summary.avgTemp /= summary.dominants.length;
                const countMap = new Map<string, number>();
                summary.dominants.forEach(dominant => {
                    countMap.set(dominant, (countMap.get(dominant) || 0) + 1);
                });
                const entries = Array.from(countMap.entries());
                entries.sort((a, b) => b[1] - a[1]);
                const dominantWeather = entries[0]?.[0] || ''; // Safeguard against empty entries
                return await db.dailyWeatherSummary.create({
                    data: {
                        maxTemp: summary.maxTemp,
                        minTemp: summary.minTemp,
                        avgTemp: summary.avgTemp,
                        dominantWeather: dominantWeather,
                        city: city,
                        date: new Date().toISOString()
                    }
                });
            })
        );
        sendEmail(email,'Weather Summary',formatWeatherSummary(results),)
        // Example response
        return NextResponse.json({ message: 'Data received successfully!', data: results }, { status: 200 });
      } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
      }
}