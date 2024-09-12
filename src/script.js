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
