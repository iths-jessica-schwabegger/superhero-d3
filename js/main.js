const svg = d3.select(".container").append("svg");
const width = 800;
const height = 600;
const margin = 100;
const barHeight = 20;

//ger width och height på container
svg
    .attr("width", width)
    .attr("height", height);

//skapar en tabell i en grupp och appendar på container(svg)
const chart = svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${margin}, ${margin})`);

//Skapar grupp för axlar och appendar på chart/tabell
const axesGroup = chart.append("g")
    .attr("class", "axes")

//Skapar grupp för left-axis och appendar i axesgrupp
const leftAxGroup = axesGroup.append("g")
    .attr("class", "left-ax")

//Skapar grupp för bottom-axis och appendar i axesgrupp
const bottomAxGroup = axesGroup.append("g")
    .attr("class", "bottom-ax")
    .attr("transform", `translate(0, ${height - margin *2})`)