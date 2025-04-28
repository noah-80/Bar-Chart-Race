import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./index.css"; // Import custom styles for the font

interface DataPoint {
  name: string;
  value: number;
}

const data2022: DataPoint[] = [
  { name: "8e8 Thai Street Food", value: 9795.11 },
  { name: "Aloha Fridays", value: 8020.68 },
  { name: "Dina’s Dumpling", value: 6822.06 },
  { name: "Salpicon", value: 6431.97 },
  { name: "Smile Hotdog", value: 5942.47 },
];

const data2023: DataPoint[] = [
  { name: "8e8 Thai Street Food", value: 8000.17 },
  { name: "Salpicon", value: 7834.0 },
  { name: "Perro 1-10 Tacos", value: 6809.13 },
  { name: "Aloha Fridays", value: 5775.88 },
  { name: "Smile Hotdog", value: 4914.29 },
];

const BarChartRace: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentData, setCurrentData] = useState<DataPoint[]>(data2022);
  const [title, setTitle] = useState("Top 5 Food Trucks\n2022-2023");

  // Define color mapping for each food truck
  const colorMapping: { [key: string]: string } = {
    "8e8 Thai Street Food": "#D59616",
    "Aloha Fridays": "#c75168",
    "Dina’s Dumpling": "#f287b7",
    "Salpicon": "#a6b83a",
    "Smile Hotdog": "#f26324",
    "Perro 1-10 Tacos": "#73524d",
  };

  // Define image mapping for each food truck
  const imageMapping: { [key: string]: string } = {
    "8e8 Thai Street Food": "image1.png",
    "Aloha Fridays": "image2.png",
    "Dina’s Dumpling": "image5.png",
    "Perro 1-10 Tacos": "image9.png",
    "Salpicon": "image11.png",
    "Smile Hotdog": "image12.png",
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 300;
    const margin = { top: 50, right: 120, bottom: 50, left: 150 }; // Adjusted right margin for larger images
    const cornerRadius = 5; // Radius for top-right and bottom-right corners

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const xScale = d3
      .scaleLinear()
      .domain([0, 10000])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(currentData.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => `$${d / 1000}k`);
    const yAxis = d3.axisLeft(yScale).tickSize(0); // Remove default ticks

    svg.select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis as any);

    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis as any);

    // Bind data to bars
    const bars = svg.selectAll(".bar").data(currentData, (d: any) => d.name);

    bars
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("d", (d) => {
        const x = margin.left;
        const y = yScale(d.name)!;
        const barWidth = xScale(d.value) - margin.left;
        const barHeight = yScale.bandwidth();

        // Create a path for a rectangle with rounded top-right and bottom-right corners
        return `
          M${x},${y} 
          h${barWidth - cornerRadius} 
          a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius} 
          v${barHeight - 2 * cornerRadius} 
          a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},${cornerRadius} 
          h-${barWidth - cornerRadius} 
          z
        `;
      })
      .attr("fill", (d) => colorMapping[d.name]); // Apply color based on the food truck name

    bars
      .transition()
      .duration(1000)
      .attr("d", (d) => {
        const x = margin.left;
        const y = yScale(d.name)!;
        const barWidth = xScale(d.value) - margin.left;
        const barHeight = yScale.bandwidth();

        return `
          M${x},${y} 
          h${barWidth - cornerRadius} 
          a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius} 
          v${barHeight - 2 * cornerRadius} 
          a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},${cornerRadius} 
          h-${barWidth - cornerRadius} 
          z
        `;
      });

    bars.exit().remove();

    // Add sales data inside each bar
    const salesLabels = svg.selectAll(".sales-label").data(currentData, (d: any) => d.name);

    salesLabels
      .enter()
      .append("text")
      .attr("class", "sales-label")
      .attr("x", (d) => xScale(d.value) - 5) // Position slightly to the left of the bar's right edge
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em") // Center vertically
      .attr("text-anchor", "end") // Align text to the right
      .attr("fill", "white") // Ensure visibility inside the bar
      .text((d) => `$${d.value.toFixed(2)}`) // Format the value
      .style("font-size", "12px")
      .style("font-family", "Almanach Test");

    salesLabels
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) - 5)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .text((d) => `$${d.value.toFixed(2)}`);

    salesLabels.exit().remove();

    // Add images to the right of each bar
    const images = svg.selectAll(".bar-image").data(currentData, (d: any) => d.name);

    images
      .enter()
      .append("image")
      .attr("class", "bar-image")
      .attr("x", (d) => xScale(d.value) + 10) // Position slightly to the right of the bar
      .attr("y", (d) => yScale(d.name)!)
      .attr("width", yScale.bandwidth() * 1.5) // Make images slightly larger
      .attr("height", yScale.bandwidth() * 1.5) // Make images slightly larger
      .attr("href", (d) => imageMapping[d.name]); // Set the image source

    images
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) + 10)
      .attr("y", (d) => yScale(d.name)!)
      .attr("width", yScale.bandwidth() * 1.5)
      .attr("height", yScale.bandwidth() * 1.5)
      .attr("href", (d) => imageMapping[d.name]);

    images.exit().remove();

    // Update the chart title
    svg.select(".chart-title")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-family", "Almanach Test")
      .text(title);
  }, [currentData, title]);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollY > windowHeight / 2) {
      setCurrentData(data2023);
      setTitle("Top 5 Food Trucks\n2023-2024");
    } else {
      setCurrentData(data2022);
      setTitle("Top 5 Food Trucks\n2022-2023");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "400px", background: "white", zIndex: 10 }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}>
        <g className="x-axis" />
        <g className="y-axis" />
        <text className="chart-title" />
      </svg>
    </div>
  );
};

export default BarChartRace;