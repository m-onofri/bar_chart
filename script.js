const width = 1190;
const height = 800;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };

const canvas = d3.select(".graph")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json")
.then(({data}) => {
  
  const values = data.map(d => d[1]);
  const dates = data.map(d => d[0]);
  var tip = d3.tip()
        .attr("class", "d3-tip")
        .attr("id", "tooltip")
        .html(function(d){
          return d;
        })
        .direction("n")
        .offset([-10,0]);
  
  canvas.call(tip);
  
  const y = d3.scaleLinear()
              .domain([0, d3.max(values)])
              .range([height - margin.bottom, margin.top]);
  
 const yAxis = d3.axisLeft(y);

  canvas.append("g")
        .attr('id', 'y-axis')
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);
  
  canvas.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('class', 'y-info')
        .attr('x', - height / 2)
        .attr('y', 40)
        .text('GROSS DOMESTIC PRODUCT');
  
  const x = d3.scaleTime()
              .domain([new Date(d3.min(dates)), new Date(d3.max(dates))])
              .range([margin.left, width - margin.right])
  
  const xAxis = d3.axisBottom(x);
  
  canvas.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - 100})`)
        .call(xAxis);
  
  canvas.append('text')
        .attr('class', 'x-info')
        .attr('x', width/2)
        .attr('y', height - 45)
        .text('YEAR');
 
  const barWidth = (width - data.length - margin.right - margin.left) / data.length;
  
 canvas.selectAll("rect")
    .data(data)
    .enter().append("rect")
     .attr('x', function(d, i) {
      return x(new Date(d[0]));
    })
    .attr("y", (d, i) => y(d[1]))
    .attr("width", (width - data.length) / data.length )
    .attr("height", (d, i) => height - margin.bottom - y(d[1]))
    .attr("data-date", (d, i) => d[0])
    .attr("data-gdp", (d, i) => d[1])
    .attr("fill", "navy")
    .attr("class", "bar")
    .on("mouseover", function(d) {
      let html = d[0] + '<br>' + '$ ' + d[1] + ' Billion';
      tip.attr('data-date', d[0]);
      tip.show(html, this);
    })
    .on('mouseout', tip.hide);
})