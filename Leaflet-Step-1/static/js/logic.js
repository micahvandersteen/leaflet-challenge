// creating map object
var myMap = L.map("map", {
    center: [35.5, -98],
    zoom: 4
  });
  
// creating tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: api_key
  }).addTo(myMap);

  // Create a legend to display information about our map
var info = L.control({
    position: "bottomright"
  });
  
  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(myMap);
  

// defining url that contains data for all earthquakes from the past week
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// using d3 to access the GeoJSON data from the url defined above
d3.json(url).then((response) => {

    console.log(response);

    // defining features to more easily interact with the GeoJSON data
    var features = response.features;

    // initializing empty arrays to store locations and magnitudes of each quake
    var locations = [];

    var magnitudes = [];

    // for loop to go through response data, get desired information,
    // and store it in the respective arrays defined above
    for (var i = 0; i < features.length; i++) {

        // getting data
        var coordinates = features[i].geometry.coordinates;

        var location = [coordinates[1] , coordinates[0]];

        locations.push(location);

        var magnitude = features[i].properties.mag;

        magnitudes.push(magnitude);

        // defining function 'getColor' to get the color for each marker based on magnitude
        function getColor(magnitude) { 

                return magnitude > 7 ? 'black' :
            
                       magnitude > 6  ? 'brown' :

                       magnitude > 5  ? 'darkred' :

                       magnitude > 4  ? 'crimson' :

                       magnitude > 3   ? 'red' :

                       magnitude > 2   ? 'orange' :

                       magnitude > 1   ? 'yellow' :

                                        'greenyellow';
        }

        // defining location of quake in words
        var stringLocation = features[i].properties.place;  

        // Creating circle markers with popups for each earthquake location.
        var circleMarkers = L.circleMarker(location, {
                                            color: getColor(magnitude),
                                            fillColor: getColor(magnitude),
                                            fillOpacity: 1,
                                            radius: magnitude * 1.5
                                        }).addTo(myMap)
                                            .bindPopup(`Location: ${stringLocation} <br> Magnitude: ${magnitude}`)
                                            .openPopup();   
                                    };

});
