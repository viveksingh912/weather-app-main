import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import { startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { NextResponse } from "next/server";
interface params{
    userId: string,
    preferredUnit: string;
}
export async function POST(request: Request) {
    try {
        const params: params = await request.json(); // Parse JSON from the request body
        let {userId, preferredUnit} = params;
        console.log(userId, preferredUnit);
        await db.user.update({
            where:{
                userId: userId
            },
            data:{
                preferredUnit: preferredUnit
            }
        });
        return NextResponse.json({ message: 'Prefference Updated Successfully' }, { status: 200 });
      } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
      }
}

export async function PUT(request: Request) {
    try {
      const params = await request.json();
      const {city}= params;
      const profile = await currentProfile();
      if(!profile){
        return new NextResponse("Unauthorised",{status: 401});
      }
      const temp = await db.weather.findMany({
        where:{
            city: city
        },
        select:{
            temperature: true
        },
        orderBy:{
            createdAt: 'desc'
        },
        take: 2
      });
      temp.sort((a,b)=>{
        return a.temperature<b.temperature?-1:1;
      });
      
      if(temp?.[0]?.temperature >= (profile.temperatureThreshold || Infinity)){
        await db.alert.create({
            data:{
                triggeredAt: new Date().toISOString(),
                userId: profile.id,
                city: city,
                alertMessage: `Your threshold is breached at  ${profile.temperatureThreshold} temperature and in city ${city}`,
                threshold: profile.temperatureThreshold || 0,
            }
        })
        sendEmail(profile.email, "Threshold breached", `Your threshold is breached at  ${profile.temperatureThreshold} temperature and in city ${city}`);
      }
     
      return NextResponse.json({ message: 'Alert Triggered' }, { status: 200 });
      } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
      }
}

export async function PATCH(request: Request) {
    try {
      const params = await request.json();
      const {threshold}= params;
      const profile = await currentProfile();
      if(!profile){
        return new NextResponse("Unauthorised",{status: 401});
      }
      await db.user.update({
       where:{
        id: profile.id,
       },
       data:{
        temperatureThreshold: threshold,
       }
      })
     
      return NextResponse.json({ message: 'Alert Triggered' }, { status: 200 });
      } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
      }
}
