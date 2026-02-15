class BotaoSair {
    constructor (){
        this.html = document.getElementById("sair-salvar")
        this.gerenciadorDeSave = new GerenciadorDeSave()
        this.html.addEventListener("click",() => this.salvaESai())
    }
    salvaESai() {
        alert("SALVANDO E SAINDO")
        const dadosSalvosJson = this.gerenciadorDeSave.atualizaDadosDoSave()
        window.localStorage.setItem("dadosSalvos", dadosSalvosJson)
    }
    pegaDadosSalvos() {
        const dadosSalvosJson=(!!window.localStorage.getItem("dadosSalvos"))?window.localStorage.getItem("dadosSalvos"):0
        const dadosSalvos = JSON.parse(dadosSalvosJson)
        if(!dadosSalvos) {
            console.log("sem dados salvos")
            return this.pegaDadosZerados()
        }
        return dadosSalvos
    }
    escondeBotao() {
        this.html.style.display="none"
    }
    mostraBotao() {
        this.html.style.display="block"
    }
    pegaDadosZerados() {
        return{
            pontuacao:0,
            tempoGasto: "00:00",
            numerosAleatoriosJaSorteados: []
        }
    }
}