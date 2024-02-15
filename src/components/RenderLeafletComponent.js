
import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { drawLineBetweenPoints } from "../utils/PointsOnMap"
import CustomScaleControl from "./customComponents/CustomScaleControl"
const RenderLeafletComponent = () => {
  const mapRef = useRef(null);
  const [mpp, setMpp] = useState(null);
  const [scaleBarLength, setScaleBarLength] = useState(100);
  const [scaleBarValue, setScaleBarValue] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const maxNativeZoom = 18;
  const latitude = 35.6681314;
  const longitude = 139.5760623;

  const pinIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });

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
      const scale = 1/(Math.pow(2, (maxNativeZoom - mapRef.current.getZoom())));
      const displayMpp = mpp / scale;
      const scaleBarValue = displayMpp * scaleBarLength;
      setScaleBarValue(scaleBarValue);
    }
  }, [mpp, scaleBarLength, maxNativeZoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleZoomEnd = () => {
      const scale = 1/(Math.pow(2, (maxNativeZoom - mapRef.current.getZoom())));
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
      <MapEventsHandler
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
        startPoint={startPoint}
        endPoint={endPoint}
        mapRef={mapRef}
        mpp = {mpp}
        maxZoom = {maxNativeZoom}
      />
      {startPoint && <Marker position={startPoint} icon={pinIcon} />}
      {endPoint && <Marker position={endPoint} icon={pinIcon} />}
      {scaleBarValue !== null && <CustomScaleControl position="bottomright" scaleBarValue={scaleBarValue} map={mapRef.current}/>}
    </MapContainer>
  );
};

const MapEventsHandler = ({ setStartPoint, setEndPoint, startPoint, endPoint, mapRef, mpp, maxZoom }) => {
    useMapEvents({
      click: (event) => {
        // Check if Shift key is pressed
        if (!event.originalEvent.shiftKey) return;
  
        const clickedPoint = event.latlng;
        const zoom = mapRef.current.getZoom();
        // If startPoint is not set, set it to the clicked point
        // Otherwise, set endPoint and draw a line between startPoint and endPoint
        if (!startPoint) {
          setStartPoint(clickedPoint);
          setEndPoint(null); // Reset endPoint when a new startPoint is set
        } else {
          setEndPoint(clickedPoint);
          drawLineBetweenPoints(mapRef.current, startPoint, clickedPoint, mpp, zoom, maxZoom );
          setStartPoint(null);
          setEndPoint(null);
        }
      }
    });
  
    return null; 
  };

export default RenderLeafletComponent;
