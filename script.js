const products = [
 {id:1,title:"Good Vibes Quote Design",category:"Posters",price:499,description:"A bold typography poster for a creative workspace or social post.",rating:"4.9",reviews:24,bg:"#f1e6d1",fg:"#14233a",art:"GOOD VIBES\nONLY",sub:"STUDIO NOTES / 01",symbol:"✦"},
 {id:2,title:"Minimal Botanical Poster",category:"Posters",price:399,description:"Minimal botanical-inspired artwork for modern interiors.",rating:"4.8",reviews:18,bg:"#dce7dd",fg:"#233b32",art:"GROW\nSLOW",sub:"BOTANICAL SERIES",symbol:"❋"},
 {id:3,title:"Lion King T-Shirt Design",category:"Branding",price:599,description:"A striking golden lion graphic concept for apparel and merch.",rating:"4.9",reviews:32,bg:"#101b2c",fg:"#ffc448",art:"♛\nKING",sub:"ROYAL COLLECTION",symbol:"✦"},
 {id:4,title:"Social Media Template Pack",category:"Social Media",price:799,description:"A coordinated set of layouts for a polished social feed.",rating:"4.7",reviews:21,bg:"#f3b3a2",fg:"#6b2842",art:"SOCIAL\nSTUDIO",sub:"POST • SHARE • GROW",symbol:"▧"},
 {id:5,title:"Vintage Logo Collection",category:"Branding",price:449,description:"Retro-inspired badge and logo concepts for small brands.",rating:"4.8",reviews:16,bg:"#d8c4a0",fg:"#27372d",art:"FIELD\n& FORM",sub:"VINTAGE MARKS",symbol:"◈"},
 {id:6,title:"Business Card Template",category:"Templates",price:699,description:"Clean business card layouts designed for easy customization.",rating:"4.9",reviews:27,bg:"#d9e3ee",fg:"#20334b",art:"YOUR\nBRAND",sub:"IDENTITY KIT",symbol:"◆"},
 {id:7,title:"Mountain Wallpaper Pack",category:"Templates",price:349,description:"Atmospheric landscape-inspired wallpapers for your devices.",rating:"4.6",reviews:13,bg:"#d7b28b",fg:"#1e3245",art:"FIND\nYOUR\nWILD",sub:"WALLPAPER SERIES",symbol:"▲"},
 {id:8,title:"Creator Media Kit",category:"Social Media",price:899,description:"A presentation template for creators, portfolios and partnerships.",rating:"4.8",reviews:19,bg:"#eadff3",fg:"#442e64",art:"CREATOR\nKIT",sub:"YOUR STORY / YOUR BRAND",symbol:"✦"},
{id:9,title:"Modern branding design",category:"Branding",price:600,description:"Modern branding design for businesses and brands.",rating:"5.0",reviews:0,bg:"#e8eef5",fg:"#26384d",art:"MODERN\nBRAND",sub:"YOUR BRAND / YOUR STYLE",image:"https://xckgwsxyhebysmkjbqfm.supabase.co/storage/v1/object/public/design%20files/IMG-20261002-WA0022.jpg",symbol:"✦"}];
const money = n => "Rs " + n.toLocaleString("en-PK");
let activeCategory = "All", cart = [], favorites = new Set();
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400)}
function productArt(p,extra=""){return p.image?`<div class="${extra}"><img src="${p.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit"></div>`:`<div class="${extra}" style="background:${p.bg};color:${p.fg}"><span class="art-symbol">${p.symbol}</span><span class="art-title">${p.art}</span><span class="art-sub">${p.sub}</span></div>`}
function renderProducts(){
 let list=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(`${p.title} ${p.category} ${p.description}`).toLowerCase().includes(searchInput.value.toLowerCase()));
 if(sortSelect.value==="low")list.sort((a,b)=>a.price-b.price);if(sortSelect.value==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(p=>`<article class="product-card">${productArt(p,"product-art")}<div class="product-info"><span class="product-category">${p.category}</span><h3>${p.title}</h3><p class="product-description">${p.description}</p><div class="product-bottom"><div class="price">${money(p.price)} <small>PKR</small></div><button class="add-btn" data-add="${p.id}">＋ Add</button></div><div class="rating"><span>★</span> ${p.rating} <span style="color:#9aa2ad">(${p.reviews} reviews)</span> <button class="remove-btn" data-fav="${p.id}" aria-label="Add to wishlist">${favorites.has(p.id)?"♥":"♡"}</button></div></div></article>`).join("");
 document.getElementById("emptyMessage").classList.toggle("hidden",list.length>0);
 grid.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(Number(b.dataset.add))));
 grid.querySelectorAll(".product-art").forEach((el,i)=>el.addEventListener("click",()=>openProduct(list[i].id)));
 grid.querySelectorAll("[data-fav]").forEach(b=>b.addEventListener("click",()=>{const id=Number(b.dataset.fav);favorites.has(id)?favorites.delete(id):favorites.add(id);renderProducts();showToast(favorites.has(id)?"Added to wishlist":"Removed from wishlist")}));
}
function addToCart(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});renderCart();showToast("Design added to your cart")}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
 document.getElementById("cartCount").textContent=count;document.getElementById("cartTitleCount").textContent=`(${count})`;document.getElementById("cartTotal").textContent=money(total);
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML='<p class="muted">Your cart is empty. Explore the collection to find something you love.</p>';return}
 box.innerHTML=cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="cart-row"><div class="mini-art" style="background:${p.bg};color:${p.fg}">${p.art.replace("\n","<br>")}</div><div><h4>${p.title}</h4><small>${money(p.price)} × ${x.qty}</small></div><button class="remove-btn" data-remove="${p.id}">Remove</button></div>`}).join("");
 box.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{cart=cart.filter(x=>x.id!==Number(b.dataset.remove));renderCart()}));
}
function setCart(open){document.getElementById("cartDrawer").classList.toggle("open",open);document.getElementById("scrim").classList.toggle("show",open)}
function openProduct(id){const p=products.find(x=>x.id===id);document.getElementById("productDetail").innerHTML=`<div class="detail-layout">${productArt(p,"detail-art")}<div class="detail-copy"><span class="product-category">${p.category}</span><h2>${p.title}</h2><div class="rating"><span>★</span> ${p.rating} (${p.reviews} reviews)</div><div class="price">${money(p.price)} <small>PKR</small></div><p>${p.description}</p><p>Digital product • File format and license details should be confirmed by the seller before purchase.</p><button class="btn primary" id="detailAdd">Add to cart →</button></div></div>`;document.getElementById("productDialog").showModal();document.getElementById("detailAdd").addEventListener("click",()=>{addToCart(id);document.getElementById("productDialog").close()})}
searchInput.addEventListener("input",renderProducts);sortSelect.addEventListener("change",renderProducts);
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderProducts();document.getElementById("shop").scrollIntoView({behavior:"smooth"})}));
document.getElementById("cartToggle").addEventListener("click",()=>setCart(true));document.getElementById("closeCart").addEventListener("click",()=>setCart(false));document.getElementById("scrim").addEventListener("click",()=>setCart(false));
document.getElementById("checkoutBtn").addEventListener("click",()=>showToast(cart.length?"Demo checkout: connect a payment provider to accept payments.":"Your cart is empty."));
document.getElementById("closeProduct").addEventListener("click",()=>document.getElementById("productDialog").close());
document.getElementById("sellBtn").addEventListener("click",()=>document.getElementById("sellerDialog").showModal());
document.getElementById("closeSeller").addEventListener("click",()=>document.getElementById("sellerDialog").close());
document.getElementById("sellerForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("sellerMessage").textContent=`Thanks, ${document.getElementById("sellerName").value}! Your demo profile is ready to preview. No information has been sent to a server.`;showToast("Demo seller profile created")});
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterMsg").textContent="Thanks for joining! This demo does not send emails yet.";e.target.reset()});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));
renderProducts();renderCart();
