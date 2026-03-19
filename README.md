# 👟 Stride Store

> Loja virtual de tênis clássicos — autenticidade que atravessa gerações.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat&logo=fontawesome&logoColor=white)

## 📋 Sobre o Projeto

A **Stride Store** é uma loja virtual de tênis desenvolvida com HTML, CSS e JavaScript puros. O projeto simula uma e-commerce completa com catálogo de produtos, páginas de detalhe, sistema de autenticação, carrinho de compras e lista de favoritos — tudo funcionando no front-end via `localStorage`.

A loja apresenta uma coleção de tênis clássicos (Nike, Converse e Vans) com foco em streetwear e cultura urbana, seguindo a identidade de marca "Desde 1966".

---

## ✨ Funcionalidades

- **Autenticação de usuário** — cadastro e login com validação de formulário; dados persistidos no `localStorage`
- **Carrinho de compras** — adicionar, remover e ajustar quantidade de itens; cálculo automático do total
- **Lista de favoritos (Wishlist)** — salvar e gerenciar produtos favoritos por usuário
- **Páginas de produto** — seleção de tamanho (com indicação de esgotado), avaliações e botão de compra
- **Drawer lateral** — sacola e favoritos acessíveis via painel deslizante sem sair da página
- **Notificações toast** — feedback visual para ações do usuário (sucesso, erro, informação)
- **Menu de usuário** — avatar com dropdown para conta, pedidos e logout
- **Design responsivo** — layout adaptado para mobile, tablet e desktop
- **Seção "Sobre"** e **seção da equipe** presentes na página principal

---

## 🗂️ Estrutura do Projeto

```
stride-store/
├── index.html          # Página principal (home, produtos, sobre, equipe)
├── tenis1.html         # Página de detalhe — Nike Air Force 1 '07
├── tenis2.html         # Página de detalhe — Converse Chuck 70
├── tenis3.html         # Página de detalhe — Vans Authentic
├── css/
│   ├── style.css       # Estilos globais (layout, header, hero, footer, drawers, modais)
│   ├── cards.css       # Estilos dos cards de produto
│   └── components.css  # Componentes reutilizáveis (botões, toasts, formulários)
├── js/
│   └── app.js          # Lógica principal — estado, carrinho, wishlist, auth, UI
└── img/
    ├── imagem1.jpg     # Imagem hero
    ├── imagem2.jpg     # Imagem seção "Sobre"
    ├── tenis1.jpg      # Nike Air Force 1 '07
    ├── tenis2.jpg      # Converse Chuck 70
    └── tenis3.jpg      # Vans Authentic
```

---

## 🛍️ Produtos

| Produto | Categoria | Preço |
|---|---|---|
| Nike Air Force 1 '07 | Nike Air | R$ 349,90 |
| Converse Chuck 70 | Canvas Vintage | R$ 389,90 |
| Vans Authentic | Originals | R$ 329,90 |

---

## 🚀 Como Executar

Por ser um projeto front-end puro, basta abrir o arquivo `index.html` no navegador:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/stride-store.git

# Acesse a pasta
cd stride-store

# Abra no navegador
open index.html
```

Ou utilize uma extensão como **Live Server** (VS Code) para uma melhor experiência de desenvolvimento.

> **Nenhuma dependência ou instalação é necessária.**

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica das páginas |
| CSS3 | Estilização, animações e responsividade |
| JavaScript (ES6+) | Lógica de negócio, estado e manipulação do DOM |
| localStorage | Persistência de usuário, carrinho e favoritos |
| Google Fonts | Tipografia (Inter + Space Grotesk) |
| Font Awesome 6 | Ícones |

---

## 👥 Equipe

| Nome | E-mail |
|---|---|
| Barbara Yasmin Pimenta dos Santos Tobias | barbarayasmimpimenta@gmail.com |
| Luana Gabrielle Ferreira Guedes Paes | luanagabrielle226@gmail.com |
| Pedro Augusto Lombardi da Costa | pedro.lombardi206@gmail.com |
| Ruan Monteiro Brito | ruanschool12@gmail.com |

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.  
© 2026 Stride Store. Todos os direitos reservados.
