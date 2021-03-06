// Global variables
let map;
let lat = 34.03;
let lon = -118.35;
let zl = 11.5;

let stationLayer;
let laneLayer;

let startpath = 'data/startStationCount.csv';
let endpath = 'data/endStationCount.csv';
let stationpath = "data/rawData/stations-2022-04-01.csv"

let startMarkers = L.featureGroup();
let endMarkers = L.featureGroup();


// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    locateMe();
    mapBikeLane();
    mapStation();
    readStart(startpath);
    readEnd(endpath);
    layerBox();
});

// create the map
function createMap(lat,lon,zl){
    map = L.map('map').setView([lat,lon], zl);
   
       L.tileLayer('https://api.mapbox.com/styles/v1/iramirez/cl39d3ufu000515pmzes7noks/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaXJhbWlyZXoiLCJhIjoiY2t3NXp3OGc0MGhkcDJwbzBnOWF5M2I5NiJ9.RDoR2Fw5DP2GJsG_uUY7kg', {
           attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
           maxZoom: 18,
        })
           .addTo(map);
   }

   
// function to map bike lane
function mapBikeLane(){

    // Read bike lane GeoJSON and add to map
    laneLayer = new L.GeoJSON.AJAX("data/Bikeways_(Existing).geojson",{
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

}

// function to map station info
function mapStation(){

    // Read station GeoJSON and add to map
    stationLayer = new L.GeoJSON.AJAX("https://bikeshare.metro.net/stations/json/", {
        onEachFeature: onEachFeature
    })
        .addTo(map)
        .on('click', function(e){
        map.setView(e.latlng, 15); //zoom to marker when clicked
    })

    //Define function for marker color and marker popup
    function getMarkerColor (feature){
        return (feature.properties.electricBikesAvailable > 0 || feature.properties.smartBikesAvailable > 0) ?
            'images/icon/greenBike.png': 
            //green marker for electric/smart available
                (feature.properties.classicBikesAvailable > 0) ? 'images/icon/blueBike.png':
            //blue marker for classic available
            'images/icon/greyBike.png';
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
        <p>Docks Available: ${feature.properties.docksAvailable}</p>
        `)
    }
}

// function to read start count csv data
function readStart(){
	Papa.parse(startpath, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			// put the data in a global variable
			startdata = data;

			// call the mapCSV function to map the data
			mapStart();
		}
	});
}

function mapStart(){

	// clear layers in case you are calling this function more than once
	startMarkers.clearLayers();

	// loop through each entry
	startdata.data.forEach(function(item){
		// circle options
		let circleOptions = {
			radius: getStartRadiusSize(parseFloat(item['total_count'].replace(/,/g,''))), // call a function to determine radius size
			weight: 1,
			color: 'white',
			fillColor: 'red',
			fillOpacity: 0.5
		}
		let marker = L.circleMarker([item.Start_Lat,item.Start_Lon],circleOptions)

        // add startPop to featuregroup
        startMarkers.addLayer(marker)	
	
	});

    // add featuregroup to map
	startMarkers.addTo(map)

}

function getStartRadiusSize(value){

	// create empty array to store data
	let values = [];

	// add case counts for most recent date to the array
	startdata.data.forEach(function(item,index){
		values.push(Number(parseFloat(item['total_count'].replace(/,/g,''))))
	})
    
    // get the max case count for most recent date
	let max = Math.max(...values)
	
	// per pixel if 100 pixel is the max range
	perpixel = max/100;

    // return the pixel size for given value
	return value/perpixel
}

// function to read end count csv data
function readEnd(){
	Papa.parse(endpath, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			// put the data in a global variable
			enddata = data;

			// call the mapCSV function to map the data
			mapEnd();
		}
	});
}

function mapEnd(){

	// clear layers in case you are calling this function more than once
	endMarkers.clearLayers();

	// loop through each entry
	enddata.data.forEach(function(item){
		// circle options
		let circleOptions = {
			radius: getEndRadiusSize(parseFloat(item['total_count'].replace(/,/g,''))), // call a function to determine radius size
			weight: 1,
			color: 'white',
			fillColor: 'blue',
			fillOpacity: 0.5
		}
		let marker = L.circleMarker([item.End_Lat,item.End_Lon],circleOptions)
        
        // add endMarkers to featuregroup
        endMarkers.addLayer(marker)	
	
	});

    // add featuregroup to map
	endMarkers.addTo(map)

}

function getEndRadiusSize(value){

	// create empty array to store data
	let values = [];

	// add case counts for most recent date to the array
	enddata.data.forEach(function(item,index){
		values.push(Number(parseFloat(item['total_count'].replace(/,/g,''))))
	})
    
    // get the max case count for most recent date
	let max = Math.max(...values)
	
	// per pixel if 100 pixel is the max range
	perpixel = max/100;

    // return the pixel size for given value
	return value/perpixel
}

function locateMe(){
    L.control.locate({
        strings: {
            title: "Locate me"
        }
    }).addTo(map);
}

// add layer control box
function layerBox(){
    let layers = {
	"Existing Bike Lanes": laneLayer,
    "Bike Share Stations": stationLayer,
    "Popular Start Stations": startMarkers,
    "Popular End Stations": endMarkers,
    }
    L.control.layers(null,layers).addTo(map)
}

//function for sidebar "Explore"
function flyToIndex(lat, lon){
	map.flyTo([lat,lon],14)
};



//function for sidebar popularity stations

function newmapStart(variable){

    // clear original layers
    startMarkers.clearLayers();
	endMarkers.clearLayers();

	// loop through each entry
	startdata.data.forEach(function(item){
		// circle options
		let circleOptions = {
			radius: (parseFloat(item[variable].replace(/,/g,'')))/50, 
			weight: 1,
			color: 'white',
			fillColor: 'red',
			fillOpacity: 0.5
		}
		let marker = L.circleMarker([item.Start_Lat,item.Start_Lon],circleOptions)

        // add startPop to featuregroup
        startMarkers.addLayer(marker)	
	
	});

    // add featuregroup to map
	startMarkers.addTo(map)

}

function newmapEnd(variable){

	 // clear original layers
    startMarkers.clearLayers();
	endMarkers.clearLayers();

	// loop through each entry
	enddata.data.forEach(function(item){
		// circle options
		let circleOptions = {
			radius: (parseFloat(item[variable].replace(/,/g,'')))/50, 
			weight: 1,
			color: 'white',
			fillColor: 'blue',
			fillOpacity: 0.5
		}
		let marker = L.circleMarker([item.End_Lat,item.End_Lon],circleOptions)

        // add endPop to featuregroup
        endMarkers.addLayer(marker)	
	
	});

    // add featuregroup to map
	endMarkers.addTo(map)

}

