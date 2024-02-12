import { useEffect } from "react";
import L from "leaflet";

const CustomScaleControl = ({ position, scaleBarValue, map }) => {
  useEffect(() => {
    const scaleControl = L.control({ position });

    scaleControl.onAdd = function () {
      const div = L.DomUtil.create("div", "custom-scale-control");
      div.innerHTML = scaleBarValue.toFixed(2);

      const scaleBarElement = document.createElement("div");
      scaleBarElement.style.display = "inline-block";
      scaleBarElement.style.height = "4px";
      scaleBarElement.style.border = "2px solid #202124";
      scaleBarElement.style.borderTop = "none";
      scaleBarElement.style.width = "100px";
      scaleBarElement.style.marginLeft = "2px";

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

export default CustomScaleControl;
  