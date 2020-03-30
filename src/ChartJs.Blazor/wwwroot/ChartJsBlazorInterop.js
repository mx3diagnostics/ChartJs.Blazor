/* Set up all the chartjs interop stuff */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/// <reference path="types/Chart.min.d.ts" />   
var ChartJsInterop = /** @class */ (function () {
    function ChartJsInterop() {
        var _this = this;
        this.BlazorCharts = new Map();
        /**
         * Given an IClickHandler (see the C# code), it tries to recover the referenced handler.
         * It currently supports Javascript functions, which are expected to be attached to the window object; .Net static functions and .Net object instance methods
         *
         * Failing to recover any handler from the IClickHandler, it returns the default handler.
         *
         * @param iClickHandler
         * @param chartJsDefaultHandler
         * @constructor
         */
        this.GetHandler = function (iClickHandler, chartJsDefaultHandler) {
            if (iClickHandler) {
                // Js function
                if (typeof iClickHandler === "object" &&
                    iClickHandler.hasOwnProperty('fullFunctionName')) {
                    var onClickStringName = iClickHandler;
                    var onClickNamespaceAndFunc = onClickStringName.fullFunctionName.split(".");
                    var onClickFunc = window[onClickNamespaceAndFunc[0]][onClickNamespaceAndFunc[1]];
                    if (typeof onClickFunc === "function") {
                        return onClickFunc;
                    }
                    else { // fallback to the default
                        return chartJsDefaultHandler;
                    }
                }
                // .Net static method
                else if (typeof iClickHandler === "object" &&
                    iClickHandler.hasOwnProperty('assemblyName') &&
                    iClickHandler.hasOwnProperty('methodName')) {
                    return (function () {
                        var onClickStatickHandler = iClickHandler;
                        var assemblyName = onClickStatickHandler.assemblyName;
                        var methodName = onClickStatickHandler.methodName;
                        return function (sender, args) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // This is sometimes necessary in order to avoid circular reference errors during JSON serialization
                                        args = this.GetCleanArgs(args);
                                        return [4 /*yield*/, DotNet.invokeMethodAsync(assemblyName, methodName, sender, args)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                    })();
                }
                // .Net instance method
                else if (typeof iClickHandler === "object" &&
                    iClickHandler.hasOwnProperty('instanceRef') &&
                    iClickHandler.hasOwnProperty('methodName')) {
                    return (function () {
                        var onClickInstanceHandler = iClickHandler;
                        var instanceRef = onClickInstanceHandler.instanceRef;
                        var methodName = onClickInstanceHandler.methodName;
                        return function (sender, args) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // This is sometimes necessary in order to avoid circular reference errors during JSON serialization
                                        args = this.GetCleanArgs(args);
                                        return [4 /*yield*/, instanceRef.invokeMethodAsync(methodName, sender, args)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                    })();
                }
            }
            else { // fallback to the default
                return chartJsDefaultHandler;
            }
        };
        this.GetCleanArgs = function (args) {
            // ToDo: refactor the function to clean up the args of each chart type 
            return typeof args['map'] === 'function' ?
                args.map(function (e) {
                    var newE = Object.assign({}, e, { _chart: undefined }, { _xScale: undefined }, { _yScale: undefined });
                    return newE;
                }) : args;
        };
    }
    ChartJsInterop.prototype.SetupChart = function (config) {
        if (!this.BlazorCharts.has(config.canvasId)) {
            if (!config.options.legend)
                config.options.legend = {};
            var thisChart = this.initializeChartjsChart(config);
            this.BlazorCharts.set(config.canvasId, thisChart);
            return true;
        }
        else {
            return this.UpdateChart(config);
        }
    };
    ChartJsInterop.prototype.UpdateChart = function (config) {
        if (!this.BlazorCharts.has(config.canvasId))
            throw "Could not find a chart with the given id. " + config.canvasId;
        var myChart = this.BlazorCharts.get(config.canvasId);
        /// Handle datasets
        this.HandleDatasets(myChart, config);
        /// Handle labels
        this.MergeLabels(myChart, config);
        // Redo any wiring up
        this.WireUpFunctions(config);
        // Handle options - mutating the Options seems better because the rest of the computed options members are preserved
        Object.entries(config.options).forEach(function (e) {
            myChart.config.options[e[0]] = e[1];
        });
        myChart.update();
        return true;
    };
    ChartJsInterop.prototype.HandleDatasets = function (myChart, config) {
        // Remove any datasets the aren't in the new config
        var dataSetsToRemove = myChart.config.data.datasets.filter(function (d) { return config.data.datasets.find(function (newD) { return newD.id === d.id; }) === undefined; });
        for (var _i = 0, dataSetsToRemove_1 = dataSetsToRemove; _i < dataSetsToRemove_1.length; _i++) {
            var d = dataSetsToRemove_1[_i];
            var indexToRemoveAt = myChart.config.data.datasets.indexOf(d);
            if (indexToRemoveAt != -1) {
                myChart.config.data.datasets.splice(indexToRemoveAt, 1);
            }
        }
        // Add new datasets
        var dataSetsToAdd = config.data.datasets.filter(function (newD) { return myChart.config.data.datasets.find(function (d) { return newD.id === d.id; }) === undefined; });
        dataSetsToAdd.forEach(function (d) { return myChart.config.data.datasets.push(d); });
        // Update any existing datasets
        var datasetsToUpdate = myChart.config.data.datasets
            .filter(function (d) { return config.data.datasets.find(function (newD) { return newD.id === d.id; }) !== undefined; })
            .map(function (d) { return ({ oldD: d, newD: config.data.datasets.find(function (val) { return val.id === d.id; }) }); });
        datasetsToUpdate.forEach(function (pair) {
            // pair.oldD.data.slice(0, pair.oldD.data.length);
            // pair.newD.data.forEach(newEntry => pair.oldD.data.push(newEntry));
            Object.entries(pair.newD).forEach(function (entry) { return pair.oldD[entry[0]] = entry[1]; });
        });
    };
    ChartJsInterop.prototype.MergeLabels = function (myChart, config) {
        if (config.data.labels === undefined || config.data.labels.length === 0) {
            myChart.config.data.labels = new Array();
            return;
        }
        if (!myChart.config.data.labels) {
            myChart.config.data.labels = new Array();
        }
        // clear existing labels
        myChart.config.data.labels.splice(0, myChart.config.data.labels.length);
        // add all the new labels
        config.data.labels.forEach(function (l) { return myChart.config.data.labels.push(l); });
    };
    ChartJsInterop.prototype.initializeChartjsChart = function (config) {
        var ctx = document.getElementById(config.canvasId);
        this.WireUpFunctions(config);
        var myChart = new Chart(ctx, config);
        return myChart;
    };
    ChartJsInterop.prototype.WireUpFunctions = function (config) {
        // replace the Legend's OnHover function name with the actual function (if present)
        this.WireUpLegendOnHover(config);
        // replace the Options' OnClick function name with the actual function (if present)
        this.WireUpOptionsOnClickFunc(config);
        // replace the Options.Hover.OnHover func name with the actual function (if present)
        this.WireUpOptionsOnHoverFunc(config);
        // replace the Legend's OnClick function name with the actual function (if present)
        this.WireUpLegendOnClick(config);
        // replace the Label's GenerateLabels function name with the actual function (if present)
        this.WireUpGenerateLabelsFunc(config);
        // replace the Label's Filter function name with the actual function (if present)
        // see details here: http://www.chartjs.org/docs/latest/configuration/legend.html#legend-label-configuration
        this.WireUpLegendItemFilterFunc(config);
    };
    ChartJsInterop.prototype.WireUpLegendItemFilterFunc = function (config) {
        if (config.options.legend.labels === undefined)
            config.options.legend.labels = {};
        if (config.options.legend.labels.filter &&
            typeof config.options.legend.labels.filter === "string" &&
            config.options.legend.labels.filter.includes(".")) {
            var filtersNamespaceAndFunc = config.options.legend.labels.filter.split(".");
            var filterFunc = window[filtersNamespaceAndFunc[0]][filtersNamespaceAndFunc[1]];
            if (typeof filterFunc === "function") {
                config.options.legend.labels.filter = filterFunc;
            }
            else { // fallback to the default, which is null
                config.options.legend.labels.filter = null;
            }
        }
        else { // fallback to the default, which is null
            config.options.legend.labels.filter = null;
        }
    };
    ChartJsInterop.prototype.WireUpGenerateLabelsFunc = function (config) {
        var getDefaultFunc = function (type) {
            var defaults = Chart.defaults[type] || Chart.defaults.global;
            if (defaults.legend &&
                defaults.legend.labels &&
                defaults.legend.labels.generateLabels) {
                return defaults.legend.labels.generateLabels;
            }
            return Chart.defaults.global.legend.labels.generateLabels;
        };
        if (config.options.legend.labels === undefined)
            config.options.legend.labels = {};
        if (config.options.legend.labels.generateLabels &&
            typeof config.options.legend.labels.generateLabels === "string" &&
            config.options.legend.labels.generateLabels.includes(".")) {
            var generateLabelsNamespaceAndFunc = config.options.legend.labels.generateLabels.split(".");
            var generateLabelsFunc = window[generateLabelsNamespaceAndFunc[0]][generateLabelsNamespaceAndFunc[1]];
            if (typeof generateLabelsFunc === "function") {
                config.options.legend.labels.generateLabels = generateLabelsFunc;
            }
            else { // fallback to the default
                config.options.legend.labels.generateLabels = getDefaultFunc(config.type);
            }
        }
        else { // fallback to the default
            config.options.legend.labels.generateLabels = getDefaultFunc(config.type);
        }
    };
    ChartJsInterop.prototype.WireUpOptionsOnClickFunc = function (config) {
        var getDefaultFunc = function (type) {
            var defaults = Chart.defaults[type] || Chart.defaults.global;
            return (defaults === null || defaults === void 0 ? void 0 : defaults.onClick) || undefined;
        };
        config.options.onClick = this.GetHandler(config.options.onClick, getDefaultFunc(config.type));
    };
    ChartJsInterop.prototype.WireUpOptionsOnHoverFunc = function (config) {
        var getDefaultFunc = function (type) {
            var _a;
            var defaults = Chart.defaults[type] || Chart.defaults.global;
            return ((_a = defaults === null || defaults === void 0 ? void 0 : defaults.hover) === null || _a === void 0 ? void 0 : _a.onHover) || undefined;
        };
        if (config.options.hover) {
            config.options.hover.onHover = this.GetHandler(config.options.hover.onHover, getDefaultFunc(config.type));
        }
    };
    ChartJsInterop.prototype.WireUpLegendOnClick = function (config) {
        var getDefaultHandler = function (type) {
            var _a, _b, _c;
            var chartDefaults = Chart.defaults[type];
            return ((_a = chartDefaults === null || chartDefaults === void 0 ? void 0 : chartDefaults.legend) === null || _a === void 0 ? void 0 : _a.onClick) || ((_c = (_b = Chart.defaults.global) === null || _b === void 0 ? void 0 : _b.legend) === null || _c === void 0 ? void 0 : _c.onClick) || undefined;
        };
        config.options.legend.onClick = this.GetHandler(config.options.legend.onClick, getDefaultHandler(config.type));
    };
    ChartJsInterop.prototype.WireUpLegendOnHover = function (config) {
        var getDefaultFunc = function (type) {
            var _a, _b, _c;
            var chartDefaults = Chart.defaults[type];
            return ((_a = chartDefaults === null || chartDefaults === void 0 ? void 0 : chartDefaults.legend) === null || _a === void 0 ? void 0 : _a.onHover) || ((_c = (_b = Chart.defaults.global) === null || _b === void 0 ? void 0 : _b.legend) === null || _c === void 0 ? void 0 : _c.onHover) || undefined;
        };
        config.options.legend.onHover = this.GetHandler(config.options.legend.onHover, getDefaultFunc(config.type));
    };
    return ChartJsInterop;
}());
/* Set up all the momentjs interop stuff */
/// <reference path="types/moment.d.ts" />
var MomentJsInterop = /** @class */ (function () {
    function MomentJsInterop() {
    }
    MomentJsInterop.prototype.getAvailableMomentLocales = function () {
        return moment.locales();
    };
    MomentJsInterop.prototype.getCurrentLocale = function () {
        return moment.locale();
    };
    MomentJsInterop.prototype.changeLocale = function (locale) {
        if (typeof locale !== 'string') {
            throw 'locale must be a string';
        }
        var cur = this.getCurrentLocale();
        // if the current locale is the one requested, we don't need to do anything
        if (locale === cur)
            return false;
        // set locale
        var newL = moment.locale(locale);
        // if the new locale is the same as the old one, it was not changed - probably because momentJs didn't find that locale
        if (cur === newL)
            throw 'the locale \'' + locale + '\' could not be set. It was probably not found.';
        return true;
    };
    return MomentJsInterop;
}());
/// <reference path="ChartJsInterop.ts" />
/// <reference path="MomentJsInterop.ts" />
function AttachChartJsInterop() {
    window.ChartJsInterop = new ChartJsInterop();
}
AttachChartJsInterop();
function AttachMomentJsInterop() {
    window.MomentJsInterop = new MomentJsInterop();
}
AttachMomentJsInterop();
//# sourceMappingURL=ChartJsBlazorInterop.js.map