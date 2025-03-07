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
    // const dimensions = { width: 600, height: 800 };
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 480);
      }
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      }
    },[])

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
                time: 
                  time === 'oneHour' ? `${isMobile ? '1H' : '1 Hr'}` : 
                  time === 'threeHour' ? `${isMobile ? '3H' : '3 Hrs'}` : 
                  time === 'sixHour' ? `${isMobile ? '6H' : '6 Hrs'}` : 
                  time === 'twelveHour' ? `${isMobile ? '12H' : '12 Hrs'}` : 
                  `${isMobile ? '24H' : '24 Hrs'}`,
                sound: d._id,
                count: d.count,
              });
            });
          }
        });
        return flatData;
    }, [oneHour, threeHour, sixHour, twelveHour, twentyFourHour, isMobile]);

    // D3 rendering: redraw whenever dimensions or data change
    useEffect(() => {
        console.log("oneHour: ", oneHour);
        
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        // Clear previous rendering
        svg.selectAll("*").remove();
    
        // Set responsive margins based on dimensions
        const margin = { 
          top: isMobile ? 30 : 50, 
          right: isMobile ? 1: 0, 
          bottom: isMobile ? 20 : 50, 
          left: isMobile ?1: 150 
        };
        const width = isMobile ? 220 : 600;
        const height = 800;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
    
        // Create unique lists for time intervals and sounds
        const times = Array.from(new Set(data.map(d => d.time)));
        const sounds = Array.from(new Set(data.map(d => d.sound)));
    
        // Create scales
        const xScale = d3.scaleBand<string>()
          .domain(times)
          .range([0, innerWidth])
          .padding(0);
    
        const yScale = d3.scaleBand<string>()
          .domain(sounds)
          .range([0, innerHeight])
          .padding(0);
        
        const maxCount = d3.max(data, d => d.count) || 0;
        const colorScale = d3.scaleSequential<string>()
            .domain([0, Math.log(maxCount)])
            .interpolator(d3.interpolateBlues);
    
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
          .style("font-size", "12px")
          .style("margin-bottom", "20px")
          .style("text-color", "gray");
    
        // Add Y axis on the left
        g.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(-5, 0)`)
          .call(d3.axisLeft(yScale))
          .selectAll("text")
          .style("font-size", `${isMobile  ? '5px':'12px'}`)
          .style("text-color", "gray")
          

        g.append("text")
          .attr("x", innerWidth / 2)
          .attr("y", -margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .text("Time");
        
        // Add Y axis label rotated and centered along the left side
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -innerHeight / 2)
          .attr("y", -margin.left + 20)  // adjust 20 as needed for spacing
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .text("Sound");

        if (isMobile) {
          g.selectAll(".cell-text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "cell-text")
            .attr("x", d => (xScale(d.time) ?? 0) + xScale.bandwidth() / 2)
            .attr("y", d => (yScale(d.sound) ?? 0) + yScale.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "10px")
            .text(d => d.count)
            .style("fill", d => {
              const fillColor = colorScale(d.count);
              // Convert the fill color to HSL
              const hslColor = d3.hsl(fillColor);
              // If lightness is below 0.5, use white text; otherwise use black text.
              return hslColor.l < 0.5 ? "#fff" : "#000";
            });
        }
    }, [isMobile, data]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%'}}>
      <svg ref={svgRef} />
    </div>
  );
};

export default ResponsiveHeatmap;
