/* ============================================
   ESCOLA CONHECIMENTO - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Destacar página atual no menu
    destacarPaginaAtual();

    // Menu mobile
    inicializarMenuMobile();

    // Calendário
    inicializarCalendario();

    // Filtros de notícias
    inicializarFiltrosNoticias();

    // Filtros de cursos
    inicializarFiltrosCursos();

    // Quiz
    inicializarQuiz();

    // Validação de formulário
    inicializarFormulario();

    // Navegação suave
    inicializarNavegacaoSuave();
});

/* ============================================
   MENU MOBILE
   ============================================ */
function inicializarMenuMobile() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function() {
        nav.classList.toggle('aberto');
        const isOpen = nav.classList.contains('aberto');
        toggle.setAttribute('aria-expanded', isOpen);
        toggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Fechar menu ao clicar em link
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('aberto');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.innerHTML = '☰';
        });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('aberto');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.innerHTML = '☰';
        }
    });
}

/* ============================================
   DESTACAR PÁGINA ATUAL
   ============================================ */
function destacarPaginaAtual() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('ativo');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/* ============================================
   NAVEGAÇÃO SUAVE
   ============================================ */
function inicializarNavegacaoSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================
   CALENDÁRIO INTERATIVO
   ============================================ */
let calendarioData = {
    mesAtual: 7, // Agosto (0-indexed)
    anoAtual: 2026
};

const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Eventos do calendário
const eventos = {
    '2026-08-15': {
        titulo: 'Reunião de Pais',
        horario: '18:00',
        local: 'Auditório da escola',
        descricao: 'Reunião bimestral com pais e responsáveis para discussão do desempenho dos alunos.'
    },
    '2026-08-20': {
        titulo: 'Feira de Ciências',
        horario: '08:00 às 12:00',
        local: 'Ginásio da escola',
        descricao: 'Apresentação dos projetos científicos dos alunos do ensino fundamental e médio.'
    },
    '2026-08-25': {
        titulo: 'Olimpíada de Matemática',
        horario: '14:00',
        local: 'Sala 12',
        descricao: 'Competição interna de matemática para alunos do 6º ao 9º ano.'
    },
    '2026-08-05': {
        titulo: 'Volta às Aulas',
        horario: '07:30',
        local: 'Pátio da escola',
        descricao: 'Cerimônia de boas-vindas para o segundo semestre letivo.'
    },
    '2026-09-07': {
        titulo: 'Feriado - Independência',
        horario: '—',
        local: '—',
        descricao: 'Não haverá aula em razão do feriado nacional.'
    },
    '2026-09-15': {
        titulo: 'Avaliação Bimestral',
        horario: '07:30 às 12:00',
        local: 'Salas de aula',
        descricao: 'Prova bimestral para todas as turmas do ensino fundamental e médio.'
    }
};

function inicializarCalendario() {
    const btnAnterior = document.getElementById('cal-anterior');
    const btnProximo = document.getElementById('cal-proximo');
    const tituloMes = document.getElementById('cal-mes-ano');
    const tabela = document.getElementById('calendario-tabela');
    const modal = document.getElementById('modal-evento');
    const btnFechar = document.getElementById('modal-fechar');

    if (!tabela) return;

    renderizarCalendario();

    if (btnAnterior) {
        btnAnterior.addEventListener('click', () => {
            calendarioData.mesAtual--;
            if (calendarioData.mesAtual < 0) {
                calendarioData.mesAtual = 11;
                calendarioData.anoAtual--;
            }
            renderizarCalendario();
        });
    }

    if (btnProximo) {
        btnProximo.addEventListener('click', () => {
            calendarioData.mesAtual++;
            if (calendarioData.mesAtual > 11) {
                calendarioData.mesAtual = 0;
                calendarioData.anoAtual++;
            }
            renderizarCalendario();
        });
    }

    if (btnFechar && modal) {
        btnFechar.addEventListener('click', fecharModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) fecharModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') fecharModal();
        });
    }
}

