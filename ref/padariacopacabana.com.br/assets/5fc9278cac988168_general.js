$.noConflict();

jQuery(window).bind("load", function() { 
   if (document.getElementById('billing_unidade')) {
		jQuery('#billing_unidade').select2();
	}
});

jQuery(document).ready(function() {
	
	
	
	//Muda Values Produto
	jQuery('.listaProdutos li').each(function() {
		var atual = jQuery(this);
		var result = parseInt(jQuery(this).find('#stepProduto').val());	
		var minProduto = parseInt(jQuery(this).find('#minProduto').val());	
		var inputQnt = jQuery(this).find('input[type="number"]');
		if (result) {
			inputQnt.val(result);
			inputQnt.prop('min', minProduto);
			inputQnt.prop('step', result);
		} else {
			jQuery(this).find('input[type="number"]').prop('step', '999');
		}
		
		
		jQuery(inputQnt).change(function(){
			atual.find('button[type="submit"]').attr('data-quantity', jQuery(this).val());
		})
		
		
		jQuery(this).find('input[type="number"]').focusout(function(event) {
			valor = jQuery(this).val();
			if (valor < minProduto) { //Volta pro valor mínimo caso tentem digitar um valor
				jQuery(this).val(minProduto); 
				atual.find('button[type="submit"]').attr('data-quantity', minProduto);
			}
		})
		
		jQuery(this).find('input[type="number"]').change(function(event) { //Não deixa o cliente digitar um valor não múltiplo do step
			if(result > 1){
				valor = jQuery(this).val();
				resultado = valor / result;
				resto = valor % result;
				if (resto!=0){
					valorAtual = result * (parseInt(resultado) + 1);
					jQuery(this).val(valorAtual);
					atual.find('button[type="submit"]').attr('data-quantity', valorAtual);
				}
			}	
		})
		
	});

	//^^^^^^^^^^^^^^^^^^^FIM LISTAGEM DE PRODUTOS^^^^^^^^^^^^^^^^^^^//



	//vvvvvvvvvvvvvvvvvvvvvvvvvvCARRINHOvvvvvvvvvvvvvvvvvvvvvvvvvvvv//

	jQuery('table.shop_table .quantity').each(function() { //Não deixa o cliente digitar um valor não múltiplo do step NO CARRINHO
		var result = parseInt(jQuery(this).find('input[type="number"]').prop('step'));	
		var minProduto = parseInt(jQuery(this).find('input[type="number"]').prop('min'));	
		
		jQuery(this).find('input[type="number"]').change(function(event) { 
			if(result > 1){
				valor = jQuery(this).val();
				resultado = valor / result;
				resto = valor % result;
				if (resto != 0){

					
					valorAtual = result * (parseInt(resultado) + 1);
					jQuery(this).val(valorAtual);
				
				
				}	
					console.log(result);
					console.log(minProduto);
					console.log(valor);
					//console.log(valorAtual);
			
			}
		})

	});

	//^^^^^^^^^^^^^^^^^^^^^^^^FIM DO CARRINHO^^^^^^^^^^^^^^^^^^^^^^^//
	
	var url_string = window.location.href;
	var url = new URL(url_string);
	var categoria = url.searchParams.get('categoria');
	
	if (categoria) {
		jQuery('.encomenda.interna .categorias button.limpar').attr('disabled', false).css('opacity', '1');
		
		jQuery('.encomenda.interna .listaProdutos .produto').fadeOut();
		jQuery('.encomenda.interna .listaProdutos .'+ categoria).fadeIn();
		
		jQuery('.encomenda.interna .categorias button').each(function() {
			if (jQuery(this).hasClass(categoria)) {
				jQuery(this).addClass('ativo');
			}
		})
	}
		
	// Categorias
	
	jQuery('.encomenda.interna .categorias button').click(function (event){
		mostrar = jQuery(this).attr('data-opencategoria');
		jQuery('.encomenda.interna .categorias button').removeClass('ativo');
		jQuery(this).addClass('ativo');
		jQuery('.encomenda.interna .listaProdutos .produto').fadeOut();
		jQuery('.encomenda.interna .listaProdutos .'+ mostrar).fadeIn();
		jQuery('.encomenda.interna .categorias button.limpar').attr('disabled', false).css('opacity', '1');
		
		if (categoria) {
			categoria = null;
			url = window.location.href;
			url = url.slice( 0, url.indexOf('?') );
			window.history.pushState('', '', url);
		}
	})
	jQuery('.encomenda.interna .categorias button.limpar').click(function (event){
		jQuery(this).attr('disabled', true).css('opacity', '0.3');
		
		if (categoria) {
			categoria = null;
			url = window.location.href;
			url = url.slice( 0, url.indexOf('?') );
			window.history.pushState('', '', url);
		}
	})
	
	new WOW().init();
	
	jQuery('#botao').tooltip({ boundary: 'window' })
	
	
	jQuery('#owlSobre').owlCarousel({
		navigation : true,
		slideSpeed : 300,
		paginationSpeed : 400,
		margin:30,
		nav:true,
		loop:true,
		dots:false,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:1
			},
			1000:{
				items:2
			}
		}
	});	
	
	
	jQuery('#owlEncomenda').owlCarousel({
		navigation : true,
		slideSpeed : 300,
		paginationSpeed : 400,
		margin:30,
		nav:true,
		loop:true,
		dots:false,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:1,
			},
			992:{
				items:2,
			},
			1000:{
				items:3,
			}
		}
	});	
	
	
	jQuery('.botaoMap').on('click', function (e) {
		e.preventDefault();	  
		var idMap = this.getAttribute('data-mapOpen');
		jQuery('#mapaId'+idMap).toggle('slow');
	});
	
	jQuery(".telefone")
        .mask("(99) 9999-9999?9")
        .focusout(function (event) {  
            var target, phone, element;  
            target = (event.currentTarget) ? event.currentTarget : event.srcElement;  
            phone = target.value.replace(/\D/g, '');
            element = jQuery(target);  
            element.unmask();  
            if(phone.length > 10) {  
                element.mask("(99) 99999-999?9");  
            } else {  
                element.mask("(99) 9999-9999?9");  
            }  
     });
	 
	 
	jQuery('input.qty').spinner();
	 
	jQuery('.ui-spinner-button').click(function() {
	   jQuery(this).siblings('input').change();
	});
	
	
	/*jQuery('.shipping_method').each(function(){
			jQuery(this).prop('checked', false);
		
	})*/
	
	
});



