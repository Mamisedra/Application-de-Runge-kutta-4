document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.carousel__item');
    let currentIndex = 0;

    function showItem(index) {
        items.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    // Show the first item by default
    showItem(currentIndex);

    document.getElementById('nextBtn').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    });

    document.getElementById('prevBtn').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    });
});

//blur machin

document.addEventListener('DOMContentLoaded', () => {
    const circlesContainer = document.querySelector('.circles');
    const colors = ['design', 'research'];

    function createCircle() {
        const circle = document.createElement('div');
        circle.className = `circle ${colors[Math.floor(Math.random() * colors.length)]}`;
        const size = Math.random() * (200 - 50) + 50;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.top = `${Math.random() * 100}vh`;
        circle.style.left = `${Math.random() * 100}vw`;
        circlesContainer.appendChild(circle);
    }

    for (let i = 0; i < 6; i++) {
        createCircle();
    }
});
