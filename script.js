// FAQ Collapsible Logic
const answers = document.querySelectorAll('.answer');
const questions = document.querySelectorAll('.question');

answers.forEach(answer => (answer.style.display = 'none'));

questions.forEach((question, idx) => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.display === 'block';
        answers.forEach(a => (a.style.display = 'none'));
        if (!isOpen) answer.style.display = 'block';
        else answer.style.display = 'none';
        // Arrow icon rotation
        document.querySelectorAll('.question img').forEach(img => img.style.transform = 'rotate(0deg)');
        const img = question.querySelector('img');
        if (!isOpen) img.style.transform = 'rotate(180deg)';
        else img.style.transform = 'rotate(0deg)';
    });
});


// Dark/Light Mode Toggle
const themeToggle = document.getElementById('themeToggle');
function setTheme(dark) {
    if (dark) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙 Dark Mode';
    }
}
themeToggle.onclick = () => {
    setTheme(!document.body.classList.contains('dark-mode'));
};
if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme(true);


// Notification Banner Logic
const notificationBanner = document.getElementById('notificationBanner');
const closeBanner = document.getElementById('closeBanner');
function showBanner() {
    notificationBanner.style.display = 'block';
}
function hideBanner() {
    notificationBanner.style.display = 'none';
}
window.addEventListener('DOMContentLoaded', showBanner);
closeBanner.addEventListener('click', hideBanner);


// Event Slider & Popup
const events = [
    {
        title: "Hackathon 2025",
        date: "Oct 10, 2025",
        description: "Join our annual hackathon and win exciting prizes!"
    },
    {
        title: "Tech Talk: AI Trends",
        date: "Nov 2, 2025",
        description: "A session on the latest trends in Artificial Intelligence."
    },
    {
        title: "Workshop: Web Security",
        date: "Dec 5, 2025",
        description: "Hands-on workshop on modern web security practices."
    }
];

const sliderTrack = document.querySelector('.slider-track');
let currentEvent = 0;

function renderEvent(idx) {
    const event = events[idx];
    sliderTrack.innerHTML = `
        <div class="event-card" tabindex="0">
            <h3 style="margin-top:0;">${event.title}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p>${event.description}</p>
            <button class="btn open-popup" style="margin-top:1rem;">Details</button>
        </div>
    `;
}
renderEvent(currentEvent);

document.getElementById('prevEvent').onclick = () => {
    currentEvent = (currentEvent - 1 + events.length) % events.length;
    renderEvent(currentEvent);
};
document.getElementById('nextEvent').onclick = () => {
    currentEvent = (currentEvent + 1) % events.length;
    renderEvent(currentEvent);
};


// Popup Modal
let modal = document.querySelector('.modal');
if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" aria-label="Close">&times;</button>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
}
const modalBody = modal.querySelector('.modal-body');
const closeModalBtn = modal.querySelector('.close-modal');

sliderTrack.addEventListener('click', e => {
    if (e.target.classList.contains('open-popup')) {
        const event = events[currentEvent];
        modalBody.innerHTML = `
            <h3 style="margin-top:0;">${event.title}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p>${event.description}</p>
        `;
        modal.classList.add('active');
        closeModalBtn.focus();
    }
});
closeModalBtn.onclick = () => modal.classList.remove('active');
modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.remove('active');
});

