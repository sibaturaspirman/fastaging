var Motor;
(function (Motor) {
    (function (RunType) {
        RunType[RunType["COMMERCIAL"] = 1] = "COMMERCIAL";
        RunType[RunType["INVERTER"] = 2] = "INVERTER";
    })(Motor.RunType || (Motor.RunType = {}));
    var RunType = Motor.RunType;
    (function (MachineType) {
        MachineType[MachineType["SFJR"] = 1] = "SFJR";
        MachineType[MachineType["SFHR"] = 2] = "SFHR";
        MachineType[MachineType["SFPR"] = 3] = "SFPR";
        MachineType[MachineType["MMEFS"] = 4] = "MMEFS";
    })(Motor.MachineType || (Motor.MachineType = {}));
    var MachineType = Motor.MachineType;
    var ValidateMotor = (function () {
        function ValidateMotor() {
        }
        ValidateMotor.prototype.Validation = function (elementId, elementValue, requiredFlg) {
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
            if (elementId != "voltSlashFreq" && elementValue != "") {
                if (isFinite(elementValue) == true) {
                    isNumber = true;
                    elementValueNumber = Math.abs(Number(elementValue));
                }
            }
            switch (elementId) {
                case "electricityCharge":
                    if (isEmpty) {
                        retValid[0] = "001";
                    }
                    else if (!isNumber) {
                        retValid[0] = "015";
                    }
                    break;
                case "co2Rate":
                    if (isEmpty) {
                        retValid[0] = "002";
                    }
                    else if (!isNumber) {
                        retValid[0] = "016";
                    }
                    break;
                case "volume":
                    if (isEmpty) {
                        retValid[0] = "003";
                    }
                    break;
                case "pole":
                    if (isEmpty) {
                        retValid[0] = "004";
                    }
                    break;
                case "voltSlashFreq":
                    if (isEmpty) {
                        retValid[0] = "005";
                    }
                    break;
                case "freq":
                    if (isEmpty) {
                        retValid[0] = "006";
                    }
                    else if (!isNumber) {
                        retValid[0] = "017";
                    }
                    else if (elementValueNumber < 3 || elementValueNumber > 60) {
                        retValid[0] = "011";
                    }
                    break;
                case "load":
                    if (isEmpty) {
                        retValid[0] = "007";
                    }
                    else if (!isNumber) {
                        retValid[0] = "018";
                    }
                    else if (elementValueNumber < 25 || elementValueNumber > 125) {
                        retValid[0] = "012";
                    }
                    break;
                case "unit":
                    if (isEmpty) {
                        retValid[0] = "008";
                    }
                    else if (!isNumber) {
                        retValid[0] = "019";
                    }
                    else if (elementValueNumber > 999) {
                        retValid[0] = "028";
                    }
                    break;
                case "hourPerDay":
                    if (isEmpty) {
                        retValid[0] = "009";
                    }
                    else if (!isNumber) {
                        retValid[0] = "020";
                    }
                    else if (elementValueNumber > 24) {
                        retValid[0] = "013";
                    }
                    break;
                case "dayPerYear":
                    if (isEmpty) {
                        retValid[0] = "010";
                    }
                    else if (!isNumber) {
                        retValid[0] = "021";
                    }
                    else if (elementValueNumber > 366) {
                        retValid[0] = "014";
                    }
                    break;
                case "price1":
                case "price2":
                case "price3":
                case "price4":
                    if (!isEmpty && !isNumber) {
                        retValid[0] = "023";
                    }
                    break;
                case "myMotorPrice":
                    if (!isEmpty && !isNumber) {
                        retValid[0] = "024";
                    }
                    break;
                case "otherEff50":
                case "otherEff75":
                case "otherEff100":
                    if (!isEmpty && !isNumber) {
                        retValid[0] = "025";
                    }
                    else if (elementValueNumber < 0 || elementValueNumber > 100) {
                        retValid[0] = "026";
                    }
                    break;
            }
            if (elementValueNumber >= 0) {
                retValid[1] = elementValueNumber.toString();
            }
            else {
                retValid[1] = elementValue;
            }
            return retValid;
        };
        return ValidateMotor;
    })();
    Motor.ValidateMotor = ValidateMotor;
    var CalcMotor = (function () {
        function CalcMotor(binFileName, binDataSize, runType, volumeKW, poleCnt, voltSlashFreq, freq, loadF100, unitCnt, hourPerDay, dayPerYear, electricityCharge, co2Rate, prices, motorTabIndex, myMotorLabel, myMotorPrice, myMotorEff, currency) {
            this.binFileName = binFileName;
            this.binDataSize = binDataSize;
            this.runType = runType;
            this.volumeKW = volumeKW;
            this.poleCnt = poleCnt;
            this.voltSlashFreq = voltSlashFreq;
            this.freq = freq;
            this.loadF100 = loadF100;
            this.unitCnt = unitCnt;
            this.hourPerDay = hourPerDay;
            this.dayPerYear = dayPerYear;
            this.electricityCharge = electricityCharge;
            this.co2Rate = co2Rate;
            this.prices = prices;
            this.motorTabIndex = motorTabIndex;
            this.myMotorLabel = myMotorLabel;
            this.myMotorPrice = myMotorPrice;
            this.myMotorEff = myMotorEff;
            this.byteKey = [45, 96, 26];
            this.shortKey = [13467, 2481, 10221];
            this.intKey = [50271496, 693288, 12430964];
            this.calEff100 = Array();
            this.currency = currency;
            for (var i = 0; i < MachineType.MMEFS.valueOf() ; i++) {
                this.calEff100[i] = -1;
            }
        }
        CalcMotor.prototype.GetParamString = function () {
            var price = "";
            for (var i = 0; i < MachineType.MMEFS.valueOf() ; i++) {
                if (this.prices[i] != null) {
                    price += "&price" + (i + 1).toString() + "=" + this.prices[i].toString();
                }
                else {
                    price += "&price" + (i + 1).toString() + "=0";
                }
            }
            return "machine=1&runType=" + this.runType.toString()
                + "&volume=" + this.volumeKW.toString() + "&pole=" + this.poleCnt.toString()
                + "&voltSlashFreq=" + encodeURIComponent(this.voltSlashFreq)
                + "&freq=" + this.freq.toString() + "&load=" + this.loadF100.toString()
                + "&unit=" + this.unitCnt.toString() + "&hourPerDay=" + this.hourPerDay.toString()
                + "&dayPerYear=" + this.dayPerYear.toString()
                + "&electricityCharge=" + this.electricityCharge.toString()
                + "&co2Rate=" + this.co2Rate.toString() + "&motorTabIndex=" + this.motorTabIndex
                + "&myMotorLabel=" + this.myMotorLabel + "&myMotorPrice=" + this.myMotorPrice
                + "&myMotorEff= " + this.myMotorEff + "&currency=" + this.currency + price;
        };
        CalcMotor.prototype.CalcEff = function (binData) {
            var i;
            var loss;
            var equalFixedFreqFlg;
            var highFreq;
            var lowFreq;
            var volt;
            var realOutputW;
            var isValueProperty;
            var fixedLoadF100 = Array();
            for (i = 0; i <= 4; i++) {
                fixedLoadF100[i] = 25 * (i + 1);
            }
            var fixedLoss = Array();
            if (this.runType == RunType.INVERTER) {
                var fixedFreq = Array(3, 20, 50, 60);
                volt = 200;
                equalFixedFreqFlg = false;
                for (i = 0; i <= fixedFreq.length; i++) {
                    if (this.freq == fixedFreq[i]) {
                        equalFixedFreqFlg = true;
                        break;
                    }
                    else if (this.freq < fixedFreq[i]) {
                        lowFreq = fixedFreq[i - 1];
                        highFreq = fixedFreq[i];
                        break;
                    }
                }
                realOutputW = this.volumeKW * (this.freq / 60) * (this.loadF100 / 100) * 1000;
                if (equalFixedFreqFlg == true) {
                    for (var machineType in MachineType) {
                        isValueProperty = parseInt(machineType, 10) >= 0;
                        if (isValueProperty) {
                            fixedLoss = this.ReadLossFromData(machineType, volt, this.freq, binData);
                            if (fixedLoss != null) {
                                loss = this.CulcLossByRowReduction(fixedLoss, this.loadF100);
                                this.calEff100[machineType - 1] = (realOutputW / (realOutputW + loss)) * 100;
                            }
                        }
                    }
                }
                else {
                    var lossOfHighFreq;
                    var lossOfLowFreq;
                    for (var machineType in MachineType) {
                        isValueProperty = parseInt(machineType, 10) >= 0;
                        if (isValueProperty) {
                            fixedLoss = this.ReadLossFromData(machineType, volt, highFreq, binData);
                            if (fixedLoss != null) {
                                lossOfHighFreq = this.CulcLossByRowReduction(fixedLoss, this.loadF100);
                            }
                            else {
                                lossOfHighFreq = 0;
                            }
                            fixedLoss = this.ReadLossFromData(machineType, volt, lowFreq, binData);
                            if (fixedLoss != null) {
                                lossOfLowFreq = this.CulcLossByRowReduction(fixedLoss, this.loadF100);
                            }
                            else {
                                lossOfLowFreq = 0;
                            }
                            if (lossOfHighFreq > 0 && lossOfLowFreq > 0) {
                                var calc = new Calc.LerpMethod(this.freq, lowFreq, highFreq, lossOfLowFreq, lossOfHighFreq);
                                loss = calc.Lerp();
                                this.calEff100[machineType - 1] = (realOutputW / (realOutputW + loss)) * 100;
                            }
                        }
                    }
                }
            }
            else {
                var tmpArray = Array();
                tmpArray = this.voltSlashFreq.split("/");
                volt = Number(tmpArray[0].trim());
                this.freq = Number(tmpArray[1].trim());
                realOutputW = this.volumeKW * (this.loadF100 / 100) * 1000;
                for (var machineType in MachineType) {
                    isValueProperty = parseInt(machineType, 10) >= 0;
                    if (isValueProperty) {
                        fixedLoss = this.ReadLossFromData(machineType, volt, this.freq, binData);
                        if (fixedLoss != null) {
                            loss = this.CulcLossByRowReduction(fixedLoss, this.loadF100);
                            this.calEff100[machineType - 1] = (realOutputW / (realOutputW + loss)) * 100;
                        }
                    }
                }
            }
            return this.calEff100;
        };
        CalcMotor.prototype.CalcOutputSumkW = function () {
            var outputSum;
            if (this.runType == RunType.INVERTER) {
                outputSum = this.volumeKW * (this.freq / 60) * (this.loadF100 / 100) * this.unitCnt;
            }
            else {
                outputSum = this.volumeKW * (this.loadF100 / 100) * this.unitCnt;
            }
            return outputSum;
        };
        CalcMotor.prototype.CalcInputkW = function (eff100, outputSum) {
            var ret = Array();
            for (var i = 0; i < eff100.length; i++) {
                if (eff100[i] > 0) {
                    ret[i] = outputSum / (eff100[i] / 100);
                }
                else {
                    ret[i] = -1;
                }
            }
            return ret;
        };
        CalcMotor.prototype.CalcPower = function (inputkW) {
            var ret = Array();
            for (var i = 0; i < inputkW.length; i++) {
                if (inputkW[i] > 0) {
                    ret[i] = Math.ceil(inputkW[i] * this.hourPerDay * this.dayPerYear);
                }
                else {
                    ret[i] = -1;
                }
            }
            return ret;
        };
        CalcMotor.prototype.CalcCharge = function (power) {
            var ret = Array();
            for (var i = 0; i < power.length; i++) {
                if (power[i] > 0) {
                    ret[i] = Math.ceil(power[i] * this.electricityCharge);
                }
                else {
                    ret[i] = 0;
                }
            }
            return ret;
        };
        CalcMotor.prototype.CalcCO2 = function (power) {
            var ret = Array();
            for (var i = 0; i < power.length; i++) {
                if (power[i] > 0) {
                    ret[i] = Math.ceil(power[i] * this.co2Rate) / 1000;
                }
                else {
                    ret[i] = -1;
                }
            }
            return ret;
        };
        CalcMotor.prototype.CalcDiff = function (inputArray) {
            var ret = Array();
            ret = [0, 0, 0, 0, 0, 0];
            if (inputArray.length < 4) {
                while (inputArray.length < 4) {
                    inputArray.push(-1);
                }
            }
            ret[0] = this.simpleDiff(inputArray[0], inputArray[1]);
            ret[1] = this.simpleDiff(inputArray[1], inputArray[2]);
            ret[2] = this.simpleDiff(inputArray[0], inputArray[2]);
            ret[3] = this.simpleDiff(inputArray[0], inputArray[3]);
            ret[4] = this.simpleDiff(inputArray[1], inputArray[3]);
            ret[5] = this.simpleDiff(inputArray[2], inputArray[3]);
            return ret;
        };
        CalcMotor.prototype.simpleDiff = function (input1, input2) {
            if (input1 >= 0 && input2 >= 0) {
                return input1 - input2;
            }
            else {
                return 0;
            }
        };
        CalcMotor.prototype.ReadLossFromData = function (machineType, volt, freq, dataArray) {
            var i;
            var method;
            var byteMachineType;
            var byteRunType;
            var shortVolume;
            var shortPole;
            var shortVolt;
            var shortFreq;
            var byteEnable;
            var intLoss = Array();
            method = 0;
            for (var lineCount = 0; lineCount * this.binDataSize <= dataArray.length; lineCount++) {
                method++;
                if (method >= 4) {
                    method = 1;
                }
                byteEnable = dataArray[lineCount * this.binDataSize + 10];
                if (byteEnable != 1) {
                    continue;
                }
                byteMachineType = this.convertMachineType(method, dataArray[lineCount * this.binDataSize]);
                if (byteMachineType != machineType) {
                    continue;
                }
                byteRunType = this.convertRunType(method, dataArray[lineCount * this.binDataSize + 1]);
                if (byteRunType != this.runType) {
                    continue;
                }
                shortVolume = this.convertVolume(method, this.Byte2ToShort(dataArray[lineCount * this.binDataSize + 3], dataArray[lineCount * this.binDataSize + 2]));
                if (shortVolume != Math.round(this.volumeKW * 100)) {
                    continue;
                }
                shortPole = this.Byte2ToShort(dataArray[lineCount * this.binDataSize + 5], dataArray[lineCount * this.binDataSize + 4]);
                if (shortPole != this.poleCnt) {
                    continue;
                }
                shortVolt = this.convertVolt(method, this.Byte2ToShort(dataArray[lineCount * this.binDataSize + 7], dataArray[lineCount * this.binDataSize + 6]));
                if (shortVolt != volt) {
                    continue;
                }
                shortFreq = this.Byte2ToShort(dataArray[lineCount * this.binDataSize + 9], dataArray[lineCount * this.binDataSize + 8]);
                if (shortFreq != freq) {
                    continue;
                }
                for (i = 0; i <= 4; i++) {
                    intLoss[i] = this.Byte4ToInt(dataArray[lineCount * this.binDataSize + 14 + 4 * i], dataArray[lineCount * this.binDataSize + 13 + 4 * i], dataArray[lineCount * this.binDataSize + 12 + 4 * i], dataArray[lineCount * this.binDataSize + 11 + 4 * i]);
                }
                intLoss = this.convertLoss(method, intLoss);
                return intLoss;
            }
            return null;
        };
        CalcMotor.prototype.convertMachineType = function (method, value) {
            switch (method) {
                case 1:
                    value = Number(parseInt((~value >>> 0).toString(16).slice(-2), 16).toString(10));
                    break;
                case 2:
                    value = Number(parseInt((~value >>> 0).toString(16).slice(-2), 16).toString(10));
                    break;
                case 3:
                    value = Number(parseInt(((value ^ this.byteKey[method - 1]) >>> 0).toString(16).slice(-2), 16).toString(10));
                    break;
            }
            return value;
        };
        CalcMotor.prototype.convertRunType = function (method, value) {
            switch (method) {
                case 1:
                    value = Number(parseInt(((value ^ this.byteKey[method - 1]) >>> 0).toString(16).slice(-2), 16).toString(10));
                    break;
                case 2:
                    value = Number(parseInt(((value ^ this.byteKey[method - 1]) >>> 0).toString(16).slice(-2), 16).toString(10));
                    break;
                case 3:
                    break;
            }
            return value;
        };
        CalcMotor.prototype.convertVolume = function (method, value) {
            if (value === void 0) { value = 0; }
            switch (method) {
                case 1:
                    value = Number(parseInt((value ^ this.shortKey[method - 1]).toString(16).slice(-4), 16).toString(10));
                    break;
                case 2:
                    value = Number(parseInt((value ^ this.shortKey[method - 1]).toString(16).slice(-4), 16).toString(10));
                    break;
                case 3:
                    value = Number(parseInt((~value).toString(16).slice(-4), 16).toString(10));
                    break;
            }
            return value;
        };
        CalcMotor.prototype.convertVolt = function (method, value) {
            switch (method) {
                case 1:
                    value = Number(parseInt((~value).toString(16).slice(-4), 16).toString(10));
                    break;
                case 2:
                    value = Number(parseInt((~value).toString(16).slice(-4), 16).toString(10));
                    break;
                case 3:
                    value = Number(parseInt((value ^ this.shortKey[method - 1]).toString(16).slice(-4), 16).toString(10));
                    break;
            }
            return value;
        };
        CalcMotor.prototype.convertLoss = function (method, value) {
            switch (method) {
                case 1:
                    value[0] = Number(parseInt((value[0] ^ this.intKey[method - 1]).toString(16).slice(-8), 16).toString(10));
                    value[1] = Number(parseInt((~value[1]).toString(16).slice(-8), 16).toString(10));
                    value[3] = Number(parseInt((value[3] ^ this.intKey[method - 1]).toString(16).slice(-8), 16).toString(10));
                    break;
                case 2:
                    value[2] = Number(parseInt((value[2] ^ this.intKey[method - 1]).toString(16).slice(-8), 16).toString(10));
                    value[3] = Number(parseInt((~value[3]).toString(16).slice(-8), 16).toString(10));
                    value[4] = Number(parseInt((value[4] ^ this.intKey[method - 1]).toString(16).slice(-8), 16).toString(10));
                    break;
                case 3:
                    value[0] = Number(parseInt((value[0] ^ this.intKey[method - 1]).toString(16).slice(-8), 16).toString(10));
                    value[1] = Number(parseInt((value[1] ^ this.intKey[method - 1]).toString(16).slice(-8), 16).toString(10));
                    value[2] = Number(parseInt((~value[2]).toString(16).slice(-8), 16).toString(10));
                    value[3] = Number(parseInt((~value[3]).toString(16).slice(-8), 16).toString(10));
                    value[4] = Number(parseInt((~value[4]).toString(16).slice(-8), 16).toString(10));
                    break;
                default:
                    break;
            }
            return value;
        };
        CalcMotor.prototype.Byte2ToShort = function (byte1, byte2) {
            var str16 = ("0" + byte1.toString(16)).slice(-2) + ("0" + byte2.toString(16)).slice(-2);
            var num10 = Number(parseInt(str16, 16).toString(10));
            if (num10 > 32767) {
                num10 = num10 - 65536;
            }
            return num10;
        };
        CalcMotor.prototype.Byte4ToInt = function (byte1, byte2, byte3, byte4) {
            var str16 = ("0" + byte1.toString(16)).slice(-2)
                + ("0" + byte2.toString(16)).slice(-2)
                + ("0" + byte3.toString(16)).slice(-2)
                + ("0" + byte4.toString(16)).slice(-2);
            var num10 = Number(parseInt(str16, 16).toString(10));
            if (num10 > 2147483647) {
                num10 = num10 - 4294967296;
            }
            return num10;
        };
        CalcMotor.prototype.CulcLossByRowReduction = function (fixedLoss, load100) {
            var fixedLoadF100 = Array();
            var Xpoints = Array();
            var Ypoints = Array();
            for (var i = 0; i <= 4; i++) {
                fixedLoadF100[i] = 25 * (i + 1);
            }
            if (load100 >= 25 && load100 < 75) {
                Xpoints = [fixedLoadF100[0], fixedLoadF100[1], fixedLoadF100[2]];
                Ypoints = [fixedLoss[0], fixedLoss[1], fixedLoss[2]];
            }
            else {
                Xpoints = [fixedLoadF100[2], fixedLoadF100[3], fixedLoadF100[4]];
                Ypoints = [fixedLoss[2], fixedLoss[3], fixedLoss[4]];
            }
            var calc = new Calc.SweepMethod(2, Xpoints, Ypoints);
            var coefficients;
            coefficients = calc.Sweep();
            var loss;
            loss = calc.CulcPolynomialFunction(coefficients, load100);
            return loss;
        };
        CalcMotor.prototype.makeLifeCycleCostData = function (machineType, eff100, prices, unit, returnYear, priceScale) {
            var lifeCycleCosts = new Array();
            var inputkW = this.CalcInputkW(eff100, this.CalcOutputSumkW());
            var power = this.CalcPower(inputkW);
            var charge = this.CalcCharge(power);
            var maxYear = Math.floor(returnYear);
            var num = 0, n = 0;
            if (maxYear <= 0) {
                maxYear = 5;
            }
            else {
                while (maxYear >= num) {
                    num = 5 * n;
                    n++;
                }
                maxYear = num;
                if (maxYear > 15) {
                    maxYear = 15;
                }
            }
            lifeCycleCosts[0] = new Array();
            lifeCycleCosts[1] = new Array();
            if (charge[3] > 0) {
                lifeCycleCosts[2] = new Array();
            }
            for (var i = 0; i <= maxYear; i++) {
                if (machineType == MachineType.SFHR) {
                    lifeCycleCosts[0][i] = Math.round((prices[1] * unit + charge[1] * i) / priceScale);
                }
                else {
                    lifeCycleCosts[0][i] = Math.round((prices[0] * unit + charge[0] * i) / priceScale);
                }
                lifeCycleCosts[1][i] = Math.round((prices[2] * unit + charge[2] * i) / priceScale);
                if (charge[3] > 0) {
                    lifeCycleCosts[2][i] = Math.round((prices[3] * unit + charge[3] * i) / priceScale);
                }
            }
            return lifeCycleCosts;
        };
        return CalcMotor;
    })();
    Motor.CalcMotor = CalcMotor;
    var MotorPrice = (function () {
        function MotorPrice() {
        }
        MotorPrice.prototype.GetPriceData = function (output, pole, volt, freq) {
            var retPrice = new Array();
            var targetIndex;
            var dataArray = new Array();
            for (var machineType in MachineType) {
                var isValueProperty = parseInt(machineType, 10) >= 0;
                if (isValueProperty) {
                    var fileName = "price" + machineType + ".csv";
                    var fileHundler = new Common.File();
                    dataArray = fileHundler.readCsvFile(fileName);
                    if (dataArray.length > 0) {
                        var price = 0;
                        for (var lineCount = 0; lineCount < dataArray.length; lineCount++) {
                            var line = dataArray[lineCount];
                            if (output == parseFloat(line[0]) && pole == parseInt(line[1])
                                && volt >= parseInt(line[2]) && volt <= parseInt(line[3])
                                && freq >= parseInt(line[4]) && freq <= parseInt(line[5])) {
                                price = parseFloat(line[6]);
                                break;
                            }
                        }
                        retPrice.push(price);
                    }
                    else {
                        retPrice.push(0);
                    }
                }
            }
            return retPrice;
        };
        return MotorPrice;
    })();
    Motor.MotorPrice = MotorPrice;
})(Motor || (Motor = {}));
//# sourceMappingURL=motor.js.map