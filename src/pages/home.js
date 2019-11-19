import Button from '../components/button.js';
import Input from '../components/input.js';
import Card from '../components/card.js';
import Menu from '../components/menu.js';
import ListCard from '../components/listcard.js';


const getTheaterApi = () => {
  fetch(`https://open-house-309f5.firebaseio.com/plays.json`)
  .then(response => response.json())
  .then((data) => {
    data.map((api) =>  {
      const allData = api;
      cards(allData);
      return allData;
  })
 })
}

function Home() {
  const template = `
  <div class = main>
  <div class="template">
    <header class="header"><img class="logo" src="./Imagens/Logo.png"></header>
    <input type="checkbox" id="btn-menu" />
    <label for="btn-menu" class="hamburguer-menu">&#9776;</label>
    <nav class="menu">
      <ul>
      ${Menu({
        name: 'Sobre',
        link: About,
      })}
      ${Menu({
        name: 'Indique uma peça',
        link: Indicate,
      })}
      ${Menu({
        name: 'Contato',
        link: Contact,
      })}
      </ul> 
    </nav>
    <section>
    <div class='destaque'>
      <h3 class="text-simple">Peças em destaque</h3>
      <div class="highlight"></div>
    </section>
    </div>
    <section>
    <h3 class="text-simple">Todas as peças</h3>
      <div class="search">
      ${Input({
      class: 'input ',
      placeholder: 'Pesquise aqui',
      type: 'text',
      })}
      ${Button({
        id: 'search',
        class:'btnsearch',
        title: '🔎',
        onClick: Search,
      })}
      <select class ="location" onchange = "window.home.filterLocation()">
      <option value='1'>localização</option>
      <option value='zona sul'>zona sul</option>
      <option value='zona norte'>zona norte</option>
      <option value='zona oeste'>zona oeste</option>
      <option value='zona leste'>zona leste</option>
      <option value='center'>centro</option>
      </select>
      <form onchange = "window.home.filterDate()">
      ${Input({
        class: 'date',
        placeholder: '',
        type: 'date',
        })}
      </form>
      <select id="price" onchange="window.home.filterPrice()">
      <option value='Vai dar certo'>valor</option>
      <option value='gratuito'>Gratuito</option>
      <option value='R$50,00'>Até R$50,00</option>
      <option value='R$100,00'>Até R$100,00</option>
      <option value='R$100,01'>Acima de R$100,00</option>
      </select>
      </div>
      <div class="all"></div>
    </section>
  </div>
  </div>
  `;
  location.hash = 'home';
  return template;
}

function cards(allData) {
  document.querySelector('.all').innerHTML += `

  ${ListCard({
    name: allData.name,
    img: allData.photo_url,
    price: allData.price,
    classification: allData.parental_raiting,
    date: allData.date,
    class: 'listcard',
  })}
  `
}

function filterPrice() {
  document.querySelector('.all').innerHTML = '';
  const option = document.querySelector('#price').value;
  fetch('https://open-house-309f5.firebaseio.com/plays.json')
    .then(response => response.json())
    .then(data => {
      data.map((item) => {
        if (option == item.price ) {
          window.home.cards(item) ;
        }
        else if (option == "R$50,00" && 50 > parseInt(item.price.replace(/\D/g,''))/100) {
            window.home.cards(item);
        }
        else if (option == "R$100,00" && 100 >= parseInt(item.price.replace(/\D/g,''))/100){
          window.home.cards(item);
        }
        else if (option == "R$100,01" && 101 < parseInt(item.price.replace(/\D/g,''))/100) {
          window.home.cards(item);
        }
      })
    })
}

function filterLocation() {
  document.querySelector('.all').innerHTML = '';
  const options = document.querySelector('.location').value;
  fetch('https://open-house-309f5.firebaseio.com/plays.json')
    .then(response => response.json())
    .then(data => {
      data.map((locations) => {
        if (options == locations.theater_zone) {
          window.home.cards(locations)
        } 
          else{
            document.querySelector('.all').innerHTML = `
            <p>Não encontramos nenhuma peça nessa localização!</p>
            `
          }
      }
    )
  })
}

function Search() {
  const keyWord  = document.querySelector('.input').value;
  fetch('https://open-house-309f5.firebaseio.com/plays.json')
  .then(response => response.json())
  .then(data => {
    const filter  = data.filter((item) => item.name.includes(keyWord)); 
    document.querySelector('.all').innerHTML = '';
    filter.forEach((item) => window.home.cards(item) );
    }
  );
}


function filterDate() {
  document.querySelector('.date').innerHTML = '';
  document.querySelector('.all').innerHTML = '';
  const dateFilter = document.querySelector('.date').value;
  const d = new Date(dateFilter)
  const date = d.getDate()+1;
  const month = d.getMonth()+1;
  const year = d.getFullYear();
  const dateResult = date + "/" + month + "/" + year;

  fetch('https://open-house-309f5.firebaseio.com/plays.json')
  .then(response => response.json())
    .then(data => {
      data.map((item) => {
        if(item.date.includes(dateResult)){
          window.home.cards(item)
        }})
    })
}

function About() {
  window.location.hash = 'about'
};

function Indicate() {
  window.location.hash = 'indicate'
};

function Contact() {
  window.location.hash = 'contact'
};


window.home = {
  cards, 
  filterPrice,
  filterLocation,
  filterDate,
}

export {Home, getTheaterApi} ;