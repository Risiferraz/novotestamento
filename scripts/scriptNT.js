function clicarStart() { // Ao clicar no botão "Start", a função clicarStart é chamada, que tem a responsabilidade de ocultar a página inicial e exibir o container do jogo.
  const paginaInicial = document.getElementById('pagina-inicial');
  const container = document.querySelector('.container');
  if (paginaInicial) {
    paginaInicial.style.display = 'none';
  }
  if (container) {
    container.style.display = 'grid';
  }
}

function clicarOpcoes() {
  document.querySelector('.lista-de-opcoes').style.display = 'block'; // Exibe a lista de opções ao clicar no botão de opções
}

function selecionarOpcao(elementoSelecionado) { // Função para selecionar uma opção na lista de opções
  const opcoes = document.querySelectorAll('.lista-de-opcoes .opcoes'); // Seleciona todas as opções dentro da lista de opções
  opcoes.forEach(opcao => { // Percorre todas as opções
    if (opcao === elementoSelecionado) { // Se (ou quando) uma opção for a selecionada
      opcao.style.display = 'block'; // A opção selecionada é exibida
    } else {
      opcao.style.display = 'none'; // As outras opções são ocultadas
    }
  });
  const lista = document.querySelector('.lista-de-opcoes'); // busca no HTML o elemento com a classe lista-de-opcoes e armazena na variável lista.
  if (lista) {
    lista.classList.remove('livro-escolhido-da-lista-de-opcoes'); // Remove antes para evitar acúmulo
    lista.classList.add('livro-escolhido-da-lista-de-opcoes');
    lista.style.display = 'flex'; // Sobrescreve o display: none do estado inicial
  }
  const botaoSelecionar = document.getElementById('selecionar-opcoes'); // busca o elemento com o id selecionar-opcoes e armazena na variável botaoSelecionar.
  if (botaoSelecionar) {
    botaoSelecionar.style.display = 'none'; //Se esse botão existir, ele é ocultado (display: 'none'), ou seja, deixa de aparecer na tela.
  }
  const nomeLivroH1 = document.getElementById('nome-livro-escolhido');
  if (nomeLivroH1 && elementoSelecionado) {
    nomeLivroH1.textContent = elementoSelecionado.textContent;
  }
}

let currentDraggedElement = null; // Variável global para rastrear o elemento sendo arrastado
let mensagemErroJaMostrada = false; // Flag para controlar se a mensagem de erro já foi mostrada
let livrosNormaisDropados = 0; // Controlar qual é o próximo box apócrifo deve ser preenchido, incrementando a cada drop correto
const TOTAL_LIVROS_NORMAIS = 27;

function embaralharLivros() {
  const boxdrag = document.getElementById('boxdrag'); // Seleciona o elemento com id "boxdrag" e armazena na variável boxdrag
  if (!boxdrag) return; // Só por segurança, se o elemento boxdrag não for encontrado, a função é encerrada imediatamente para evitar erros

  const books = Array.from(boxdrag.querySelectorAll('.livro')); // Cria um array a partir dos elementos encontrados dentro de boxdrag que possuem a classe "livro". Esses elementos representam as imagens dos livros que serão embaralhadas.

  for (let i = books.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = books[i];
    books[i] = books[j];
    books[j] = temp;
  }

  books.forEach(book => book.remove()); // Remove as imagens dragáveis "livros"
  books.forEach(book => boxdrag.appendChild(book));   // Volta a inseri-las na ordem embaralhada
  if (books.length > 0) {
    const primeiroLivro = books[0];
    const nomePrimeiroLivro = (primeiroLivro.getAttribute('alt') || primeiroLivro.textContent || '').toUpperCase();
  }
}

