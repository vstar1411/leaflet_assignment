import L from "leaflet";
export const drawLineBetweenPoints = (map, startPoint, endPoint, mpp,  zoom, maxZoom ) => {

    if (!startPoint || !endPoint) return;
  
    // Remove existing polyline if any
    if (map.currentPolyline) {
      map.removeLayer(map.currentPolyline);
    }
  
    // Create a polyline between startPoint and endPoint
    const polyline = L.polyline([startPoint, endPoint], { color: 'red' }).addTo(map);
    map.currentPolyline = polyline;

    const distance = calculateDistance(startPoint, endPoint, zoom, maxZoom, mpp);

    // Add distance to Tooltip
    polyline.bindTooltip(`Distance: ${distance.toFixed(4)}`).openTooltip();
  };

  export const calculateDistance = (startPoint, endPoint, zoom, maxNativeZoom, mpp) => {
    // Calculate scale
    const scale = 1/(Math.pow(2, (maxNativeZoom - zoom)));

    // Apply scale to coordinates
    const start_x = startPoint.lat * scale;
    const start_y = startPoint.lng * scale;
    const end_x = endPoint.lat * scale;
    const end_y = endPoint.lng * scale;
  
    // Calculate distance
    const distance = Math.sqrt((start_x - end_x) ** 2 + (start_y - end_y) ** 2) * mpp;

  
    return distance;
  };