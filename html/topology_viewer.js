/*
 * Copyright 2014 Masao Nishie. All Rights Reserved.
 */
function TopologyViewer(element) { 
    _self = this;

    this.nodes = [];    //ノードを収める配列
    this.links = [];    //ノード間のリンク情報を収める配列
    /*
    this.onNodeClick=function{};
    this.onNodeMouseOver=function{};
    */
    
    var w = element.clientWidth,
        h = element.clientHeight;
    
    //グラフを描画するステージ（svgタグ）を追加
    var stage = d3.select("#"+element.id)
                  .append("svg:svg")
                  .attr("width", w)
                  .attr("height", h);

    
    //グラフの初期設定
    var force = self.force = d3.layout.force()
        .nodes(_self.nodes)
        .links(_self.links)
        .gravity(.05) //重力
        .distance(100) //ノード間の距離
        .charge(-1000) //各ノードの引き合うor反発しあう力
        .size([w, h]); //図のサイズ

    
    //グラフにアニメーションイベントを設置
    force.on("tick", function() {
        var node = stage.selectAll("g.node").data(_self.nodes, function(d) { return d.id;} );
            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
     
        var link = stage.selectAll("line.link").data(_self.links, function(d) { return d.source.id + ',' + d.target.id});
        link.attr({
            x1: function(d) { return d.source.x; },
            y1: function(d) { return d.source.y; },
            x2: function(d) { return d.target.x; },
            y2:function(d) { return d.target.y; }
        });
    });


     
    //アップデート（再描画）
    this.update = function() {
        var link = stage.selectAll("line.link")
        .data(_self.links, function(l) { return l.source.id + '-' + l.target.id; }); //linksデータを要素にバインド
         
        link.enter().append("svg:line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        link.exit().remove(); //要らなくなった要素を削除
     
        var node = stage.selectAll("g.node")
        .data(_self.nodes, function(d) {return d.id});  //nodesデータを要素にバインド


        var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("id", "node1")
        .attr("width", "64px")
        .attr("height", "64px")
        .on("click", nodeClick)
        .call(force.drag); //ノードをドラッグできるように設定
         
        nodeEnter.append("svg:image")
        .attr("id", "imgId")
        .attr("class", "circle")
        .attr("xlink:href", function(d) { return d.img}) //ノード用画像の設定
        .attr("x", "-32px")
        .attr("y", "-32px")
        .attr("width", "64px")
        .attr("height", "64px");
     
        nodeEnter.append("svg:text")
        .attr("class", "nodetext")
        .attr("dx", 48)
        .attr("dy", ".35em")
        .text(function(d) { return d.text });


        node.exit().remove(); //要らなくなった要素を削除

     
        force.start(); //forceグラグの描画を開始
    }

    this.findById = function(id){
        for (var i = 0; i < _self.nodes.length;i++) {
            var n = _self.nodes[i];
            if (n.id == id) {
                return n;
            }
        }
    }

    this.deleteById = function(id){
        _self.nodes = _self.nodes.filter(function(n) { return n.id !== id; });
        _self.links = _self.links.filter(function(l) { return (l.source.id !== id && l.target.id !== id); });
        _self.update();
    }

    /* for override */
    function nodeClick(obj){
        if( typeof _self.onNodeClick == 'function')
            _self.onNodeClick( obj );
    }

    /* for override */
    function nodeMouseOver(obj){
        if( typeof _self.onNodeMouseOver == 'function')
            _self.onNodeMouseOver( obj );
    }


}
function importJS(jsPath){
    document.write("<script type='text/javascript' src='"+jsPath+"'><\/script>");
}
importJS("./js/d3.min.js");
importJS("./js/jquery-1.10.2.min.js");

document.write("<style>.link{ stroke:#ccc; } .nodetext{ pointer-events: none; font: 16px sans-serif; color:#FFF; fill:#fff }</style>")