// Função para dimensionamento proporcional de toda a área de jogo
(function escalaDinamicaPagina() {
  const BASE_WIDTH = 750;
  const BASE_HEIGHT = 850;
  const MAX_VISUAL_WIDTH = 800; // limita a largura visual máxima
  function scaleStage() {
    // Desativa escala dinâmica em telas pequenas
    if (window.innerWidth <= 480) {
      const stageEl = document.getElementById('game-base');
      const paginaInicial = document.getElementById('pagina-inicial');
      if (stageEl) stageEl.style.transform = '';
      if (paginaInicial) paginaInicial.style.transform = '';
      return;
    }
    const stageEl = document.getElementById('game-base');
    const stageWrapper = document.getElementById('stage');
    if (stageEl && stageWrapper) {
      // Usar o tamanho interno disponível do wrapper (considera padding)
      const availableWidth = stageWrapper.clientWidth;
      const availableHeight = stageWrapper.clientHeight;
      const scaleW = Math.min(availableWidth, MAX_VISUAL_WIDTH) / BASE_WIDTH;
      const scale = Math.min(scaleW, availableHeight / BASE_HEIGHT);
      const scaledWidth = BASE_WIDTH * scale;
      const offsetX = Math.max(0, (availableWidth - scaledWidth) / 2);
      stageEl.style.transform = `translate(${offsetX}px, 0) scale(${scale})`;
    }
    // Escala dinâmica para a tela inicial
    const paginaInicial = document.getElementById('pagina-inicial');
    if (paginaInicial && stageWrapper) {
      const availableWidth = stageWrapper.clientWidth;
      const availableHeight = stageWrapper.clientHeight;
      const scaleW = Math.min(availableWidth, MAX_VISUAL_WIDTH) / BASE_WIDTH;
      const scale = Math.min(scaleW, availableHeight / BASE_HEIGHT);
      const scaledWidth = BASE_WIDTH * scale;
      const offsetX = Math.max(0, (availableWidth - scaledWidth) / 2);
      paginaInicial.style.transform = `translate(${offsetX}px, 0) scale(${scale})`;
      paginaInicial.style.transformOrigin = 'top left';
    }
  }
  window.addEventListener('resize', scaleStage);
  window.addEventListener('DOMContentLoaded', scaleStage);
})();

const cronometro = new Cronometro();

window.addEventListener('DOMContentLoaded', function () { // Quando o conteúdo da página for completamente carregado, a função dentro do addEventListener será executada. Isso garante que o código só tente acessar elementos do DOM depois que eles estiverem disponíveis.
  embaralharLivros(); // chama a função que embaralha as imagens dos livros dentro do container #boxdrag, garantindo que a ordem dos livros seja diferente a cada vez que o jogo é iniciado. (linha 47)
  setupBookDragListeners(); // chama a função que adiciona os listeners necessários para permitir que os livros sejam arrastados e soltos.
  setupDropZones(); //chama a função que configura as áreas onde os livros podem ser soltos (as prateleiras).

  const livros = Array.from(document.querySelectorAll('#boxdrag .livro')); // Cria um array com as imagens de livros dentro de #boxdrag
  if (livros.length > 0) { // Se houver livros ...
    livros.forEach((livro, idx) => { // Percorre as imagens de livros
      livro.style.display = idx === 0 ? '' : 'none'; // Exibe apenas o primeiro livro (idx === 0) e oculta os demais (display: 'none'), garantindo que o jogador só veja um livro de cada vez para arrastar, mantendo os outros ocultos até que seja necessário mostrar o próximo.
    });

    const ultimoLivro = livros[livros.length - 1]; // Pega o último livro do array
    const nomeUltimoLivro = (ultimoLivro.getAttribute('alt') || ultimoLivro.textContent || '').toUpperCase(); // Obtém o nome do último livro
    const nomeUltimoLivroH1 = document.getElementById('nome-ultimo-livro'); // Seleciona o elemento h1 onde o nome do último livro sorteado será exibido
    if (nomeUltimoLivroH1) {
      nomeUltimoLivroH1.textContent = nomeUltimoLivro;
      console.log('Último livro:', nomeUltimoLivro);
    }
  }

  // Iniciar cronômetro
  cronometro.iniciaCronometro();
  setInterval(() => cronometro.atualizaCronometro(), 1000);
});

