function changeContent(elementClicked) {
            
            const newContent = elementClicked.getAttribute('data-content');
            const mainContentElement = document.getElementById('main-content');
            mainContentElement.innerHTML = newContent;
}