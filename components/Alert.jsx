import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const Alerts = ({ alerts }) => (
    <div className="flex-1">
    <h2 className="text-xl font-bold bg-dark p-2">Alerts</h2> {/* Change bg-white to match your body background */}
    {alerts.map((alert, index) => (
      <Alert key={index} type="warning" className="mb-4">
        <AlertTitle>{alert.city}</AlertTitle>
        <AlertDescription>{alert.alertMessage}</AlertDescription>
      </Alert>
    ))}
  </div>
);

export default Alerts;
