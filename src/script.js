// Carousel functionality
import * as algo from "./algorithm.js";

document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.carousel__item');
    let currentIndex = 0;

    items.forEach((item, index) => {
        const image = item.querySelector('img');
        if (image) {
            const key = `NBR_${index + 1}`;
            if (algo.circuit[key]) {
                image.src = algo.circuit[key];
                image.alt = `Image ${index + 1}`;
            }
        }
    });

    function    get_data(t)
    {
        return ( labels.map(t => ({
            x: t,
            y: algo.eq_diff(t, key)
        })));
    }

    function showItem(index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    function updateIndex(increment) {
        currentIndex = (currentIndex + increment + items.length) % items.length;
        showItem(currentIndex);
    }

    // Show the first item by default
    showItem(currentIndex);

    document.getElementById('nextBtn').addEventListener('click', () => updateIndex(1));
    document.getElementById('prevBtn').addEventListener('click', () => updateIndex(-1));
});

// RLC Chart functionality
document.addEventListener('DOMContentLoaded', function () {
    const dataPoints = 100;
    const maxTime = 10;
    const labels = Array.from({ length: dataPoints }, (_, i) => i * (maxTime / dataPoints));
    const data = get_data(t);

    const totalDuration = 10000; // Increased duration
    const delayBetweenPoints = totalDuration / dataPoints;
    const previousY = (ctx) => ctx.index === 0
        ? ctx.chart.scales.y.getPixelForValue(data[0].y)
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
            easing: 'easeInOutQuad', // Smoother easing
            duration: 500, // Increased duration
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) return 0;
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    const ctx = document.getElementById('rlcChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Variation de q(t)',
                data: data,
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
});
