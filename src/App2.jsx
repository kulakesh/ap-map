import React, { useState } from "react";
import { useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

// const GEO_URL = "/arunachal_districts.geojson";
const GEO_URL = "/export4.geojson";
const districtColors = [
  "#bdd2ff",
  "#cbb6fb",
  "#fbeeb2",
  "#cd6798",
  "#b0b0f2",
  "#e8fcb7",
  "#beffe7",
  "#fac7b9",
  "#f9b3d1",
  "#cd6667",
  "#fabebe",
  "#c1e7fc",
  "#f67f7e",
  "#fbd380",
  "#cdf57a",
  "#72dffe",
];
const layerNmaes = {
  rivers: "RIVERS",
  roads: "ROADS",
  labels: "LABELS",
  agl: "ADVANCE LANDING GROUND (ALG)",
  airport: "AIRPORTS",
  checkgate: "CHECKGATES",
  helipad: "HELIPADS",
  hq: "DISTRICT HQ.",
};
function App2() {
  const [selectedDistrictGeo, setSelectedDistrictGeo] = useState(null);
  const [closeButton, setCloseButton] = useState(false);
  const [selectedDistrictProperties, setSelectedDistrictProperties] =
    useState(null);
  const [layers, setLayers] = useState({
    rivers: true,
    roads: false,
    labels: false,
    agl: false,
    airport: false,
    checkgate: false,
    helipad: false,
    hq: false,
  });
  const [mapTransform, setMapTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  const mapRef = useRef(null);

  const handleDistrictClick = (event, geo) => {
    if (closeButton) return;

    const svgRect = mapRef.current.getBoundingClientRect();

    const clickX = event.clientX - svgRect.left;
    const clickY = event.clientY - svgRect.top;

    const zoom = 3;

    setMapTransform({
      scale: zoom,
      x: svgRect.width / 2 - clickX * zoom,
      y: svgRect.height / 2 - clickY * zoom,
    });

      setSelectedDistrictGeo(true);
      setCloseButton(true);
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
    <> 
    {/* Buttons */}
    <div className="fixed left-4 top-4 z-50 w-52 bg-white rounded-xl shadow-xl border">
          <div className="bg-blue-700 text-white font-semibold p-3 rounded-t-xl">
            Legend
          </div>

          {Object.entries(layers).map(([key, value]) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className={`w-full flex items-center justify-between px-4 py-3 border-b
            transition hover:bg-gray-100 ${value ? "bg-green-50" : "bg-white"}`}
            >
              <span className="capitalize">{layerNmaes[key]}</span>

              <span>{value ? "👁" : " "}</span>
            </button>
          ))}
        </div>
    <div
      className="relative inline-block bg-white"
      ref={mapRef}
      style={{
        transform: `translate(${mapTransform.x}px, ${mapTransform.y}px) scale(${mapTransform.scale})`,
        transformOrigin: "0 0",
        transition: "transform 0.5s ease",
      }}
    >
      <div className="relative inline-block p-4">
        <h1 className="text-2xl font-bold mb-4 w-screen text-center text-gray-800">
          Arunachal Pradesh
        </h1>
        
        {/* Full Arunachal Map */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 10000,
            center: [94.5, 27.2],
          }}
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
                      onClick={(event) => handleDistrictClick(event, geo)}
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
                    {/* <Marker
                      coordinates={[centroid[0] - 0.5, centroid[1] + 0.1]}
                    >
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
                    </Marker> */}
                  </React.Fragment>
                );
              })
            }
          </Geographies>
        </ComposableMap>
        { console.log(closeButton) }
        {/* <img
          src="/img/test-map.png"
          style={{marginTop: "-27px", marginLeft: "107px", width: "1278px", height: "900px" }}
          className="absolute inset-0 pointer-events-none"
      /> */}
        <img
            src="/img/boarders.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />

        {layers.rivers && (
          <img
            src="/img/rivers-new.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        {layers.roads && (
          <img
            src="/img/roads.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        {layers.labels && (
          <img
            src="/img/labels.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        {layers.agl && (
          <img
            src="/img/agl.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        {layers.airport && (
          <img
            src="/img/airport.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        {layers.checkgate && (
          <img
            src="/img/checkgate.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        {layers.helipad && (
          <img
            src="/img/helipad.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        {layers.hq && (
          <img
            src="/img/hq.png"
            style={{
              marginTop: "-27px",
              marginLeft: "107px",
              width: "1278px",
              height: "900px",
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}

        
      </div>
    </div>
    {closeButton && (
      <button
      onClick={() => {
        setMapTransform({
          x: 0,
          y: 0,
          scale: 1,
        });
    
        setSelectedDistrictGeo(null);
        setCloseButton(false);
        setSelectedDistrictProperties(null);
    
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                 group flex items-center gap-3
                 px-6 py-3
                 rounded-full
                 bg-white/90 backdrop-blur-md
                 border border-white/50
                 shadow-2xl
                 text-white-800 font-semibold
                 transition-all duration-300
                 hover:scale-105
                 hover:bg-white
                 hover:shadow-blue-300/40
                 active:scale-95"
    >
      <span
        className="flex h-9 w-9 items-center justify-center
                   rounded-full bg-blue-600 text-white
                   transition-transform duration-300
                   group-hover:-translate-x-1"
      >
        ←
      </span>
    
      <span>Back</span>
    </button>
          
        )}
    </>
  );
}

export default App2;
