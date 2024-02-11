
import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const CustomScaleControl = ({ position, scaleBarValue }) => {
  const map = useMap();

  useEffect(() => {
    const scaleControl = L.control({ position });

    scaleControl.onAdd = function (map) {
      const div = L.DomUtil.create("div", "custom-scale-control");
      div.innerHTML = scaleBarValue.toFixed(2);

      const scaleBarElement = document.createElement("div");
      scaleBarElement.style.display = "inline-block";
      scaleBarElement.style.height = "4px";
      scaleBarElement.style.border = "2px solid #202124";
      scaleBarElement.style.borderTop = "none";
      scaleBarElement.style.width = "100px";
      scaleBarElement.style.marginLeft = "2px"

      // Append the scale bar element to the control
      div.appendChild(scaleBarElement);
      return div;
    };

    scaleControl.addTo(map);

    return () => {
      map.removeControl(scaleControl);
    };
  }, [map, position, scaleBarValue]);

  return null;
};

const RenderLeafletComponent = () => {
  const mapRef = useRef(null);
  const [mpp, setMpp] = useState(null);
  const [scaleBarLength, setScaleBarLength] = useState(100);
  const [scaleBarValue, setScaleBarValue] = useState(null);
  const maxNativeZoom = 18;
  const latitude = 35.6681314;
  const longitude = 139.5760623;

  useEffect(() => {
    const fetchMpp = async () => {
      try {
        const response = await fetch("http://localhost:3100");
        const data = await response.json();
        setMpp(data.mpp);
      } catch (error) {
        console.error("Error fetching mpp values:", error);
      }
    };

    fetchMpp();
  }, []);

  useEffect(() => {
    if (mpp !== null && scaleBarLength !== null) {
      const scale = Math.pow(2, (maxNativeZoom - mapRef.current.getZoom()));
      console.log(scale);
      const displayMpp = mpp / scale;
      const scaleBarValue = displayMpp * scaleBarLength;
      setScaleBarValue(scaleBarValue);
    }
  }, [mpp, scaleBarLength, maxNativeZoom]);

  useEffect(() => {
    const map = mapRef.current;

    const handleZoomEnd = () => {
      const scale = Math.pow(2, (map.getMaxZoom() - map.getZoom()));
      const displayMpp = mpp / scale;
      const scaleBarValue = displayMpp * scaleBarLength;
      setScaleBarValue(scaleBarValue);
    };

    if (map) {
      map.on("zoomend", handleZoomEnd);
    }

    return () => {
      if (map) {
        map.off("zoomend", handleZoomEnd);
      }
    };
  }, [mpp, scaleBarLength, mapRef]);

  return (
    <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} style={{height: "100vh", width: "100vw"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {scaleBarValue !== null && <CustomScaleControl position="bottomleft" scaleBarValue={scaleBarValue} />}
    </MapContainer>
  );
};

export default RenderLeafletComponent;
