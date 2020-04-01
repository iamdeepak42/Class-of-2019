function init(){
    const slides = document.querySelectorAll('.slide');
    const pages = document.querySelectorAll('.page');
    const backgrounds = [`radial-gradient(#2B3760,#0B1023)`,`radial-gradient(#4E3022,#161616)`,
    `radial-gradient(#4E4342,#161616)`];
    // tracker

    let current = 0;

    slides.forEach((slide,index) => {
        slide.addEventListener("click",function(){
            changeDots(this);
            nextSlide(index);
        });

    });

    function changeDots(dot){
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dot.classList.add('active');
    };

    function nextSlide(pageNumber){
        const nextPage = pages[pageNumber];
        const currentPage = pages[current];
        const nextLeft = nextPage.querySelector('.hero .model-left');
        const nextRight = nextPage.querySelector('.hero .model-right');

        const currentLeft= currentPage.querySelector('.hero .model-left');
        const currentRight  = currentPage.querySelector('.hero .model-right');

        const nextText = nextPage.querySelector('.details');
        const friends  = document.querySelector('.friends');

        const t1 = new TimelineMax();
        t1.fromTo(currentLeft,0.3,{y: '-10%'},{y: '-100%'})
        .fromTo(currentRight,0.3,{y: '10%'},{y: '-100%'},'-=0.2')

        .to(friends,0.3,{backgroundImage: backgrounds[pageNumber]})
        .fromTo(currentPage,0.3,{opacity:1,pointerEvents: 'all'},
        {opacity:0,pointerEvents: 'none'})
        .fromTo(nextPage,0.3,{opacity:0,pointerEvents: 'none'},
        {opacity:1,pointerEvents: 'all'})
        .fromTo(nextLeft,0.3,{y: '-100%'},{y: '-10%'},'-=0.6')
        .fromTo(nextRight,0.3,{y: '-100%'},{y: '10%'},'-=0.8')
        .fromTo(nextText,0.3,{opacity:0,y:0 }, {opacity:1,y:0})
        .set(nextLeft,{clearProps: 'all'})
        .set(nextRight,{clearProps: 'all'});


        current = pageNumber;
   };
   
   const hamburger = document.querySelector('.menu');
   const hamburgerLines = document.querySelectorAll('.menu line');
   const navOpen = document.querySelector('.nav-open');
   const contact = document.querySelector('.contact');
   const social = document.querySelector('.social'); 
   const logo = document.querySelector('.logo');

   const t1 = new TimelineMax({paused: true, reversed: true });
   t1.to(navOpen,0.3,{y:0})
   .fromTo(contact,0.5,{opacity:0,y:10},{opacity:1,y:0},'-=0.1')
   .fromTo(social,0.2,{opacity:0,y:10},{opacity:1,y:0},'-=0.5')
   .fromTo(logo,0.2,{color:'white'},{color:'black'},'-=0.5')
   .fromTo(hamburgerLines,0.2,{stroke:'white'},{stroke:'black'},'-=0.1' );

   hamburger.addEventListener('click',()=>{
       t1.reversed() ? t1.play():t1.reverse();
   })
};

init();

