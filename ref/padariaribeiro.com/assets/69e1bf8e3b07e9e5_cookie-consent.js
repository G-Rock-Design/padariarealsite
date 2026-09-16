/* Gestao de consentimento de cookies (RGPD) - JS nativo, sem dependencias, self-hosted.
   O Consent Mode v2 (default negado) e o proprio Google Tag Manager sao carregados em gtm_head.php,
   o mais cedo possivel no <head> - antes deste script, antes de qualquer outra coisa. Este ficheiro
   so trata do banner em si:
   1. Mostra o banner na primeira visita (sem preferencia guardada).
   2. Ao aceitar/recusar, envia gtag('consent','update', ...) - o GA4 dentro do GTM reage sozinho,
      sem ser preciso recarregar a pagina nem injetar nenhum script novo aqui.
   3. Guarda a preferencia em localStorage e respeita-a em visitas seguintes, sem voltar a mostrar o banner.
   4. Expoe uma forma de rever a decisao mais tarde (qualquer elemento com a classe
      js-cookie-consent-manage reabre o banner ao ser clicado). */
(function () {
	'use strict';

	window.dataLayer = window.dataLayer || [];
	function gtag() { window.dataLayer.push(arguments); }
	window.gtag = window.gtag || gtag;

	var STORAGE_KEY = 'padaria_cookie_consent'; // valores possiveis: "accepted" | "rejected"

	function getStored() {
		try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
	}
	function setStored(value) {
		try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* localStorage indisponivel - o banner simplesmente volta a aparecer na proxima visita */ }
	}

	function aplicarConsentimento(aceite) {
		gtag('consent', 'update', {
			ad_storage: aceite ? 'granted' : 'denied',
			analytics_storage: aceite ? 'granted' : 'denied',
			ad_user_data: aceite ? 'granted' : 'denied',
			ad_personalization: aceite ? 'granted' : 'denied'
		});
		window.dataLayer.push({ event: 'consent_updated' });
	}

	function mostrarBanner() {
		var el = document.getElementById('cookie-consent');
		if (el) el.style.display = 'block';
	}
	function esconderBanner() {
		var el = document.getElementById('cookie-consent');
		if (el) el.style.display = 'none';
	}

	function iniciar() {
		var estadoGuardado = getStored();
		if (estadoGuardado === 'accepted') {
			aplicarConsentimento(true);
		} else if (estadoGuardado === 'rejected') {
			aplicarConsentimento(false);
		} else {
			mostrarBanner();
		}

		var btnAceitar = document.getElementById('cookie-consent-accept');
		var btnRecusar = document.getElementById('cookie-consent-reject');
		if (btnAceitar) {
			btnAceitar.addEventListener('click', function () {
				setStored('accepted');
				aplicarConsentimento(true);
				esconderBanner();
			});
		}
		if (btnRecusar) {
			btnRecusar.addEventListener('click', function () {
				setStored('rejected');
				aplicarConsentimento(false);
				esconderBanner();
			});
		}
		var botoesGerir = document.querySelectorAll('.js-cookie-consent-manage');
		for (var i = 0; i < botoesGerir.length; i++) {
			botoesGerir[i].addEventListener('click', function (e) {
				e.preventDefault();
				mostrarBanner();
			});
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', iniciar);
	} else {
		iniciar();
	}
})();
