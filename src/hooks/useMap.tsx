import { useEffect, useState } from "react";
import { Map, View } from "ol";
import { fromLonLat, Projection } from "ol/proj";
import { getIgnTileLayer } from "../map/ignTileLayer";
import { zoomController, positionCurseurController } from "../map/controllers";
import { Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";

const useMap = (target: string, center: [number, number], zoom: number) => {
  const [view, setView] = useState<View | undefined>(undefined);

  const ignTileLayer = getIgnTileLayer();

  const initialView = new View({
    zoom,
    center: fromLonLat(center),
  });

  useEffect(() => {
    const map = new Map({
      target,
      layers: [ignTileLayer],
      view: initialView,
      controls: [zoomController, positionCurseurController],
    });
    setView(initialView);

    return () => map.setTarget(undefined);
  }, []);

  const setNewCenterAndNewZoom = (
    coordinates: [number, number],
    zoom: number
  ) => {
    view?.setCenter(fromLonLat(coordinates));
    view?.setZoom(zoom);
  };

  const fitViewToPolygon = (coordinates: Coordinate[][]) => {
    const epsg4326 = new Projection({ code: "EPSG:4326" });
    const epsg3857 = new Projection({ code: "EPSG:3857" });
    const polygon = new Polygon(coordinates).transform(
      epsg4326,
      epsg3857
    ) as Polygon;

    view?.fit(polygon);
  };

  return { setNewCenterAndNewZoom, fitViewToPolygon };
};

export default useMap;
