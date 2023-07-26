var modal = document.getElementById("request_modal");
var rqst_btn = document.getElementById("request_button");
var emerg_btn = document.getElementById('emergency_button');
var span = document.getElementsByClassName("close")[0];

var n_emergencies = 0;

window.onload = function () {
  localStorage.clear();

  updateCancelButtons();
  updateAcceptButtons();
  updateFinishButtons()

  localStorage.setItem("fornDone", "false");
  localStorage.setItem("contrDone", "false");

  localStorage.setItem("fornCanceled", "false");
  localStorage.setItem("contrCanceled", "false");

  localStorage.setItem("fornFinished", "false");
  localStorage.setItem("contrFinished", "false");
}

if (rqst_btn) {
  rqst_btn.onclick = function () {
    modal.style.display = "block";
  }
}
if (span) {
  span.onclick = function () {
    modal.style.display = "none";
  }
}
if (modal) {
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


function updateCancelButtons() {

  var cancel_btns = document.getElementsByClassName("cancel_button");
  for (var i = 0; i < cancel_btns.length; i++) {
    cancel_btns[i].removeEventListener("click", cancel);
    cancel_btns[i].addEventListener("click", cancel);
  }
}

var cancel = function () {
  let confirmation = "Tem certeza que gostaria de cancelar a requisição?"
  if (confirm(confirmation) == true) {
    if (this.parentElement.parentElement.innerHTML.indexOf("Altíssima") >= 0) {
      n_emergencies--;
    }
    localStorage.setItem("canceledRequest", this.parentElement.parentElement.innerHTML);
  }
}


function updateAcceptButtons() {

  var accept_btns = document.getElementsByClassName("accept_button");
  for (var i = 0; i < accept_btns.length; i++) {
    accept_btns[i].removeEventListener("click", accept);
    accept_btns[i].addEventListener("click", accept);
  }
}

var accept = function () {
  let confirmation = "Tem certeza que gostaria de aceitar a requisição?"
  if (confirm(confirmation) == true) {
    localStorage.setItem("acceptedRequests", this.parentElement.parentElement.innerHTML);
    this.parentElement.parentElement.remove();
  }
}

function updateFinishButtons() {

  var finish_btns = document.getElementsByClassName("finish_button");
  for (var i = 0; i < finish_btns.length; i++) {
    finish_btns[i].removeEventListener("click", finish);
    finish_btns[i].addEventListener("click", finish);
  }
}

var finish = function () {
  let confirmation = "A requisição pode ser finalizada?"
  if (confirm(confirmation) == true) {
    if (this.parentElement.parentElement.innerHTML.indexOf("Altíssima") >= 0) {
      n_emergencies--;
    }
    localStorage.setItem("finishedRequest", this.parentElement.parentElement.innerHTML);
    this.parentElement.parentElement.remove();
  }
}


function requestForm(form) {

  let pendentes = document.getElementById('pendentes');

  let origem = form.elements['origem'].value;
  let destino = form.elements['destino'].value;
  let urgencia = form.elements['urgencia'].value;
  let horario_chegada = form.elements['horario_chegada'].value;
  let obs = form.elements['obs'].value;
  let valor_desejado = form.elements['valor_desejado'].value;

  let newRequest = '<div class="pedido"> <b>Origem:</b> ' + origem + '<br><b>Destino:</b> ' + destino + '<br><b>Urgência:</b> ' + urgencia + '<br><b>Horário de chegada:</b> ' + horario_chegada + '<br><b>Obs:</b> ' + obs + '<br><b>Valor desejado: R$ </b>' + valor_desejado + '</div>';

  pendentes.innerHTML += newRequest;

  localStorage.setItem("pendentesRequests", newRequest);

  form.reset();
  modal.style.display = "none"

  return false;
}


function updatePendentesRequests() {

  let requisicoes = document.getElementById('requisicoes');

  let pendentes = localStorage.getItem('pendentesRequests');

  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = pendentes.trim();
  let requests = tempDiv.getElementsByClassName('pedido');

  let availableRequests = '';

  if (requisicoes) {
    availableRequests += '<div class="pedido">' + requests[0].innerHTML + '<br><br><div class="accept_div"><button class="accept_button"><b>Aceitar</b></button></div></div>';

    localStorage.setItem("availableRequests", availableRequests);

    requisicoes.innerHTML += availableRequests;

    localStorage.removeItem('pendentesRequests');

    updateAcceptButtons();
  }
}


function updateAcceptedRequests() {

  let aceitosFornecedor = document.getElementById('aceitos_fornecedor');
  let aceitosContratante = document.getElementById('aceitos_contratante');

  let deslocFornecedor = document.getElementById('deslocamento_fornecedor');
  let deslocContratante = document.getElementById('deslocamento_contratante');

  let acceptedRequests = localStorage.getItem('acceptedRequests');

  let request = document.createElement('div');
  request.innerHTML = acceptedRequests.trim();

  let acceptButton = request.getElementsByClassName('accept_div');
  acceptButton[0].parentNode.removeChild(acceptButton[0]);

  fornDone = localStorage.getItem("fornDone");
  contrDone = localStorage.getItem("contrDone");

  if (aceitosFornecedor && (fornDone == "false")) {

    if (request.innerHTML.includes("Altíssima")) {
      n_emergencies++;
    }

    deslocFornecedor.innerHTML += '<div class="pedido">' + request.innerHTML + '<div class="finish_div"><button class="finish_button"><b>Finalizado</b></button></div></div>';

    aceitosFornecedor.innerHTML += '<div class="pedido">' + request.innerHTML + '<div class="cancel_div"><button class="cancel_button"><b>Cancelar</b></button></div></div>';

    localStorage.setItem("fornDone", "true");

    updateCancelButtons();
    updateFinishButtons()
  }

  else if (aceitosContratante && (contrDone == "false")) {
    let pendentes = document.getElementById('pendentes');
    let pendingRequests = pendentes.getElementsByClassName('pedido');
    for (let i = 0; i < pendingRequests.length; i++) {
      if ((request.innerHTML.trim()).includes(pendingRequests[i].innerHTML.trim()) ||
        (pendingRequests[i].innerHTML.trim()).includes(request.innerHTML.trim())) {
        pendingRequests[i].remove();
        break;
      }
    }
    deslocContratante.innerHTML += '<div class="pedido">' + request.innerHTML + '</div>';

    aceitosContratante.innerHTML += '<div class="pedido">' + request.innerHTML + '<div class="cancel_div"><button class="cancel_button"><b>Cancelar</b></button></div></div>';

    localStorage.setItem("contrDone", "true");

    updateCancelButtons();
  }
}


function updateCanceledRequests() {

  let deslocFornecedor = document.getElementById('deslocamento_fornecedor');
  let aceitosFornecedor = document.getElementById('aceitos_fornecedor');
  let fornRequests;
  let fornAccepted;
  if (deslocFornecedor) {
    fornRequests = deslocFornecedor.getElementsByClassName('pedido');
    fornAccepted = aceitosFornecedor.getElementsByClassName('pedido');
  }

  let deslocContratante = document.getElementById('deslocamento_contratante');
  let aceitosContratante = document.getElementById('aceitos_contratante');
  let contrRequests;
  let contrAccepted;
  if (deslocContratante) {
    contrRequests = deslocContratante.getElementsByClassName('pedido');
    contrAccepted = aceitosContratante.getElementsByClassName('pedido');
  }

  let canceledRequest = localStorage.getItem("canceledRequest");

  let request = document.createElement('div');
  request.innerHTML = canceledRequest.trim();

  let cancelButton = request.getElementsByClassName('cancel_div');
  cancelButton[0].parentNode.removeChild(cancelButton[0]);

  fornCanceled = localStorage.getItem("fornCanceled");
  contrCanceled = localStorage.getItem("contrCanceled");

  if (deslocFornecedor && (fornCanceled == "false")) {

    for (let i = 0; i < fornAccepted.length; i++) {
      if ((request.innerHTML.trim()).includes(fornAccepted[i].innerHTML.trim()) ||
        (fornAccepted[i].innerHTML.trim()).includes(request.innerHTML.trim())) {

        fornAccepted[i].remove();
        break;
      }
    }

    for (let j = 0; j < fornRequests.length; j++) {
      if ((request.innerHTML.trim()).includes(fornRequests[j].innerHTML.trim()) ||
        (fornRequests[j].innerHTML.trim()).includes(request.innerHTML.trim())) {

        fornRequests[j].remove();
        break;
      }
    }

    localStorage.setItem("fornCanceled", "true");

    updateCancelButtons();
  }

  else if (deslocContratante && (contrCanceled == "false")) {

    for (let i = 0; i < contrAccepted.length; i++) {
      if ((request.innerHTML.trim()).includes(contrAccepted[i].innerHTML.trim()) ||
        (contrAccepted[i].innerHTML.trim()).includes(request.innerHTML.trim())) {

        contrAccepted[i].remove();
        break;
      }
    }

    for (let j = 0; j < contrRequests.length; j++) {
      if ((request.innerHTML.trim()).includes(contrRequests[j].innerHTML.trim()) ||
        (contrRequests[j].innerHTML.trim()).includes(request.innerHTML.trim())) {

        contrRequests[j].remove();
        break;
      }
    }

    localStorage.setItem("contrCanceled", "true");

    updateCancelButtons();
  }
}


function updateFinishedRequests() {

  let complFornecedor = document.getElementById('completos_fornecedor');
  let aceitosFornecedor = document.getElementById('aceitos_fornecedor');

  let complContratante = document.getElementById('completos_contratante');
  let aceitosContratante = document.getElementById('aceitos_contratante');

  let finishedRequest = localStorage.getItem('finishedRequest');

  let request = document.createElement('div');
  request.innerHTML = finishedRequest.trim();

  let finishButton = request.getElementsByClassName('finish_div');
  finishButton[0].parentNode.removeChild(finishButton[0]);

  fornFinished = localStorage.getItem("fornFinished");
  contrFinished = localStorage.getItem("contrFinished");

  if (complFornecedor && (fornFinished == "false")) {
    complFornecedor.innerHTML += '<div class="pedido">' + request.innerHTML + '</div>';

    let fornAccepted = aceitosFornecedor.getElementsByClassName('pedido');

    for (let i = 0; i < fornAccepted.length; i++) {
      if ((request.innerHTML.trim()).includes(fornAccepted[i].innerHTML.trim()) ||
        (fornAccepted[i].innerHTML.trim()).includes(request.innerHTML.trim())) {

        fornAccepted[i].remove();
        break;
      }
    }

    localStorage.setItem("fornFinished", "true");
  }
  else if (complContratante && (contrFinished == "false")) {
    let deslocContratante = document.getElementById('deslocamento_contratante');
    let deslocRequests = deslocContratante.getElementsByClassName('pedido');
    for (let i = 0; i < deslocRequests.length; i++) {
      if ((request.innerHTML.trim()).includes(deslocRequests[i].innerHTML.trim()) ||
        (deslocRequests[i].innerHTML.trim()).includes(request.innerHTML.trim())) {
        deslocRequests[i].remove();
        break;
      }
    }

    let contrAccepted = aceitosContratante.getElementsByClassName('pedido');

    for (let i = 0; i < contrAccepted.length; i++) {
      if ((request.innerHTML.trim()).includes(contrAccepted[i].innerHTML.trim()) ||
        (contrAccepted[i].innerHTML.trim()).includes(request.innerHTML.trim())) {

        contrAccepted[i].remove();
        break;
      }
    }

    complContratante.innerHTML += '<div class="pedido">' + request.innerHTML + '</div>';

    localStorage.setItem("contrFinished", "true");
  }
}


window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});


