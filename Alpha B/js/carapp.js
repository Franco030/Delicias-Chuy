let iconCart = document.querySelector('.cart_link');
let closeCart = document.querySelector('.cartClose');
let body = document.querySelector('body');  
let listCartHTML = document.querySelector('.listCart')
//let iconCartSpan = document.querySelector('')

let listProducts = [];
let carts = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        })
    } else {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts))
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    if(carts.length > 0) {
        carts.forEach(cart => {
            let newCart = document.createElement('div');
            newCart.classList.add('listCartItem');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info  = listProducts[positionProduct];
            newCart.innerHTML = `<div class="itemImage">
            <img src="${info.image}" alt="">
          </div>
          <div class="itemName">
          ${info.name}
          </div>
          <div class="itemTotalPrice">
          $${info.price * cart.quantity}
          </div>
          <div class="itemQuantity">
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span>
          </div>`;
          listCartHTML.appendChild(newCart);
        })
    }
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        console.log(product_id);
        changeQuantity(product_id, type);
    }
})

const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

const initApp = () => {
    fetch('js/items.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;

        if(localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp()