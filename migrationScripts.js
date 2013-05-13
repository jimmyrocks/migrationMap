var testVar;
var addMap = function(width, height) {

    var displayFields = function(data, formula) {
        var getField = function(lookupName) {
            if (data && formula) {
                return formula.formula(data, lookupName);
            } else {
                return null;
            };
        };

        // Quantize the values!
        var maxValue = 0;
        for (var dataField in data){
            if (data.hasOwnProperty(dataField)) {
                maxValue = getField(dataField) > maxValue ?
                    getField(dataField): maxValue;
            }
        }

        var quantize = function(lookupName) {
            var color = "blue";
            if (formula.s === lookupName) {
                return "null" + "-9";
            } else
            {
                var q = d3.scale.quantize()
                    .domain([0, maxValue])
                    .range(d3.range(9).map(function(i) { return color + i + "-9"; }));
                return q(getField(lookupName));
            }
        };

        return {
            description: function(lookupName) {return formula.name(lookupName);},
                getField: function(lookupName) {return getField(lookupName);},
                quantize: function(lookupName) {return quantize(lookupName);}
        };
    };


    var drawButtons = function() {
        var blankFormulae = formulae();
        var counter = 0;
        for (formula in blankFormulae) {
            if (blankFormulae.hasOwnProperty(formula) && blankFormulae[formula].button) {
                counter++;

                var newButton = document.createElement("input");
                newButton.setAttribute("id", "button_" + counter);
                newButton.setAttribute("name", "groupA");
                var newLabel = document.createElement("label");
                newLabel.setAttribute("for", "button_" + counter);
                newLabel.textContent = blankFormulae[formula].button.name;
                newButton.setAttribute("type", "radio");
                if (blankFormulae[formula].button.group === "0") {
                    $("#formulaWindow #national").append(newButton);
                    $("#formulaWindow #national").append(newLabel);
                } else {
                    $("#formulaWindow #stateLevel").append(newButton);
                    $("#formulaWindow #stateLevel").append(newLabel);
                }
                $("#button_" + counter).button();
                $("#button_1").attr('checked', 'checked');
                $("#button_" + counter).data("formulaName", formula);
                $("#button_" + counter).click(
                    function() {
                        if ($(this).data().hasOwnProperty("setFormula") &&
                $(this).data().hasOwnProperty("lastState")){
                            var sf = $(this).data("setFormula");
                            var fm = formulae($(this).data("lastState"))[$(this).data("formulaName")];
                            sf(fm);
                        }
                        $("#infoWindow").hide();
                    }
                );
            }
        }
    };

    // Map Drawing Functions
    var drawFirstMap = function(error, states, migrationData){

        var displayField;
        var setFormula = function(formula){
            displayField = displayFields(
                migrationData,
                formula
            );

            d3.selectAll("path")
                .attr("class", function(d) {
                    return displayField.quantize(d.properties.name);
                });

            // Set up the buttons so the map gets updated onclick
            $("input[name=groupA]").data("setFormula", setFormula);
            $("#titleBar").text(formula.name("each state"));
        };

        $('#infoWindow').css("top", height-180);
        $('#infoWindow').css("left", width-175);

        var showInformation = function(d) {
            if (d && d.properties && d.properties.name) {
                var message = "<b>" + d.properties.name + "</b><hr/>" + "<b>" + displayField.description(d.properties.name) + ":</b>&nbsp;&nbsp;" + Math.round(+displayField.getField(d.properties.name)*10000)/10000;
                $('#infoWindow').html(message);
                $('#infoWindow').show();
            } else {
                $('#infoWindow').html("");
                $('#infoWindow').hide();
            };
            svg.selectAll("path").sort(function (a, b){
                if (a.id != d.id) return -1;
                else return 1;
            });
        };


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
            .attr("d", path)
            .attr("title", function(d) {return d.properties.name;})
            .on("click",click)
            .on("mouseover", function(d) {showInformation(d);});

        function click(d) {
            if (d && d.properties && d.properties.name) {
                var formulaName = $("input[name=groupA]:checked").data().formulaName;
                setFormula(formulae(d.properties.name)[formulaName]);
                $("#infoWindow").hide();
                $("input[name=groupA]").data("lastState", d.properties.name);
            }
        }

        //Start with the Population Formula Initially
        setFormula(formulae()["Population"]);

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

        // Allow the user to select formulae
        $(document).ready(function(){
            drawButtons();
        });

};

addMap(960, 500);
