// Utility Functions
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
    }
}

// Approach Modal Functions
function openApproachModal() {
    const modal = document.getElementById('approachModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }
}

function closeApproachModal() {
    const modal = document.getElementById('approachModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
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
        name: "A.L.",
        location: "",
        text: "Minha trajetória na terapia com o Gui tem sido um verdadeiro marco na minha vida. Desde o início, mergulhei em um processo profundo de autoconhecimento, onde comecei a entender questões que antes pareciam confusas ou ignoradas. Com paciência e orientação, o Guilherme tem me ajudado a enxergar padrões, superar desafios e construir uma visão mais clara de quem sou e do que quero para minha vida. Ainda estou no caminho, mas cada sessão tem sido um passo essencial para o crescimento que busco. Essa jornada tem sido libertadora e transformadora.",
        rating: 5
    },
    {
        name: "F.F.",
        location: "",
        text: "O Gui tem sido um apoio essencial na minha jornada. Com sua atenção, empatia e solidariedade, ele me ajuda a compreender melhor meus sentimentos, tomar decisões importantes com mais clareza e fortalecer meu emocional. Sua forma acolhedora de conduzir as sessões tem me proporcionado mais equilíbrio, confiança e bem-estar no dia a dia. Obrigado por ser esse excelente profissional, Gui! Você é sensacional!",
        rating: 5
    },
    {
        name: "M.S.",
        location: "",
        text: "O trabalho com o Guilherme transformou minha vida. Pela primeira vez consegui entender e trabalhar questões que carregava há anos. Seu acolhimento e profissionalismo são excepcionais.",
        rating: 5
    },
    {
        name: "A.P.",
        location: "",
        text: "Iniciar esta jornada foi a melhor decisão que tomei. O espaço seguro e a escuta atenta me permitiram crescer como nunca imaginei. Recomendo de coração!",
        rating: 5
    },
    {
        name: "L.R.",
        location: "",
        text: "A abordagem empática e personalizada fez toda diferença no meu processo terapêutico. Hoje me sinto mais equilibrado e confiante para enfrentar meus desafios.",
        rating: 5
    }
];

let currentTestimonialIndex = 0;

function renderTestimonialCard(cardElement, index) {
    if (index >= testimonials.length) {
        cardElement.style.display = 'none';
        return;
    }
    
    cardElement.style.display = 'flex';
    const testimonial = testimonials[index];
    
    // Adiciona classe de fade-out antes de mudar o conteúdo
    cardElement.classList.remove('fade-in');
    cardElement.classList.add('fade-out');
    
    setTimeout(() => {
        cardElement.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-header">
                    <div class="testimonial-header-left">
                        <p class="author-name">${testimonial.name}</p>
                    </div>
                    <div class="testimonial-header-icon">
                        <span>G+</span>
                    </div>
                </div>
                <blockquote>${testimonial.text}</blockquote>
            </div>
        `;
        
        // Remove fade-out e adiciona fade-in
        cardElement.classList.remove('fade-out');
        cardElement.classList.add('fade-in');
        
        lucide.createIcons();
    }, 250); // Metade da duração da animação
}

function renderTestimonials() {
    const card1 = document.getElementById('testimonialCard1');
    const card2 = document.getElementById('testimonialCard2');
    
    if (isMobile()) {
        // Mobile: mostra apenas 1 card
        renderTestimonialCard(card1, currentTestimonialIndex);
        if (card2) {
            card2.style.display = 'none';
        }
    } else {
        // Desktop: mostra 2 cards
        renderTestimonialCard(card1, currentTestimonialIndex);
        renderTestimonialCard(card2, currentTestimonialIndex + 1);
    }
}

function goToTestimonial(index) {
    currentTestimonialIndex = index;
    renderTestimonials();
}

function isMobile() {
    return window.innerWidth <= 768;
}

function nextTestimonial() {
    if (isMobile()) {
        // Mobile: avança de 1 em 1
        if (currentTestimonialIndex + 1 < testimonials.length) {
            currentTestimonialIndex += 1;
        } else {
            currentTestimonialIndex = 0; // Volta ao início
        }
    } else {
        // Desktop: avança de 2 em 2
        if (currentTestimonialIndex + 2 < testimonials.length) {
            currentTestimonialIndex += 2;
        } else {
            currentTestimonialIndex = 0; // Volta ao início
        }
    }
    renderTestimonials();
}

function prevTestimonial() {
    if (isMobile()) {
        // Mobile: retrocede de 1 em 1
        if (currentTestimonialIndex - 1 >= 0) {
            currentTestimonialIndex -= 1;
        } else {
            // Vai para o último depoimento
            currentTestimonialIndex = testimonials.length - 1;
        }
    } else {
        // Desktop: retrocede de 2 em 2
        if (currentTestimonialIndex - 2 >= 0) {
            currentTestimonialIndex -= 2;
        } else {
            // Vai para o último par possível
            const lastPair = Math.floor((testimonials.length - 1) / 2) * 2;
            currentTestimonialIndex = lastPair;
        }
    }
    renderTestimonials();
}

document.getElementById('testimonialPrev')?.addEventListener('click', prevTestimonial);
document.getElementById('testimonialNext')?.addEventListener('click', nextTestimonial);

// Atualiza quando a janela é redimensionada
window.addEventListener('resize', () => {
    renderTestimonials();
});

// Auto-advance testimonials
setInterval(nextTestimonial, 7000);

// FAQ Accordion
const faqs = [
    {
        question: "Como saber se preciso de terapia?",
        answer: "Quando suas emoções, pensamentos ou comportamentos começam a limitar sua vida, quando você se sente repetindo padrões que não consegue mudar sozinho ou simplesmente quer se conhecer melhor, a terapia pode ser o espaço ideal."
    },
    {
        question: "E se eu não souber o que dizer na sessão?",
        answer: "Não tem problema. O processo é conduzido com perguntas e acolhimento. Às vezes, o silêncio inicial faz parte e já revela muito sobre o que você está vivendo."
    },
    {
        question: "O que eu devo esperar das primeiras sessões?",
        answer: "As primeiras sessões servem para entender sua história, levantar objetivos e construir uma base de confiança. É um momento para alinhar expectativas e definir o melhor caminho terapêutico para você."
    },
    {
        question: "E se eu não me identificar com o psicólogo?",
        answer: "A relação terapêutica precisa fazer sentido para ambos. Caso não haja identificação, conversamos abertamente sobre isso e indico outro profissional que possa atender melhor ao seu momento."
    },
    {
        question: "E se eu me sentir desconfortável e quiser parar?",
        answer: "Você tem total liberdade para falar sobre qualquer desconforto, ajustar o processo ou interrompê-lo. O objetivo é que você se sinta seguro e respeitado durante todo o percurso."
    },
    {
        question: "Como a psicoterapia ajuda na prática?",
        answer: "A terapia amplia sua consciência sobre padrões emocionais, oferece ferramentas para lidar com desafios diários e ajuda a construir respostas mais maduras e coerentes com quem você é."
    },
    {
        question: "Leva muito tempo pra começar a sentir resultados?",
        answer: "Cada pessoa tem um ritmo, mas muitas percebem mudanças já nas primeiras semanas, seja pelo alívio de ser ouvido ou por novas perspectivas que surgem nas conversas."
    },
    {
        question: "E se eu não tiver dinheiro pra fazer toda semana?",
        answer: "Dialogamos sobre frequência e valores com transparência. Podemos ajustar a frequência temporariamente ou montar um plano que caiba no seu orçamento sem comprometer sua evolução."
    },
    {
        question: "Qual a diferença entre psicólogo, psiquiatra e terapeuta?",
        answer: "Psicólogo trabalha com processos emocionais por meio da fala, psiquiatra é médico e pode prescrever medicação, e terapeuta é um termo mais amplo que engloba diferentes abordagens de cuidado."
    },
    {
        question: "Psicanálise não é só falar do passado?",
        answer: "Falamos do passado para entender como ele atua no presente. O foco é entender padrões inconscientes e transformá-los, gerando mudanças concretas aqui e agora."
    },
    {
        question: "E se eu achar que a terapia não está funcionando pra mim?",
        answer: "Conversamos sobre o que não está funcionando, ajustamos o método ou objetivos e, se necessário, redesenhamos o processo. Terapia é construção conjunta."
    },
    {
        question: "E se eu tiver medo de me abrir?",
        answer: "O medo é compreensível. Avançamos no seu tempo, sempre com respeito aos seus limites. A confiança nasce aos poucos e é construída no diálogo."
    },
    {
        question: "Eu preciso falar sobre tudo na terapia?",
        answer: "Você não precisa contar tudo de uma vez. Compartilhe o que fizer sentido em cada momento. Aos poucos, o espaço se torna seguro para assuntos mais delicados."
    },
    {
        question: "E se eu já fiz terapia antes e não deu certo?",
        answer: "Cada processo é diferente. Entendemos o que não funcionou antes e construímos uma experiência nova, com outra abordagem e objetivos mais alinhados ao seu momento."
    },
    {
        question: "Psicólogo dá conselho?",
        answer: "Mais do que conselhos, ofereço reflexões, ferramentas e perguntas que ampliam sua visão. A ideia é que você encontre respostas autênticas e tome decisões com consciência."
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

// More Info Accordion with Modal
const infoItems = [
    {
        title: "Abordagem",
        content: "Trabalho com a linha psicanalítica integrativa, adaptando o atendimento conforme suas necessidades, história e objetivos pessoais. Juntos, buscamos promover uma transformação consciente, unindo técnicas clássicas, modernas e experimentais da psicologia e da psicanálise para um processo mais profundo e flexível."
    },
    {
        title: "Tempo de sessão",
        content: "As sessões têm duração padrão de 50 minutos, mas podem ser estendidas brevemente (cerca de 10 minutos) quando for necessário para que o conteúdo seja trabalhado de forma adequada. Essa extensão não altera o valor da sessão."
    },
    {
        title: "Plataforma Online",
        content: "As sessões são realizadas por videochamada no Google Meet. No horário exato da sessão, envio o link diretamente pelo WhatsApp, facilitando o acesso e garantindo praticidade."
    },
    {
        title: "Frequência das sessões",
        content: "Na maioria dos casos, o mais indicado é realizar sessões semanais, mantendo uma continuidade que favorece o desenvolvimento do processo terapêutico. Ainda assim, a frequência pode ser ajustada conforme suas necessidades, objetivos e momento de vida."
    },
    {
        title: "Alta / Finalização",
        content: "O tempo de acompanhamento varia de pessoa para pessoa. Alguns preferem manter as sessões de forma contínua, enquanto outros buscam o processo com objetivos mais específicos e prazos definidos. O encerramento é algo que vamos avaliando juntos ao longo do processo, mas a decisão final de encerrar é sempre sua, conforme o que considerar adequado para si."
    },
    {
        title: "Sigilo",
        content: "Tudo o que é compartilhado durante o processo é tratado com sigilo absoluto. Nenhuma informação é repassada a terceiros, garantindo um ambiente de confiança, segurança e respeito."
    },
    {
        title: "Pagamento",
        content: "Há um desconto especial na primeira sessão, para que você possa experimentar o processo, se identificar com a abordagem e decidir com tranquilidade se deseja dar continuidade. Caso opte por seguir, também há descontos em pacotes de sessões, que podem ser combinados conforme sua disponibilidade e frequência desejada. Embora a psicoterapia seja um trabalho, ela também é movida por propósito e compromisso genuíno com o bem e a transformação consciente."
    },
    {
        title: "Política de atrasos e faltas",
        content: "Caso haja um atraso de 15 minutos ou mais sem aviso prévio, a sessão é automaticamente cancelada. Em caso de falta, é importante avisar com pelo menos 24 horas de antecedência. Quando isso não acontece, a sessão é cobrada normalmente. Ainda assim, compreendo que imprevistos podem acontecer. Se houver uma justificativa, podemos conversar e avaliar com flexibilidade e bom senso, mantendo sempre uma relação justa e respeitosa para ambos os lados."
    }
];

function renderInfoAccordion() {
    const accordion = document.getElementById('infoAccordion');
    if (!accordion) return;
    
    infoItems.forEach((item, index) => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'info-accordion-item';
        accordionItem.innerHTML = `
            <button class="info-accordion-header" onclick="openInfoModal(${index})">
                <div class="info-item-content">
                    <span class="info-item-title">${item.title}</span>
                    <div class="info-icon-circle">
                        <i data-lucide="info"></i>
                    </div>
                </div>
                <i data-lucide="chevron-right" class="info-accordion-icon"></i>
            </button>
        `;
        accordion.appendChild(accordionItem);
    });
    
    lucide.createIcons();
}

function openInfoModal(index) {
    const item = infoItems[index];
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('infoModalTitle');
    const modalBody = document.getElementById('infoModalBody');
    
    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = item.title;
        modalBody.innerHTML = `<p>${item.content}</p>`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }
}

function closeInfoModal() {
    const modal = document.getElementById('infoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
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

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeApproachModal();
    }
});

// Typewriter Animation
const typewriterPhrases = [
    { text: 'humildade', type: 'gradient', after: ' e ', text2: 'amor próprio.', type2: 'gradient' },
    { text: 'coragem', type: 'gradient', after: ' e ', text2: 'autocuidado.', type2: 'gradient' },
    { text: 'sabedoria', type: 'gradient', after: ' e ', text2: 'clareza.', type2: 'gradient' },
    { text: 'força', type: 'gradient', after: ' e ', text2: 'transformação.', type2: 'gradient' },
    { text: 'resiliência', type: 'gradient', after: ' e ', text2: 'bem-estar.', type2: 'gradient' },
    { text: 'paz', type: 'gradient', after: ' e ', text2: 'equilíbrio.', type2: 'gradient' }
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typewriterElement = null;
let currentFullText = '';

function getFullText(phrase, charCount) {
    const fullText = phrase.text + phrase.after + phrase.text2;
    const totalLength = fullText.length;
    const firstPartEnd = phrase.text.length + phrase.after.length;
    
    // Se for gradiente, aplica ao texto completo
    if (phrase.type === 'gradient' && phrase.type2 === 'gradient') {
        const displayedText = fullText.substring(0, charCount);
        
        if (charCount >= totalLength) {
            // Texto completo: primeira parte + quebra + segunda parte
            return `<span class="text-gradient">${phrase.text}${phrase.after}</span><br><span class="text-gradient">${phrase.text2}</span>`;
        } else if (charCount > firstPartEnd) {
            // Passou da primeira parte + " e ", adiciona quebra
            const firstPart = phrase.text + phrase.after;
            const secondPart = phrase.text2.substring(0, charCount - firstPartEnd);
            return `<span class="text-gradient">${firstPart}</span><br><span class="text-gradient">${secondPart}</span>`;
        } else {
            // Ainda na primeira parte
            return `<span class="text-gradient">${displayedText}</span>`;
        }
    }
    
    // Se completou, retorna com todas as formatações
    if (charCount >= totalLength) {
        return `<span class="text-${phrase.type}">${phrase.text}</span>${phrase.after}<span class="text-${phrase.type2}">${phrase.text2}</span>`;
    }
    
    let result = '';
    let currentPos = 0;
    
    // Primeira palavra com formatação
    if (charCount > phrase.text.length) {
        result += `<span class="text-${phrase.type}">${phrase.text}</span>`;
        currentPos = phrase.text.length;
        
        // " e "
        if (charCount > currentPos + phrase.after.length) {
            result += phrase.after;
            currentPos += phrase.after.length;
            
            // Segunda palavra com formatação
            const remaining = charCount - currentPos;
            if (remaining > 0) {
                result += `<span class="text-${phrase.type2}">${phrase.text2.substring(0, remaining)}</span>`;
            }
        } else {
            const remaining = charCount - currentPos;
            result += phrase.after.substring(0, remaining);
        }
    } else {
        result += `<span class="text-${phrase.type}">${phrase.text.substring(0, charCount)}</span>`;
    }
    
    return result;
}

function typeWriter() {
    if (!typewriterElement) return;
    
    const currentPhrase = typewriterPhrases[currentPhraseIndex];
    const fullText = currentPhrase.text + currentPhrase.after + currentPhrase.text2;
    
    if (!isDeleting && currentCharIndex < fullText.length) {
        // Escrevendo
        typewriterElement.innerHTML = getFullText(currentPhrase, currentCharIndex + 1);
        currentCharIndex++;
        setTimeout(typeWriter, 50);
    } else if (isDeleting && currentCharIndex > 0) {
        // Apagando
        typewriterElement.innerHTML = getFullText(currentPhrase, currentCharIndex - 1);
        currentCharIndex--;
        setTimeout(typeWriter, 30);
    } else if (isDeleting && currentCharIndex === 0) {
        // Terminou de apagar, muda para próxima frase
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % typewriterPhrases.length;
        setTimeout(typeWriter, 500);
    } else {
        // Terminou de escrever, espera e começa a apagar
        isDeleting = true;
        setTimeout(typeWriter, 3000);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    renderTestimonials();
    renderFAQ();
    renderInfoAccordion();
    lucide.createIcons();
    
    // Inicializar typewriter
    typewriterElement = document.getElementById('typewriterText');
    if (typewriterElement) {
        typeWriter();
    }
    
    // Info Modal ESC key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const infoModal = document.getElementById('infoModal');
            const approachModal = document.getElementById('approachModal');
            if (infoModal?.classList.contains('active')) {
                closeInfoModal();
            } else if (approachModal?.classList.contains('active')) {
                closeApproachModal();
            }
        }
    });
});