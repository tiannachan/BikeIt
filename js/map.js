// Global variables
let lat = 34.0692;
let lon = -118.3206;
let zl = 11.4;

let map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
    
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
      Docks Available: ${feature.properties.docksAvailable}<br>`)
}




// define layers
let layers = {
	"Existing Bike Lanes": laneLayer,
    "Bike Share Stations": stationLayer
}

// add layer control box
L.control.layers(null,layers).addTo(map)


//function for sidebar
function flyToIndex(lat, lon){
	map.flyTo([lat,lon],14)
};


L.control.locate({
    strings: {
        title: "Locate me"
    }
}).addTo(map);