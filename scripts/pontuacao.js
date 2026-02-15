// Sistema de pontuação do jogo
let pontuacao = 100;

/**
 * Acrescenta ou diminui pontuação baseado no resultado do drop
 * @param {boolean} acertou - true se o livro foi dropado no local correto, false se errado
 */
function acrescentarPontuacao(acertou) {
    if (acertou) {
        // Acrescenta 2 pontos quando dropado no local certo
        pontuacao += 2;
    } else {
        // Diminui 1 ponto quando dropado no local errado
        pontuacao -= 1;
    }
    
    // Atualizar a exibição da pontuação (se houver um elemento na página)
    atualizarExibicaoPontuacao();
}

/**
 * Atualiza a exibição da pontuação na página
 */
function atualizarExibicaoPontuacao() {
    const elementoPontuacao = document.getElementById('indicador');
    if (elementoPontuacao) {
        elementoPontuacao.textContent = pontuacao;
    }
}

/**
 * Retorna a pontuação atual
 * @returns {number} pontuação atual
 */
function obterPontuacao() {
    return pontuacao;
}

/**
 * Função chamada ao final do jogo
 * Exibe a pontuação final no console e pode fazer outras ações
 */
function pontuacaoFinal() {
    // Atualizar a exibição final da pontuação
    atualizarExibicaoPontuacao();
    
    // Você pode adicionar aqui outras ações, como:
    // - Salvar pontuação no localStorage
    // - Exibir mensagem personalizada baseada na pontuação
    // - Enviar pontuação para um servidor, etc.
}
