let startX = 0, startY = 0, newX = 0, newY = 0;

const draggable = document.querySelector('.outer-conatiner');


draggable.addEventListener('mousedown', mouseDown);

function mouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e) {
    newX = e.clientX - startX;
    newY = e.clientY - startY;


    draggable.style.left = (draggable.offsetLeft + newX) + 'px';
    draggable.style.top = (draggable.offsetTop + newY) + 'px';


    startX = e.clientX;
    startY = e.clientY;
}

function mouseUp() {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
}
