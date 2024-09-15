document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
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

    showItem(currentIndex);

    document.getElementById('nextBtn').addEventListener('click', () => updateIndex(1));
    document.getElementById('prevBtn').addEventListener('click', () => updateIndex(-1));

    // RLC Chart functionality
    const form = document.getElementById('circuitForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const resistance = parseFloat(document.getElementById('resistance').value);
        const inductance = parseFloat(document.getElementById('inductance').value);
        const capacitance = parseFloat(document.getElementById('capacitance').value);
        const voltage = parseFloat(document.getElementById('voltage').value);

        const activeImage = items[currentIndex].querySelector('img').src.split('/').pop();

        let equation;
        if (activeImage === "Rlc_en_serie.png") {
            equation = (t, y) => {
                const [q, dq] = y;
                return [
                    dq,
                    (voltage - dq * resistance - q / capacitance) / inductance
                ];
            };
        } else if (activeImage === "Rlc_en_parallele.png") {
            equation = (t, y) => {
                const [q, dq] = y;
                return [
                    dq,
                    (voltage - dq / capacitance - q / inductance) / resistance
                ];
            };
        } else if (activeImage === "Filtre_passe_bas.png") {
            equation = (t, y) => {
                const [q, dq] = y;
                return [
                    dq,
                    (voltage - q / capacitance - dq * resistance) / inductance
                ];
            };
        }

        const initialConditions = [1, 0]; // Updated initial values for q and dq
        const result = rungeKutta4(equation, 0, 50, 0.01, initialConditions); // Extended time range and smaller step size
        const data = generateChartData(result);
        updateChart(data);
    });

    // Runge-Kutta 4th order method
    function rungeKutta4(equation, t0, tf, dt, y0) {
        const steps = Math.floor((tf - t0) / dt);
        const ts = [];
        const ys = [];
        let t = t0;
        let y = [...y0];

        for (let i = 0; i <= steps; i++) {
            ts.push(t);
            ys.push(y[0]);
            const k1 = equation(t, y);
            const k2 = equation(t + dt / 2, y.map((yi, j) => yi + k1[j] * dt / 2));
            const k3 = equation(t + dt / 2, y.map((yi, j) => yi + k2[j] * dt / 2));
            const k4 = equation(t + dt, y.map((yi, j) => yi + k3[j] * dt));
            y = y.map((yi, j) => yi + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
            t += dt;
        }
        return { ts, ys };
    }

    function generateChartData(result) {
        return {
            labels: result.ts,
            data: result.ys.map((y, i) => ({ x: result.ts[i], y }))
        };
    }

    function updateChart(chartData) {
        const totalDuration = 10000; // Increased duration
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
                    label: 'Variation de q(t)',
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
