// Optioneel: ECharts helper voor responsive behavior en themas
const echartSetOption = (chart, userOptions, getDefaultOptions) => {
  chart.setOption(_.merge(getDefaultOptions(), userOptions)); // LoDash merge voor custom opties

  // Resize bij venster-verandering
  window.addEventListener('resize', () => {
    chart.resize();
  });

  // Thema switch (optioneel)
  document.body.addEventListener('clickControl', ({ detail: { control } }) => {
    if (control === 'phoenixTheme') {
      chart.setOption(_.merge(getDefaultOptions(), userOptions));
    }
  });
};

// 🔋 Jouw PV-grafiek (voorbeeld met 3 omvormers)
const pvPowerChartInit = () => {
  const $chart = document.querySelector('.echart-pv-power');
  if ($chart) {
    const chart = echarts.init($chart);

    fetch('/api/pv-power')  // <<< Jouw Flask API-route
      .then(response => response.json())
      .then(apiData => {
        const options = {
          tooltip: { trigger: 'axis' },
          legend: { data: apiData.labels },  // Labels uit Python meegeven
          xAxis: { type: 'category', data: apiData.tijden },
          yAxis: { type: 'value' },
          series: apiData.series  // Series-structuur volledig uit Python
        };
        chart.setOption(options);
      });
  }
};

document.addEventListener('DOMContentLoaded', pvPowerChartInit);


const productionChartInit = () => {
    const { getColor, getData } = window.phoenix.utils;
    const $productionChart = document.querySelector('.echart-production');

    if ($productionChart) {
        const userOptions = getData($productionChart, 'echarts');
        const chart = window.echarts.init($productionChart);

        const getDefaultOptions = () => ({
            color: [getColor('primary'), getColor('primary-bg-subtle')],
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                padding: [7, 10],
                backgroundColor: getColor('body-highlight-bg'),
                borderColor: getColor('border-color'),
                textStyle: { color: getColor('light-text-emphasis') },
                borderWidth: 1,
                transitionDuration: 0,
                formatter: params => {
                    return `<strong>${params[0].axisValue}:</strong> ${params[0].value} kWh`;
                },
                extraCssText: 'z-index: 1000'
            },
            xAxis: {
                type: 'category',
                data: [],
                axisLabel: { color: getColor('secondary-color') },
                axisLine: { lineStyle: { color: getColor('secondary-bg') } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: getColor('secondary-color') },
                splitLine: { lineStyle: { color: getColor('secondary-bg') } }
            },
            series: [
                {
                    name: 'Productie',
                    type: 'bar',
                    data: [],
                    barWidth: '50%',
                    itemStyle: { borderRadius: [4, 4, 0, 0] }
                }
            ],
            grid: { left: 10, right: 10, bottom: 0, top: 10, containLabel: true }
        });

        fetch('/api/production')
            .then(response => response.json())
            .then(data => {
                chart.setOption({
                    xAxis: { data: data.dates },
                    series: [{ data: data.production }]
                });
            });

        echartSetOption(chart, userOptions, getDefaultOptions);
    }
};

document.addEventListener('DOMContentLoaded', productionChartInit);
