import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = ({ user, dailyData, setDailyData, setTempPreference }) => {
  
  const [isMounted, setIsMounted] = useState(false);
  const [userT, setUserT] = useState();
  
  const generateSummary = async () => {
    const newSummary = await axios.post('/api/summary', { email: user.email });
    if (newSummary.status === 200) {
      alert("Today's summary has been sent to your email")
    }
    const data = [...dailyData, newSummary.data.data];
    setDailyData([]);
    setDailyData(data);
  }
  // useEffect to update state after component mounts on the client
  useEffect(() => {
    setUserT(user.temperatureThreshold);
    setIsMounted(true);
  }, []);

  const handleKeyDown =  async (e) => {
    if (e.key === 'Enter') {
      // Validate input is a number
      const threshold = parseFloat(userT);
      if (!isNaN(threshold) && userT !=  user.temperatureThreshold) {
       const status = (await axios.patch('api/users',{threshold: threshold})).status;
       if(status === 200){
        user.temperatureThreshold = threshold;
       }
      }
    }
  };

  return (
    <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
      {/* Left Section - Heading and Mode Toggle */}
      <div className="flex items-center space-x-4 gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight leading-none">Real-Time Weather Monitor</h1>
        {user && <ModeToggle/>}
      </div>

      {/* Right Section - Navigation and Buttons */}
      <div className="flex items-center space-x-4">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            {/* Temperature Threshold Input */}
           

            <NavigationMenuItem>
              <NavigationMenuTrigger>Select Unit</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => setTempPreference("C")}
                        className="mb-2 mt-4 text-lg font-medium cursor-pointer hover:text-blue-500 transition-colors w-full text-left"
                      >
                        Celsius
                      </button>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => setTempPreference("F")}
                        className="mb-2 mt-4 text-lg font-medium cursor-pointer hover:text-blue-500 transition-colors w-full text-left"
                      >
                        Fahrenheit
                      </button>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => setTempPreference("K")}
                        className="mb-2 mt-4 text-lg font-medium cursor-pointer hover:text-blue-500 transition-colors w-full text-left"
                      >
                        Kelvin
                      </button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <div className="flex items-center gap-2">
                <Label htmlFor="userT" className="text-white">
                  Temp Threshold:
                </Label>
                <Input
                  id="userT"
                  type="number"
                  value={userT}
                  onChange={(e) => setUserT(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Set threshold..."
                  className="w-24 bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                />
              </div>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Button className="mr-2" onClick={() => generateSummary()}>
                Generate Summary
              </Button>
            </NavigationMenuItem>

            <NavigationMenuItem>
              {user && <UserButton/>}
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
