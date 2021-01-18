var peliculaBuscar,idPelicula;
var section,informacion;
var peticionEnCurso = false;
var page = 1;

$(function(){
  let boton = $("button:eq(0)");

  section = $("#divPeliculas");
  informacion = $("#informacion");

  boton.on('click',function(){
      $(section).html("");
      $(informacion).css("display","none");
      let buscar = $("#buscar");
      peliculaBuscar = $(buscar).val();
      obtenerPeliculas();
      $(buscar).val("");
  })

  $(window).on('scroll',function(){
    if($(window).scrollTop()+$(window).height()>= $(document).height()-300){
      obtenerPeliculas();
    }

    if($(window).scrollTop()<=0){
      $("#subir").css("visibility","hidden");
    }else{
      $("#subir").css("visibility","visible");
    }
  })

  $("#subir").on('click',function(){
    $("html").animate( {scrollTop:0 },2000 ); 
  })
})

function obtenerPeliculas(){
  if(!peticionEnCurso){
    peticionEnCurso = true;
    $.ajax( "https://www.omdbapi.com/?s="+peliculaBuscar +"&page="+page+"&apikey=3ec76701" )
      .done(function(informacion) {
        maquetarPeliculas(informacion);
      })
      .fail(function() {
          alert( "error" );
      })
      .always(function(){
          peticionEnCurso = false;
    })
  }
} 


function obtenerInformacion() {
  if(!peticionEnCurso){
    peticionEnCurso = true;
    $.ajax( "https://www.omdbapi.com/?i="+idPelicula+"&page="+page+"&apikey=3ec76701")
      .done(function(informacion){
        maquetarInformacion(informacion);
      })
    .fail(function(){
      alert( "error" );
    })
    .always(function(){
        peticionEnCurso = false;
    })
  }
} 

function maquetarPeliculas(ajax){
  if(ajax.Response != "False"){
    for(i=0;i<ajax.Search.length;i++)
      maquetarPelicula(ajax.Search[i]);
    page++;
  }
  else if(ajax.Response == "False" && page == 1){
    $("<p>").text('No hay ninguna pelicula con el titulo "' + peliculaBuscar + '"');
    $(section).append($(parrafo));
  }
}

function maquetarPelicula(pelicula){
  let article =  $("<article>").attr("id",pelicula.imdbID);
  let titulo =  $("<h3>").text(pelicula.Title);
  let imagen =  $("<img>").attr("src",pelicula.Poster);

  $(article).append($(titulo));
  $(article).append($(imagen));

  $(section).append($(article));

  eventoInformacion($(article));
}

function maquetarInformacion(ajax){
  let iconoCerrar = $("<span class='material-icons'>clear</span>");

  let titulo = $("<h3>").text(ajax.Title)
  
  let divImagen = $("<div>").attr("id","divImagen");

  let imagen = $("<img>").attr("src",ajax.Poster);

  $(divImagen).append($(imagen));

  let pAño = $("<p>").text("Year: " + ajax.Year);
  let pActores = $("<p>").text("Actors: "+ ajax.Actors);
  let pPlot = $("<p>").text("Plot: " + ajax.Plot);
  let pLanguage = $("<p>").text("Language: " + ajax.Language);
  let pCountry = $("<p>").text("Country: " + ajax.Country);
  let pRatings = $("<p>").text("Ratings: " + ajax.Ratings[0].Value);

  $(informacion).append($(iconoCerrar))
                .append($(titulo))
                .append($(divImagen))
                .append($(pAño))
                .append($(pActores))
                .append($(pPlot))
                .append($(pLanguage))
                .append($(pCountry))
                .append($(pRatings));

  $(iconoCerrar).on('click',function(){
    $(informacion).css({
                        "display":"none",
                        "wide":"100%",
    });  
  })
}

function eventoInformacion(pelicula){
  $(pelicula).on('click',e =>{
    idPelicula = e.currentTarget.id;
    $(informacion).empty();
    $(section).css("width","70vw");
    $(informacion).css("display","initial")
    obtenerInformacion();
  })
}
