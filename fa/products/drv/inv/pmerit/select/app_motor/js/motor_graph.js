function drawSaveGraph(saveCanvas, chargeArray, co2Array, currency, priceScalse, pattern) {
    var data = {
        //labels: ["SF-JR", "SF-HR", "SF-PR", "MM-EFS"],
        datasets: [
            {
                fillColor: "rgba(11,124,124,0.5)",
                strokeColor: "rgba(11,124,124,1)",
                pointColor: "rgba(11,124,124,1)",
                pointStrokeColor: "#fff",
                y2axis: false
            },
            {
                fillColor: "rgba(222,121,121,0.5)",
                strokeColor: "rgba(222,121,121,1)",
                pointColor: "rgba(222,121,121,1)",
                pointStrokeColor: "#fff",
                y2axis: true
            },
        ]
    };

    if (pattern == "a") {
        data.labels = ["SF-JR", "SF-HR", "SF-PR", "MM-EFS"];
    } else {
        data.labels = ["IE1", "IE2", "IE3", "IE4"];
    }

    if (chargeArray.length > 0) {
        data.datasets[0].label = "Electric Rate Total Costs";
        data.datasets[1].label = "CO2 Emissions";

        data.datasets[0].data = new Array();
        data.datasets[1].data = new Array();
        for (i = 0; i < chargeArray.length; i++) {
            if (chargeArray[i] > 0) {
                data.datasets[0].data[i] = chargeArray[i] / priceScalse;
                data.datasets[1].data[i] = co2Array[i];
            }
        }

        Chart.types.Bar.extend({
            name: "Bar2Y",
            getScale: function (data) {
                var startPoint = this.options.scaleFontSize;
                var endPoint = this.chart.height - (this.options.scaleFontSize * 1.5) - 5;
                return Chart.helpers.calculateScaleRange(
                    data,
                    endPoint - startPoint,
                    this.options.scaleFontSize,
                    this.options.scaleBeginAtZero,
                    this.options.scaleIntegersOnly);
            },
            initialize: function (data) {
                var y2datasetLabels = [];
                var y2data = [];
                var y1data = [];
                data.datasets.forEach(function (dataset, i) {
                    if (dataset.y2axis == true) {
                        y2datasetLabels.push(dataset.label);
                        y2data = y2data.concat(dataset.data);
                    } else {
                        y1data = y1data.concat(dataset.data);
                    }
                });

                var y1Scale = this.getScale(y1data);
                this.y2Scale = this.getScale(y2data);
                var normalizingFactor = y1Scale.max / this.y2Scale.max;

                data.datasets.forEach(function (dataset) {
                    if (y2datasetLabels.indexOf(dataset.label) !== -1) {
                        dataset.data.forEach(function (e, j) {
                            dataset.data[j] = e * normalizingFactor;
                        })
                    }
                })

                this.options.multiTooltipTemplate = function (d) {
                    if (y2datasetLabels.indexOf(d.datasetLabel) !== -1)
                        return Math.round(d.value / normalizingFactor * 1000) / 1000 + " t/year";
                    else
                        return Intl.NumberFormat().format(d.value) + " (" + priceScalse + currency + ")";
                }

                Chart.types.Bar.prototype.initialize.apply(this, arguments);
            },
            draw: function () {
                var ctx = this.chart.ctx;
                var scale = this.scale;
                this.scale.xScalePaddingRight = this.scale.xScalePaddingLeft;
                Chart.types.Bar.prototype.draw.apply(this, arguments);

                ctx.textAlign = 'left';
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#666";
                var labelValue = 0;
                var yStep = (scale.endPoint - scale.startPoint) / this.y2Scale.steps;
                var allIntFlg = true;
                for (var i = 0, y = this.scale.endPoint, label = this.y2Scale.min; i <= this.y2Scale.steps; i++) {
                    labelValue += this.y2Scale.stepValue;
                    var tmpLabel = Math.round(parseFloat(labelValue) * 100) / 100;
                    if (Math.floor(tmpLabel) != Math.ceil(tmpLabel)) {
                        allIntFlg = false;
                        break;
                    }
                }

                var y2position = this.chart.width - scale.xScalePaddingRight;
                if (allIntFlg) {
                    y2position += 8;
                } else {
                    y2position -= 8;
                }

                labelValue = 0;
                for (var i = 0, y = this.scale.endPoint, label = this.y2Scale.min; i <= this.y2Scale.steps; i++) {
                    label = "- " + Math.round(parseFloat(labelValue) * 100) / 100 ;
                    this.chart.ctx.fillText(label, y2position, y);
                    y -= yStep;
                    labelValue += this.y2Scale.stepValue;
                }

                ctx.beginPath();
                ctx.moveTo(y2position, scale.startPoint);
                ctx.strokeStyle = "rgba(0,0,0,.15)";
                ctx.lineTo(y2position, scale.endPoint);
                ctx.stroke();
            }
        });

        var chart = new Chart(saveCanvas).Bar2Y(data, {
            scaleShowHorizontalLines: true,
            scaleLineColor: "rgba(0,0,0,.5)",
            scaleGridLineColor: "rgba(0,0,0,.2)",
            scaleShowVerticalLines: true,
            scaleLabel: "<%= new Intl.NumberFormat().format(value) %>",
            barValueSpacing: 15,
            legendTemplate: "<% for (var i=0; i<datasets.length; i++){%><span class=\"legendbox\" style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>"
        });
        $("#saveGraphLegend").html(chart.generateLegend());
    } else {
        Chart.types.Bar.extend({
            name: "BarEmpty",
            draw: function () {
                Chart.types.Bar.prototype.draw.apply(this, arguments);

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

        var chart = new Chart(saveCanvas).BarEmpty(data, {
            scaleShowHorizontalLines: true,
            scaleLineColor: "rgba(0,0,0,.3)",
            scaleShowVerticalLines: true,
        });

        $("#saveGraphLegend").html(chart.generateLegend());
    }
}

function drawLifeCycleGraph(lifeCycleCanvas, lifeCycleData, showMyMotor, myMotorLabel, currency, priceScale, pattern) {
    var data = {
        labels: [],
        datasets: [
            {
                strokeColor: "rgba(198,28,28,1)",
                pointColor: "rgba(198,28,28,1)",
                pointHighlightStroke: "rgba(198,28,28,1)",
            },
            {
                strokeColor: "rgba(19,187,187,1)",
                pointColor: "rgba(19,187,187,1)",
                pointHighlightStroke: "rgba(19,187,187,1)",
            },
        ]
    };

    if (lifeCycleData.length >= 3) {
        var dataLabel = "MM-EFS";
        if (pattern != "a") {
            dataLabel = "IE4";
        }

        data.datasets.push({
            label: dataLabel,
            strokeColor: "rgba(222,121,121,1)",
            pointColor: "rgba(222,121,121,1)",
            pointHighlightStroke: "rgba(222,121,121,1)",
        });
    }

    if (lifeCycleData.length > 0) {
        var maxCost = 0;
        for (i = 0; i < data.datasets.length; i++) {
            for (year in lifeCycleData[i]) {
                if (i == 0) {
                    data.labels.push(year.toString());
                }
                if (lifeCycleData[i][year] >= maxCost) {
                    maxCost = lifeCycleData[i][year];
                }
            }

            data.datasets[i].data = lifeCycleData[i];
            data.datasets[i].pointStrokeColor = "#fff";
            data.datasets[i].pointHighlightFill = "#fff";
        }

        var dataLabel = "SF-PR";
        if (pattern != "a") {
            dataLabel = "IE3";
        }

        data.datasets[1].label = dataLabel;
        if (showMyMotor) {
            data.datasets[0].label = myMotorLabel;
        } else {
            data.datasets.shift();
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

        var chart = new Chart(lifeCycleCanvas).Line(data, {
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.2)",
            scaleOverride: true,
            scaleSteps: stepNumber,
            scaleStepWidth: stepWidthNumber,
            scaleStartValue: 0,
            scaleLabel: "<%= new Intl.NumberFormat().format(value) %>",
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
            tooltipTitleTemplate: "<%= label%> years",
            multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= new Intl.NumberFormat().format(value) %> " + "(" + priceScale + currency + ")",
            legendTemplate: "<% for (var i=0; i<datasets.length; i++){%><span class=\"legendbox\" style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>"
        });

        $("#lifeCycleGraphLegend").html(chart.generateLegend());
    } else {
        data.labels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
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