// تغییر تب‌ها
function showTab(index) {
    let buttons = document.querySelectorAll('.tab-button');
    let contents = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => btn.classList.remove('active'));
    contents.forEach(tab => tab.classList.remove('active'));

    buttons[index].classList.add('active');
    contents[index].classList.add('active');
}

// ساخت آکاردئون برای هر تب
function createAccordions() {
    for (let i = 0; i < 6; i++) {
        const container = document.getElementById(`accordion${i}`);
        for (let j = 1; j <= 10; j++) {
            const acc = document.createElement('button');
            acc.className = 'accordion';
            acc.innerHTML = `عنوان آکاردئون ${j} <span class="accordion-icon">▼</span>`;
            const panel = document.createElement('div');
            panel.className = 'panel';
            panel.innerHTML = `<p>این متن آکاردئون ${j} برای تب ${i + 1} است.</p>`;
            container.appendChild(acc);
            container.appendChild(panel);
        }
    }
}

// عملکرد آکاردئون‌ها
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('accordion') || e.target.closest('.accordion')) {
        const btn = e.target.closest('.accordion');
        btn.classList.toggle('active');
        const panel = btn.nextElementSibling;
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    }
});

// اجرای اولیه
createAccordions();