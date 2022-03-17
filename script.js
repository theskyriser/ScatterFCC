const loadGraph = () => {
    d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then((data) => {
        
        const w = 1000
        const h = 750
        const padding = 60
        const xParseTime = d3.timeParse("%Y");
        const yParseTime = d3.timeParse("%M:%S")
        let dates = [];
        data.forEach(date => {
            dates.push(xParseTime(date['Year']))
        })
        const xDomain = d3.extent(dates)
        dates = [];
        data.forEach(date => {
         dates.push(yParseTime(date['Time']))
       })
       dates.forEach(date => {
        date.setYear(2022)
       })

       const tooltip = d3.select("body")
       .append("div")
       .attr("id", "tooltip")
       .style('opacity', 0)

       
        const yDomain = d3.extent(dates)

        
        //Scales

        const xScale = d3.scaleTime().domain(xDomain).nice().range([padding, w - padding])
        const yScale = d3.scaleTime().domain(yDomain).nice().range([h - padding, padding])

        const xAxis = d3.axisBottom(xScale)
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))
        
        const svg = d3.select(".container")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

        svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + " )")
        .attr("id", "x-axis")
        .call(xAxis)

        svg.append("g")
        .attr("transform", "translate(" + (padding) + ",0)")
        .attr("id", "y-axis")
        .call(yAxis)

        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(xParseTime(d['Year'])))
        .attr("cy", (d) => yScale(yParseTime(d['Time']).setYear(2022)))
        .attr("r", 5)
        .attr("class", "dot")
        .attr("fill", "black")
        .attr("t", (d) => d['Time'])
        .attr("data-xvalue", function(d) {
            return xParseTime(d['Year']).toISOString()
        })
        .attr("data-yvalue", function(d) {
            return yParseTime(d['Time']).toISOString()
        })
        .attr("fill", (d) => {
            if (d['Doping'] !== "") {
                return "Red"
            } else {
                return "Blue"
            }
        })
        .on("mouseover", (event, d) => {
            tooltip
            .attr("data-year", xParseTime(d['Year']).toISOString())
            .style('opacity', 0.9)
            .html(
                "Name: " + d['Name'] + "<br> Time: " + d['Time'] + "<br> Year: " + d['Year'] + "<br> Doping: " + d['Doping']
            )
            .style("top", `${event.pageY - 20}px`)
            .style("left", `${event.pageX + 20}px`)
        })
        .on("mouseout", function(event, d) {
            tooltip
              .style("opacity", 0);
          });

          svg.append("text")      // text label for the x axis
          .attr("x", w / 2)
          .attr("y", h - 30)
          .style("text-anchor", "middle")
          .text("Date");
        
          svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", padding - 45)
                .attr("x", 0 - (h / 2))
                .style("text-anchor", "middle")
                .text("Time in Minutes:Seconds");

          console.log(yParseTime(data[0]['Time']).toISOString())

    })



    .catch((e) => console.log(e))
}

document.addEventListener("DOMContentLoaded", loadGraph())





