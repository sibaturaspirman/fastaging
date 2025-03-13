var Fan;
(function (Fan) {
    (function (RunType) {
        RunType[RunType["DISCHARGE_DAMPER"] = 0] = "DISCHARGE_DAMPER";
        RunType[RunType["SUCTION_DAMPER"] = 1] = "SUCTION_DAMPER";
        RunType[RunType["VALVE"] = 2] = "VALVE";
    })(Fan.RunType || (Fan.RunType = {}));
    var RunType = Fan.RunType;
    (function (MachineType) {
        MachineType[MachineType["DEFAULT"] = 0] = "DEFAULT";
        MachineType[MachineType["SFJR"] = 1] = "SFJR";
        MachineType[MachineType["SFHR"] = 2] = "SFHR";
        MachineType[MachineType["SFPR"] = 3] = "SFPR";
        MachineType[MachineType["MMEFS"] = 4] = "MMEFS";
    })(Fan.MachineType || (Fan.MachineType = {}));
    var MachineType = Fan.MachineType;
    var ValidateFan = (function () {
        function ValidateFan() {
        }
        ValidateFan.prototype.Validation = function (elementId, elementValue, requiredFlg) {
            var retValid = ["-", ""];
            var isEmpty = false;
            var isNumber = false;
            var elementValueNumber;
            if (requiredFlg == true && elementValue == "") {
                isEmpty = true;
            }
            var z = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
            for (var i = 0; i < 10; i++) {
                elementValue = elementValue.replace(new RegExp(z[i], "g"), i);
            }
            if (isFinite(elementValue) == true) {
                isNumber = true;
                elementValueNumber = Math.abs(Number(elementValue));
            }
            switch (elementId) {
                case "unitCount1":
                case "unitCount2":
                case "unitCount3":
                case "unitCount4":
                case "unitCount5":
                    if (!isNumber) {
                        retValid[0] = "062";
                    }
                    else if (elementValueNumber > 999) {
                        retValid[0] = "067";
                    }
                    break;
                case "hour20":
                case "hour30":
                case "hour40":
                case "hour50":
                case "hour60":
                case "hour70":
                case "hour80":
                case "hour90":
                case "hour100":
                    if (!isNumber) {
                        retValid[0] = "066";
                    }
                    else if (elementValueNumber > 24) {
                        retValid[0] = "068";
                    }
                    break;
                case "electricityCharge":
                    if (isEmpty) {
                        retValid[0] = "051";
                    }
                    else if (!isNumber) {
                        retValid[0] = "059";
                    }
                    break;
                case "co2Rate":
                    if (isEmpty) {
                        retValid[0] = "052";
                    }
                    else if (!isNumber) {
                        retValid[0] = "060";
                    }
                    break;
                case "dayPerYear":
                    if (isEmpty) {
                        retValid[0] = "053";
                    }
                    else if (!isNumber) {
                        retValid[0] = "061";
                    }
                    else if (elementValueNumber > 366) {
                        retValid[0] = "057";
                    }
                    break;
                case "totalVolume":
                    if (isEmpty || (elementValueNumber == 0)) {
                        retValid[0] = "054";
                    }
                    break;
                case "totalUnitCount":
                    if (isEmpty || (elementValueNumber == 0)) {
                        retValid[0] = "055";
                    }
                    else if (elementValueNumber > 999) {
                        retValid[0] = "067";
                    }
                    break;
                case "totalHour":
                    if (isEmpty || (elementValueNumber == 0)) {
                        retValid[0] = "056";
                    }
                    else if (elementValueNumber > 24) {
                        retValid[0] = "058";
                    }
                    break;
                case "inputInitialCost0":
                case "inputInitialCost1":
                case "inputInitialCost2":
                case "inputInitialCost3":
                case "inputInitialCost4":
                    if (!isNumber) {
                        retValid[0] = "063";
                    }
                    break;
                case "inputBearingCost0":
                case "inputBearingCost1":
                case "inputBearingCost2":
                case "inputBearingCost3":
                case "inputBearingCost4":
                    if (!isNumber) {
                        retValid[0] = "064";
                    }
                    break;
                case "inputInverterCost1":
                case "inputInverterCost2":
                case "inputInverterCost3":
                case "inputInverterCost4":
                    if (!isNumber) {
                        retValid[0] = "065";
                    }
                    break;
            }
            if (elementValueNumber >= 0) {
                retValid[1] = elementValueNumber.toString();
            }
            return retValid;
        };
        return ValidateFan;
    })();
    Fan.ValidateFan = ValidateFan;
    var CalcFan = (function () {
        function CalcFan(csvFileName, runType, names, volumes, unitCounts, hours, dayPerYear, electricityCharge, co2Rate, initialCosts, bearingCosts, inverterCosts, currency) {
            this.csvFileName = csvFileName;
            this.runType = runType;
            this.names = names;
            this.volumes = volumes;
            this.unitCounts = unitCounts;
            this.hours = hours;
            this.dayPerYear = dayPerYear;
            this.electricityCharge = electricityCharge;
            this.co2Rate = co2Rate;
            this.initialCosts = initialCosts;
            this.bearingCosts = bearingCosts;
            this.inverterCosts = inverterCosts;
            this.calEnergy = new Object();
            this.dataArray = new Array();
            this.currency = currency;
            for (var hour in this.hours) {
                this.calEnergy[hour] = new Array();
                for (var machineType in MachineType) {
                    var isValueProperty = parseInt(machineType, 10) >= 0;
                    if (isValueProperty) {
                        this.calEnergy[hour][machineType] = 0;
                    }
                }
            }
        }
        CalcFan.prototype.GetParamString = function () {
            var name = "";
            var volume = "";
            var unit = "";
            var hour = "";
            var initialCost = "";
            var bearingCost = "";
            var inverterCost = "";
            for (var i = 0; i < this.names.length; i++) {
                if (this.names[i] != "") {
                    name += "&name" + (i + 1).toString() + "=" + this.names[i];
                }
                else {
                    name += "&name" + (i + 1).toString() + "=-";
                }
            }
            for (var i = 0; i < this.volumes.length; i++) {
                if (this.volumes[i] != null) {
                    volume += "&motorVolume" + (i + 1).toString() + "=" + this.volumes[i].toString();
                }
                else {
                    volume += "&motorVolume" + (i + 1).toString() + "=0";
                }
            }
            for (var i = 0; i < this.unitCounts.length; i++) {
                if (this.unitCounts[i] != null) {
                    unit += "&unitCount" + (i + 1).toString() + "=" + this.unitCounts[i].toString();
                }
                else {
                    unit += "&unitCount" + (i + 1).toString() + "=0";
                }
            }
            for (var i = 20; i <= 100; i = i + 10) {
                if (this.hours[i] != null) {
                    hour += "&hour" + i.toString() + "=" + this.hours[i].toString();
                }
                else {
                    hour += "&hour" + i.toString() + "=0";
                }
            }
            for (var i = 0; i < this.initialCosts.length; i++) {
                if (this.initialCosts[i] != null) {
                    initialCost += "&initialCost" + i.toString() + "=" + this.initialCosts[i].toString();
                }
                else {
                    initialCost += "&initialCost" + i.toString() + "=0";
                }
            }
            for (var i = 0; i < this.bearingCosts.length; i++) {
                if (this.bearingCosts[i] != null) {
                    bearingCost += "&bearingCost" + i.toString() + "=" + this.bearingCosts[i].toString();
                }
                else {
                    bearingCost += "&bearingCost" + i.toString() + "=0";
                }
            }
            for (var i = 0; i < this.inverterCosts.length; i++) {
                if (this.inverterCosts[i] != null) {
                    inverterCost += "&inverterCost" + i.toString() + "=" + this.inverterCosts[i].toString();
                }
                else {
                    inverterCost += "&inverterCost" + i.toString() + "=0";
                }
            }
            return "machine=2&runType=" + this.runType.toString()
                + "&dayPerYear=" + this.dayPerYear.toString() + "&electricityCharge=" + this.electricityCharge.toString()
                + "&co2Rate=" + this.co2Rate.toString() + name + volume + unit + hour + "&currency=" + this.currency
                + initialCost + bearingCost + inverterCost;
        };
        CalcFan.prototype.GetTotalVolume = function () {
            var totalVolume = [0, 0, 0];
            if (this.volumes == null) {
                return null;
            }
            for (var i = 0; i < this.volumes.length; i++) {
                if (this.volumes[i] <= 15) {
                    totalVolume[0] += this.volumes[i] * this.unitCounts[i];
                }
                else if (this.volumes[i] >= 18.5 && this.volumes[i] <= 45) {
                    totalVolume[1] += this.volumes[i] * this.unitCounts[i];
                }
                else if (this.volumes[i] >= 55) {
                    totalVolume[2] += this.volumes[i] * this.unitCounts[i];
                }
            }
            return totalVolume;
        };
        CalcFan.prototype.CalcEnergy = function () {
            var totalVolume = [0, 0, 0];
            var fileHundler = new Common.File();
            this.dataArray = fileHundler.readCsvFile(this.csvFileName);
            totalVolume = this.GetTotalVolume();
            var defalutIndex = 2 + this.runType;
            for (var hour in this.calEnergy) {
                var timeFactor = this.hours[hour] * this.dayPerYear;
                for (var lineCount = 0; lineCount < this.dataArray.length; lineCount++) {
                    var line = this.dataArray[lineCount];
                    if (line[1] == hour) {
                        var kwRegion = parseInt(line[0]);
                        this.calEnergy[hour][MachineType.DEFAULT] += parseFloat(line[defalutIndex]) * totalVolume[kwRegion - 1] * timeFactor;
                        this.calEnergy[hour][MachineType.SFJR] += parseFloat(line[5]) * totalVolume[kwRegion - 1] * timeFactor;
                        this.calEnergy[hour][MachineType.SFHR] += parseFloat(line[6]) * totalVolume[kwRegion - 1] * timeFactor;
                        this.calEnergy[hour][MachineType.SFPR] += parseFloat(line[7]) * totalVolume[kwRegion - 1] * timeFactor;
                        this.calEnergy[hour][MachineType.MMEFS] += parseFloat(line[8]) * totalVolume[kwRegion - 1] * timeFactor;
                    }
                }
            }
            return this.calEnergy;
        };
        CalcFan.prototype.GetDataByParam = function (totalVolumeRange, runType, machineType, percentage) {
            var retPower;
            var targetIndex;
            if (this.dataArray == null) {
                var fileHundler = new Common.File();
                this.dataArray = fileHundler.readCsvFile(this.csvFileName);
            }
            for (var lineCount = 0; lineCount < this.dataArray.length; lineCount++) {
                var line = this.dataArray[lineCount];
                if (totalVolumeRange == parseInt(line[0]) && percentage == parseInt(line[1])) {
                    if (machineType == MachineType.DEFAULT) {
                        targetIndex = 2 + runType;
                    }
                    else {
                        targetIndex = 4 + machineType;
                    }
                    retPower = parseFloat(line[targetIndex]);
                    break;
                }
            }
            return retPower;
        };
        CalcFan.prototype.makeLifeCycleCostData = function (totalOutput, priceScale) {
            var lifeCycleCosts = new Array();
            for (var machineType in MachineType) {
                var isValueProperty = parseInt(machineType, 10) >= 0;
                if (isValueProperty) {
                    lifeCycleCosts[machineType] = new Array();
                    lifeCycleCosts[machineType][0] = this.initialCosts[machineType];
                    for (var i = 1; i < 21; i++) {
                        lifeCycleCosts[machineType][i] = lifeCycleCosts[machineType][i - 1] + totalOutput[machineType] * this.electricityCharge;
                        if (i % 3 == 0 && machineType != MachineType.MMEFS) {
                            lifeCycleCosts[machineType][i] += this.bearingCosts[machineType];
                        }
                        else if (i % 6 == 0 && machineType == MachineType.MMEFS) {
                            lifeCycleCosts[machineType][i] += this.bearingCosts[machineType];
                        }
                        else if (i % 10 == 0 && machineType != MachineType.DEFAULT) {
                            lifeCycleCosts[machineType][i] += this.inverterCosts[machineType];
                        }
                    }
                    for (var i = 0; i < lifeCycleCosts[machineType].length; i++) {
                        lifeCycleCosts[machineType][i] = lifeCycleCosts[machineType][i] / priceScale;
                    }
                }
            }
            return lifeCycleCosts;
        };
        return CalcFan;
    })();
    Fan.CalcFan = CalcFan;
})(Fan || (Fan = {}));
//# sourceMappingURL=fan.js.map