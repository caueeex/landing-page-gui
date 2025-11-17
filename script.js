// Utility Functions
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
    }
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.querySelector('#menuToggle i');
    mobileMenu.classList.remove('active');
    menuIcon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
document.getElementById('menuToggle')?.addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.querySelector('#menuToggle i');
    const isOpen = mobileMenu.classList.toggle('active');
    
    menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
    lucide.createIcons();
});

// Services Carousel
class Carousel {
    constructor(containerSelector, trackSelector, prevBtnSelector, nextBtnSelector) {
        this.container = document.querySelector(containerSelector);
        this.track = document.querySelector(trackSelector);
        this.prevBtn = document.querySelector(prevBtnSelector);
        this.nextBtn = document.querySelector(nextBtnSelector);
        this.currentIndex = 0;
        this.autoplayInterval = null;
        
        if (this.track && this.prevBtn && this.nextBtn) {
            this.init();
        }
    }
    
    init() {
        this.updateCardsPerView();
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        window.addEventListener('resize', () => this.updateCardsPerView());
        
        // Auto-advance every 5 seconds
        this.startAutoplay();
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    updateCardsPerView() {
        const width = window.innerWidth;
        if (width >= 1280) {
            this.cardsPerView = 4;
        } else if (width >= 1024) {
            this.cardsPerView = 3;
        } else if (width >= 768) {
            this.cardsPerView = 2;
        } else {
            this.cardsPerView = 1;
        }
        this.maxIndex = Math.max(0, this.track.children.length - this.cardsPerView);
        this.updatePosition();
    }
    
    updatePosition() {
        const cardWidth = this.track.children[0].offsetWidth;
        const gap = 24; // 1.5rem
        const offset = -(this.currentIndex * (cardWidth + gap));
        this.track.style.transform = `translateX(${offset}px)`;
        
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updatePosition();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updatePosition();
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updatePosition();
        }, 5000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize Services Carousel
const servicesCarousel = new Carousel(
    '#servicesCarousel',
    '#servicesTrack',
    '#servicesPrev',
    '#servicesNext'
);

// Testimonials
const testimonials = [
    {
        name: "M.S.",
        location: "São Paulo, SP",
        text: "O trabalho com o Guilherme transformou minha vida. Pela primeira vez consegui entender e trabalhar questões que carregava há anos. Seu acolhimento e profissionalismo são excepcionais.",
        rating: 5
    },
    {
        name: "A.P.",
        location: "Rio de Janeiro, RJ",
        text: "Iniciar esta jornada foi a melhor decisão que tomei. O espaço seguro e a escuta atenta me permitiram crescer como nunca imaginei. Recomendo de coração!",
        rating: 5
    },
    {
        name: "L.R.",
        location: "Belo Horizonte, MG",
        text: "A abordagem empática e personalizada fez toda diferença no meu processo terapêutico. Hoje me sinto mais equilibrado e confiante para enfrentar meus desafios.",
        rating: 5
    }
];

let currentTestimonialIndex = 0;

function renderTestimonial(index) {
    const testimonial = testimonials[index];
    document.getElementById('testimonialText').textContent = `"${testimonial.text}"`;
    document.getElementById('testimonialName').textContent = testimonial.name;
    document.getElementById('testimonialLocation').textContent = testimonial.location;
    
    // Update dots
    const dotsContainer = document.getElementById('testimonialDots');
    dotsContainer.innerHTML = '';
    testimonials.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === index ? 'active' : ''}`;
        dot.addEventListener('click', () => goToTestimonial(i));
        dotsContainer.appendChild(dot);
    });
    
    lucide.createIcons();
}

function goToTestimonial(index) {
    currentTestimonialIndex = index;
    renderTestimonial(index);
}

function nextTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    renderTestimonial(currentTestimonialIndex);
}

function prevTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(currentTestimonialIndex);
}

document.getElementById('testimonialPrev')?.addEventListener('click', prevTestimonial);
document.getElementById('testimonialNext')?.addEventListener('click', nextTestimonial);

// Auto-advance testimonials
setInterval(nextTestimonial, 7000);

// FAQ Accordion
const faqs = [
    {
        question: "Tempo de sessão",
        answer: "As sessões têm duração padrão de 50 minutos, mas podem ser estendidas brevemente (cerca de 10 minutos) quando for necessário para que o conteúdo seja trabalhado de forma adequada. Essa extensão não altera o valor da sessão."
    },
    {
        question: "Sigilo",
        answer: "Tudo o que é compartilhado durante o processo é tratado com sigilo absoluto. Nenhuma informação é repassada a terceiros, garantindo um ambiente de confiança, segurança e respeito."
    },
    {
        question: "Abordagem",
        answer: "Trabalho com a linha psicanalítica integrativa, adaptando o atendimento conforme suas necessidades, história e objetivos pessoais. Juntos, buscamos promover uma transformação consciente, unindo técnicas clássicas, modernas e experimentais da psicologia e da psicanálise para um processo mais profundo e flexível."
    },
    {
        question: "Frequência das sessões",
        answer: "Na maioria dos casos, o mais indicado é realizar sessões semanais, mantendo uma continuidade que favorece o desenvolvimento do processo terapêutico. Ainda assim, a frequência pode ser ajustada conforme suas necessidades, objetivos e momento de vida."
    },
    {
        question: "Alta / Finalização",
        answer: "O tempo de acompanhamento varia de pessoa para pessoa. Alguns preferem manter as sessões de forma contínua, enquanto outros buscam o processo com objetivos mais específicos e prazos definidos. O encerramento é algo que vamos avaliando juntos ao longo do processo, mas a decisão final de encerrar é sempre sua, conforme o que considerar adequado para si."
    },
    {
        question: "Plataforma Online",
        answer: "As sessões são realizadas por videochamada no Google Meet. No horário exato da sessão, envio o link diretamente pelo WhatsApp, facilitando o acesso e garantindo praticidade."
    },
    {
        question: "Pagamento",
        answer: "Há um desconto especial na primeira sessão, para que você possa experimentar o processo, se identificar com a abordagem e decidir com tranquilidade se deseja dar continuidade. Caso opte por seguir, também há descontos em pacotes de sessões, que podem ser combinados conforme sua disponibilidade e frequência desejada. Embora a psicoterapia seja um trabalho, ela também é movida por propósito e compromisso genuíno com o bem e a transformação consciente."
    },
    {
        question: "Política de atrasos e faltas",
        answer: "Caso haja um atraso de 15 minutos ou mais sem aviso prévio, a sessão é automaticamente cancelada. Em caso de falta, é importante avisar com pelo menos 24 horas de antecedência. Quando isso não acontece, a sessão é cobrada normalmente. Ainda assim, compreendo que imprevistos podem acontecer. Se houver uma justificativa, podemos conversar e avaliar com flexibilidade e bom senso, mantendo sempre uma relação justa e respeitosa para ambos os lados."
    }
];

function renderFAQ() {
    const accordion = document.getElementById('faqAccordion');
    if (!accordion) return;
    
    faqs.forEach((faq, index) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        item.innerHTML = `
            <button class="accordion-header" onclick="toggleAccordion(${index})">
                <h3>${faq.question}</h3>
                <i data-lucide="chevron-down" class="accordion-icon"></i>
            </button>
            <div class="accordion-content">
                <p>${faq.answer}</p>
            </div>
        `;
        accordion.appendChild(item);
    });
    
    lucide.createIcons();
}

function toggleAccordion(index) {
    const items = document.querySelectorAll('.accordion-item');
    const item = items[index];
    const isActive = item.classList.contains('active');
    
    // Close all items
    items.forEach(i => i.classList.remove('active'));
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

// Contact Form
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        consent: document.getElementById('consent').checked
    };
    
    if (!formData.consent) {
        showToast('Por favor, aceite a política de privacidade para continuar.');
        return;
    }
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    setTimeout(() => {
        showToast('Mensagem enviada com sucesso! Entrarei em contato em breve. Obrigado!');
        document.getElementById('contactForm').reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="send"></i> Enviar mensagem';
        lucide.createIcons();
    }, 1500);
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    renderTestimonial(0);
    renderFAQ();
    lucide.createIcons();
});