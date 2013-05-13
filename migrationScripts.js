
var addMap = function(width, height) {

    // Map Drawing Functions
    var drawFirstMap = function(error, states, migrationData){
        var displayField = function(record, stateName) {
            var fieldName = "Moved from a different state in the last year";
            if (record) {
                return (record[stateName]["Moved from a different state in the last year"] / record[stateName]["Population"]);
            } else {
                return fieldName;
            };
        }

        // Quantize the values!
        var maxValue = 0;
        for (var migrationState in migrationData){
            if (migrationData.hasOwnProperty(migrationState)) {
                var validState = false;
                for (var state in states.features) {
                    if (migrationState ===
                        states.features[state].properties.name)
                    {
                        validState = true;
                        break;
                    }
                }
                if (validState) {
                    maxValue = +displayField(migrationData, migrationState)
                        > maxValue ?
                        +displayField(migrationData, migrationState):
                        maxValue;
                }
            }
        }

        var quantize = d3.scale.quantize()
            .domain([0, maxValue])
            .range(d3.range(9).map(function(i) { return "green" + i + "-9"; }));

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

        var g = svg.append("g")
            .attr("id", "states")
            .attr("class", "states")
            .selectAll("path")
            .data(states.features)
            .enter().append("path")
            .attr("class", function(d) {
                return quantize(displayField(migrationData, d.properties.name));
            })
            .attr("d", path)
            .on("click",click);

        function click(d) {
            if (d && d.properties && d.properties.name) {
                console.log(displayField(migrationData, d.properties.name));
            }
        }

        $("svg g path").tipsy({
            gravity: 'se',
            html: true,
            title: function() {
                var d = this.__data__;
                var message = "<h4>" + d.properties.name + "</h4><hr/><b>" + displayField() + ":</b>&nbsp;&nbsp;" + displayField(migrationData, d.properties.name);
                return message;
            }
        });
    };

    //Set up the D3 map
    var path = d3.geo.path();
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    //Load the files
    queue()
        .defer (d3.json, "states.json")
        .defer (d3.json, "data/2011.json")
        .await(drawFirstMap);

};

addMap(960, 500);
