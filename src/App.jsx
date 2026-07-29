import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { geoCentroid, geoArea } from "d3-geo";

// const GEO_URL = "/arunachal_districts.geojson";
const GEO_URL = "/export4.geojson";
const districtColors = [
  "#bdd2ff", "#cbb6fb",
  "#fbeeb2", "#cd6798", "#b0b0f2", "#e8fcb7", "#beffe7",
  "#fac7b9", "#f9b3d1", "#cd6667", "#fabebe", "#c1e7fc",
  "#f67f7e", "#fbd380", "#cdf57a", "#72dffe"
];
const layerNmaes = {
  rivers: "Rivers",
  nsHighway: "National Highways",
  stHighway: "State Highways",
  dtRoad: "District Roads",
  railway: "Railways",
  dtHq: "District HQ.",
};
function App() {
  const [selectedDistrictGeo, setSelectedDistrictGeo] = useState(null);
  const [selectedDistrictProperties, setSelectedDistrictProperties] = useState(null);
  const [layers, setLayers] = useState({
    rivers: true,
    nsHighway: false,
    stHighway: false,
    dtRoad: false,
    railway: false,
    dtHq: false,
  });

  const handleDistrictClick = (geo) => {
    const center = geoCentroid(geo);
    const earthRadiusKm = 6371; // Earth's radius
    const areaSteradians = geoArea(geo);
    const areaKm2 = areaSteradians * 4 * Math.PI * Math.pow(earthRadiusKm, 2);
    const baseScale = 720000;
    const scale = baseScale / Math.sqrt(areaKm2);

    setSelectedDistrictGeo({ ...geo, center, areaKm2, scale });
    setSelectedDistrictProperties(geo.properties);
    
  };

  const closePopup = () => {
    setSelectedDistrictGeo(null);
    setSelectedDistrictProperties(null);
  };

  const toggleLayer = (layer) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 w-screen">
        Arunachal Pradesh District Map
      </h1>
      {/* Buttons */}
      <div className="absolute left-4 top-4 z-50 w-52 bg-white rounded-xl shadow-xl border">

        <div className="bg-blue-700 text-white font-semibold p-3 rounded-t-xl">
          Legend
        </div>

        {Object.entries(layers).map(([key, value]) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            className={`w-full flex items-center justify-between px-4 py-3 border-b
            transition hover:bg-gray-100 ${
              value ? "bg-green-50" : "bg-white"
            }`}
          >
            <span className="capitalize">{layerNmaes[key]}</span>

            <span>
              {value ? "👁" : " "}
            </span>
          </button>
        ))}

      </div>
      {/* Full Arunachal Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 10000, center: [94.5, 27.2] }}
        width={1200}
        height={900}
      >
        <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo, index) => {
            const centroid = geoCentroid(geo);
            const name = geo.properties.district || geo.properties.name;
            return (
              <React.Fragment key={geo.rsmKey}>
                {/* District Shape */}
                <Geography
                  geography={geo}
                  onClick={() => handleDistrictClick(geo)}
                  style={{
                    default: {
                      fill: districtColors[index % districtColors.length],
                      stroke: "#000",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#FFD700",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#FF5722",
                      outline: "none",
                    },
                  }}
                />

                {/* District Label */}
                <Marker coordinates={[centroid[0] - .5, centroid[1] + .1]}>
                  <text
                    x={centroid[0]}
                    y={centroid[1]}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: 10,
                      fill: "#000",
                      pointerEvents: "none", // so clicks pass through to district
                    }}
                  >
                    {name}
                  </text>
                </Marker>
              </React.Fragment>
            );
          })
        }
        </Geographies>
      </ComposableMap>
      {/* <img
          src="/img/test-map.png"
          style={{marginTop: "-27px", marginLeft: "107px", width: "1278px", height: "900px" }}
          className="absolute inset-0 pointer-events-none"
      /> */}
      {layers.rivers && (
      <img
          src="/img/rivers.png"
          style={{marginTop: "-27px", marginLeft: "107px", width: "1278px", height: "900px" }}
          className="absolute inset-0 pointer-events-none"
      />
      )}
      {layers.nsHighway && (
      <img
          src="/img/national-highway.png"
          style={{marginTop: "-27px", marginLeft: "107px", width: "1278px", height: "900px" }}
          className="absolute inset-0 pointer-events-none"
      />
      )}
{/* fbeeb2, 2c2b28, cd6798, b0b0f2, e8fcb7, beffe7, fac7b9, f9b3d1, cd6667, fabebe, c1e7fc, cbb6fb, f67f7e, fbd380, cdf57a, 72dffe, bdd2ff,  */}
      {/* Popup for Clicked District */}
      {selectedDistrictGeo && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[900px]">

          <div className="absolute bottom-30 bg-white border border-gray-300 shadow-lg rounded-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700">{selectedDistrictProperties.name || selectedDistrictProperties.district}</p>
            <p className="text-gray-700">Headquarter: {selectedDistrictProperties.headquarter}</p>
            <p className="text-gray-700">Area: {selectedDistrictProperties.area}</p>
            <p className="text-gray-700">Forest Land: {selectedDistrictProperties.forest_land}</p>
            <p className="text-gray-700">Schools: {selectedDistrictProperties.schools}</p>
            <p className="text-gray-700">Colleges: {selectedDistrictProperties.colleges}</p>
            <p className="text-gray-700">Hospitals: {selectedDistrictProperties.hospitals}</p>
            <p className="text-gray-700">Block Developemet Office: {selectedDistrictProperties.bdo}</p>
          </div>

            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              {selectedDistrictProperties.name || selectedDistrictProperties.district}
            </h2>

            <ComposableMap
              projection="geoMercator"
              width={600}
              height={400}
              projectionConfig={{
                scale: selectedDistrictGeo.scale,
              }}
            >
              <ZoomableGroup
                center={selectedDistrictGeo.center || [94.5, 28.2]}
                zoom={6}
              >
                <Geographies
                  geography={{
                    type: "FeatureCollection",
                    features: [selectedDistrictGeo],
                  }}
                >
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: "#FF9800",
                            stroke: "#000",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                        }}
                      />
                    ))
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
