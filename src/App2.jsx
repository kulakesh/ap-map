import React, { useState } from "react";
import { useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

// const GEO_URL = "/arunachal_districts.geojson";
const GEO_URL = "export4.geojson";
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
const map_layers = {
  rivers: 
  {
    name: "RIVERS",
    src: "img/rivers.png",
    show: false,
    visible_on_legend: true,
  },
  roads: 
  {
    name: "ROADS",
    src: "img/roads.png",
    show: false,
    visible_on_legend: true,
  },
  frontier: 
  {
    name: "FRONTIER ROADS",
    src: "img/frontier.png",
    show: false,
    visible_on_legend: true,
  },
  places: 
  {
    name: "PLACES",
    src: "img/places.png",
    show: true,
    visible_on_legend: true,
  },
  agl: 
  {
    name: "ADVANCE LANDING GROUND (ALG)",
    src: "img/alg.png",
    show: false,
  },
  airport: 
  {
    name: "AIRPORTS",
    src: "img/airport.png",
    show: true,
    visible_on_legend: true,
  },
  checkgate: 
  {
    name: "CHECKGATES",
    src: "img/checkgate.png",
    show: true,
    visible_on_legend: true,
  },
  helipad: 
  {
    name: "HELIPADS",
    src: "img/helipad.png",
    show: true,
    visible_on_legend: true,
  },
  hq: 
  {
    name: "DISTRICT HQ.",
    src: "img/hq.png",
    show: true,
    visible_on_legend: true,
  },
  boarders:
  {
    name: "",
    src: "img/boarders.png",
    show: true,
    visible_on_legend: false,
  },
};

function App2() {
  const [closeButton, setCloseButton] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mapLayers, setMapLayers] = useState(map_layers);

  const [mapTransform, setMapTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    const preloadImages = async () => {
      const images = Object.values(map_layers)
        .map((layer) => layer.src)
        .filter(Boolean);
  
      let loaded = 0;
  
      const loadImage = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
  
          img.onload = () => {
            loaded++;
  
            setProgress(
              Math.round((loaded / images.length) * 100)
            );
  
            resolve();
          };
  
          img.onerror = () => {
            console.error("Failed to preload:", src);
  
            loaded++;
  
            setProgress(
              Math.round((loaded / images.length) * 100)
            );
  
            resolve();
          };
  
          img.src = src;
        });
      };
  
      await Promise.all(images.map(loadImage));
  
      setProgress(100);
  
      // Small delay so the user sees 100%
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };
  
    preloadImages();
  }, []);

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

      setCloseButton(true);
    };

    const toggleLayer = (key) => {
      setMapLayers((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          show: !prev[key].show,
        },
      }));
    };
  
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="w-96 rounded-2xl bg-white p-8 shadow-2xl border text-center">
  
          <div className="mb-6">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
  
          <h2 className="text-xl font-bold">
            Loading GIS Layers
          </h2>
  
          <p className="mt-2 text-gray-500">
            Preparing map...
          </p>
  
          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
  
          <p className="mt-3 text-sm font-semibold text-gray-600">
            {progress}%
          </p>
  
        </div>
      </div>
    );
  }

  return (
    <> 
    {/* Buttons */}
    <div
  className={`fixed left-4 top-4 z-50 bg-white rounded-xl shadow-xl border transition-all duration-300 ${
    legendCollapsed ? "w-14" : "w-52"
  }`}
>
  <div className="flex items-center justify-between bg-blue-700 text-white p-3 rounded-t-xl">
    {!legendCollapsed && (
      <span className="font-semibold">Legend</span>
    )}

    <button
      onClick={() => setLegendCollapsed((prev) => !prev)}
      className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg hover:bg-blue-800 transition"
      title={legendCollapsed ? "Expand" : "Collapse"}
    >
      {legendCollapsed ? "▶" : "◀"}
    </button>
  </div>

  {!legendCollapsed && (
    <>
      {Object.entries(mapLayers)
      .filter(([_, layer]) => layer.visible_on_legend)
      .map(([key, layer]) => (
        <button
          key={key}
          onClick={() => toggleLayer(key)}
          className={`w-full flex items-center justify-between px-4 py-3 border-b ${
            layer.show ? "bg-green-50" : "bg-white"
          }`}
        >
          <span>{layer.name}</span>
          <span>{layer.show ? "👁️" : " "}</span>
        </button>
      ))}
    </>
  )}
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
          <Geographies geography={`${import.meta.env.BASE_URL}${GEO_URL}`}>
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
                  </React.Fragment>
                );
              })
            }
          </Geographies>
        </ComposableMap>
        
        
        {Object.entries(mapLayers).map(([key, layer]) => {
          if (!layer.show) return null;

          return (
            <LayerImage key={key} src={layer.src} />
          );
        })}
        
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
    
        setCloseButton(false);
    
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
const LayerImage = ({ src }) => (
  <img
  src={`${import.meta.env.BASE_URL}${src}`}
    style={{
      marginTop: "-27px",
      marginLeft: "107px",
      width: "1278px",
      height: "900px",
    }}
    className="absolute inset-0 pointer-events-none"
  />
);
export default App2;
