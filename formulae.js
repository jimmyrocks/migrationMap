var formulae = function(s) {
    return {
        "Population": {
            "formula": function(d,v) {
                return d[v]["Population"]
            },
            "name": function() {return "Population"},
            "button": {
                "name": "Population",
                "group": "0"
            }
        },
        "MovedTo": {
            "formula": function(d,v) {
                return d[s][v];
            },
            "name": function(v) {
                return "Number of people from " + v + " who moved to " + s + " in 2011"
            },
            "s": s,
            "button": {
                "name": "# Moved To",
                "group": "1"
            }

        },
        "MovedToPercentOfPop": {
            "formula": function(d,v) {
                return d[s][v]/d[v]["Population"]
            },
            "name": function(v) {
                return "Percent of people from " + v + " who moved to " + s + " in 2011";
            },
            "s": s,
            "button": {
                "name": "% Moved To",
                "group": "1"
            }
        },
        "MovedFrom": {
            "formula": function(d,v) {
                return d[v][s];
            },
            "name": function(v) {
                return "Number of people who moved from " + s + " to " + v  + " in 2011";
            },
            "s": s,
             "button": {
                "name": "# Moved From",
                "group": "1"
            }
        },
        "MovedFromPercentOfPop": {
            "formula": function(d,v) {
                return d[v][s]/d[v]["Population"]
            },
            "name": function(v) {
                return "Percent of people in " + v + " who moved there from " + s + " in 2011";
            },
            "s": s,
            "button": {
                "name": "% Moved From",
                "group": "1"
            }
        }
    }};
