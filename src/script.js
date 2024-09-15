document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.carousel__item');
    let currentIndex = 0;

    function showItem(index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    function updateIndex(increment) {
        currentIndex = (currentIndex + increment + items.length) % items.length;
        showItem(currentIndex);
    }

    // Afficher le premier élément par défaut
    showItem(currentIndex);

    document.getElementById('nextBtn').addEventListener('click', () => updateIndex(1));
    document.getElementById('prevBtn').addEventListener('click', () => updateIndex(-1));

    const form = document.getElementById('circuitForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const resistance = parseFloat(document.getElementById('resistance').value);
        const inductance = parseFloat(document.getElementById('inductance').value);
        const capacitance = parseFloat(document.getElementById('capacitance').value);
        const voltage = parseFloat(document.getElementById('voltage').value);

        const activeImage = items[currentIndex].querySelector('img').src.split('/').pop();

        let equationResult;
        let data;

        if (activeImage === "Rlc_en_serie.png") {
            equationResult = calculateRLCSerie(resistance, inductance, capacitance, voltage);
            data = generateChartData(equationResult);
        } else if (activeImage === "Rlc_en_parallele.png") {
            equationResult = calculateRLCParallel(resistance, inductance, capacitance, voltage);
            data = generateChartData(equationResult);
        } else if (activeImage === "Filtre_passe_bas.png") {
            equationResult = calculateLowPassFilter(resistance, inductance, capacitance, voltage);
            data = generateChartData(equationResult);
        }

        updateChart(data);
    });

    // Fonction de calculs
    function calculateRLCSerie(R, L, C, E) {
        const omega = 1 / Math.sqrt(L * C);
        const alpha = R / (2 * L);
        return (t) => E * Math.exp(-alpha * t) * Math.cos(omega * t);
    }

    function calculateRLCParallel(R, L, C, E) {
        const omega = 1 / Math.sqrt(L * C);
        const alpha = R / (2 * L);
        return (t) => E * Math.exp(-alpha * t) * Math.sin(omega * t);
    }

    function calculateLowPassFilter(R, L, C, E) {
        const tau = R * C;
        return (t) => E * (1 - Math.exp(-t / tau));
    }

    function generateChartData(equation) {
        const dataPoints = 100;
        const maxTime = 10;
        const labels = Array.from({ length: dataPoints }, (_, i) => i * (maxTime / dataPoints));
        const data = labels.map(t => ({
            x: t,
            y: equation(t)
        }));
        return { labels, data };
    }

    function updateChart(chartData) {
        const totalDuration = 10000; // Durée totale augmentée
        const delayBetweenPoints = totalDuration / chartData.data.length;
        const previousY = (ctx) => ctx.index === 0
            ? ctx.chart.scales.y.getPixelForValue(chartData.data[0].y)
            : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

        const animation = {
            x: {
                type: 'number',
                easing: 'easeInOutQuad',
                duration: 200,
                from: NaN,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) return 0;
                    ctx.xStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            },
            y: {
                type: 'number',
                easing: 'easeInOutQuad',
                duration: 500,
                from: previousY,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.yStarted) return 0;
                    ctx.yStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            }
        };

        const ctx = document.getElementById('rlcChart').getContext('2d');

        if (window.myChart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'q(t)',
                    data: chartData.data,
                    borderColor: '#283030',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 1,
                }]
            },
            options: {
                responsive: true,
                animation: animation,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Temps (s)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(2);
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Charge q(t)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
});
