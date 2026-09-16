// O WebFontLoader (ajax.googleapis.com/.../webfont.js) foi removido (Google PageSpeed, Pedro
// 2026-09-04: "Font display" - a API classica da Google que ele usava nao garantia font-display:swap).
// As Google Fonts passaram a carregar via <link> direto com "&display=swap" (ver
// google_fonts_link() em inc/text_helpers.php, chamado em cada pagina) - mais rapido (poupa o
// pedido extra do proprio webfont.js) e com swap garantido pela propria API v2.
//
// document.fonts.ready (Font Loading API, suportada em todos os browsers modernos) substitui o
// callback "active" do WebFontLoader: resolve quando TODAS as fontes referenciadas na pagina (as
// Google Fonts do <link> acima, e as self-hosted como fontello/Brusher/Storytella) terminam de
// carregar. Sem isto, uma grelha Isotope (ex: Oportunidades - cartões sem imagem, so' texto) podia
// medir a altura de cada item ANTES da webfont carregar, com a fonte de reserva do browser (mais
// estreita/compacta) - quando a Raleway troca a meio, o texto cresce, mas o Isotope nunca volta a
// reposicionar sozinho, e a 2a linha fica desalinhada por cima da 1a (Pedro, 2026-08-26). O relayout
// ja' existente em vanilla-lazyload (mais abaixo) so' cobre grelhas COM imagens.
// Registado so' depois do "load" (nao logo ao ler o ficheiro) - descoberto ao testar a serio em
// mobile (Playwright, Pedro 2026-09-04): registar o .then() logo no arranque criava uma condicao de
// corrida com a inicializacao do slick carousel (main.min.js/initADA), rebentando com "Cannot read
// properties of null (reading 'add')" nas paginas com slider (Home, Catering) - bug latente do
// bundle vendor, so' exposto por esta mudanca de timing. A esta altura ("load") o slick ja' acabou
// de inicializar, o que evita a corrida.
if (window.document && document.fonts && document.fonts.ready) {
	window.addEventListener('load', function () {
		document.fonts.ready.then(function () {
			if (window.jQuery) {
				jQuery('.js-isotope-2').each(function () {
					var $g = jQuery(this);
					if ($g.data('isotope')) $g.isotope('layout');
				});
			}
		});
	});
}

