// Global variables
// let map;
let lat = 34.0692;
let lon = -118.3206;
let zl = 11.4;
// let path = 'data/startStationCount.csv';
// let markers = L.featureGroup();

// initialize
// $( document ).ready(function() {
// 	createMap(lat,lon,zl);
// 	readCSV(path);
// });

// create the map
// function createMap(lat,lon,zl){
	let map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
// }

// // function to read csv data
// function readCSV(path){
// 	Papa.parse(path, {
// 		header: true,
// 		download: true,
// 		complete: function(data) {
// 			console.log(data);
			
// 			// map the data
// 			mapCSV(data);
// 		}
// 	});
// }

// function mapCSV(data){

// 	// clear layers
// 	markers.clearLayers();

// 	// loop through each entry
// 	data.data.forEach(function(item,index){
// 		// circle options
// 		let circleOptions = {
// 			radius: getRadiusSize(item.count),
// 			weight: 1,
// 			color: 'white',
// 			fillColor: 'red',
// 			fillOpacity: 0.5
// 			}
// 			let marker = L.circleMarker([item.Start_Lat,item.Start_Lon],circleOptions)
            
// 			markers.addLayer(marker)	
// 		});

// 	markers.addTo(map)
//     map.fitBounds(markers.getBounds())

// }

// function getRadiusSize(value){

//     // create empty array to store data
// 	let values = [];

// 	// add counts to the array
// 	data.data.forEach(function(item){
// 		values.push(Number(item.count))
// 	})
    
//     // get the max 
// 	let max = Math.max(...values)
	
// 	// per pixel if 100 pixel is the max range
// 	perpixel = max/100;

//     // return the pixel size for given value
// 	return value/perpixel
// }




// Read bike lane GeoJSON and add to map
let laneLayer = new L.GeoJSON.AJAX("data/Bikeways_(Existing).geojson",{
    onEachFeature: lanePopup
});       
laneLayer.addTo(map);

// Define lane popup function
function lanePopup(feature,layer) {
    layer.setStyle({color:'green'})
    layer.bindPopup(`Street: ${feature.properties.Street} <br>
                    From: ${feature.properties.From_} <br>
                    To: ${feature.properties.To_} <br>
                    Bikeway Type: ${feature.properties.Bikeway_Type} <br>`), {
                        closeButton: false, offset: L.point(0, -20)};
        layer.on('mouseover', function() { layer.openPopup(); });
        layer.on('mouseout', function() { layer.closePopup(); });
}




// Read station GeoJSON and add to map
let stationLayer = new L.GeoJSON.AJAX("https://bikeshare.metro.net/stations/json/", {
    onEachFeature: onEachFeature
})
    .addTo(map)
    .on('click', function(e){
    map.setView(e.latlng, 15); //zoom to marker when clicked
})

//Define function for marker color and marker popup
function getMarkerColor (feature){
    return (feature.properties.electricBikesAvailable > 0 || feature.properties.smartBikesAvailable > 0) ?
        'icon/greenBike.png': 
        //green marker for electric/smart available
            (feature.properties.classicBikesAvailable > 0) ? 'icon/blueBike.png':
        //blue marker for classic available
        'icon/greyBike.png';
        //grey marker for none available
}

function onEachFeature (feature,layer){
    layer.setIcon(new L.Icon({
        iconUrl: getMarkerColor(feature),
        iconSize: [20, 20],
        popupAnchor: [1, -34],
        shadowSize: [31, 31]
    })),
    layer.bindPopup(`<h3>${feature.properties.name}</h3>
      <h4><i>${feature.properties.addressStreet}, ${feature.properties.addressCity}, ${feature.properties.addressState} ${feature.properties.addressZipCode}</i></h4>
      <table>
        <tr>
            <th>Smart Bikes Available</th>
            <th>Electric Bikes Available</th>
            <th>Classic Bikes Available</th>
        </tr>
        <tr>
            <td>${feature.properties.smartBikesAvailable}</td>
            <td>${feature.properties.electricBikesAvailable}</td>
            <td>${feature.properties.classicBikesAvailable}</td>
        </tr>
      </table>
      <br>
      Docks Available: ${feature.properties.docksAvailable}<br>`)
}




// define layers
let layers = {
	"Existing Bike Lanes": laneLayer,
    "Bike Share Stations": stationLayer
}

// add layer control box
L.control.layers(null,layers).addTo(map)