const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

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

// Маска для телефона
const phone = document.getElementById('phone');
if (phone) {
  phone.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '').slice(0, 11);
    const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
    const parts = [];
    
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1, 4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
    if (d.length >= 8) parts.push('-' + d.slice(7, 9));
    if (d.length >= 10) parts.push('-' + d.slice(9, 11));
    
    phone.value = parts.join('');
    phone.setCustomValidity(''); // Сброс кастомной валидации при вводе
  });

  // Установка pattern для строгой проверки
  phone.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
}

openBtn.addEventListener('click', () => {
  lastActive = document.activeElement;
  dlg.showModal();
  dlg.querySelector('input, select, textarea, button')?.focus();
  successMessage.classList.add('hidden');
});

closeBtn.addEventListener('click', () => dlg.close('cancel'));

form?.addEventListener('submit', (e) => {
  // Сброс кастомных сообщений
  [...form.elements].forEach(el => el.setCustomValidity?.(''));
  
  if (!form.checkValidity()) {
    e.preventDefault();
    
    // Кастомные сообщения об ошибках
    const email = form.elements.email;
    if (email?.validity.typeMismatch) {
      email.setCustomValidity('Введите корректный e-mail, например: name@example.com');
    }
    
    const phone = form.elements.phone;
    if (phone?.validity.patternMismatch) {
      phone.setCustomValidity('Введите телефон в формате: +7 (999) 123-45-67');
    }
    
    // Теперь обновим атрибуты aria-invalid для всех полей ввода
    [...form.elements].forEach(el => {
      // Проверяем, есть ли у элемента checkValidity и это поле ввода (игнорируем кнопки)
      if (el.checkValidity && typeof el.checkValidity === 'function') {
        const isValid = el.checkValidity();
        el.setAttribute('aria-invalid', !isValid);
      }
    });
    
    form.reportValidity();
    return;
  }
  
  e.preventDefault();
  dlg.close('success');
  form.reset();
  successMessage.classList.remove('hidden');
  setTimeout(() => {
    successMessage.classList.add('hidden');
  }, 5000);
});

dlg.addEventListener('close', () => {
  lastActive?.focus();
});