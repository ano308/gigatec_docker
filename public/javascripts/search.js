
var img = document.querySelector("img");
img.addEventListener("click", function() {
location.reload();
});
const form = document.querySelector("form");
const input = document.querySelector("input");
const productsContainer = document.querySelector(".products");
const products = document.querySelectorAll(".products .product");
const highlightsImg = document.querySelector(".hide-on-search");
input.addEventListener("input", (event) => {
const query = event.target.value.toLowerCase();
products.forEach((product) => {
const productName = product.querySelector("h4").textContent.toLowerCase();
if (productName.includes(query)) {
product.style.display = "flex";
product.style.width = "48%";
product.style.marginBottom = "20px";
} else {
product.style.display = "none";
}
});
productsContainer.style.display = "flex";
productsContainer.style.flexWrap = "wrap";
productsContainer.style.justifyContent = "space-between";
highlightsImg.classList.add("hide");
});
const formBut = document.querySelector("form");
const inputBut = document.querySelector("input");
const productsBut = document.querySelectorAll(".products .product");
const highlightsImgBut = document.querySelector(".hide-on-search");
formBut.addEventListener("submit", (event) => {
event.preventDefault();
const queryBut = input1.value.toLowerCase();
productsBut.forEach((product) => {
const productNameBut = product.querySelector("h4").textContent.toLowerCase();
if (productNameBut.includes(queryBut)) {
product.style.display = "flex";
product.style.width = "30%";
product.style.marginBottom = "20px";
} else {
product.style.display = "none";
}
});
highlightsImgBut.classList.add("hide");
});