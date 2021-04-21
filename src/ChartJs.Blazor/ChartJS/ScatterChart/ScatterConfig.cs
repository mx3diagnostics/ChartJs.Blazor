using ChartJs.Blazor.ChartJS.Common;
using ChartJs.Blazor.ChartJS.Common.Enums;
using ChartJs.Blazor.ChartJS.LineChart;

namespace ChartJs.Blazor.ChartJS.ScatterChart
{
    public class ScatterConfig : ConfigBase<LineOptions, ScatterData>
    {
        public ScatterConfig() : base(ChartType.Scatter) { }
    }
}