function renderizarCalendario() {
    const tabela = document.getElementById('calendario-tabela');
    const tituloMes = document.getElementById('cal-mes-ano');
    if (!tabela) return;

    const { mesAtual, anoAtual } = calendarioData;
    if (tituloMes) tituloMes.textContent = `${nomesMeses[mesAtual]} ${anoAtual}`;

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const diasMesAnterior = new Date(anoAtual, mesAtual, 0).getDate();

    let html = '<thead><tr>';
    diasSemana.forEach(dia => {
        html += `<th scope="col">${dia}</th>`;
    });
    html += '</tr></thead><tbody><tr>';

    // Dias do mês anterior
    for (let i = primeiroDia - 1; i >= 0; i--) {
        const dia = diasMesAnterior - i;
        html += `<td class="outro-mes"><span class="num-dia">${dia}</span></td>`;
    }

    // Dias do mês atual
    const hoje = new Date();
    const ehHoje = (dia) => {
        return hoje.getDate() === dia && hoje.getMonth() === mesAtual && hoje.getFullYear() === anoAtual;
    };

    let diaSemana = primeiroDia;
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataKey = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const temEvento = eventos[dataKey];
        const classeHoje = ehHoje(dia) ? 'hoje' : '';
        const classeEvento = temEvento ? 'evento' : '';
        const labelEvento = temEvento ? `<div class="evento-label">${temEvento.titulo}</div>` : '';

        html += `<td class="${classeHoje} ${classeEvento}" data-data="${dataKey}" tabindex="0" role="button" aria-label="${dia} de ${nomesMeses[mesAtual]}">
            <span class="num-dia">${dia}</span>
            ${labelEvento}
        </td>`;

        diaSemana++;
        if (diaSemana === 7) {
            html += '</tr><tr>';
            diaSemana = 0;
        }
    }

    // Dias do próximo mês
    let proxDia = 1;
    while (diaSemana > 0 && diaSemana < 7) {
        html += `<td class="outro-mes"><span class="num-dia">${proxDia}</span></td>`;
        proxDia++;
        diaSemana++;
    }

    html += '</tr></tbody>';
    tabela.innerHTML = html;

    // Adicionar eventos de clique
    tabela.querySelectorAll('td[data-data]').forEach(celula => {
        const dataKey = celula.getAttribute('data-data');
        if (eventos[dataKey]) {
            celula.addEventListener('click', () => abrirModalEvento(dataKey));
            celula.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    abrirModalEvento(dataKey);
                }
            });
        }
    });
}

function abrirModalEvento(dataKey) {
    const modal = document.getElementById('modal-evento');
    const evento = eventos[dataKey];
    if (!modal || !evento) return;

    const [ano, mes, dia] = dataKey.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    document.getElementById('modal-titulo').textContent = evento.titulo;
    document.getElementById('modal-data').innerHTML = `<strong>Data:</strong> ${dataFormatada}`;
    document.getElementById('modal-horario').innerHTML = `<strong>Horário:</strong> ${evento.horario}`;
    document.getElementById('modal-local').innerHTML = `<strong>Local:</strong> ${evento.local}`;
    document.getElementById('modal-descricao').innerHTML = `<strong>Descrição:</strong> ${evento.descricao}`;

    modal.classList.add('aberto');
    document.getElementById('modal-fechar').focus();
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    const modal = document.getElementById('modal-evento');
    if (modal) {
        modal.classList.remove('aberto');
        document.body.style.overflow = '';
    }
}

/* ============================================
   FILTROS DE NOTÍCIAS
   ============================================ */