var _html = document.documentElement,
isTouch = (('ontouchstart' in _html) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
_html.className = _html.className.replace("no-js","js");
_html.classList.add( isTouch ? "touch" : "no-touch");

(function(w, d){
	var m = d.getElementsByTagName('main')[0],
	s = d.createElement("script"),
	v = !("IntersectionObserver" in w) ? "8.17.0" : "10.19.0",
	o = {
		elements_selector: ".lazy",
		data_src: 'src',
		data_srcset: 'srcset',
		threshold: 500,
		callback_enter: function (element) {
		},
		callback_load: function (element) {
			element.removeAttribute('data-src')
			oTimeout = setTimeout(function (){
				clearTimeout(oTimeout);
				AOS.refresh();
				// Grelhas Isotope (Produtos, Portfolio): cada imagem lazy que acaba de carregar muda de
				// tamanho (de blank.gif para a imagem real), mas nada avisava o Isotope disso - o layout
				// (e por tabela, a filtragem por categoria) so "apanhava" a posicao certa por coincidencia,
				// quando outra coisa qualquer forcava um reflow. Sem isto, clicar num filtro podia demorar
				// varios segundos (ou nunca) a refletir-se visualmente, mesmo a funcionar por baixo.
				if (window.jQuery) {
					var $j = window.jQuery;
					$j('.js-isotope-2').each(function () {
						var $g = $j(this);
						if ($g.data('isotope')) $g.isotope('layout');
					});
				}
			}, 1000);
		},
		callback_set: function (element) {
		},
		callback_error: function(element) {
		}
	};
	s.type = 'text/javascript';
	s.async = true;
	s.src = "https://cdn.jsdelivr.net/npm/vanilla-lazyload@" + v + "/dist/lazyload.min.js";
	m.appendChild(s);
	w.lazyLoadOptions = o;
}(window, document));

	// O tema (main.min.js / AGRO.slick()) inicializa os mesmos carrosseis por conta propria, DEPOIS
	// destas inicializacoes. Nessa altura ja' nao encontra os slides originais - encontra o DOM que o
	// slick gerou (setas + .slick-list) - e o initADA rebenta com "Cannot read properties of null
	// (reading 'add')", matando a inicializacao do tema a meio. Confirmado ao vivo em /catering/
	// (Pedro, 2026-09-10): a 1a chamada, a nossa, recebe os 39 slides reais e corre bem; a 2a, do tema,
	// recebe 3 filhos e falha. O carrossel funcionava na mesma (vale a nossa), mas ficava um erro na
	// consola em todas as paginas com galeria. Ignorar um init repetido sobre um elemento ja'
	// inicializado resolve sem tocar no main.min.js (vendor, minificado, sem fontes). Chamadas por
	// metodo ('unslick', 'slickNext', ...) passam sempre - so' o init duplicado e' que e' descartado,
	// e um carrossel que se auto-destruiu ('settings: unslick' no js-slick-2) perde a classe, por isso
	// continua a poder ser reinicializado no resize.
	if (window.jQuery && jQuery.fn.slick && !jQuery.fn.slick.__semDuplicados) {
		var _slickOriginal = jQuery.fn.slick;
		jQuery.fn.slick = function () {
			var ehInit = arguments.length === 0 || (typeof arguments[0] === 'object' && arguments[0] !== null);
			if (ehInit && this.hasClass('slick-initialized')) return this;
			return _slickOriginal.apply(this, arguments);
		};
		jQuery.fn.slick.__semDuplicados = true;
	}

    if($('.js-slick').length > 0){
		if ($('.js-slick').hasClass('slick-initialized')) {
			$('.js-slick').slick('unslick');
		}
		$('.js-slick').slick({
			autoplay: true,
			arrows: true,
			dots: false,
			speed: 1000,
			slidesToShow: 3,
			prevArrow: '<i class="slick-prev fontello-left"></i>',
			nextArrow: '<i class="slick-next fontello-right"></i>',
			responsive: [
				{
				  breakpoint: 992,
				  settings: {
					slidesToShow: 2
				  }
				}
			]
		});
	}
	
	if($('.js-slick-2').length > 0){
		var slick2 = {
			autoplay: true,
			arrows: true,
			dots: false,
			speed: 1000,
			slidesToShow: 1,
			prevArrow: '<i class="slick-prev fontello-left"></i>',
			nextArrow: '<i class="slick-next fontello-right"></i>',
			mobileFirst: true,
			responsive: [
				{
				   breakpoint: 767,
				   settings: 'unslick'
				}
			]
		};
		$('.js-slick-2').slick(slick2);
	}
	
	$(window).resize(function(){
		if($('.js-slick-2').length > 0){
			var width = $(window).width();
			if(width < 767) {
				$('.js-slick-2').slick(slick2);
			}
		}
	});
	
	if($('.js-slick-3').length > 0){
		var slick3 = {
			autoplay: false,
			arrows: true,
			dots: false,
			speed: 1000,
			slidesToShow: 2,
			prevArrow: '<i class="slick-prev fontello-left"></i>',
			nextArrow: '<i class="slick-next fontello-right"></i>',
			mobileFirst: true,
			responsive: [
				{
				   breakpoint: 767,
				   settings: {
					 slidesToShow: 4
				   }
				}
			]
		};
		$('.js-slick-3').slick(slick3);
	}
	
	if($('.js-isotope-2').length > 0){
		var $isomodule = $('.js-isotope-2');
		$isomodule.isotope({
			itemSelector: '.js-isotope__item',
			layoutMode: 'fitRows',
			transitionDuration: '0.4s',
			percentPosition: true,
			// Por omissao o Isotope anima opacity+transform:scale ao esconder/mostrar um item - mais o
			// "instant cut" (display:none) do gallerySet() abaixo, mais o data-aos="fade" que alguns
			// destes itens tambem tinham (Oportunidades - removido, ver blocos.php), dava 2-3 efeitos
			// diferentes a acontecer ao mesmo tempo/desencontrados num simples clique num filtro
			// (Pedro, 2026-08-27: "tantos efeitos e efeitos repetidos... devia ter um unico efeito e
			// mais nada"). hiddenStyle/visibleStyle so' com opacity = um unico efeito limpo (fade),
			// sem o scale.
			hiddenStyle: { opacity: 0 },
			visibleStyle: { opacity: 1 },
			masonry: {
				columnWidth: '.js-isotope__sizer'
			}
		});
		// Terceira rede de seguranca (Pedro, 2026-08-27 - linhas de Oportunidades sobrepostas em
		// producao, nunca reproduzido em local): as duas ja existentes (imagesLoaded acima, webfont
		// "active" no topo do ficheiro) so' disparam se a imagem/fonte ainda estiver a carregar
		// QUANDO o listener e' registado - numa rede rapida ambas podem resolver antes do proprio
		// Isotope sequer inicializar, sem nada a disparar o relayout depois disso. O evento "load" da
		// window (dispara sempre por definicao, depois de TUDO - imagens, fontes, iframes) e' o unico
		// sinal garantido; o setTimeout extra da' margem a reflows tardios (troca de webfont a meio,
		// AOS.refresh()) que possam acontecer mesmo depois desse "load".
		$(window).on('load', function () {
			setTimeout(function () {
				if ($isomodule.data('isotope')) $isomodule.isotope('layout');
			}, 300);
		});
	}
	
	function gallerySet($this){
		var idx = $this.index();
		$('#produtos-filtro li').each(function(i){
			if(i != idx){
            	$('a', this).removeClass('selected');
			}else{
				$('a', this).addClass('selected');
			}
        });

		var selector = $('a', $this).attr('data-cat');
    	$isomodule.isotope({
			filter: selector
		});
		// O Isotope calcula corretamente quais os itens que ficam (confirmado via
		// $isomodule.data('isotope').filteredItems), mas a animacao que os esconde depende de um
		// evento transitionend que, neste tema, nunca chega a disparar (algures ha um reset de CSS
		// que forca transition-duration:0 nestes elementos) - o Isotope fica preso a meio da
		// transicao e o display:none nunca chega a ser aplicado. Em vez de depender dessa transicao,
		// aplicamos o display manualmente a partir da lista que o proprio Isotope ja calculou.
		//
		// display:none tinha de ficar so' para os itens que SAEM, e so' DEPOIS do fade (opacity,
		// ver hiddenStyle acima) ter tempo de se ver - aplicar isto no mesmo instante (como estava
		// antes) cortava a transicao mesmo antes de comecar a desenhar-se, o oposto do "unico efeito
		// limpo" pedido (Pedro, 2026-08-27). Os itens que ENTRAM ficam display:'' logo - o proprio
		// Isotope trata do fade-in a partir daqui.
		var inst = $isomodule.data('isotope');
		if (inst && inst.filteredItems) {
			var elementosVisiveis = inst.filteredItems.map(function (it) { return it.element; });
			var elementosASair = [];
			$isomodule.find('.js-isotope__item').each(function () {
				if (elementosVisiveis.indexOf(this) !== -1) {
					this.style.display = '';
				} else {
					elementosASair.push(this);
				}
			});
			setTimeout(function () {
				elementosASair.forEach(function (el) { el.style.display = 'none'; });
			}, 420);
		}
		$isomodule.isotope('layout');
	}

	$('#produtos-filtro li').on('click', function(e){
		e.preventDefault();
		gallerySet($(this));
	});
	
	$('.anchor').on('click', function(e){
		e.preventDefault();
		var target = $(this).attr('href');
		$('html, body').animate({scrollTop: $(target).offset().top}, 'slow');
		return false;
	});
	
	$('.toggle-address a').on('click', function(e){
		e.preventDefault();
		var aPos = $(this).parent().index();
		var aTitle = $(this).html();
		var aDescription = $(this).attr('description');

		$('.toggle-address ul li').each(function(i){
            (i != aPos) ? $(this).removeClass('active') : $(this).addClass('active');
        });

		$('#footer address span').html(aTitle);
		$('#footer address p').html(aDescription);
		return false;
	});
	$('.toggle-address a').eq(0).trigger('click');
	
	
	var validEmail = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
	var validPhone = new RegExp(/^\+?[0-9]{1,12}$/);

	function fgValidation($form){
		var error = true;
		var ireturn = '';
		$form.find('input, select, textarea').each(function(){		
			if($(this).hasClass('imail')){
				if(validEmail.test($(this).val()) != true && ireturn == ''){
					ireturn = $(this).attr('id');
					error = false;
				}
			}
			
			if($(this).hasClass('iphone')){
				if(validPhone.test($.trim($(this).val())) != true && ireturn == ''){
					ireturn = $(this).attr('id');
					error = false;
				}
			}
			
			if($(this).val() == '' && ireturn == ''){		
				if($(this).hasClass('irequire')){
					ireturn = $(this).attr('id');
					error = false;
				}
			}
		});

		(ireturn != '') ? $('#'+ireturn).focus() : '';
		return error;
	}

	// Ficheiros com limite de tamanho (CV da candidatura, anexo da denuncia - "data-max-mb" no
	// input, ver render_candidatura_form/render_bloco_formulario_denuncia em blocos.php) - avisa e
	// limpa a seleccao logo ao escolher o ficheiro, em vez de so' descobrir o limite depois de
	// esperar o upload todo e o servidor recusar (Gemini review, Pedro 2026-08-26).
	// "Placeholder" dos <select class="textfield"> (Escolher loja/Selecione o motivo) - a cor
	// clara (#ccc, ver default.css) so' deve aparecer enquanto a opcao vazia ("") continua
	// escolhida; ".has-value" repoe a cor normal (#666) assim que o utilizador escolhe uma opcao
	// real (Pedro, 2026-08-27). Corre no load (valor pode vir pre-preenchido, ex: "voltar atras" do
	// browser) e outra vez a cada "change".
	function atualizarSelectPlaceholder($select) {
		$select.toggleClass('has-value', $select.val() !== '');
	}
	$('select.textfield').each(function () { atualizarSelectPlaceholder($(this)); });
	$(document).on('change', 'select.textfield', function () { atualizarSelectPlaceholder($(this)); });

	$(document).on('change', '.js-file-size-check', function () {
		var $input = $(this);
		var file = this.files && this.files[0];
		if (!file) return;
		var maxMb = parseFloat($input.data('max-mb'));
		if (!maxMb || file.size <= maxMb * 1024 * 1024) return;

		var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
		var msg = isEn
			? 'That file is too large (max. ' + maxMb + 'MB). Please choose a smaller file.'
			: 'Esse ficheiro é demasiado grande (máx. ' + maxMb + 'MB). Escolhe um ficheiro mais pequeno.';
		$input.val('');
		$input.closest('form').find('.form-result').html('<i class="fa fa-exclamation-circle"></i> ' + msg).removeClass('hidden');
	});

	$('form').on('submit', function(e) {
		e.preventDefault();
		var $this = $(this);
		var error = fgValidation($this);
		var action = $this.attr('action');

		$('.form-result').addClass('hidden');
		if (!$('#ctermos', $this).is(':checked')) {
			$('#ctermos', $this).parent().addClass('shakeX animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$(this).attr('class', 'apo-checkbox');
			});
			// Mesmo sítio onde aparece "Mensagem enviada com sucesso!" - antes disto só havia o
			// abanão da checkbox, sem nenhum texto a explicar o que faltava.
			var isEnPriv = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
			var msgPriv = isEnPriv
				? 'To get in touch you must accept our Privacy Policy. If you do not agree, please contact us in person at one of our stores'
				: 'Para entrar em contacto deve aceitar a nossa Política de Privacidade. Caso não concorde, por favor, contacte-nos pessoalmente numa das nossas lojas';
			$this.parent().find('.form-result').html('<i class="fa fa-exclamation-circle"></i> ' + msgPriv).removeClass('hidden');
			return false;
		}

		if(error) {
			$this.find('.fpreloader').removeClass('hidden');
			// $.serialize() NUNCA inclui campos type="file" (limitacao do proprio metodo, nao um bug
			// de configuracao) - o CV/anexo era sempre omitido do pedido, chegando ao servidor como
			// UPLOAD_ERR_NO_FILE mesmo com um ficheiro genuino selecionado. Ficheiros exigem FormData
			// (le o <form> real, incl. inputs de ficheiro) + processData:false/contentType:false
			// (deixa o browser definir o boundary multipart/form-data sozinho) - Pedro, 2026-08-27,
			// diagnosticado com "[diag: err=4 ...]" no proprio erro devolvido por candidatura.php.
			var temFicheiro = $this.find('input[type="file"]').length > 0;
			var ajaxData = temFicheiro ? new FormData($this[0]) : $this.serialize();
			$.ajax({
				type: 'POST',
				url: action,
				data: ajaxData,
				processData: !temFicheiro,
				contentType: temFicheiro ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
				timeout: 15000,
				success: function (data){
					var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
					var fallbackMsg = isEn ? 'There was a problem sending your message. Please try again later.' : 'Ocorreu um problema ao enviar a sua mensagem. Tente novamente mais tarde.';
					var xdata = (typeof data === 'string') ? data.split('$') : [];
					$this.find('.fpreloader').addClass('hidden');

					if (xdata.length >= 2) {
						$this.parent().find('.form-result').html(xdata[1]).removeClass('hidden');
						if (xdata[0] > 0) {
							$this[0].reset();
							// Evento proprio, so' na submissao CONFIRMADA (nunca ao 1o campo preenchido, que e'
							// o que o "form_start" automatico do GA4/Enhanced Measurement ja fazia sozinho, mesmo
							// quando a submissao falhava ou nem chegava a acontecer - Pedro, 2026-09-07: "ve se o
							// formulario de encomenda/produtos esta a entrar no analytics"). "data-form-tipo" da'
							// o rotulo (encomenda/catering/contacto/candidatura) e e' definido em blocos.php, o
							// unico sitio que ja sabe o tipo real de cada formulario. Vai sempre so' o rotulo:
							// nenhum campo preenchido pelo utilizador entra no evento. O Canal de Denuncias e' o
							// unico sem rotulo de proposito, por isso nao dispara nada aqui - ver blocos.php.
							var formTipo = $this.data('formTipo');
							if (formTipo && window.dataLayer) {
								window.dataLayer.push({ event: 'form_submit_success', form_type: formTipo });
							}
						}
					} else {
						$this.parent().find('.form-result').html('<i class="fa fa-exclamation-circle"></i> ' + fallbackMsg).removeClass('hidden');
					}
				},
				error: function () {
					var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
					var msg = isEn ? 'There was a problem sending your message. Please try again later.' : 'Ocorreu um problema ao enviar a sua mensagem. Tente novamente mais tarde.';
					$this.find('.fpreloader').addClass('hidden');
					$this.parent().find('.form-result').html('<i class="fa fa-exclamation-circle"></i> ' + msg).removeClass('hidden');
				}
			});
		} else {
			// Campo obrigatório vazio ou em formato inválido (nome/email/telefone) - antes disto só
			// focava e "abanava" o campo, sem nenhuma mensagem a explicar o que falhou.
			var isEnReq = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
			var msgReq = isEnReq ? 'The marked fields are mandatory' : 'Os campos assinalados são de preenchimento obrigatório';
			$this.parent().find('.form-result').html('<i class="fa fa-exclamation-circle"></i> ' + msgReq).removeClass('hidden');
		}

	});

