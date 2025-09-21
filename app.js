// DOM elements
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contactForm');

// Mobile menu functionality
let mobileMenuOpen = false;

mobileMenuBtn?.addEventListener('click', () => {
  mobileMenuOpen = !mobileMenuOpen;
  
  if (mobileMenuOpen) {
    nav.classList.add('nav--open');
    mobileMenuBtn.classList.add('mobile-menu-btn--open');
    document.body.style.overflow = 'hidden';
  } else {
    nav.classList.remove('nav--open');
    mobileMenuBtn.classList.remove('mobile-menu-btn--open');
    document.body.style.overflow = '';
  }
});

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenuOpen) {
      nav.classList.remove('nav--open');
      mobileMenuBtn.classList.remove('mobile-menu-btn--open');
      document.body.style.overflow = '';
      mobileMenuOpen = false;
    }
  });
});

// Header scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 100) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
  
  // Hide/show header on scroll
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  
  lastScrollY = currentScrollY;
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Form submission handling
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  
  // Validate required fields
  const requiredFields = ['nome', 'email', 'telefone', 'servico'];
  const emptyFields = requiredFields.filter(field => !data[field].trim());
  
  if (emptyFields.length > 0) {
    showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showMessage('Por favor, insira um e-mail válido.', 'error');
    return;
  }
  
  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.classList.add('btn--loading');
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;
  
  try {
    // Format WhatsApp message
    const whatsappMessage = formatWhatsAppMessage(data);
    
    // Show success message
    showMessage('Mensagem preparada! Você será redirecionado para o WhatsApp.', 'success');
    
    // Reset form
    contactForm.reset();
    
    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
      const whatsappUrl = `https://wa.me/5521994503162?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
    }, 1500);
    
  } catch (error) {
    console.error('Error sending message:', error);
    showMessage('Ocorreu um erro ao enviar a mensagem. Tente novamente.', 'error');
  } finally {
    // Reset button state
    submitBtn.classList.remove('btn--loading');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Format WhatsApp message
function formatWhatsAppMessage(data) {
  const serviceLabels = {
    'basico': 'Pacote Básico - Análise de Edital',
    'intermediario': 'Pacote Intermediário - Acompanhamento da Licitação',
    'completo': 'Pacote Completo - Gestão Jurídica da Licitação',
    'treinamento': 'Treinamentos e Workshops',
    'parecer': 'Parecer Jurídico Pontual',
    'impugnacao': 'Assessoria para Impugnação de Editais',
    'consorcio': 'Consultoria para Consórcios'
  };
  
  let message = `🏛️ *LICITADOR - Consultoria Jurídica*\n\n`;
  message += `👤 *Nome:* ${data.nome}\n`;
  
  if (data.empresa) {
    message += `🏢 *Empresa:* ${data.empresa}\n`;
  }
  
  message += `📧 *E-mail:* ${data.email}\n`;
  message += `📱 *Telefone:* ${data.telefone}\n`;
  message += `⚖️ *Serviço de Interesse:* ${serviceLabels[data.servico] || data.servico}\n`;
  
  if (data.mensagem) {
    message += `💬 *Mensagem:*\n${data.mensagem}\n`;
  }
  
  message += `\n---\n_Enviado através do site www.licitador.com.br_`;
  
  return message;
}

// Show message function
function showMessage(text, type = 'info') {
  // Remove existing messages
  const existingMessage = document.querySelector('.message-toast');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const message = document.createElement('div');
  message.className = `message-toast message-toast--${type}`;
  message.textContent = text;
  
  // Add styles
  message.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-error)' : 'var(--color-info)'};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1001;
    font-weight: 500;
    max-width: 350px;
    word-wrap: break-word;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(message);
  
  // Show message
  setTimeout(() => {
    message.style.transform = 'translateX(0)';
  }, 100);
  
  // Hide message after delay
  setTimeout(() => {
    message.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 300);
  }, 4000);
}

// Active section highlighting in navigation
const sections = document.querySelectorAll('section[id]');
const navLinksArray = Array.from(navLinks);

function highlightActiveSection() {
  const scrollPosition = window.scrollY + header.offsetHeight + 50;
  
  let activeSection = null;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      activeSection = section.id;
    }
  });
  
  // Update active nav link
  navLinksArray.forEach(link => {
    link.classList.remove('nav__link--active');
    if (link.getAttribute('href') === `#${activeSection}`) {
      link.classList.add('nav__link--active');
    }
  });
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Add scroll listener with throttling
window.addEventListener('scroll', throttle(highlightActiveSection, 100));

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  highlightActiveSection();
  
  // Add fade-in animation to elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const elementsToAnimate = document.querySelectorAll('.servico-card, .atuacao__card, .feature, .stat');
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .nav__link--active {
    color: var(--color-primary) !important;
  }
  
  .nav__link--active::after {
    width: 100% !important;
  }
  
  .header--scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: var(--shadow-sm);
  }
  
  .mobile-menu-btn--open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .mobile-menu-btn--open span:nth-child(2) {
    opacity: 0;
  }
  
  .mobile-menu-btn--open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
  
  @media (max-width: 768px) {
    .nav {
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      transform: translateY(-100%);
      transition: transform 0.3s ease;
      z-index: 999;
    }
    
    .nav--open {
      transform: translateY(0);
    }
    
    .nav__list {
      flex-direction: column;
      padding: var(--space-20);
      gap: var(--space-16);
    }
    
    .nav__link {
      padding: var(--space-12);
      display: block;
      text-align: center;
      border-bottom: 1px solid var(--color-border);
    }
    
    .nav__link:last-child {
      border-bottom: none;
    }
  }
  
  /* Enhanced button hover effects */
  .btn {
    position: relative;
    overflow: hidden;
  }
  
  .btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  .btn:hover::before {
    width: 300px;
    height: 300px;
  }
  
  .btn > * {
    position: relative;
    z-index: 1;
  }
`;

document.head.appendChild(style);

// Preload images for better performance
const imagesToPreload = [
  'https://user-gen-media-assets.s3.amazonaws.com/gemini_images/59ebc98e-bcbd-4401-a07b-c9fd2cba3753.png',
  'https://pplx-res.cloudinary.com/image/upload/v1758383430/pplx_project_search_images/3244aaac6b3644986d7b95f5e05543003dae0963.png',
  'https://pplx-res.cloudinary.com/image/upload/v1758383430/pplx_project_search_images/bb18d6711974d28545d962779fc832893e7eb13d.png'
];

imagesToPreload.forEach(src => {
  const img = new Image();
  img.src = src;
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    console.warn(`Failed to load image: ${this.src}`);
  });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenuOpen) {
    nav.classList.remove('nav--open');
    mobileMenuBtn.classList.remove('mobile-menu-btn--open');
    document.body.style.overflow = '';
    mobileMenuOpen = false;
  }
});

// Print styles
window.addEventListener('beforeprint', () => {
  document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing');
});

console.log('🏛️ Licitador - Site carregado com sucesso!');
console.log('📱 WhatsApp: +55 21 9 9450-3162');
console.log('📧 E-mail: contato@licitador.com.br');