"use client"
import Header from '@/components/Header.jsx';
import CitySelector from '@/components/CitySelector';
import CurrentWeather from '@/components/CurrentWeather';
import DailySummary from '@/components/DailySummary';
import Alerts from '@/components/Alert';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from './Chart';
import { convert } from '@/lib/tempConvert';

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const dailyWeatherSummaries: any = [];

type DataItem = {
  temperature?: number;
  feelsLike?: number;
  [key: string]: any; // Allows for additional properties
};
  

const Landing = ({ profile }: any) => {
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [weatherData, setWeatherData] = useState<DataItem>([]);
    const [dailyData, setDailyData] = useState(dailyWeatherSummaries);
    const [data, setData] = useState<[{temp: number,time: string}]>();
    const [tempPreference, setTempPreference] = useState<string> (profile.prefferedUnit);
    
    // Fetch weather data and summaries here
    
    const convertTempLikeUser = (
      data: { temperature?: number; feelsLike?: number; [key: string]: any }[] // Accepts any additional properties
    ): { temperature?: number; feelsLike?: number; [key: string]: any }[] => {
      return data.map(val => ({
        ...val,
        temperature: val.temperature !== undefined 
          ? convert(val.temperature, profile.preferredUnit) 
          : undefined,
        feelsLike: val.feelsLike !== undefined 
          ? convert(val.feelsLike, profile.preferredUnit) 
          : undefined,
      }));
    };

    const checkAndSendAlertToUser = (data: any)=>{
      data.forEach( async (weather: any)=>{
        await axios.put('api/users', {temperature: weather.temperature, city: weather.city});
      })
    }

    const fetchWeatherData = async () => {
      try {
        const results = await Promise.all(
          cities.map(async (city) => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_WEATHER_URL}?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`);
            const data = res.data;
            const temperature =data.main.temp;
            const feelsLike = data.main.feels_like;
            const timestamp = data.dt;
            const main = data.weather[0].main;
  
            return { city, temperature, feelsLike, timestamp, main };
          })
        );
        const response=  await axios.post('/api/weather',{data: results});
        setWeatherData(convertTempLikeUser(response.data.data));
        checkAndSendAlertToUser(response.data.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    useEffect(() => {
        fetchWeatherData();
        const intervalId = setInterval(fetchWeatherData, 5*60*1000); // Fetch every 5 minutes
        return () => clearInterval(intervalId);
    }, []);

    useEffect(()=>{
      const getTodayWeather = async()=>{
      const res = await axios.get('/api/weather', {
        params: {
          city: selectedCity,
        },
      });
      if(( !profile.preferredUnit && tempPreference) || (profile.preferredUnit != tempPreference && tempPreference)){
        profile.preferredUnit = tempPreference;
        const profileRes = await axios.post('api/users', {userId: profile.userId,preferredUnit: profile.preferredUnit  })
        profileRes.status === 200 && alert("Your preference has been set");
        fetchWeatherData();
      }
      if(!tempPreference)setTempPreference(profile.preferredUnit);
      const formeddata= res.data.data.map((entry: any)=>{
        return {
          time: entry.time,
          temp: convert(entry.temp,  profile.preferredUnit)
        }
      })
      setData(formeddata)
    }
     getTodayWeather();
      console.log(selectedCity);
    },[selectedCity, tempPreference])


    return (
        <div className="container mx-auto p-4">
            <Header user={profile} dailyData={dailyData} setDailyData= {setDailyData} setTempPreference={setTempPreference}/>
            <div className=" flex flex-col justify-between mt-4 gap-16 md:flex-row items-center">
                <CurrentWeather weatherData={weatherData} setSelectedCity={setSelectedCity} scale={tempPreference} />
               {data && (data?.length > 0) &&  <Chart hourlyWeather={data} city={selectedCity} scale={tempPreference}></Chart>}
            </div>
        </div>
    );
};

export default Landing;
