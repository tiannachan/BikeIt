# Week 4 Part 1: Data Plan Update

<b><a href="https://bikeshare.metro.net/about/data/">Metro Bike Share data</a></b>
 
This website contains the trip data from 2016 quarter 3 to 2022 quarter 1 (as of April 2022). We will be analyzing their 2021 quarter 2 to 2022 quarter 1 data (April 2021- March 2022). The data is downloaded as CSV, which contains variables such as the duration, start and end locations, trip route categories, bike types, and the passholder types. 
 
Since the trip data does not include the names of the start and end stations, we need to connect it with their station data, available on the same website. It is also downloadable as a CSV file and includes variables such as the first date station is available, and the status (as of April 2022).
 
Furthermore, there is real-time station status data available in the GeoJSON file, which allows us to map the station locations and available bikes in real-time, mimicking the metro bike share app’s map.
 
<b><a href="https://geohub.lacity.org/datasets/230abc621b144dbc96cca83d65bd454d/explore?location=34.033311%2C-118.317725%2C10.87
">LA Bikeways data</a></b>
 
This website contains the data on existing bikeways in Los Angeles. It can be downloaded as a CSV or GeoJSON file. We plan to use this as one of the layers in our map, so users can easily understand which roads currently have bike lanes.
