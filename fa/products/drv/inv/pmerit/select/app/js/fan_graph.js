function drawLifeCycleGraph(lifeCycleCanvas, lifeCycleData, runTypeName, priceScale, currency, pattern) {
    var labels;
    if (pattern == "a") {
        labels = ["SF-JR", "SF-HR", "SF-PR", "MM-EFS"];
    } else {
        labels = ["IE1", "IE2", "IE3", "IE4"];
    }

    var data = {
        labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
        datasets: [
            {

            },
            {
                strokeColor: "rgba(72, 139, 139, 1)",
                pointColor: "rgba(72, 139, 139, 1)",
                pointHighlightStroke: "rgba(72, 139, 139, 1)",
            },
            {
                strokeColor: "rgba(19, 187, 187, 1)",
                pointColor: "rgba(19, 187, 187, 1)",
                pointHighlightStroke: "rgba(19, 187, 187, 1)",
            },
            {
                strokeColor: "rgba(209, 167, 75, 1)",
                pointColor: "rgba(209, 167, 75, 1)",
                pointHighlightStroke: "rgba(209, 167, 75, 1)",
            },
            {
                strokeColor: "rgba(198, 28, 28, 1)",
                pointColor: "rgba(198, 28, 28, 1)",
                pointHighlightStroke: "rgba(198, 28, 28, 1)",
            },
        ]
    };

    if (lifeCycleData.length >= 4) {
        data.datasets[0].label = runTypeName.trim();
        data.datasets[1].label = "Inverter " + labels[0];
        data.datasets[2].label = "Inverter " + labels[1];
        data.datasets[3].label = "Inverter " + labels[2];
        data.datasets[4].label = "IPM Control " + labels[3];

        var rgba = ""
        if (data.datasets[0].label == "Discharge Side Damper") {
            data.datasets[0].label = "Discharge Side Damper Control";
            rgba = "rgba(222, 121, 121, 1)";
        } else if (data.datasets[0].label == "Suction Side Damper") {
            data.datasets[0].label = "Suction Side Damper Control";
            rgba = "rgba(9, 0, 0, 1)";
        } else {
            data.datasets[0].label = "Valve control";
            rgba = "rgba(141, 8, 8, 1)";
        }
        data.datasets[0].strokeColor = data.datasets[0].pointColor = data.datasets[0].pointHighlightStroke = rgba;

        var maxCost = 0;
        for (i = 0; i <= 4; i++) {
            for (cost in lifeCycleData[i]) {
                if (lifeCycleData[i][cost] >= maxCost) {
                    maxCost = lifeCycleData[i][cost];
                }
            }

            data.datasets[i].data = lifeCycleData[i];
        }

        for (i = 0; i < data.datasets.length; i++) {
            data.datasets[i].pointStrokeColor = "#fff";
            data.datasets[i].pointHighlightFill = "#fff";
        }

        var maxScaleLength = parseInt(maxCost).toString(10).length;
        var maxScale = Math.ceil(maxCost / Math.pow(10, maxScaleLength - 2)) * Math.pow(10, maxScaleLength - 2);
        var stepNumber = Math.ceil(maxScale / Math.pow(10, maxScaleLength - 2));
        while (stepNumber > 10) {
            stepNumber = Math.ceil(stepNumber / 2);
        }
        var tmpStepWidthNumber = Math.ceil(maxScale / stepNumber);
        var tmpStepWidthNumberLength = tmpStepWidthNumber.toString(10).length;
        var stepWidthNumber = Math.ceil(tmpStepWidthNumber / Math.pow(10, tmpStepWidthNumber.toString(10).length - 1)) * Math.pow(10, tmpStepWidthNumber.toString(10).length - 1);
        if ((stepWidthNumber * (stepNumber - 1) > maxCost)) {
            stepNumber--;
        }

        Chart.types.Line.extend({
            name: "LineWithLine",
            draw: function () {
                if (this.datasets.length)
                    Chart.types.Line.prototype.draw.apply(this, arguments);
                var ctx = this.chart.ctx;
                var scale = this.scale;
                var bearingPoints = this.options.lineAtBearing;
                var inverterPoints = this.options.lineAtInverter;
                var originFont = ctx.font;

                ctx.font = "9px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

                for (i = 0; i < bearingPoints.length; i++) {
                    var point = this.datasets[0].points[bearingPoints[i]];

                    ctx.beginPath();
                    ctx.moveTo(point.x, scale.startPoint);
                    ctx.strokeStyle = '#7a7a4f';
                    ctx.lineTo(point.x, scale.endPoint);
                    ctx.stroke();

                    ctx.fillStyle = '#7a7a4f';
                    ctx.textAlign = "center";
                    ctx.fillText("B.R.", point.x, scale.startPoint - 6);
                }

                for (i = 0; i < inverterPoints.length; i++) {
                    var point = this.datasets[0].points[inverterPoints[i]];

                    ctx.beginPath();
                    ctx.moveTo(point.x, scale.startPoint);
                    ctx.strokeStyle = '#6e7827';
                    ctx.lineTo(point.x, scale.endPoint);
                    ctx.stroke();

                    ctx.fillStyle = '6e7827';
                    ctx.textAlign = "center";
                    ctx.fillText("I.R.", point.x, scale.startPoint - 6);
                }

                ctx.font = originFont;
            }
        });

        var chart = new Chart(lifeCycleCanvas).LineWithLine(data, {
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.2)",
            scaleOverride: true,
            scaleSteps: stepNumber,
            scaleStepWidth: stepWidthNumber,
            scaleStartValue: 0,
            scaleLabel: "<%= new Intl.NumberFormat().format(value)%>",
            scaleShowHorizontalLines: true,
            scaleLineColor: "rgba(0,0,0,.5)",
            scaleShowVerticalLines: true,
            bezierCurve: true,
            bezierCurveTension: 0.4,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 5,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: false,
            tooltipTitleTemplate: "<%= label%> years <%if (label % 3 == 0){%>(Bearing Replacement Period)<%} else if (label % 10 == 0){%>(Inverter Replacement Period)<%}%>",
            multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>：<%}%><%= new Intl.NumberFormat().format(value) %> (" + priceScale + currency + ")",
            legendTemplate: "<% for (var i=0; i<datasets.length; i++){%><span class=\"legendbox\" style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%if(i==2){%><br><%}%><%}%><div class=\"alignR mr10 mt3\"><span class=\"nonebox\">B.R. Bearing Replacement Period</span><span class=\"nonebox\">I.R. Inverter Replacement Period</span></div>",
            lineAtBearing: [3, 6, 9, 12, 15, 18],
            lineAtInverter: [10, 20]
        });

        $("#lifeCycleGraphLegend").html(chart.generateLegend());
    } else {

        Chart.types.Line.extend({
            name: "LineEmpty",
            draw: function () {
                Chart.types.Line.prototype.draw.apply(this, arguments);

                var ctx = this.chart.ctx;
                var xStart = Math.round(this.scale.xScalePaddingLeft);
                var linePositionY = Math.round(this.scale.endPoint);

                ctx.lineWidth = this.scale.lineWidth;
                ctx.strokeStyle = this.scale.lineColor;

                ctx.beginPath();
                ctx.moveTo(xStart, linePositionY);
                ctx.lineTo(this.scale.width, linePositionY);
                ctx.stroke();
                ctx.closePath();
            }
        });

        var chart = new Chart(lifeCycleCanvas).LineEmpty(data, {
            scaleShowHorizontalLines: true,
            scaleLineColor: "rgba(0,0,0,.3)",
            scaleShowVerticalLines: true,
        });
        $("#lifeCycleGraphLegend").html(chart.generateLegend());
    }
}

