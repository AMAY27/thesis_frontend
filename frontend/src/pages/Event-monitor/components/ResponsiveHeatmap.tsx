import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { SoundCount, EventsMonitorData } from '../types';

interface HeatmapData {
    time: string;
    sound: string;
    count: number;
  }

const ResponsiveHeatmap:React.FC<EventsMonitorData> = ({ oneHour, threeHour, sixHour, twelveHour, twentyFourHour }) => {
    
    const containerRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 800 });

  // Listen for container size changes
    // useEffect(() => {
    //     console.log(oneHour);
    //     const container = containerRef.current;
    //     if (!container) return;
    //     const observer = new ResizeObserver(entries => {
    //       for (let entry of entries) {
    //         if (entry.target === container) {
    //           setDimensions({
    //             width: entry.contentRect.width,
    //             height: entry.contentRect.height,
    //           });
    //         }
    //       }
    //     });
    //     observer.observe(container);
    //     return () => observer.disconnect();
    // }, []);

    // Transform the rawData into a flat array: { time, sound, count }
    const data: HeatmapData[] = useMemo(() => {
        const rawData: Partial<EventsMonitorData> = { oneHour, threeHour, sixHour, twelveHour, twentyFourHour };
        const timeIntervals = Object.keys(rawData) as (keyof EventsMonitorData)[];
        const flatData: HeatmapData[] = [];
        timeIntervals.forEach(time => {
          const counts = rawData[time];
          if (counts) {
            counts.forEach((d: SoundCount) => {
              flatData.push({
                time: time === 'oneHour' ? "1 Hr" : time === 'threeHour' ? "3 Hrs" : time === 'sixHour' ? "6 Hrs" : time === 'twelveHour' ? "12 Hrs" : "24 Hrs",
                sound: d._id,
                count: d.count,
              });
            });
          }
        });
        return flatData;
    }, [oneHour, threeHour, sixHour, twelveHour, twentyFourHour]);

    // D3 rendering: redraw whenever dimensions or data change
    useEffect(() => {
        console.log("oneHour: ", oneHour);
        
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        // Clear previous rendering
        svg.selectAll("*").remove();
    
        // Set responsive margins based on dimensions
        const margin = { top: 50, right: 30, bottom: 50, left: 100 };
        const width = dimensions.width;
        const height = dimensions.height;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
    
        // Create unique lists for time intervals and sounds
        const times = Array.from(new Set(data.map(d => d.time)));
        const sounds = Array.from(new Set(data.map(d => d.sound)));
    
        // Create scales
        const xScale = d3.scaleBand<string>()
          .domain(times)
          .range([0, innerWidth])
          .padding(0.05);
    
        const yScale = d3.scaleBand<string>()
          .domain(sounds)
          .range([0, innerHeight])
          .padding(0.05);
    
        const maxCount = d3.max(data, d => d.count) || 0;
        const colorScale = d3.scaleQuantize<string>()
            .domain([0, maxCount])
            .range(["#E8EAEE", "#A1DEE9", "#0C4D58", "#166876", "#02252C"]);
    
        // Create a group container for the chart and apply margins
        const g = svg
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // Draw heatmap cells
        g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "cell")
          .attr("x", d => xScale(d.time) || 0)
          .attr("y", d => yScale(d.sound) || 0)
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .style("fill", d => colorScale(d.count))
          .append("title")
          .text(d => `${d.sound} (${d.time}): ${d.count}`);
    
        // Add X axis at the top
        g.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(0, -5)`)
          .call(d3.axisTop(xScale))
          .selectAll("text")
          .style("font-size", "16px");
    
        // Add Y axis on the left
        g.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(-5, 0)`)
          .call(d3.axisLeft(yScale))
          .selectAll("text")
          .style("font-size", "18px");
    }, [dimensions, data]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} />
    </div>
  );
};

export default ResponsiveHeatmap;