function setupBookDragListeners() {
  // Adicionar listeners nas imagens .livro
  const bookImages = document.querySelectorAll(".livro");
  bookImages.forEach(book => {
    book.addEventListener("dragstart", dragStart);
    book.addEventListener("dragend", dragEnd);
  });

  // Garantir que imagens box-livro não sejam arrastáveis
  const boxLivros = document.querySelectorAll(".box-livro");
  boxLivros.forEach(boxLivro => {
    boxLivro.setAttribute("draggable", "false");
    boxLivro.style.pointerEvents = "none"; // Desabilitar completamente interação com mouse
  });

  // (Removido dragenter de #boxdrag para mostrar o próximo livro. Agora será feito no dragEnd)
}

// (removida) preencherBoxesComLivros: agora as imagens já estão dentro das boxes no HTML

// Define a drag image de 25x60px e hotspot ~no canto inferior direito
function dragStart(event) {
  const img = event.target;

  // Apenas permitir drag de imagens com classe "livro"
  if (!img.classList.contains('livro')) {
    event.preventDefault();
    return;
  }

  currentDraggedElement = img; // Armazena referência global
  // Garante que temos um id para o drop usar
  if (img && img.id) {
    event.dataTransfer.setData("text/plain", img.id);
  }
  // Permite movimentação e registra o elemento pai de origem para possíveis trocas
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
  img._sourceParent = img.parentElement;

  // Ocultar a imagem original durante o arraste
  img.style.opacity = '0';

  // 1) criar um helper visual (imagem fantasma) totalmente opaco que segue o cursor
  const helper = new Image(); // Cria um novo elemento de imagem para servir como o "helper" visual que seguirá o cursor durante o arraste.
  helper.src = img.src; // Define a fonte da imagem do helper para ser a mesma da imagem original que está sendo arrastada, garantindo que o helper tenha a mesma aparência visual.
  helper.className = 'drag-ghost';  // Define a classe CSS do helper para "drag-ghost", permitindo que ele seja estilizado de forma específica (por exemplo, para definir seu tamanho, opacidade, etc.) através do CSS.
  helper.style.position = 'fixed';
  helper.style.left = '0px';
  helper.style.top = '0px';
  helper.style.pointerEvents = 'none';
  helper.style.userSelect = 'none';
  helper.style.zIndex = '2147483647';
  helper.style.opacity = '1';
  helper.style.transformOrigin = 'center center';
  document.body.appendChild(helper);
  const ghostW = parseFloat(window.getComputedStyle(helper).width) || 32;
  const ghostH = parseFloat(window.getComputedStyle(helper).height) || 77;
  const offsetX = ghostW * 0.5;
  const offsetY = ghostH * 0.5;
  const onDragMove = (e) => {
    // Parar de mover se o drop foi bem-sucedido
    if (img._dropSuccessful || !helper.parentNode) return;
    helper.style.left = (e.clientX - offsetX) + 'px';
    helper.style.top = (e.clientY - offsetY) + 'px';
  };
  document.addEventListener('dragover', onDragMove);
  img._dragHelper = helper;
  img._onDragMove = onDragMove;
  // 2) ocultar o ghost nativo usando um canvas transparente 1x1
  if (event.dataTransfer && event.dataTransfer.setDragImage) {
    const blank = document.createElement('canvas');
    blank.width = 1;
    blank.height = 1;
    event.dataTransfer.setDragImage(blank, 0, 0);
  }
}

