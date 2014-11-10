function EventsWatchDirective() {
    "use strict";

    return {
        link: function(scope, element) {
            element = $(element);

            element.on('delegate', 'menu', function(e) {
                var showed = element.find('.event-options.show'),
                    parent = $(this).parent();

                if (parent.hasClass('show')) {
                    parent.removeClass('show');
                }
                else {
                    showed.removeClass('show');
                    parent.addClass('show');
                }
            });

            element.on('delegate', 'more', function(e) {
                var box = $(e.detail.target).parents('li'),
                    parent = element.parent()[0],
                    top = box[0].offsetTop,
                    start = new Date().getTime();

                /*function animate() {
                    window.animateFrame = requestAnimationFrame(animate);

                    parent.scrollTop += 20;

                    parent.scrollTop >= box[0].offsetTop && cancelAnimationFrame(animateFrame);

                    console.log(parent.scrollTop, top);
                }

                window.animateFrame = requestAnimationFrame(animate);*/

                /*function animate() {
                    var now = (new Date().getTime()) - start; // Текущее время
                    var progress = now / 200; // Прогресс анимации

                    parent.scrollTop = (top - 0) * progress + 0;
                    progress < 1 && setTimeout(animate, 10);
                }

                setTimeout(animate, 10);*/


                /*var interval = window.setInterval(function() {
                    console.log(parent.scrollTop, top);
                    if (parent.scrollTop < top) {
                        parent.scrollTop += 10;
                    }
                    else {
                        clearInterval(interval);
                    }
                    //scrollTop = box[0].offsetTop;
                }, 20);*/
                //element.parent().css('overflow', 'hidden');
            });
        }
    }
}