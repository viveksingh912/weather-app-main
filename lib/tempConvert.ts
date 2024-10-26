export const convert=(temp: number, type: string)=>{
    if ( type === "K") {
        // If type is not specified or is Kelvin, return the original temperature
        return Number(temp.toFixed(2));
    }
    if (!type || type === "C") {
        return Number((temp - 273.15).toFixed(2));
    }
    if (type === "F") {
        return Number(((temp - 273.15) * (9 / 5) + 32).toFixed(2));
    }
}