const container = d3.select(".container").append("svg");
const width = 800;
const height = 600;
const margin = 100;
const barHeight = 25;

const chartWidth = width - margin * 2
const chartHeight = height - margin * 2

const imgWrapper = d3.select(".img-wrapper").append("svg");
const imgWrapperWidth = 800;
const imgWrapperHeight = 200;

//Ger width och height
imgWrapper
    .attr("width", imgWrapperWidth)
    .attr("height", imgWrapperHeight);



//ger width och height på container
container
    .attr("width", width)
    .attr("height", height);

//skapar en tabell i en grupp och appendar på container(svg)
const chart = container.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${margin}, ${margin})`);

//Skapar grupp för axlar och appendar på chart/tabell
const axesGroup = chart.append("g")
    .attr("class", "axes");

//Skapar grupp för left-axis och appendar i axesgrupp
const leftAxGroup = axesGroup.append("g")
    .attr("class", "left-ax");

//Skapar grupp för bottom-axis och appendar i axesgrupp
const bottomAxGroup = axesGroup.append("g")
    .attr("class", "bottom-ax")
    .attr("transform", `translate(0, ${height - margin *2})`);


const gridLinesGroup = axesGroup.append("g")
    .attr("class", "grid-lines")

const verticalGridLinesGroup = gridLinesGroup.append("g")
    .attr("class", "vertical-lines")
    .attr("transform", `translate(0,${chartHeight})`)


    //tar bort keys i obj som ej ska visas i grafen
function removeKeys(obj, keys) {
    for (let key of keys) {
        delete obj[key];
    }
    return obj;
}


//funktion som skapar en array som innehåller objekt med nya keys.
function createNewDataArray(data) {
    let arr = [];

    Object.entries(data).forEach((entry) => {
        arr.push({property: entry[0], value: entry[1]})
    })
    console.log(arr);
    return arr;
}



//rendera data
async function renderStats(superheroId) {

    let superHeroData = await d3.json(`https://www.superheroapi.com/api.php/10158949248976982/${superheroId}`);
    console.log(superHeroData);

    //sparar namn på hero till senare
    //const superHeroName = superHeroData.name;

    //Lägger in data på y
    let y = d3.scaleBand()
        .domain(Object.keys(removeKeys(superHeroData.powerstats, ["name", "id", "response"])))
        .range([0, height - margin *2])

    let leftAx = d3.axisLeft(y);
    leftAx(leftAxGroup);


    //lägger in data på x
    let x = d3.scaleLinear()
        .domain([0, 150])
        .range([0, width - margin *2]);

    
    let bottomAx = d3.axisBottom(x);
    bottomAx(bottomAxGroup);


    //grid lines
    let verticalGridLines = d3.axisTop(x)
        .tickSize(chartHeight)
        .ticks(10)
        .tickSizeOuter(0)
        .tickFormat(()=>"")

    verticalGridLinesGroup
        .call(verticalGridLines)
    gridLinesGroup.selectAll(".tick line")
        .attr("stroke","lightgrey")


    // container.append('text')
    //     .attr('x', chartWidth / 2 + margin)
    //     .attr('y', 40)
    //     .attr('text-anchor', 'middle')
    //     .text(superHeroData.name)


    //skapar ny array med objekt med nya keys
    const superHeroStatsArr = createNewDataArray(superHeroData.powerstats);
    
    //Väljer alla rect, skickar in data
    const bars = chart.selectAll("rect").data(superHeroStatsArr);
    const t = d3.transition().duration(2000).delay(500);

    bars 
        .transition().duration(2000)
        .attr("width", value => x(value.value))

        

    //skapar rect
    bars
        .enter()
        .append("rect")
        .attr("y", prop => y(prop.property) + barHeight)
        .attr("width", 0)
        .attr("height", barHeight)
        .attr("fill", "lightgrey")
        .on("mouseenter", function (actual) {
            
            d3.select(this)
                .attr("opacity", 0.5)
                .transition()
                .duration(300)

            
            const a = x(actual.value)

            //skapar linje vid hover
            chart.append('line')
                .attr("class", "line")
                .attr('x1', a)
                .attr('y1', chartHeight)
                .attr('x2', a)
                .attr('stroke', 'red')
        })
        .on('mouseleave', function () {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('opacity', 1)

            chart.selectAll('.line').remove()
  
          })
    .transition(t)
        .attr("width", value => x(value.value))
        .attr("fill", "#35659b")


    console.log(superHeroData.image.url);

}

renderStats("348");

document.querySelector(".dropdown").addEventListener("change", (event) => {
    renderStats(event.target.value);
})

