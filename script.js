
document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordRegisterBtns = document.querySelectorAll('.toggle-password-register');
    const openModalBtn = document.querySelector('.open-modal-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const openLoginLink = document.querySelector('.open-login-modal');



    let currentSlide = 0;
    let startX = 0; // Para rastrear el punto de inicio del deslizamiento
    let isDragging = false; // Para saber si el usuario esta arrastrando

    // -------------------------
    // ----Carousel ------------
    // -------------------------
    const carouselItems = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const carouselInner = document.querySelector('.carousel-inner');
    const totalSlides = carouselItems.length;
    const visibleSlides = 4; // Para ver cuatro slides a la vez

    // Actualizar el carrusel
    function updateCarousel() {
        const offset = currentSlide * (-100 / visibleSlides); // Para desplazarse segun el numero de slides
        document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;

        // Actualizar los "dots" activos
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Ajustar opacidad y escala de cada ítem
        carouselItems.forEach((item, index) => {
            if (index >= currentSlide && index < currentSlide + visibleSlides) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Funciones para avanzar y retroceder
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Eventos de los botones de control
    document.querySelector('.carousel-control.left').addEventListener('click', prevSlide);
    document.querySelector('.carousel-control.right').addEventListener('click', nextSlide);

    //Eventos de los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // inicio del carrousel
    updateCarousel();

    // para que se mueva el carrousel cada 5 segundos solo
    setInterval(nextSlide, 5000);


    // -------------------------
    // Deslizamiento tActil PANTALLAS PEQUEÑAS
    // -------------------------
    if (carouselInner) {
        carouselInner.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            isDragging = true;
        });

        carouselInner.addEventListener('touchmove', (event) => {
            if (!isDragging) return;
            const moveX = event.touches[0].clientX;
            const diff = startX - moveX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide(); // Desliza a la izquierda
                } else {
                    prevSlide(); // Desliza a la derecha
                }
                isDragging = false; // Evitar que se dispare varias veces
            }
        });

        carouselInner.addEventListener('touchend', () => {
            isDragging = false; // Restablecer el estado al finalizar el deslizamiento
        });
    }

    // -------------------------
    // Funciones para los modales
    // -------------------------

    if (openLoginLink) {
        openLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }


    // Abrir el modal de inicio de sesión
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            loginModal.style.display = "block";
        });
    }

    // Cerrar modales
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        });
    });

    // Abrir el modal de registro desde el modal de inicio de sesion
    const openRegisterLink = document.querySelector('.open-register-modal');
    if (openRegisterLink) {
        openRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }

    // Abrir el modal de inicio de sesion desde el modal de registro
    if (openLoginLink) {
        openLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    /// ---------------------
    /// -----Valiadacion formuulario------
    /// ---------------------

    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    const registerPassword = document.getElementById('register-password');
    const confirmPassword = document.getElementById('confirm-password');
    const registerEmail = document.getElementById('register-email');
    const alertsContainer = document.getElementById('register-alerts'); // Para contener los mensajes

    // Validar el formulario de registro
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault(); 

        // Limpiar mensajes anteriores
        alertsContainer.innerHTML = '';

        let messages = [];

        // Validar la seguridad de la contraseña
        if (!validatePassword(registerPassword.value)) {
            messages.push("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.");
        }

        // Verificar que las contraseñas coincidan
        if (registerPassword.value !== confirmPassword.value) {
            messages.push("Las contraseñas no coinciden.");
        }

        // Verificar que el correo electrónico sea válido
        if (!validateEmail(registerEmail.value)) {
            messages.push("Por favor, introduce un correo electrónico válido.");
        }

        // Mostrar mensajes de error si existen
        if (messages.length > 0) {
            showMessages(messages, 'error');
            return;
        }

        // Si todo es valido, mostrar mensaje de exito y el tick
        showMessages(["Registro exitoso."], 'success');
        showSuccessIcon(); 

        setTimeout(() => {
            registerForm.submit(); 
        }, 2000); 
    });

    // Validar el formato del correo electrónico
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validar la seguridad de la contraseña
    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    // Función para mostrar mensajes en pantalla
    function showMessages(messages, type) {
        alertsContainer.innerHTML = ''; // Limpiar mensajes anteriores

        messages.forEach(msg => {
            const div = document.createElement('div');
            div.classList.add(type === 'error' ? 'alert-error' : 'alert-success');
            div.textContent = msg;
            alertsContainer.appendChild(div);
        });
    }

    // Función para mostrar el tick de éxito (imagen PNG)
    function showSuccessIcon() {
        const tickContainer = document.getElementById('register-success');
        tickContainer.style.display = 'block'; // Muestra el tick

        // Ocultar el tick después de 2 segundos
        setTimeout(() => {
            tickContainer.style.display = 'none';
        }, 2000);
    }

    // Toggle de visibilidad de contraseñas
    const togglePasswordIcons = document.querySelectorAll('.toggle-password, .toggle-password-register');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const passwordField = this.previousElementSibling;
            if (passwordField.type === "password") {
                passwordField.type = "text";
                this.textContent = "visibility";
            } else {
                passwordField.type = "password";
                this.textContent = "visibility_off";
            }
        });
    });

    // -------------------------
    // Funciones para el menu lateral
    // -------------------------

    const menuIcon = document.querySelector('.menu-icon');
    const closeSidebarBtn = document.querySelector('.close-sidebar-btn');
    const sidebar = document.querySelector('.sidebar');

    // Abrir el menú lateral
    menuIcon.addEventListener('click', () => {
        sidebar.style.transform = 'translateX(0)';
    });

    // Cerrar el menu lateral
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.style.transform = 'translateX(-250px)';
    });

    // Cerrar el menú lateral al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
            sidebar.style.transform = 'translateX(-250px)';
        }
    });




    /// ---------------------
    /// -----Cookies------
    /// ---------------------


    // Verificar si el usuario ya ha aceptado las cookies
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.style.display = 'flex';
    }

    // Evento para aceptar cookies
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.display = 'none';

    });
    rejectCookiesBtn.addEventListener('click', function () {
        localStorage.setItem('cookiesDenegated', 'false');
        cookieBanner.style.display = 'none';
    });



    /// ---------------------
    /// -----SubMenu------
    /// ---------------------


    // Evento para mostrar/ocultar el submenu de juegos en el desplegable
    const juegosMenuItem = document.querySelector('.sidebar-item.has-submenu');
    const submenu = document.querySelector('#juegos-submenu');
    juegosMenuItem.addEventListener('click', () => {
        submenu.classList.toggle('active');
    });

    /// -----------------------------
    /// -----Videos Aleoatorios------
    /// -----------------------------




    // Lista de videos disponibles
    const videos = [
        './video/NintendoSwitch.mp4',
        './video/The Legend of Zelda Tears of the Kingdom.mp4',
        './video/PlayStation 5 Pro.mp4',
        './video/The Legend of Zelda Tears of the Kingdom.mp4',
        './video/The Legend of Zelda Twilight Princess HD.mp4',
        './video/The Last of Us Parte II.mp4',
        './video/The Legend of Zelda Skyward Sword HD.mp4',
        './video/The Last of Us Parte I.mp4',
        './video/The Legend of Zelda Echoes of Wisdom.mp4'
    ];

    // Función para seleccionar un video aleatoriamente
    function selectRandomVideo() {
        const randomIndex = Math.floor(Math.random() * videos.length);
        return videos[randomIndex];
    }

    // Establecer el video seleccionado aleatoriamente al cargar la página
    window.onload = function () {
        const videoElement = document.getElementById('background-video');
        const videoSource = document.getElementById('video-source');

        // Selecciona un video aleatorio y lo asigna al elemento <source>
        const selectedVideo = selectRandomVideo();
        videoSource.src = selectedVideo;

        // Recargar el video para asegurarse de que se reproduzca
        videoElement.load();
    };

});