/* Data de agendamento Checkout */
jQuery(function($){
	$.datepicker.regional['pt-BR'] = {
			closeText: 'Fechar',
			prevText: '&#x3c;Anterior',
			nextText: 'Pr&oacute;ximo&#x3e;',
			currentText: 'Hoje',
			monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
			'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
			'Jul','Ago','Set','Out','Nov','Dez'],
			dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
			dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
			weekHeader: 'Sm',
			dateFormat: 'dd/mm/yy',
			firstDay: 0,
			isRTL: false,
			showMonthAfterYear: false,
			yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['pt-BR']);
});

// Seta campos
jQuery("#dataRetirada").mask('99/99/9999');
jQuery("#dataRetirada").datepicker();;
var botaoCheckout = jQuery('.wc-proceed-to-checkout a.checkout-button');



jQuery('#shipping_method input[type="radio"]').each(function() {
  if(jQuery(this).is(':checked')) {		
	if (jQuery(this).val() != 'flat_rate:4') {
		jQuery('.retirada').show();
		botaoCheckout.click(function(event) {			
			event.preventDefault();

			dataRetirada = jQuery('#dataRetirada').val();
			horarioRetirada = jQuery('#horarioRetirada').val();
			
			if (dataRetirada != '' && horarioRetirada != '') {
				localStorage.setItem('dataRetirada', dataRetirada);
				localStorage.setItem('horarioRetirada', horarioRetirada);
				window.location.href = 'https://padariacopacabana.com.br/finalizar-encomenda/';
			}	
		}) 
	} else {
		localStorage.setItem('dataRetirada', '');
		localStorage.setItem('horarioRetirada', '');
	}
  }
});


jQuery( document.body ).on( 'update_total_price', function(){
	console.log('teste');
})

jQuery( document.body ).on( 'updated_shipping_method', function(){
	
	jQuery('#shipping_method input[type="radio"]').each(function() {
	  if(jQuery(this).is(':checked')) {			
		if (jQuery(this).val() != 'flat_rate:4') {
			jQuery('.retirada').show();
			location.reload();
			botaoCheckout.click(function(event) {			
				event.preventDefault();
				
				dataRetirada = jQuery('#dataRetirada').val();
				horarioRetirada = jQuery('#horarioRetirada').val();
				
				if (dataRetirada != '' && horarioRetirada != '') {
					localStorage.setItem('dataRetirada', dataRetirada);
					localStorage.setItem('horarioRetirada', horarioRetirada);
					window.location.href = 'https://padariacopacabana.com.br/finalizar-encomenda/';
				}					
			}) 
		} else {
			localStorage.setItem('dataRetirada', '');
			localStorage.setItem('horarioRetirada', '');
		}
	  }
	});
})


botaoCheckout.click(function(event) {			
	event.preventDefault();
	jQuery('#shipping_method input[type="radio"]').each(function() {
	  if(jQuery(this).is(':checked')) {			
		if (jQuery(this).val() == 'flat_rate:4') {
			window.location.href = 'https://padariacopacabana.com.br/finalizar-encomenda/';
			localStorage.setItem('dataRetirada', '');
			localStorage.setItem('horarioRetirada', '');
		} else {
			dataRetirada = jQuery('#dataRetirada').val();
			horarioRetirada = jQuery('#horarioRetirada').val();
			
			if (dataRetirada != '' && horarioRetirada != '') {
				localStorage.setItem('dataRetirada', dataRetirada);
				localStorage.setItem('horarioRetirada', horarioRetirada);
				window.location.href = 'https://padariacopacabana.com.br/finalizar-encomenda/';
			} else {
				alert('Preencha os campos de Data e Horário da retirada.');
			}
		}
	  }
	})
})

if (localStorage.getItem('dataRetirada') != '' && localStorage.getItem('horarioRetirada') != '') {
	var texto = 'Data de Retirada: '+ localStorage.getItem('dataRetirada') + '\nHorário da Retirada: '+ localStorage.getItem('horarioRetirada');
	jQuery('body.woocommerce-checkout #order_comments').val(texto);
}

jQuery('.conversaoWhatsApp').click(function(event) {
	dataLayer.push({'event': 'conversaoWhatsApp'});
})

jQuery('.conversaoTelefone').click(function(event) {
	dataLayer.push({'event': 'conversaoTelefone'});
})

document.addEventListener( 'wpcf7mailsent', function(event){
	if ('67' == event.detail.contactFormId){
			dataLayer.push({'event': 'conversaoForm'});
			fbq('track', 'Contact');
		}	
	}, false);



window.addEventListener("load", function(event) {
	jQuery('#slider').owlCarousel({
		navigation : true,
		autoplay: true,
		items : 1, 
		singleItem:true,
		dots: false,
		loop:true, 
		autoHeight:true
	});	
});