function dragEnd(event) { // função que ocorre quando o arraste termina
  const img = event.target; // img recebe a imagem que foi arrastada
  currentDraggedElement = null; // Quando o arraste termina (no dragEnd), essa linha define currentDraggedElement como null, indicando que nenhum elemento está mais sendo arrastado.

  if (img) img.style.opacity = '1';   // Restaurar a opacidade da imagem original que ficou oculta durante o arraste (linha 117)
  if (img && !img._dropSuccessful) {  //Só executa o bloco se o arraste não terminou com um drop correto (ou seja, a imagem não foi solta no local certo).
    if (img._dragHelper) {  //Se existe um helper visual (a imagem fantasma que segue o cursor), ele é removido do DOM e a referência é apagada.
      if (img._dragHelper.parentNode) img._dragHelper.parentNode.removeChild(img._dragHelper);
      delete img._dragHelper;
    }
    if (img._onDragMove) { //Verifica se existe a função que fazia o evento que fazia o "ghost" (imagem fantasma)
      document.removeEventListener('dragover', img._onDragMove); //Remove o listener de dragover que atualizava a posição do ghost na tela.
      delete img._onDragMove; //Apaga a referência à função do objeto img, liberando memória e evitando efeitos colaterais em futuros drags.
    }
  }

  if (img && img._dropSuccessful) {  //verificam se a imagem (img) possui a propriedade _dropSuccessful, que indica que o último arraste terminou com um drop correto
    delete img._dropSuccessful;  //Se sim, a propriedade é removida do objeto img
  }

  if (img && img.parentElement && img.parentElement.classList.contains('box')) { //
    const box = img.parentElement;  // const box recebe o elemento pai da img (a box onde a imagem foi solta)
    const boxId = box.getAttribute('data-draggable-id'); // Remove o sufixo '-drag' para comparar com o boxId
    const livroId = img.id.replace(/-drag$/, ''); // livroId recebe o id da imagem arrastada (sem o sufixo '-drag')

    let primeiraDropagem = !img.hasAttribute('data-drop-ocorreu'); // Verifica se é a primeira vez que essa imagem está sendo dropada corretamente
    if (boxId === livroId) {  // Verifica se o drop foi correto comparando os ids
      img.style.display = 'none'; // Drop correto: ocultar a imagem do livro arrastável

      let boxLivro = box.querySelector('.box-livro'); // Verifica se já existe uma imagem .box-livro dentro da box
      if (!boxLivro) {  // Se não existir ...
        boxLivro = document.createElement('img');  // Cria uma nova imagem .box-livro
        boxLivro.className = 'box-livro';  // Define a classe da nova imagem criada
        boxLivro.id = livroId;  // Define o id da nova imagem criada
        boxLivro.alt = livroId; // Define o alt da nova imagem criada
        boxLivro.src = `/imagens/${livroId}.png`; // Define o src da nova imagem criada selecionando uma imagem da pasta "imagens"
        box.appendChild(boxLivro); // Adiciona a nova imagem criada à box
      }
      boxLivro.style.display = 'block'; // Garante que a imagem .box-livro esteja visível
    } else {  //Se o drop foi incorreto, ou seja, quando o id do box de destino (boxId) é diferente do id do livro (livroId) - veja linha 183
      img.style.display = ''; // Drop incorreto: restaurar a visibilidade da imagem arrastável (classe: livro)
    }

    if (primeiraDropagem) { // Se for a primeira vez que essa imagem está sendo dropada corretamente
      img.setAttribute('data-drop-ocorreu', '1');  // Só executa o bloco se for a primeira vez que essa imagem está sendo dropada (ou seja, ela ainda não tem o atributo data-drop-ocorreu).
      const livros = Array.from(document.querySelectorAll('#boxdrag .livro')); // Pega todas as imagens de livros ainda em #boxdrag.
      for (let i = 0; i < livros.length; i++) { //Percorre as imagens de classe "livros".
        if (livros[i].style.display === 'none') { //Quando encontra a próxima imagem oculta (display: none), torna ela visível (display: '') e para o loop.
          livros[i].style.display = ''; // Tornar visível o próximo livro
          break; // Sair do loop após mostrar o próximo livro
        }
      }
    }
  }
}

