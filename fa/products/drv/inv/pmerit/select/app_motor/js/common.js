var Common;
(function (Common) {
    var File = (function () {
        function File() {
            this.csvData = new Array();
        }
        File.prototype.readCsvFile = function (fileName) {
            var request = new XMLHttpRequest();
            request.open('GET', fileName, false);
            request.send();
            var LF = String.fromCharCode(10);
            if (request.status == 200) {
                var lines = request.responseText.split(LF);
                for (var i = 0; i < lines.length; i++) {
                    var cells = new Array();
                    cells = lines[i].split(",");
                    if (cells.length != 1) {
                        this.csvData.push(cells);
                    }
                }
            }
            return this.csvData;
        };
        File.prototype.readJsonFile = function (fileName) {
            var request = new XMLHttpRequest();
            request.open('GET', fileName, false);
            request.send();
            if (request.status == 200) {
                this.jsonData = JSON.parse(request.responseText);
            }
            return this.jsonData;
        };
        return File;
    })();
    Common.File = File;
    var Param = (function () {
        function Param() {
        }
        Param.prototype.GetQueryString = function () {
            if (1 < document.location.search.length) {
                var query = document.location.search.substring(1);
                var parameters = query.split('&');
                var result = new Object();
                for (var i = 0; i < parameters.length; i++) {
                    var element = parameters[i].split('=');
                    var paramName = decodeURIComponent(element[0]);
                    var paramValue = decodeURIComponent(element[1]);
                    result[paramName] = decodeURIComponent(paramValue);
                }
                return result;
            }
            return null;
        };
        Param.prototype.GetSettings = function (settingName) {
            var common = new File();
            var settingData = common.readJsonFile("setting.json");
            var settingValue = "";
            if (settingName in settingData["setting"][0]) {
                settingValue = settingData["setting"][0][settingName];
            }
            return settingValue;
        };
        Param.prototype.GetErrorMessage = function (errorCode) {
            var common = new File();
            var messageData = common.readJsonFile("message.json");
            var errorMessage = "";
            for (var error in messageData["error"]) {
                if (messageData["error"][parseInt(error)]["errorCode"] == errorCode) {
                    errorMessage = messageData["error"][parseInt(error)]["errorMessage"];
                    break;
                }
            }
            return errorMessage;
        };
        return Param;
    })();
    Common.Param = Param;
})(Common || (Common = {}));
//# sourceMappingURL=common.js.map