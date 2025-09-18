const KEY = 'theme';
const themeBtn = document.querySelector('.theme-toggle');

if (themeBtn) {
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;

    // Устанавливаем тему при загрузке
    if (localStorage.getItem(KEY) === 'dark' || (!localStorage.getItem(KEY) && prefersDark)) {
        document.body.classList.add('theme-dark');
        themeBtn.setAttribute('aria-pressed', 'true');
    }

    // Переключаем тему по клику
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme-dark');
        themeBtn.setAttribute('aria-pressed', String(isDark));
        localStorage.setItem(KEY, isDark ? 'dark' : 'light');
    });
}
