/// <reference path="ChartJsInterop.ts" />
/// <reference path="MomentJsInterop.ts" />

function AttachChartJsInterop(): void {
    (<any>window).ChartJsInterop = new ChartJsInterop();
}

AttachChartJsInterop();

function AttachMomentJsInterop(): void {
    (<any>window).MomentJsInterop = new MomentJsInterop();
}

AttachMomentJsInterop();
