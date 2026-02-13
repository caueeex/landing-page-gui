// Carousel section - Especialidades ("Se você luta contra:")

class Carousel {
    constructor(containerSelector, trackSelector, prevBtnSelector, nextBtnSelector) {
        this.container = document.querySelector(containerSelector);
        this.track = document.querySelector(trackSelector);
        this.prevBtn = document.querySelector(prevBtnSelector);
        this.nextBtn = document.querySelector(nextBtnSelector);
        this.currentIndex = 0;
        this._resizeTimeout = null;
        this.cardsPerView = 1;
        this.maxIndex = 0;
        
        // Drag properties
        this.isDragging = false;
        this.hasMoved = false;
        this.startX = 0;
        this.currentX = 0;
        this.scrollLeft = 0;
        this.dragOffset = 0;
        this.startY = 0;
        this.startTime = 0;
        
        if (this.track && this.prevBtn && this.nextBtn) {
            this.init();
        }
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        window.addEventListener('resize', () => {
            if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
            this._resizeTimeout = setTimeout(() => this.updateCardsPerView(), 150);
        });
        
        // Carrossel só se move pelas setas (arrasto desativado)
        
        // Inicializar posição só após layout final (CSS + fontes + imagens)
        if (document.readyState === 'complete') {
            this.updateCardsPerView();
        } else {
            window.addEventListener('load', () => this.updateCardsPerView(), { once: true });
        }
    }
    
    initDrag() {
        // Mouse events
        this.track.addEventListener('mousedown', (e) => this.handleDragStart(e));
        this.track.addEventListener('mousemove', (e) => this.handleDragMove(e));
        this.track.addEventListener('mouseup', () => this.handleDragEnd());
        this.track.addEventListener('mouseleave', () => this.handleDragEnd());
        
        // Touch events - touchmove needs to be non-passive to allow preventDefault
        this.track.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        this.track.addEventListener('touchend', () => this.handleDragEnd());
        
        // Prevent text selection while dragging
        this.track.addEventListener('selectstart', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
    }
    
    handleDragStart(e) {
        // Se tocou/clicou em um card, não iniciar drag (deixar o card processar)
        const target = e.target;
        const card = target.closest ? target.closest('.service-card') : null;
        if (card) {
            // Se for mobile, não iniciar drag - deixar o card processar
            if (window.innerWidth <= 768) {
                return;
            }
        }
        
        // Get initial position
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        this.startX = clientX;
        this.startY = clientY;
        this.startTime = Date.now();
        this.hasMoved = false;
        
        // Get current scroll position
        const cardWidth = this.track.children[0]?.offsetWidth || 0;
        const gap = 24; // 1.5rem
        this.scrollLeft = -(this.currentIndex * (cardWidth + gap));
    }
    
    handleDragMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Calculate movement
        const deltaX = Math.abs(clientX - this.startX);
        const deltaY = Math.abs(clientY - this.startY);
        
        // Only start dragging if horizontal movement is significant and greater than vertical
        if (!this.isDragging && deltaX > 10 && deltaX > deltaY) {
            this.isDragging = true;
            this.track.classList.add('dragging');
        }
        
        if (this.isDragging) {
            e.preventDefault();
            
            this.currentX = clientX;
            this.dragOffset = this.currentX - this.startX;
            this.hasMoved = true;
            
            // Update position with drag offset
            const newPosition = this.scrollLeft + this.dragOffset;
            this.track.style.transform = `translateX(${newPosition}px)`;
            this.track.style.transition = 'none'; // Disable transition during drag
        }
    }
    
    handleDragEnd() {
        if (this.isDragging) {
            this.track.classList.remove('dragging');
            this.track.style.transition = 'transform 0.5s ease'; // Re-enable transition
            
            // Calculate which card to snap to
            const cardWidth = this.track.children[0]?.offsetWidth || 0;
            const gap = 24; // 1.5rem
            const cardWidthWithGap = cardWidth + gap;
            
            // Determine direction and threshold (30% of card width or minimum 50px)
            const threshold = Math.max(cardWidthWithGap * 0.3, 50);
            
            if (Math.abs(this.dragOffset) > threshold) {
                // Move to next/prev card
                if (this.dragOffset < 0) {
                    // Dragged left, go to next
                    this.next();
                } else {
                    // Dragged right, go to prev
                    this.prev();
                }
            } else {
                // Snap back to current position
                this.updatePosition();
            }
        }
        
        // Reset drag values
        this.isDragging = false;
        this.hasMoved = false;
        this.dragOffset = 0;
        this.startX = 0;
        this.currentX = 0;
        this.startY = 0;
        this.startTime = 0;
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
        if (!this.track.children[0]) return;
        
        if (typeof this.cardsPerView !== 'number') {
            this.cardsPerView = 1;
        }
        
        const gap = 24;
        const cardWidth = this.track.children[0].offsetWidth;
        
        if (cardWidth <= 0) {
            this.track.style.transform = 'translateX(0)';
            return;
        }
        
        const maxIdx = Math.max(0, this.track.children.length - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, maxIdx);
        
        const offset = -(this.currentIndex * (cardWidth + gap));
        this.track.style.transform = `translateX(${offset}px)`;
        
        if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
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
}

// Initialize Services Carousel
const servicesCarousel = new Carousel(
    '#servicesCarousel',
    '#servicesTrack',
    '#servicesPrev',
    '#servicesNext'
);

// Service Card Modal Functions
function openServiceCardModal(card) {
    const modal = document.getElementById('serviceCardModal');
    const modalTitle = document.getElementById('serviceCardModalTitle');
    const modalBody = document.getElementById('serviceCardModalBody');
    
    if (modal && modalTitle && modalBody) {
        const title = card.getAttribute('data-service-title');
        const description = card.getAttribute('data-service-description');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = `<p>${description}</p>`;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }
}

function closeServiceCardModal() {
    const modal = document.getElementById('serviceCardModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Adicionar event listeners aos cards de serviço em mobile
function initServiceCardClicks() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let hasMoved = false;
        let cardTouched = false;
        
        // Touch events for mobile - usar capture phase para processar antes do track
        card.addEventListener('touchstart', function(e) {
            cardTouched = true;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            hasMoved = false;
        }, { passive: true, capture: true });
        
        card.addEventListener('touchmove', function(e) {
            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
            
            // Se moveu mais de 10px, considera como movimento (arrasto)
            if (deltaX > 10 || deltaY > 10) {
                hasMoved = true;
                cardTouched = false; // Se moveu, não é um toque simples
            }
        }, { passive: true, capture: true });
        
        card.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
            
            // Verificar se é mobile e se foi um toque simples (não arrastou)
            const isSimpleTouch = !hasMoved && deltaX < 10 && deltaY < 10 && touchDuration < 300;
            
            if (window.innerWidth <= 768 && isSimpleTouch && cardTouched) {
                e.preventDefault();
                e.stopPropagation();
                // Garantir que o modal abra
                setTimeout(() => {
                    if (!servicesCarousel.isDragging) {
                        openServiceCardModal(this);
                    }
                }, 10);
            }
            
            // Reset
            cardTouched = false;
            hasMoved = false;
        }, { capture: true });
        
        // Click event for desktop (fallback)
        card.addEventListener('click', function(e) {
            // Verificar se é desktop
            if (window.innerWidth > 768) {
                // Desktop behavior (if needed)
                return;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initServiceCardClicks();
});
