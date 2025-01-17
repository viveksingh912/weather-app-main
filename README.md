Real-Time Data Processing System for Weather Monitoring with Rollups and Aggregates
Overview
This real-time data processing system monitors weather conditions and provides summarized insights using rollups and aggregates. It retrieves weather data from the OpenWeatherMap API for major metros in India and supports configurable thresholds and alert notifications.

Features
Real-Time Weather Data: Fetches current weather conditions for Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad.
Daily Weather Summaries: Calculates average, maximum, minimum temperatures, and determines the dominant weather condition.
Configurable Alerts: Allows users to set thresholds (e.g., temperature > 35°C) with alert notifications if crossed for two consecutive updates.
Email Summaries: Daily summaries are sent to users via email upon clicking the "Generate Summary" button.
Visualizations: Displays a line graph for daily average temperature trends.
Prerequisites
```
Node.js and npm installed
Line graph depends upon the weather summary data, So to show the line graph you've to click at least once on the generate summary button and referesh the page.
To set the temperature threshold you've to give input in the input box and press enter
```
Getting Started
1. Clone the Repository
```
git clone  https://github.com/viveksingh912/weather-app-main.git
```
2. Navigate to the Project Directory
```
cd weather-app-main
```
3. Install Dependencies
```
npm install
```
4. Set Environment Variables
```
In your .env file, add:
USER_EMAIL=<your_email>
USER_EMAIL_APP_PASSWORD=<your_email_app_password>
Note: Keep USER_EMAIL and USER_EMAIL_APP_PASSWORD secure and do not share them publicly(these keys are required for sending the mails, rest of all the keys i've uploaded in .env), application can run without these keys but mail summaries can't be send to users.
```
5. Run the Project
```
npm run dev
```
Design Choices
```
Database: A relational SQL database was selected due to the nature of the data and relationships among models.
```
Data Processing & Analysis
```
Real-Time Data Fetching
The system fetches data every 5 minutes from the OpenWeatherMap API for selected cities in India. Temperature data is converted from Kelvin to the user’s preferred unit (Celsius, Fahrenheit, or Kelvin).
```
Rollups and Aggregates
Daily Weather Summary
Aggregates daily data for each city.
Calculations include:
Average Temperature
Maximum Temperature
Minimum Temperature
```
Dominant Weather Condition: determined based on frequency of conditions(the condition which appears for most number of time is taken as dominant weather condition) (e.g., Rain vs. Clear).
```
Alert Thresholds
```
User-configurable thresholds can be set for temperature.
Alerts are triggered if a threshold is breached in two consecutive updates, notifying the user via email.
```
Visualization
Daily Summary Line Graph: Displays trends for daily average temperatures

