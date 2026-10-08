"use strict";

/* ========================================
   ATREVA
   Main JavaScript
======================================== */

/* ========================================
   ELEMENTOS
======================================== */

const header = document.querySelector("#header");
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const navLinks = document.querySelectorAll(".nav__link");
const addCartLinks = document.querySelectorAll(".add-cart");
const toast = document.querySelector("#toast");


/* ========================================
   HEADER — EFEITO AO ROLAR
======================================== */

function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleHeaderScroll, {
    passive: true
});


/* ========================================
   MENU MOBILE
======================================== */

function toggleMenu() {
    if (!mainNav || !menuToggle) return;

    const isOpen = mainNav.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
}

if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
}


/* ========================================
   FECHAR MENU AO CLICAR NO LINK
======================================== */

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (!mainNav || !menuToggle) return;

        mainNav.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    });
});


/* ========================================
   MENU — TECLA ESC
======================================== */

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        mainNav &&
        mainNav.classList.contains("open")
    ) {
        mainNav.classList.remove("open");

        if (menuToggle) {
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }
});


/* ========================================
   NAVEGAÇÃO ATIVA
======================================== */

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const currentId =
                    entry.target.getAttribute("id");

                navLinks.forEach((link) => {
                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${currentId}`
                    ) {
                        link.classList.add("active");
                    }
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
}


/* ========================================
   PEDIDOS PELO INSTAGRAM
======================================== */

/*
   Os botões "+" agora são links <a>.
   Ao clicar:

   1. A mensagem do produto é copiada.
   2. O Instagram Direct é aberto.
   3. O cliente cola a mensagem com Ctrl + V.

   O Instagram não permite que o site
   preencha automaticamente o campo do Direct.
*/

addCartLinks.forEach((link) => {

    link.addEventListener("click", async () => {

        const message = link.dataset.message;

        if (!message) return;

        try {

            await navigator.clipboard.writeText(message);

            showToast(
                "Mensagem copiada! Cole no Direct."
            );

        } catch (error) {

            console.log(
                "Não foi possível copiar a mensagem automaticamente."
            );

        }

    });

});


/* ========================================
   TOAST / MENSAGEM
======================================== */

let toastTimeout;

function showToast(message) {

    if (!toast) return;

    /*
       Procura o texto dentro do toast
       sem alterar o ícone.
    */

    const toastText = toast.querySelector(
        ".toast__text"
    );

    if (toastText) {

        toastText.textContent = message;

    } else {

        /*
           Compatibilidade caso seu HTML
           ainda não tenha .toast__text.
        */

        const textNode = Array.from(
            toast.childNodes
        ).find(
            (node) =>
                node.nodeType === Node.TEXT_NODE &&
                node.textContent.trim() !== ""
        );

        if (textNode) {
            textNode.textContent = ` ${message}`;
        }

    }

    toast.classList.add("visible");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("visible");

    }, 3000);
}


/* ========================================
   INICIALIZAÇÃO
======================================== */

handleHeaderScroll();