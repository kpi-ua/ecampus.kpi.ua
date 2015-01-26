$('.carousel').slick({
    arrows: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    variableWidth: true,
    draggable: false,
    infinite: false,
    nextArrow: $(".glyphicon-chevron-left"),
    prevArrow: $(".glyphicon-chevron-right"),
    responsive: [
      {
          breakpoint: 1024,
          settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
          }
      },
      {
          breakpoint: 600,
          settings: {
              slidesToShow: 2,
              slidesToScroll: 2
          }
      },
      {
          breakpoint: 480,
          settings: {
              slidesToShow: 1,
              slidesToScroll: 1
          }
      }
    ]
});