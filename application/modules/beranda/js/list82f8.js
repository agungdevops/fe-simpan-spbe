$(document).ready(function(){
// $('#slider').nivoSlider({
//        effect: 'random',
//        slices: 15,
//        boxCols: 8,
//        boxRows: 4,
//        animSpeed: 500,
//        pauseTime: 3000,
//        startSlide: 0,
//        directionNav: false,
//        controlNav: false,
//        controlNavThumbs: false,
//        pauseOnHover: true,
//        manualAdvance: false,
//        prevText: 'Prev',
//        nextText: 'Next',
//        randomStart: false,
//        beforeChange: function() {},
//        afterChange: function() {},
//        slideshowEnd: function() {},
//        lastSlide: function() {},
//        afterLoad: function() {}
// });

    $("#parent").off("select_node.jstree"); 

    get_tree_navigasi();
    get_tags_terpopuler();
    get_artikel_terpopuler();


})


function get_tree_navigasi() {
	$.ajax({
		url: url_module + "beranda/get_tree_navigasi",
		method: "POST",
		dataType: "json",
		success: function (data) {
			$("#parent").jstree({
				core: {
					data: data.kategori,
					themes: {
						icons: false,
					},
					multiple: false,
				},
			});


      // select node pertama
        if (data.id_user != -1) {
          get_hak_akses_tree_navigasi();
        }
        else
        {
          $("#parent").on(
            "loaded.jstree",
            function(data2)
            {

              $("#parent").jstree(true).deselect_all();
              $("#parent").jstree(true).select_node(data.kategori[0].id);
            }
          );
            
        }
      // select node pertama

      // event handler : changed.jstree
      $("#parent").on(
        "select_node.jstree", 
        function (e, data) 
        {
          $("#hid-id-kategori-artikel").val(data.selected);
          process_display_artikel(
            (id_kategori = data.selected),
            (page_no = 1),
            (items_per_page = 5)
          );

          get_navigasi_terkait((id_kategori = data.selected));
        }
      );
		},
	});
}

function get_tags_terpopuler() {
	$.ajax({
		url: url_module + "beranda/get_tags_terpopuler",
		method: "POST",
		dataType: "json",
		success: function (data) {
			$("#tags-terpopuler").html(data);
		},
	});
}

function get_artikel_terpopuler() {
	$.ajax({
		url: url_module + "beranda/get_artikel_terpopuler",
		method: "POST",
		dataType: "json",
		success: function (data) {
			// console.log(data)
			$("#artikel-terpopuler").html(data);

		},
	});
}

function get_hak_akses_tree_navigasi() {
	$.ajax({
		url: url_module + "beranda/get_hak_akses_tree_navigasi",
		method: "POST",
		dataType: "json",
		async: false,
		success: function (data) {
			// console.log(data.first_kategori);

			$("#parent").on("loaded.jstree", function (e, datas) {
				$("#parent").jstree().disable_node(data["kategori"]);
				data["kategori"].forEach((element) => {
					$("#" + element + "_anchor").attr("style", "color:red");
				});

				$("#parent").jstree("select_node", data.first_kategori);
			});
		},
	});
}

function process_display_artikel(id_kategori, page_no, items_per_page)
{	
	var id_kategori = id_kategori;
	var page_no = page_no;
	var items_per_page = items_per_page;

	$.ajax({
		type: "POST",
		url: url_module + "beranda/process_display_artikel",
		data: {
			id_kategori: id_kategori,
			page_no: page_no,
			items_per_page: items_per_page,
		},

		async: true,
		dataType: "json",
		beforeSend: function () {
			// document.getElementById("img-loading-listartikel").style.display = "inline";
			$("#data-artikel").attr('hidden', true);
		},
		success: function (res) {
			$("#data-artikel").html(res);
		},
		complete: function () {
			// document.getElementById("img-loading-listartikel").style.display = "none";
			$("#data-artikel").attr('hidden', false);

		},
		
	});
}

function next_page(page) {
	process_display_artikel(
		(id_kategori = [0, 1, 2]),
		(page_no = page),
		(items_per_page = 5)
	);

	property = document.getElementById(page);
	property.classList.add("color_list");

	var all_pages = document.getElementsByClassName("pages");
	for (x = 0; x < all_pages.length; ++x) {
		if (
			all_pages[x].classList.contains("color_list") &&
			all_pages[x] != property
		) {
			all_pages[x].classList.remove("color_list");
		}
	}
}

function get_navigasi_terkait(id_kategori) {
	$("#navigasi-terkait").html("");
	$.ajax({
		url: url_module + "beranda/get_navigasi_terkait",
		data: {
			params: "list",
			id_kategori: id_kategori,
		},
		method: "POST",
		dataType: "json",
		async: true,
		beforeSend: function () {
			// $("#img-loading-navigasi").css("display", "inline");
			// document.getElementById("img-loading-navigasi").style.display = "inline";
		},
		success: function (data) {
			$("#navigasi-terkait").html(data);
		},
		complete: function () {
			// $("#img-loading-navigasi").css("display", "none");
      			// document.getElementById("img-loading-navigasi").style.display = "none";
		},
	});
}

function redirect_to_list(id_kategori, page_no, items_per_page) {
	sessionStorage.setItem("id_kategori", id_kategori);
	window.location.href = "lingkup";
	
}

/*
 * TODO
 * search_artikel harud dimodifikasi sehingga:
 * 1. memperhatikan page berapa yang hendak di-load
 * */
function beranda_search_artikel()
{
  debugger;

  $.cookie("search", $("#txt-search").val());

  // load page artikel
  window.location.href = "lingkup";
}
