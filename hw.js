document.addEventListener('DOMContentLoaded', (event) => {
const consonants ='bcdfghjklmnpqrstvwxz';
const punctuations = '.,!?:;';
const vowels = 'aeiouy' ;

const coloring = {
  'vowels': '#99dac7',
  'consonants': '#fcf4a3',
  'punctuation': '#c6b1d5'
};

function color(char) {
  if ("aeiou".includes(char.toLowerCase())) return 'vowels';
  if (".,!?:".includes(char)) return 'punctuation';
  return 'consonants'; 
    }

function categorize(char) {
    char = char.toLowerCase();
    if (vowels.includes(char)) return 'vowels';
    if (consonants.includes(char)) return 'consonants';
    if (punctuations.includes(char)) return 'punctuations';
   
    return null;
}
function CountData(text) {
    const count = { consonants: {}, vowels: {}, punctuations: {} };
    for (const char of text) {
      const lowerChar = char.toLowerCase();
      const category = categorize(lowerChar);
      if (category) {
        count[category][lowerChar] = (count[category][lowerChar] || 0) + 1;
      }
    }
    const hierarchy = {
        name: 'root',
        children: Object.keys(count).map(category => ({
          name: category,
        children: Object.keys(count[category]).map(char => ({
          name: char,
          value: count[category][char]
          }))
        }))
      };
    
      return hierarchy;
}
///////////////////////////////
function treemapMapping(data) {
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 580 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var inputS = document.getElementById("textarea").value.trim();
    
    var svg = d3.select("#treemap_svg")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + " ,"+ margin.top +")");

    var root = d3.hierarchy(data).sum(d => d.value);
    d3.treemap()
      .size([width, height])
      .paddingInner(2.5)
      (root);
    
    const color = d3.scaleOrdinal()
                    .range(["#fcf4a3", "#c6b1d5", "#99dac7"])
                    .domain([ "consonants", "punctuations","vowels"]);
                    
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "white")
    .style("border", "solid")
    .style("border-width", "1.7px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("pointer-events", "none")
    .style("visibility", "hidden");
    
    svg.selectAll("rect")
       .data(root.leaves())
       .enter()
       .append("rect")
       .attr('x', d => d.x0)
       .attr('y', d => d.y0)
       .attr('width', d => d.x1 - d.x0)
       .attr('height', d => d.y1 - d.y0)
       .style("stroke", "black")
       .style("fill", d => color(d.parent.data.name))
       .on("click", function(event, d){
        sankeyVis(d, inputS);
       })
       .on("mouseover", function(event, d) {
         tooltip.transition()
        .duration(200)
        .style("opacity", 1);
         tooltip.html("Character: " + d.data.name + "<br/>Count: " + d.data.value)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px")
            .style("visibility", "visible");
      })
      .on("mousemove", function(event) {
          tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0)
              .on("end", function() { tooltip.style("visibility", "hidden"); });
      });
  }
  function sankeyVis(d, inputS) {
    let regexPattern = new RegExp(`[^${consonants}${punctuations}${vowels}\\s]`, "g");
    inputS = inputS.replace(regexPattern, "");
    var sChar = d.data.name;
    d3.select("#sankey_svg").selectAll("*").remove();
    const flowLabel = document.getElementById('flow_label');
    flowLabel.textContent = `Character flow for '${d.data.name}'`;
    var { nodes, links } = calculatesankeyMap(sChar, inputS);

    var sankeyLayout = d3.sankey()
        .nodeWidth(16)
        .nodePadding(10)
        .size([580-40, 400-15]);

    var sankeyMap = sankeyLayout({
        nodes: nodes.map(d => Object.assign({}, d)),
        links: links.map(d => Object.assign({}, d))
    });

    var svg = d3.select("#sankey_svg")
        .append("svg")
        .attr("width", 580)
        .attr("height", 400);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("background", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("visibility", "hidden"); 

    svg.append("g")
        .selectAll(".link")
        .data(sankeyMap.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .style("stroke-width", d => Math.max(1, d.width))
        .style("stroke", "grey")
        .style("fill", "none")
        .attr("transform", d => `translate(${30},${8})`);
       
    var node = svg.append("g")
        .selectAll(".node")
        .data(sankeyMap.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x0+30},${d.y0+8})`);

    node.append("rect")
        .attr("height", d => d.y1 - d.y0)
        .attr("width", sankeyLayout.nodeWidth())
        .style("fill", d => coloring[color(d.name)])
        .style("opacity", 1)
        .style("stroke", "#000")
        .on("mouseover", function(event, d) {
          var tooltipContent = '';
          console.log(d);
          if (d.sourceLinks.length > 0) {
            tooltipContent = `Character '${d.name}' flows into character '${d.sourceLinks[0].target.name}' ${d.value} times.`;
          }
          else if (d.id.length == 1) {
            tooltipContent = `Character '${d.name}' appears ${d.value} times.`
          } 
          else if (d.targetLinks.length > 0) {
              tooltipContent = `Character '${d.name}' flows into character '${d.targetLinks[0].target.name}' ${d.value} times.`;
          }
          tooltip.html(tooltipContent);
          tooltip.style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 10) + "px")
              .style("opacity", 1)
              .style("visibility", "visible");
      })
      .on("mousemove", function(event) {
          tooltip.style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 10) + "px")
              .style("opacity", 1);
      })
      .on("mouseout", function(event, d) {
          tooltip.transition().style("opacity", 0);
      });

  node.append("text")
      .attr("x",0)
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(d => d.name)
      .filter(d => d.x0 < 400)
      .attr("x", -30+ sankeyLayout.nodeWidth())
      .attr("text-anchor", "start");
}
function calculatesankeyMap(sChar, inputS) {
  let preCharacters = {};
  let postCharacters = {};
  let nodes = [], links = [];
  let nodeMap = new Map(); 

  function addNode(char) {
      if (!nodeMap.has(char) && char !== sChar) {
          nodeMap.set(char, nodes.length);
          nodes.push({ name: char });
      }
  }

  for (let i = 0; i < inputS.length-1; i++) {
      let currentChar = inputS[i].toLowerCase();
      if (currentChar === sChar) {
          let preChar = i >=  0 ? inputS[i - 1].toLowerCase() : 'start';
          let postChar = i < inputS.length ? inputS[i + 1].toLowerCase() : 'end';

          if (preChar !== sChar) { 
              preCharacters[preChar] = (preCharacters[preChar] || 0) + 1;
          }
          if (postChar !== sChar) { 
              postCharacters[postChar] = (postCharacters[postChar] || 0) + 1;
          }
      }
  }

  nodeMap.set(sChar, nodes.length);
  nodes.push({ id: sChar, name: sChar });

  for (let preChar of Object.keys(preCharacters)) {
      if (!nodeMap.has(preChar+'_') && preChar !== sChar) {
        nodeMap.set(preChar + '_', nodes.length);
        nodes.push({ id : preChar+'_',name: preChar });
      }
  }
  for (let postChar of Object.keys(postCharacters)) {
    if (!nodeMap.has('_'+postChar) && postChar !== sChar) {
      nodeMap.set('_'+postChar, nodes.length);
      nodes.push({ id: '_'+postChar, name: postChar}); 
    }
  }

  function addLink(source, target, value) {
      if (source !== target) {
          links.push({
              source: nodeMap.get(source),
              target: nodeMap.get(target),
              value: value
          });
      }
  }     
  Object.keys(preCharacters).forEach(preChar => {
      addLink(preChar+'_', sChar, preCharacters[preChar]);
  });

  Object.keys(postCharacters).forEach(postChar => {
      addLink(sChar, '_'+postChar, postCharacters[postChar]);
  });

  return { nodes, links };
}

document.getElementById('submitButton').addEventListener('click', () => {
    const text = document.getElementById('textarea').value;
    const data = CountData(text);
    d3.select('#treemap_svg').html(null);
    d3.select('#sankey_svg').html(null);
    treemapMapping(data);
    const flowLabel = document.getElementById('flow_label');
    flowLabel.textContent = `Character flow for ...`;
  });
  });