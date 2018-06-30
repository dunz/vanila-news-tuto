class News {
    constructor(options) {
        this.mockUrl = options.mockUrl;
        this.listContainer = document.querySelector('.news-list');
        this.contentContainer = document.querySelector('.news-content');
        this.leftButton = document.querySelector('.button-left');
        this.rightButton = document.querySelector('.button-right');
        this.newsList = [];
        this.currentIndex = 0;
        this.currentNewsHTML = '';
    }
    
    async init() {
        const newsList = await this.getNewsList();
        const currentNews = this.getCurrentNews(this.currentIndex);
        
        this.render(this.listContainer, this.getListHTML(newsList));
        this.render(this.contentContainer, this.getCurrentNewsHTML(currentNews));
        
        this.addEvent(this.listContainer, 'click', this.onClickListItem.bind(this));
        this.addEvent(this.leftButton, 'click', ev => this.onClickMoveButton(ev, 'left'));
        this.addEvent(this.rightButton, 'click', ev => this.onClickMoveButton(ev, 'right'));
    }
    
    onClickListItem(ev) {
        const list = Array.from(this.listContainer.querySelectorAll('li'));
        const index = list.indexOf(ev.target);
        if (index === this.currentIndex || index < 0) {
            return;
        }
        this.currentIndex = index;
        this.changeCurrentNews(this.currentIndex);
    }
    
    onClickMoveButton(ev, direction) {
        this.changeCurrentIndex(direction);
        this.changeCurrentNews(this.currentIndex);
    }
    
    changeCurrentNews(index) {
        const currentNews = this.getCurrentNews(index);
        this.render(this.contentContainer, this.getCurrentNewsHTML(currentNews), true);
    }
    
    changeCurrentIndex(direction) {
        const lastIndex = this.newsList.length - 1;
        if (direction === 'left') {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = lastIndex;
            }
        } else {
            this.currentIndex++;
            if (this.currentIndex > lastIndex) {
                this.currentIndex = 0;
            }
        }
    }
    
    addEvent(selector, event, fn) {
        try {
            selector.addEventListener(event, fn);
        } catch (e) {
            console.log(e);
        }
    }
    
    async getNewsList() {
        this.newsList = (await axios.get(this.mockUrl)).data;
        return this.newsList;
    }
    
    getCurrentNews(index = 0) {
        this.currentNewsHTML = this.newsList[index];
        return this.currentNewsHTML;
    }
    
    getListHTML(list = []) {
        return list.reduce((str, item, index, arr) => {
            return str += `<li>${item.title}</li>${index === arr.length - 1 ? '</ul>' : ''}`;
        }, '<ul>');
    };
    
    getCurrentNewsHTML(content = {title: '', description: ''}) {
        const {title, description} = content;
        this.currentNewsHTML = `<div><p><h1>${title}</h1></p><div>${description}</div></div>`;
        return this.currentNewsHTML;
    }
    
    render(container, html, isChange = false) {
        isChange && container.removeChild(container.firstChild);
        return container.insertAdjacentHTML('beforeend', html);
    }
}

const news = new News({
    mockUrl: './mock.json'
});

document.addEventListener('DOMContentLoaded', () => {
    news.init();
});