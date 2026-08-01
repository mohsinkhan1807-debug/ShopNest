// =======================
// CART
// =======================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let total = 0;
let discount = 0;
let discountPercent = 0;

const discountText = document.getElementById("discount-text");
const couponInput = document.getElementById("coupon-code");
const applyCoupon = document.getElementById("apply-coupon");

let couponApplied = false;

document.querySelectorAll(".add-cart").forEach(button => {

    button.classList.remove("added");
    button.innerText = "Add to Cart";

});

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
function updateCart() {

    // Cart save
    localStorage.setItem("cart", JSON.stringify(cart));

    cartItems.innerHTML = "";

    const summaryItems = document.getElementById("order-summary-items");

    if(summaryItems){
        summaryItems.innerHTML = "";
    }

    // Empty Cart
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your Cart is Empty 🛒</h3>
                <p>Add some products to continue shopping.</p>
            </div>
        `;

        cartTotal.innerText = "0";

        if(summaryItems){
            document.getElementById("subtotal").innerText = "₹0";
            document.getElementById("summary-discount").innerText = "₹0";
            document.getElementById("checkout-total").innerText = "₹0";
            summaryItems.innerHTML="<P>No Items in Cart</P>"
        }

        return;

    }

    // Total Reset
    total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `
        <div class="cart-item">

            <div class="cart-info">
                <h4>${item.name}</h4>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>

            <div class="cart-actions">

                <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>

                <span class="qty">${item.quantity}</span>

                <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>

                <button class="remove-btn" onclick="removeItem(${index})">
                    Remove
                </button>

            </div>

        </div>
        `;

        if(summaryItems){

            summaryItems.innerHTML += `
            <p>
                ${item.name} × ${item.quantity}
                <span>
                    ₹${item.price * item.quantity}
                </span>
            </p>
            `;

        }

    });

    // Discount
    discount = total * discountPercent / 100;

    cartTotal.innerText = (total - discount).toFixed(0);

    discountText.innerText = `Discount: ₹${discount.toFixed(0)}`;

    if(summaryItems){

        document.getElementById("subtotal").innerText = "₹" + total;

        document.getElementById("summary-discount").innerText =
        "₹" + discount.toFixed(0);

        document.getElementById("checkout-total").innerText =
        "₹" + (total - discount).toFixed(0);

    }

}


    function removeItem(index){

    const removedName = cart[index].name;

    cart.splice(index,1);

    document.getElementById("cart-icon").innerText = cart.length;

    document.querySelectorAll(".add-cart").forEach(button=>{

        const card = button.closest(".product-card");

        if(card.dataset.name === removedName){

            button.classList.remove("added");
            button.innerText = "Add to Cart";

        }

    });

    updateCart();

    showToast("Item Removed ❌");
}


function increaseQuantity(index){

    cart[index].quantity++;

    updateCart();

}

function decreaseQuantity(index){

    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }else{

        removeItem(index);
        return;

    }

    updateCart();

}
// =======================
// ADD TO CART
// =======================
document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", function () {

        const card = button.closest(".product-card");

        const product = {
            name: card.dataset.name,
            price: Number(card.dataset.price),
            quantity: 1
        };

        const index = cart.findIndex(item => item.name === product.name);

        if (index === -1) {

            cart.push(product);

            button.classList.add("added");
            button.innerText = "Added ✓";

            showToast("Item Added ✅");

        } else {

            cart.splice(index, 1);

            button.classList.remove("added");
            button.innerText = "Add to Cart";

            showToast("Item Removed ❌");

        }

        document.getElementById("cart-icon").innerText = cart.length;

        updateCart();

    });

});


// =======================
// SEARCH
// =======================

const search = document.getElementById("search");

search.addEventListener("keyup", function () {

    document.querySelector(".products").scrollIntoView({
        behavior: "smooth"
    });

    let value = search.value.toLowerCase();

    document.querySelectorAll(".product-card").forEach(card => {

        let name = card.dataset.name.toLowerCase();

        if (name.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});


// =======================
// WISHLIST
// =======================
function updateWishlist(){

    const container = document.getElementById("wishlist-products");

    container.innerHTML = "";

    if(wishlist.length === 0){

        container.innerHTML = `
            <p id="empty-favourite">
                No Favourite Items Yet ❤️
            </p>
        `;

        document.getElementById("wishlist-count").innerText = 0;

        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        return;
    }

    wishlist.forEach(item=>{

        container.innerHTML += `
            <div class="product-card">
                <img src="${item.image}" alt="">
                <h3>${item.name}</h3>
                <h4>₹${item.price}</h4>
            </div>
        `;

    });

    document.getElementById("wishlist-count").innerText = wishlist.length;

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

document.querySelectorAll(".wishlist-btn").forEach(button => {

    const card = button.closest(".product-card");

    const name = card.dataset.name;

    if (wishlist.some(item => item.name === name)) {

        button.classList.add("active");
        button.innerText = "❤️";

    } else {

        button.classList.remove("active");
        button.innerText = "🤍";

    }

});

}

localStorage.setItem("wishlist",JSON.stringify(wishlist));


document.querySelectorAll(".wishlist-btn").forEach(button=>{

    button.addEventListener("click",function(){

        const card = button.closest(".product-card");

        const item = {

            name: card.dataset.name,
            price: card.dataset.price,
            image: card.querySelector("img").src

        };

        const index = wishlist.findIndex(p=>p.name===item.name);

        if(index===-1){

            wishlist.push(item);

            button.classList.add("active");

            button.innerText="❤️";

            showToast("Added to Favourite ❤️");

        }

        else{

            wishlist.splice(index,1);

            button.classList.remove("active");

            button.innerText="🤍";

            showToast("Removed from Favourite ❌");

        }

        updateWishlist();

    });

});


// =======================
// CART SIDEBAR
// =======================

const cartSidebar = document.getElementById("cart-sidebar");
const cartBtn = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");

cartBtn.addEventListener("click", function (e) {

    e.preventDefault();
    cartSidebar.classList.add("open");

    document.getElementById("checkout-total").innerText=total;

});

closeCart.addEventListener("click", function () {

    cartSidebar.classList.remove("open");

});

function showToast(message){

    const toast = document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);}

applyCoupon.addEventListener("click", () => {

    if (couponApplied) {
        showToast("Coupon Already Applied ❌");
        return;
    }

    const code = couponInput.value.trim().toUpperCase();

    if (code === "SAVE10") {

        discountPercent=10;

        couponApplied = true;

        showToast("10% Discount Applied 🎉");

    }

    else if (code === "WELCOME20") {

        discountPercent=20;

        couponApplied = true;

        showToast("20% Discount Applied 🎉");

    }

    else {

        showToast("Invalid Coupon ❌");

        return;

    }
    updateCart();
    couponInput.value="";


    discountText.innerText = `Discount : ₹${discount}`;

    document.getElementById("checkout-total").innerText =
        Math.round(total - discount);

});
    
    
const checkoutBtn = document.querySelector(".checkout-btn");
const checkoutPopup = document.getElementById("checkout-popup");
const checkoutTotal = document.getElementById("checkout-total");

checkoutBtn.addEventListener("click", () => {

    if(cart.length===0){

        showToast("Cart is Empty 🛒");
        return;

    }

    checkoutTotal.innerText = cartTotal.innerText;

    checkoutPopup.classList.add("show");

});

document.getElementById("close-checkout").addEventListener("click",()=>{

    checkoutPopup.classList.remove("show");

});

document.getElementById("place-order").addEventListener("click",()=>{

    const name=document.getElementById("customer-name").value.trim();
    const phone=document.getElementById("customer-phone").value.trim();
    const address=document.getElementById("customer-address").value.trim();
    const payment =document.querySelector('input[name="payment"]:checked').value;

    if(!name || !phone || !address){

        showToast("Please fill all details");
        return;

    }
    showToast(`Thank You ${name}! 🎉 ${payment} Selected`);

    cart=[];
    localStorage.removeItem("cart");

    document.getElementById("cart-icon").innerText=0;

    updateCart();

document.querySelectorAll(".product-card").forEach(card => {
 
    const button = card.querySelector(".add-cart");

const found = cart.find(item => item.name === card.dataset.name);

    if (found) {
        button.classList.add("added");
        button.innerText = "Added ✓";
    } else {
    button.classList.remove("added");
    button.innerText = "Add to Cart";
    }
});

    
document.getElementById("customer-name").value = "";
document.getElementById("customer-phone").value = "";
document.getElementById("customer-address").value = "";
    checkoutPopup.classList.remove("show");

    discount = 0;
discountPercent = 0;
couponApplied = false;

discountText.innerText = "Discount: ₹0";

document.getElementById("checkout-total").innerText = "0";

updateCart();
})
document.getElementById("cart-icon").innerText = cart.length;

cart.forEach(item => {

    document.querySelectorAll(".product-card").forEach(card => {

        if(card.dataset.name === item.name){

            const button = card.querySelector(".add-cart");

            button.classList.add("added");
            button.innerText = "Added ✓";

        }

    });

});
updateCart();
updateWishlist();


document.getElementById("contact-form").addEventListener("submit", function(e){

    e.preventDefault();

    showToast("Message Sent Successfully ✅");

    this.reset();

});

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", function(){

    if(window.scrollY > 300){
        topBtn.style.display = "block";
    }else{
        topBtn.style.display = "none";
    }
    const scrollTop = document.documentElement.scrollTop;
const scrollHeight =
document.documentElement.scrollHeight -
document.documentElement.clientHeight;

const progress = (scrollTop / scrollHeight) * 100;

document.getElementById("progress-bar").style.width =
progress + "%";

});

topBtn.addEventListener("click", function(){

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
window.addEventListener("load", function(){

    setTimeout(function(){

        document.getElementById("preloader").classList.add("hide");

    },1200);

});

const themeBtn = document.getElementById("theme-toggle");

// Page refresh ke baad bhi theme yaad rahe
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
    themeBtn.innerText = "☀️";
}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        themeBtn.innerText = "☀️";
    }else{
        localStorage.setItem("theme","light");
        themeBtn.innerText = "🌙";
    }

});