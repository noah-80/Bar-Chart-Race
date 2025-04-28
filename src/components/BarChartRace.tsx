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
  { name: "(+2) Salpicon", value: 7834.0 },
  { name: "(+3) Perro 1-10 Tacos", value: 6809.13 },
  { name: "(-2) Aloha Fridays", value: 5775.88 },
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
    "Perro 1-10 Tacos": "#73524d", // No prefix here
  };

  const imageMapping: { [key: string]: string } = {
    "8e8 Thai Street Food": "image1.png",
    "Aloha Fridays": "image2.png",
    "Dina’s Dumpling": "image5.png",
    "Salpicon": "image11.png",
    "Smile Hotdog": "image12.png",
    "Perro 1-10 Tacos": "image9.png", // No prefix here
  };

  // Helper function to strip prefixes
  const stripPrefix = (name: string) => name.replace(/^\(\+?\d+\)\s|\(-\d+\)\s/, "");

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 300;
    const margin = { top: 50, right: 120, bottom: 50, left: 150 }; // Adjusted right margin for larger images
    const cornerRadius = 5; // Radius for top-right and bottom-right corners

    svg.attr("viewBox", `0 0 ${width} ${height}`); // Extend the height of the viewBox

    const xScale = d3
      .scaleLinear()
      .domain([0, 10000])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(currentData.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
      return `$${d / 1000}k`;
    });

    svg.select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis as any)
      .selectAll("text")
      .html(function () {
        const text = d3.select(this).text();
        return `<tspan style="font-family: Arial;">$</tspan>${text.slice(1)}`; // Replace the dollar sign with Arial
      })
      .style("font-family", "Almanach Test") // Use Almanach Test for the rest of the text
      .style("font-size", "12px");

    // Add X-axis title
    svg.select(".x-axis-title").remove(); // Remove any existing title to avoid duplicates
    svg.append("text")
      .attr("class", "x-axis-title")
      .attr("x", width / 2) // Center horizontally
      .attr("y", height - margin.bottom + 40) // Add more space above the title
      .attr("text-anchor", "middle") // Center the text
      .style("font-size", "12px")
      .style("font-family", "Almanach Test") // Use Almanach Test for the rest of the text
      .html(`Average <tspan style="font-family: Arial;">$</tspan>/Visit`); // Use Arial for the dollar sign

    const yAxis = d3.axisLeft(yScale).tickSize(0).tickFormat(() => ""); // Remove tick labels

    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis as any);

    // Bind data to bars
    const bars = svg.selectAll(".bar").data(currentData, (d: any) => stripPrefix(d.name));

    bars
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("d", (d) => {
        const x = margin.left;
        const y = yScale(d.name)! + 4; // Add padding to the top
        const barWidth = xScale(d.value) - margin.left;
        const barHeight = yScale.bandwidth() - 8; // Reduce height by 4 (2px padding on top and bottom)

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
      .attr("fill", (d) => colorMapping[stripPrefix(d.name)]);

    bars
      .transition()
      .duration(1000)
      .attr("d", (d) => {
        const x = margin.left;
        const y = yScale(d.name)! + 4; // Add padding to the top
        const barWidth = xScale(d.value) - margin.left;
        const barHeight = yScale.bandwidth() - 8; // Reduce height by 4 (2px padding on top and bottom)

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
    const salesLabels = svg.selectAll(".sales-label").data(currentData, (d: any) => stripPrefix(d.name));

    salesLabels
      .enter()
      .append("text")
      .attr("class", "sales-label")
      .attr("x", (d) => xScale(d.value) - 5)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-family", "Almanach Test") // Default font for the numeric part
      .each(function (d) {
        const textElement = d3.select(this);

        // Clear any existing tspans to avoid duplication
        textElement.selectAll("tspan").remove();

        // Add a tspan for the dollar sign
        textElement
          .append("tspan")
          .text("$")
          .style("font-family", "Arial"); // Use Arial for the dollar sign

        // Add a tspan for the numeric value
        textElement
          .append("tspan")
          .text(d.value.toFixed(2))
          .style("font-family", "Almanach Test"); // Use Almanach Test for the numeric value
      });

    salesLabels
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) - 5)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .each(function (d) {
        const textElement = d3.select(this);

        // Clear any existing tspans to avoid duplication
        textElement.selectAll("tspan").remove();

        // Add a tspan for the dollar sign
        textElement
          .append("tspan")
          .text("$")
          .style("font-family", "Arial"); // Use Arial for the dollar sign

        // Add a tspan for the numeric value
        textElement
          .append("tspan")
          .text(d.value.toFixed(2))
          .style("font-family", "Almanach Test"); // Use Almanach Test for the numeric value
      });

    salesLabels.exit().remove();

    // Bind data to images
    const images = svg.selectAll(".bar-image").data(currentData, (d: any) => stripPrefix(d.name));

    images
      .enter()
      .append("image")
      .attr("class", "bar-image")
      .attr("x", (d) => xScale(d.value) + 10)
      .attr("y", (d) => yScale(d.name)! + (yScale.bandwidth() - yScale.bandwidth() * 1.5) / 2)
      .attr("width", yScale.bandwidth() * 1.5)
      .attr("height", yScale.bandwidth() * 1.5)
      .attr("href", (d) => imageMapping[stripPrefix(d.name)]);

    images
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) + 10)
      .attr("y", (d) => yScale(d.name)! + (yScale.bandwidth() - yScale.bandwidth() * 1.5) / 2)
      .attr("width", yScale.bandwidth() * 1.5)
      .attr("height", yScale.bandwidth() * 1.5);

    images.exit().remove();

    // Bind data to names
    const names = svg.selectAll("text.name").data(currentData, (d: any) => d.name); // Use full name with prefix

    names
      .enter()
      .append("text")
      .attr("class", "name")
      .attr("x", margin.left - 10) // Position slightly to the left of the bars
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em") // Center vertically
      .attr("text-anchor", "end") // Align text to the end
      .attr("fill", "black")
      .html((d) => {
        if (d.name.includes("(+2)") || d.name.includes("(-2)") || d.name.includes("(+3)")) {
          const [prefix, rest] = d.name.split(") ");
          return `<tspan style="fill: ${prefix.includes("+") ? "#3CB371" : "#FF0000"};">${prefix})</tspan> ${rest}`;
        }
        return d.name; // Display the full name if no prefix is present
      })
      .style("font-size", "12px")
      .style("font-family", "Almanach Test");

    names
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2);

    names.exit().remove();

    // Update the chart title
    svg.select(".chart-title")
      .attr("x", width / 2)
      .attr("y", margin.top / 2) // Add 20px to create a gap below the title
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "Almanach Test")
      .html(() => {
        const [titleText, yearText] = title.split("\n"); // Split the title into two lines
        return `<tspan x="${width / 2}" dy="0">${titleText}</tspan>
                <tspan x="${width / 2}" dy="1.2em">${yearText}</tspan>`; // Add the year on a new line
      });
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