function inicializarFiltrosNoticias() {
    const botoes = document.querySelectorAll('.filtro-noticia');
    const cards = document.querySelectorAll('.noticia-card');

    if (botoes.length === 0) return;

    botoes.forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-filtro');

            botoes.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');

            cards.forEach(card => {
                const catCard = card.getAttribute('data-categoria');
                if (categoria === 'todos' || catCard === categoria) {
                    card.style.display = '';
                    card.style.animation = 'slideIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ============================================
   FILTROS DE CURSOS
   ============================================ */
function inicializarFiltrosCursos() {
    const botoes = document.querySelectorAll('.filtro-curso');
    const cards = document.querySelectorAll('.curso-card');

    if (botoes.length === 0) return;

    botoes.forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-filtro');

            botoes.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');

            cards.forEach(card => {
                const catCard = card.getAttribute('data-categoria');
                if (categoria === 'todos' || catCard === categoria) {
                    card.style.display = '';
                    card.style.animation = 'slideIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ============================================
   QUIZ EDUCATIVO
   ============================================ */
function inicializarQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    const perguntas = [
        {
            pergunta: 'Qual é o resultado de 5 × 6?',
            opcoes: ['20', '25', '30', '35'],
            correta: 2
        },
        {
            pergunta: 'Qual é a capital do Brasil?',
            opcoes: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
            correta: 2
        },
        {
            pergunta: 'Quantos planetas existem no Sistema Solar?',
            opcoes: ['7', '8', '9', '10'],
            correta: 1
        },
        {
            pergunta: 'Qual é o maior oceano da Terra?',
            opcoes: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
            correta: 3
        },
        {
            pergunta: 'Quem pintou a Mona Lisa?',
            opcoes: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo'],
            correta: 2
        }
    ];

    let perguntaAtual = 0;
    let pontuacao = 0;
    let respondeu = false;

    function renderizarPergunta() {
        const pergunta = perguntas[perguntaAtual];
        respondeu = false;

        let html = `
            <div class="quiz-progresso" style="margin-bottom: 1.5rem; color: var(--cinza-texto); font-size: 0.9rem;">
                Pergunta ${perguntaAtual + 1} de ${perguntas.length}
            </div>
            <div class="quiz-pergunta">${pergunta.pergunta}</div>
            <div class="quiz-opcoes">
        `;

        pergunta.opcoes.forEach((opcao, index) => {
            html += `
                <label class="quiz-opcao" data-index="${index}">
                    <input type="radio" name="quiz-resposta" value="${index}">
                    <span>${opcao}</span>
                </label>
            `;
        });

        html += '</div>';
        html += '<div class="quiz-feedback" id="quiz-feedback"></div>';
        html += `<button class="btn btn-primary" id="btn-responder">Responder</button>`;

        container.innerHTML = html;

        // Eventos de seleção
        container.querySelectorAll('.quiz-opcao').forEach(opcao => {
            opcao.addEventListener('click', function() {
                if (respondeu) return;
                container.querySelectorAll('.quiz-opcao').forEach(o => o.classList.remove('selecionada'));
                this.classList.add('selecionada');
                this.querySelector('input').checked = true;
            });
        });

        document.getElementById('btn-responder').addEventListener('click', verificarResposta);
    }

    function verificarResposta() {
        if (respondeu) return;

        const selecionada = container.querySelector('input[name="quiz-resposta"]:checked');
        if (!selecionada) {
            mostrarFeedback('Por favor, selecione uma resposta.', 'erro');
            return;
        }

        respondeu = true;
        const resposta = parseInt(selecionada.value);
        const pergunta = perguntas[perguntaAtual];
        const feedback = document.getElementById('quiz-feedback');

        container.querySelectorAll('.quiz-opcao').forEach((opcao, index) => {
            if (index === pergunta.correta) {
                opcao.classList.add('correta');
            } else if (index === resposta && resposta !== pergunta.correta) {
                opcao.classList.add('errada');
            }
            opcao.style.pointerEvents = 'none';
        });

        if (resposta === pergunta.correta) {
            pontuacao++;
            mostrarFeedback('✅ Resposta correta! Parabéns!', 'acerto');
        } else {
            mostrarFeedback(`❌ Resposta incorreta. A resposta correta era: ${pergunta.opcoes[pergunta.correta]}`, 'erro');
        }

        const btn = document.getElementById('btn-responder');
        if (perguntaAtual < perguntas.length - 1) {
            btn.textContent = 'Próxima pergunta →';
            btn.onclick = function() {
                perguntaAtual++;
                renderizarPergunta();
            };
        } else {
            btn.textContent = 'Ver resultado final';
            btn.onclick = mostrarResultado;
        }
    }

    function mostrarFeedback(msg, tipo) {
        const feedback = document.getElementById('quiz-feedback');
        feedback.textContent = msg;
        feedback.className = `quiz-feedback visivel ${tipo}`;
    }

    function mostrarResultado() {
        const porcentagem = Math.round((pontuacao / perguntas.length) * 100);
        let mensagem = '';
        if (porcentagem === 100) mensagem = 'Perfeito! Você acertou todas!';
        else if (porcentagem >= 80) mensagem = 'Excelente! Você foi muito bem!';
        else if (porcentagem >= 60) mensagem = 'Bom trabalho! Continue estudando!';
        else mensagem = 'Não desista! Estude mais e tente novamente!';

        container.innerHTML = `
            <div class="text-center" style="padding: 2rem 0;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                <h3 style="color: var(--azul-escuro); margin-bottom: 1rem;">Resultado do Quiz</h3>
                <p style="font-size: 1.5rem; color: var(--azul-medio); font-weight: bold; margin-bottom: 0.5rem;">
                    ${pontuacao} de ${perguntas.length} corretas
                </p>
                <p style="color: var(--cinza-texto); margin-bottom: 1.5rem;">${mensagem}</p>
                <button class="btn btn-primary" id="btn-reiniciar">Tentar novamente</button>
            </div>
        `;

        document.getElementById('btn-reiniciar').addEventListener('click', function() {
            perguntaAtual = 0;
            pontuacao = 0;
            renderizarPergunta();
        });
    }

    renderizarPergunta();
}

/* ============================================
   VALIDAÇÃO DE FORMULÁRIO
   ============================================ */
function inicializarFormulario() {
    const form = document.getElementById('form-contato');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valido = true;

        // Limpar erros anteriores
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('erro'));
        document.getElementById('mensagem-sucesso').classList.remove('visivel');

        // Validar nome
        const nome = document.getElementById('nome');
        if (!nome.value.trim()) {
            mostrarErro(nome, 'Por favor, preencha seu nome.');
            valido = false;
        }

        // Validar email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            mostrarErro(email, 'Por favor, preencha seu e-mail.');
            valido = false;
        } else if (!emailRegex.test(email.value.trim())) {
            mostrarErro(email, 'Por favor, insira um e-mail válido.');
            valido = false;
        }

        // Validar assunto
        const assunto = document.getElementById('assunto');
        if (!assunto.value.trim()) {
            mostrarErro(assunto, 'Por favor, preencha o assunto.');
            valido = false;
        }

        // Validar mensagem
        const mensagem = document.getElementById('mensagem');
        if (!mensagem.value.trim()) {
            mostrarErro(mensagem, 'Por favor, escreva sua mensagem.');
            valido = false;
        }

        if (valido) {
            document.getElementById('mensagem-sucesso').classList.add('visivel');
            form.reset();

            // Esconder mensagem após 5 segundos
            setTimeout(() => {
                document.getElementById('mensagem-sucesso').classList.remove('visivel');
            }, 5000);
        }
    });

    // Limpar erro ao digitar
    form.querySelectorAll('input, textarea').forEach(campo => {
        campo.addEventListener('input', function() {
            this.closest('.form-group').classList.remove('erro');
        });
    });
}

function mostrarErro(campo, mensagem) {
    const grupo = campo.closest('.form-group');
    grupo.classList.add('erro');
    const msgEl = grupo.querySelector('.erro-msg');
    if (msgEl) msgEl.textContent = mensagem;
}
