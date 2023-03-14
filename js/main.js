class Show {
    constructor() {
        this.input_block = document.getElementById("input_block");

        this.title = this.createElement("h1", "title");
        this.title.textContent = "Git user search";

        this.searchBlock = this.createElement("div", "search-block");
        this.searchInput = this.createElement("input", "search-input");
        this.search_button = this.createElement("button", "btn");
        this.search_button.textContent = "Search";
        this.counter = this.createElement("p", "counter");
        this.error = this.createElement("p", "error")
        this.searchBlock.append(this.searchInput);
        this.searchBlock.append(this.counter);
        this.searchBlock.append(this.error);
        this.searchBlock.append(this.search_button);

        this.block_main = this.createElement("div", "block_main");
        this.users_container = this.createElement("div", "users_container");
        this.users = this.createElement("ul", "users");

        this.users_container.append(this.users);

        this.input_block.append(this.title);
        this.input_block.append(this.searchBlock);

        this.input_block.append(this.block_main);
        this.input_block.append(this.users_container);


    }
    createElement (tag, className){
    const element = document.createElement(tag);
    if (className){
        element.classList.add(className);
        }
    return element;
    }

    createUser (userJson) {
    const user = this.createElement("li", "user");
    user.innerHTML = `<img class="photo" src="${userJson.avatar_url}" alt="${userJson.login}">     
                      <p><a class="user_link" href="${userJson.html_url}" target="login">${userJson.login}</a></p>`;
    this.users.append(user);

    }
    addCountMessage (count) {
        let message;
        count ? message = `Найдено ${count} пользователей` : message = `Ничего не найдено`;
        this.counter.textContent = message;
    }
}

const USER_PER_PAGE = 10;
class Search {
    constructor(show) {
        this.show = show;

        this.show.search_button.addEventListener("click", this.getUsers.bind(this));
    }
    async getUsers () {
        let count;
        this.show.users.innerHTML = '';
        this.show.error.innerHTML = '';
        let request = this.show.searchInput.value;
        if (request === '') {
            this.show.counter.textContent = '';
            this.show.error.textContent = 'вы пытаетесь отправить пустой запрос';
            return false;
        }
        return await fetch(`https://api.github.com/search/users?q=${request}&per_page=${USER_PER_PAGE}`)
            .then((res) =>{
                if (res.ok){
                    res.json().then(res => {
                        count = res.total_count;
                        this.show.addCountMessage(count);
                        res.items.forEach(user => this.show.createUser(user));
                    })
                }
            })
    }
}

new Search(new Show());
