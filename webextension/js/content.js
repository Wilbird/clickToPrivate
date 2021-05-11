var target;

window.addEventListener('click', handler, false);

function handler(event) {
    if (!event.shiftKey) {
        return;
    }
    // left click ?
    if (event.button !== 0 &&
        event.buttons !== 0) {
        return;
    }
        
    target = event.target;
    
    while (target) {
        if (target.tagName && target.tagName === "A") {
            event.preventDefault();
            event.stopPropagation();
            var sending = browser.runtime.sendMessage({"url": target.href});
            break;
        }
        target = target.parentNode;
    }
};