function setupDropZones() { // Configura as zonas de drop
  const boxes = document.querySelectorAll('.box');
  boxes.forEach(box => {
    box.addEventListener('dragover', (e) => { // função que ocorre quando o elemento é arrastado sobre a box
      e.preventDefault(); // Previne o comportamento padrão do navegador, permitindo o drop
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'; // Indica que o efeito de drop será de movimentação
      box.classList.add('droppable-hover'); // Adiciona a classe de droppable-hover = efeito visual ao passar o mouse OU ao arrastar elemento sobre a box
    });

    box.addEventListener('dragenter', () => { // função que ocorre quando o elemento entra na box
      box.classList.add('droppable-hover'); // Adiciona a classe de droppable-hover = efeito visual ao passar o mouse OU ao arrastar elemento sobre a box
    });

    box.addEventListener('dragleave', () => { // função que ocorre quando o elemento sai da box
      box.classList.remove('droppable-hover');
    });

    box.addEventListener('drop', (e) => { // função que ocorre quando o elemento é solto na box
      e.preventDefault(); // Previne o comportamento padrão do navegador, permitindo o drop
      box.classList.remove('droppable-hover'); // Remover a classe de droppable-hover = efeito visual ao passar o mouse OU ao arrastar elemento sobre a box
      const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null; // Pega o id do elemento arrastado
      if (!id) return; // Se não coincidir o id, sai da função
      const dragged = document.getElementById(id); // Pega o id do elemento arrastado
      if (!dragged) return; // Se não encontrar o elemento arrastado, sai da função (não dropa)

      // Verificar se o livro foi colocado no lugar correto
      const boxId = box.getAttribute('data-draggable-id'); // id da box
      const livroId = id.replace(/-drag$/, ''); // livroId recebe o id da imagem arrastada, removendo o sufixo '-drag' para comparar corretamente

      if (dragged.parentElement === box) return; // Se o usuário tentar "dropar" o livro na mesma box onde ele já está, nada acontece.

      const sourceParent = dragged._sourceParent || dragged.parentElement; // garante que devolva o livro para sua posição original que estava na box alvo antes do drop.
      const existing = box.querySelector('.livro'); // Verifica se já existe um livro na box alvo

      // Se já houver um livro na box alvo e não for o mesmo, faz swap: devolve o existente para a origem
      if (existing && existing !== dragged) { // Se já existir um livro na box alvo e não for o mesmo que está sendo dropado
        if (sourceParent) sourceParent.appendChild(existing); // Devolve o livro existente para a box de origem
      }

      box.appendChild(dragged);  // Adiciona o livro arrastado à box alvo

      if (boxId === livroId) {  // Verifica se o drop foi correto comparando os ids (agora ambos sem sufixo)
        dragged._dropSuccessful = true; // Marca o drop como bem-sucedido

        acrescentarPontuacao(true);  // chama a função para acrescentar pontuação por acerto
        livrosNormaisDropados++; // Incrementa o contador de livros normais dropados corretamente

        if (dragged._dragHelper && dragged._dragHelper.parentNode) { // verifica se a imagem fantasma existe e se  ainda está presente no DOM (na página)
          dragged._dragHelper.parentNode.removeChild(dragged._dragHelper); // Remove o helper visual (imagem fantasma) que segue o cursor
          delete dragged._dragHelper; // Apaga a referência ao helper visual do objeto arrastado
        }
        if (dragged._onDragMove) { // Verifica se a função que atualizava a posição do ghost na tela ainda está associada ao elemento arrastado
          document.removeEventListener('dragover', dragged._onDragMove); // Remove o listener de dragover que atualizava a posição do ghost na tela
          delete dragged._onDragMove; // Apaga a referência à função do objeto arrastado
        }
        verificarFimDeJogo(); // a função verificarFimDeJogo é chamada toda vez que um livro é arrastado e solto na box correta,
      } else { //se não for o drop correto
        mostrarMensagemErro();
        // Diminuir pontuação por erro
        acrescentarPontuacao(false);
      }
    });
  });
}

function mostrarMensagemErro() { // Função para mostrar mensagem de erro
  if (mensagemErroJaMostrada) return;   // Se a mensagem de erro já foi mostrada, não faz nada

  const mensagem = document.getElementById('mensagem-de-erro'); // Seleciona o elemento da mensagem de erro
  const botaoOk = document.getElementById('ok'); // Seleciona o botão OK da mensagem de erro
  if (!mensagem) return; // Se o elemento da mensagem de erro não existir, sai da função

  mensagemErroJaMostrada = true;  // Marca que a mensagem já foi mostrada

  mensagem.style.display = 'block';  // Mostra a mensagem de erro
  mensagem.style.opacity = '1'; // Define a opacidade da mensagem de erro para 1 (totalmente visível)

  if (botaoOk) { // Se o botão OK existir
    botaoOk.style.display = 'block'; // Mostra o botão OK
  }
}

function clicarOk() {
  const mensagemErro = document.getElementById("mensagem-de-erro");
  const botaoOk = document.getElementById("ok");

  if (mensagemErro) {
    mensagemErro.style.display = "none";
  }

  if (botaoOk) {
    botaoOk.style.display = "none";
  }

  // mensagemErroJaMostrada não é mais resetada aqui, garantindo que a mensagem só apareça uma vez durante toda a partida
}

