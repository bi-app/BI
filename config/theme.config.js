import gexf from 'gexf';
const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')

const floorPath = path.join(__dirname, '../config/floor.gexf');
const typePath = path.join(__dirname, '../config/type.gexf');
const floor_gexf = fs.readFileSync(floorPath, 'utf-8');
const type_gexf = fs.readFileSync(typePath, 'utf-8');
const floorGraph = gexf.parse(floor_gexf);
const typeGraph = gexf.parse(type_gexf);


floorGraph.nodes.forEach(function(node) {
  // node.itemStyle = null;
  // console.warn("node",node)
  // console.warn("node",node)
  node.value = [node.viz.position.x, node.viz.position.y];
  node.symbolSize = node.viz.size;
  node.x = node.viz.position.x;
  node.y = node.viz.position.y;
  node.name = node.attributes.name || "";
  node.label = node.id === "0" ? {
    fontSize: 26,
    color: "#0B0347",
  } : {
    // position: [14, 18],
    fontSize: 18,
    // fontWeight: 600,
    // fontFamily: 'Microsoft YaHei',
    color: "#0B0347",
  }

  node.itemStyle = node.id === "0" ? {
    normal: {
      show: true,
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#388DF3' // 0% 处的颜色
        }, {
          offset: 1, color: '#10EAF2' // 100% 处的颜色
        }],
        globalCoord: false // 缺省为 false
      }
    }
  } : {
    normal: {
      show: true,
      color: node.viz.color
    }
  };
});


/**
 * 创建新json
 * */
typeGraph.nodes.forEach(function(node, index) {
  // console.warn("node：",node)
  node.value = [node.viz.position.x, node.viz.position.y];
  node.symbolSize = node.viz.size;
  node.x = node.viz.position.x;
  node.y = node.viz.position.y;
  node.name = node.attributes.name || "";

  // node.symbol = matchSymbol(node.id)
  node.label = JSON.parse(node.attributes.style)
  node.tooltip = {
    formatter: function(params, ticket) {
      return params.data.name
    }
  }
  node.itemStyle = node.id === "0" ? {
    normal: {
      show: true,
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#388DF3' // 0% 处的颜色
        }, {
          offset: 1, color: '#10EAF2' // 100% 处的颜色
        }],
        globalCoord: false // 缺省为 false
      }
    }
  } : {
    normal: {
      show: true,
      color: node.viz.color
    }
  };
});



//楼层
fs.writeFileSync(path.join(__dirname, '../src/pages/deal/components/floorPoint.json'), JSON.stringify(floorGraph), function(error){
  if(error){
    console.log('写入成功')
  }else{
    console.log('写入成功')
  }
})

//业态
fs.writeFileSync(path.join(__dirname, '../src/pages/deal/components/typePoint.json'), JSON.stringify(typeGraph), function(error){
  if(error){
    console.log('写入成功')
  }else{
    console.log('写入成功')
    // writeJson()
  }
})



module.exports = () => {
  const themePath = path.join(__dirname, '../src/themes/default.less');
  return lessToJs(fs.readFileSync(themePath, 'utf8'))
}
