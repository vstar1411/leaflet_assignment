import React, { useRef } from "react";
import { MapContainer, TileLayer, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RenderLeafletComponent = () => {
    const mapRef = useRef(null);
    const latitude = 35.6681314;
    const longitude = 139.5760623;
  
    return ( 
        <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} style={{height: "100vh", width: "100vw"}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ScaleControl imperial={false} maxWidth={200} position="bottomleft" /> {/* Scale bar */}
            {/* Additional map layers or components can be added here */}
        </MapContainer>
    );
};

export default RenderLeafletComponent;