function verificarFimDeJogo() { // Verificar se o jogo acabou
  if (livrosNormaisDropados === TOTAL_LIVROS_NORMAIS) { // Verificar se todos os livros foram dropados corretamente
    fimDeJogo(); //Neste caso, a função fimDeJogo é chamada para finalizar o jogo
  }
}

function fimDeJogo() {
  cronometro.pararCronometro();
  pontuacaoFinal();

  acrescerPontuacaoTempo();
  function acrescerPontuacaoTempo() {
    // 1. Pegar número do indicador (ou marca-pontuacao)
    let indicadorNum = 0;
    const indicadorElemento = document.getElementById("indicador");
    if (indicadorElemento) {
      indicadorNum = parseFloat(indicadorElemento.textContent.replace(',', '.')) || 0;
    } else {
      // Tentar pegar de marca-pontuacao se não achar indicador
      const marcaPontuacao = document.getElementById("marca-pontuacao");
      if (marcaPontuacao) {
        indicadorNum = parseFloat(marcaPontuacao.textContent.replace(',', '.')) || 0;
      }
    }

    // 2. Pegar número do cronômetro e transformar em m,ss (float)
    let tempoStr = cronometro.pegaRelogio();
    let tempoFloat = 0;
    if (tempoStr) {
      let partes = tempoStr.split(":");
      if (partes.length === 2) {
        // mm:ss
        let min = parseInt(partes[0], 10);
        let seg = parseInt(partes[1], 10);
        tempoFloat = parseFloat(min + "." + (seg < 10 ? "0" + seg : seg));
      } else if (partes.length === 3) {
        // hh:mm:ss (ignorar horas, usar só mm:ss)
        let min = parseInt(partes[1], 10);
        let seg = parseInt(partes[2], 10);
        tempoFloat = parseFloat(min + "." + (seg < 10 ? "0" + seg : seg));
      }
    }

    // 3. Subtrair tempoFloat de indicadorNum
    let resultado = +(indicadorNum - tempoFloat).toFixed(2);

    // Log explicando a operação matemática
    console.log(
      `[Pontuação Tempo] indicador: ${indicadorNum}, tempo (m,ss): ${tempoFloat}, operação: ${indicadorNum} - ${tempoFloat} = ${resultado}`
    );

    // Transferir resultado para mostra-pontuacao-final
    const pontuacaoFinalElemento = document.getElementById("mostra-pontuacao-final");
    if (pontuacaoFinalElemento) {
      pontuacaoFinalElemento.textContent = resultado;
    }
  }
  
  const tempoFinalElemento = document.getElementById('mostra-tempo-final');
  if (tempoFinalElemento) {
    tempoFinalElemento.textContent = cronometro.pegaRelogio();
  }

  // Fazer aparecer "mensagem-final"
  const mensagemFinal = document.getElementById('mensagem-final');
  if (mensagemFinal) {
    mensagemFinal.style.display = 'grid';
    mensagemFinal.style.opacity = '1';
    setTimeout(function () {  // Após 5 segundos, aplicar efeito piscante e mostrar mensagem de acerto/erro
      verificarSeAcertouLivro();  // Chamar a função de verificação e mostrar mensagem

      const livroEscolhido = document.getElementById('livro-escolhido'); // Seleciona a div do livro escolhido
      const ultimoLivro = document.getElementById('ultimo-livro'); // Seleciona a div do último livro sorteado
      const mensagemLivro = document.getElementById('mensagem-livro-escolhido'); // Seleciona a div da mensagem de acerto/erro
      if (mensagemLivro) mensagemLivro.style.display = 'flex'; // Exibe a mensagem com display flex
      if (livroEscolhido) livroEscolhido.classList.add('efeito-pisca'); // Aplica classe de efeito piscante no livro escolhido
      if (ultimoLivro) ultimoLivro.classList.add('efeito-pisca'); // Aplica classe de efeito piscante no último livro sorteado
      if (mensagemLivro) mensagemLivro.classList.add('efeito-pisca'); // Aplica classe de efeito piscante na mensagem de acerto/erro

      // Remover o efeito após 3 segundos
      setTimeout(function () {
        if (livroEscolhido) livroEscolhido.classList.remove('efeito-pisca');
        if (ultimoLivro) ultimoLivro.classList.remove('efeito-pisca');
        if (mensagemLivro) mensagemLivro.classList.remove('efeito-pisca');
      }, 5000); // Duração total do efeito piscante (2 segundos)
    }, 1500); // Aguardar 1.5 segundos antes de iniciar o efeito piscante
  }
}