setInterval(function () {

  if (emerg_btn) {
    if (n_emergencies == 1) {
      emerg_btn.innerHTML = '<span class="row"><span id="bell">&#128276;</span><span id="bttn_txt_emerg">' + n_emergencies + '<br>Emergência</span></span>';
    }
    else {
      emerg_btn.innerHTML = '<span class="row"><span id="bell">&#128276;</span><span id="bttn_txt_emerg">' + n_emergencies + '<br>Emergências</span></span>';
    }

    if (n_emergencies == 0) {
      emerg_btn.style.backgroundColor = "rgb(224, 224, 224)";
    }
    else {
      emerg_btn.style.backgroundColor = "rgb(96, 197, 255)";
    }
  }

  if (localStorage.getItem("pendentesRequests") !== null) {
    updatePendentesRequests();
  }
  if (localStorage.getItem("acceptedRequests") !== null) {
    updateAcceptedRequests();
    let fornDone = localStorage.getItem("fornDone");
    let contrDone = localStorage.getItem("contrDone");
    if ((fornDone == "true") && (contrDone == "true")) {
      localStorage.removeItem("acceptedRequests");
      localStorage.setItem("fornDone", "false");
      localStorage.setItem("contrDone", "false");
    }
  }
  if (localStorage.getItem("canceledRequest") !== null) {
    updateCanceledRequests();
    let fornCanceled = localStorage.getItem("fornCanceled");
    let contrCanceled = localStorage.getItem("contrCanceled");
    if ((fornCanceled == "true") && (contrCanceled == "true")) {
      localStorage.removeItem("canceledRequest");
      localStorage.setItem("fornCanceled", "false");
      localStorage.setItem("contrCanceled", "false");
    }
  }
  if (localStorage.getItem("finishedRequest") !== null) {
    updateFinishedRequests();
    let fornFinished = localStorage.getItem("fornFinished");
    let contrFinished = localStorage.getItem("contrFinished");
    if ((fornFinished == "true") && (contrFinished == "true")) {
      localStorage.removeItem("finishedRequest");
      localStorage.setItem("fornFinished", "false");
      localStorage.setItem("contrFinished", "false");
    }
  }
}, 100);