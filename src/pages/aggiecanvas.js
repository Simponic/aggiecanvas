import { useEffect, useState } from "react";
import axios from "axios";
import { CanvasComponent } from "@/components/canvasComponent";
import { ColorBar } from "@/components/colorBar";
import "bootstrap/dist/css/bootstrap.css";
import CheckboxArray from "@/components/checkboxArray";

export default function Canvas() {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    axios.get("/api/grid-snapshot").then((gridResponse) => {
      let snapshot = gridResponse.data.snapshot;
      let editingGrid = snapshot.grid;

      axios
        .get("/api/latest-updates", {
          params: { "last-update": snapshot.lastUpdate },
        })
        .then((updatesResponse) => {
          for (let u of updatesResponse.data.updates) {
            editingGrid[u.row][u.column] = u.color;
          }
          window.grid = editingGrid;
          setGrid(editingGrid);
        });
    });
  }, []);

  useEffect(() => {
    window.lastUpdate = "2030-01-01 00:00:00";
    setInterval(() => {
      axios
        .get("/api/latest-updates", {
          params: { "last-update": window.lastUpdate },
        })
        .then((updatesResponse) => {
          window.lastUpdate = updatesResponse.data.lastUpdate;
          for (let u of updatesResponse.data.updates) {
            console.log(u);
            window.grid[u.row][u.column] = u.color;
          }
          setGrid(window.grid);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 2000);
  }, []);

  return (
    <>
      {/* <CanvasComponent /> */}
      <CheckboxArray grid={grid} />
      <ColorBar />
    </>
  );
}