function verificarSeAcertouLivro() {
  const nomeEscolhido = document.getElementById('nome-livro-escolhido');
  const nomeUltimo = document.getElementById('nome-ultimo-livro');
  const mensagemDiv = document.getElementById('mensagem-livro-escolhido');
  if (!nomeEscolhido || !nomeUltimo || !mensagemDiv) return;
  const nome1 = (nomeEscolhido.textContent || '').trim().toUpperCase();
  const nome2 = (nomeUltimo.textContent || '').trim().toUpperCase();
  if (nome1 && nome2 && nome1 === nome2) {
    mensagemDiv.innerHTML = 'PARABÉNS VOCÊ ACERTOU<br>CLIQUE AQUI PARA GANHAR UNS PONTOS EXTRAS.';
    mensagemDiv.style.cursor = 'pointer';
    let clicado = false;
    // Remove event listeners anteriores para evitar múltiplos handlers
    mensagemDiv.replaceWith(mensagemDiv.cloneNode(true));
    const novaMensagemDiv = document.getElementById('mensagem-livro-escolhido');
    if (novaMensagemDiv) {
      novaMensagemDiv.style.cursor = 'pointer';
      novaMensagemDiv.addEventListener('click', function handler() {
        if (clicado) return;
        clicado = true;
        novaMensagemDiv.classList.add('clicado');
        // Só permite se o nome do livro escolhido coincidir com o de ultimo-livro
        const nomeEscolhido = document.getElementById('nome-livro-escolhido');
        const nomeUltimo = document.getElementById('nome-ultimo-livro');
        if (!nomeEscolhido || !nomeUltimo) return;
        const nome1 = (nomeEscolhido.textContent || '').trim().toUpperCase();
        const nome2 = (nomeUltimo.textContent || '').trim().toUpperCase();
        if (nome1 && nome2 && nome1 === nome2) {
          // Pega o elemento da pontuação final
          const pontuacaoFinalElemento = document.getElementById('mostra-pontuacao-final');
          if (pontuacaoFinalElemento) {
            let valor = parseFloat(pontuacaoFinalElemento.textContent.replace(',', '.')) || 0;
            let novoValor = +(valor + 1).toFixed(2);
            pontuacaoFinalElemento.textContent = novoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            console.log(`[Pontos Extras] Pontuação anterior: ${valor}, nova pontuação: ${novoValor}`);
          }
        }
        // Desaparecer suavemente após 5 segundos
        novaMensagemDiv.style.transition = 'opacity 1s';
        setTimeout(function() {
          novaMensagemDiv.style.opacity = '0';
          setTimeout(function() {
            novaMensagemDiv.style.display = 'none';
          }, 1000); // tempo da transição
        }, 3000);
      });
    }
  } else {
    mensagemDiv.innerHTML = 'Você não acertou o livro.<br>Veja abaixo sua pontuação.';
    mensagemDiv.style.cursor = '';
  }
}

// Função para ir para a próxima fase
function vaiParaProximaFase() {
  window.location.href = "https://www.w3schools.com";
}

// Função para sair do jogo
function sairDoJogo() {
  window.close();
}

// Adicionar evento click aos botões
window.addEventListener('DOMContentLoaded', function () {
  const botaoProximaFase = document.getElementById('proxima-fase');
  if (botaoProximaFase) {
    botaoProximaFase.addEventListener('click', vaiParaProximaFase);
  }

  const botaoSairJogoFinalizado = document.getElementById('sair-jogo-finalizado');
  if (botaoSairJogoFinalizado) {
    botaoSairJogoFinalizado.addEventListener('click', sairDoJogo);
  }
});

