document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const answer = item.querySelector('.faq-answer');
            answer.classList.toggle('active');ṇ
            const isActive = answer.classList.contains('active');
            question.setAttribute('aria-expanded', isActive);
        });
    });
});