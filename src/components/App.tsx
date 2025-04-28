import React from "react";
import BarChartRace from "./BarChartRace";

const App: React.FC = () => {
  return (
    <div>
      <BarChartRace />
      <div style={{ height: "200vh", padding: "20px" }}>
        <h1>Scroll to see the bar chart transition!</h1>
      </div>
    </div>
  );
};

export default App;