function drawPowerGraph(powerCanvas, runTypeValue, pattern) {
    var labels;
    if (pattern == "a") {
        labels = ["SF-JR", "SF-HR", "SF-PR", "MM-EFS"];
    } else {
        labels = ["IE1", "IE2", "IE3", "IE4"];
    }

    var data = {
        labels: ["20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
        datasets: [
            {
                label: "Inverter " + labels[0],
                strokeColor: "rgba(72, 139, 139, 1)",
                pointColor: "rgba(72, 139, 139, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(72, 139, 139, 1)",
                data: [7, 9, 14, 22, 34, 49, 66, 92, 125]
            },
            {
                label: "Inverter " + labels[1],
                strokeColor: "rgba(19, 187, 187, 1)",
                pointColor: "rgba(19, 187, 187, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(19, 187, 187, 1)",
                data: [6, 8, 12, 20, 31, 46, 64, 89, 121]
            },
            {
                label: "Inverter " + labels[2],
                strokeColor: "rgba(209, 167, 75, 1)",
                pointColor: "rgba(209, 167, 75, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(209, 167, 75, 1)",
                data: [4, 6, 11, 18, 29, 44, 61, 86, 118]
            },
            {
                label: "IPM Control " + labels[3],
                strokeColor: "rgba(198, 28, 28, 1)",
                pointColor: "rgba(198, 28, 28, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(198, 28, 28, 1)",
                data: [4, 6, 10, 16, 26, 40, 58, 81, 111]
            },
        ]
    };

    var runTypeData = new Array();
    runTypeData = [
        {
            label: "Discharge Side Damper Control",
            strokeColor: "rgba(222, 121, 121, 1)",
            pointColor: "rgba(222, 121, 121, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(222, 121, 121, 1)",
            data: [73, 83, 91, 98, 103, 108, 111, 115, 118]
        },
        {
            label: "Suction Side Damper Control",
            strokeColor: "rgba(9, 0, 0, 1)",
            pointColor: "rgba(9, 0, 0, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(9, 0, 0, 1)",
            data: [64.757, 66.541, 69.005, 72.149, 75.973, 80.477, 85.661, 95.44, 118.44]
        },
        {
            label: "Valve Control",
            strokeColor: "rgba(141, 8, 8, 1)",
            pointColor: "rgba(141, 8, 8, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(141, 8, 8, 1)",
            data: [76.4, 81.6, 86.8, 92, 97.2, 102.4, 107.6, 112.8, 118]
        }
    ];

    if (data.datasets.length > 4) {
        data.datasets.shift();
    }
    data.datasets.unshift(runTypeData[runTypeValue]);

    powerCanvas.canvas.width = 360 * window.devicePixelRatio;
    powerCanvas.canvas.height = 240 * window.devicePixelRatio;

    var chart = new Chart(powerCanvas).Line(data, {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.2)",
        scaleOverride: true,
        scaleSteps: 7,
        scaleStepWidth: 20,
        scaleStartValue: 0,
        scaleLabel: "<%=value%>%",
        scaleShowHorizontalLines: true,
        scaleLineColor: "rgba(0,0,0,.5)",
        scaleShowVerticalLines: true,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 10,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: false,
        tooltipTitleTemplate: "Flow Rate <%= label%>",
        multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>%",
        legendTemplate: "<% for (var i=0; i<datasets.length; i++){%><span class=\"legendbox\" style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%if(i==2){%><br><%}%><%}%>"
    });

    $("#powerGraphLegend").html(chart.generateLegend());
}