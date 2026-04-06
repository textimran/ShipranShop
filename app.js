// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAel-2fN_Wvv3drCWfi3qRuOLfn2eaVCgI",
  authDomain: "shipran-shop.firebaseapp.com",
  projectId: "shipran-shop",
  storageBucket: "shipran-shop.firebasestorage.app",
  appId: "1:1028470116814:web:981b125c0e7ea1e7601b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// ====== Load Products ======
export async function loadProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  const snapshot = await getDocs(collection(db, "products"));
  snapshot.forEach(doc => {
    const p = doc.data();

    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" width="120">
        <h3>${p.name}</h3>
        <p>৳${p.price}</p>
        <button onclick="viewProduct('${p.name}','${p.price}','${p.desc}','${p.image}')">View</button>
      </div>
    `;
  });
}

// ====== View Single Product ======
window.viewProduct = (name, price, desc, image) => {
  localStorage.setItem("product", JSON.stringify({name, price, desc, image}));
  window.location.href = "product.html";
};

// ====== Load Product Details ======
export function loadSingleProduct() {
  const data = JSON.parse(localStorage.getItem("product"));
  if (!data) return;

  document.getElementById("pimg").src = data.image;
  document.getElementById("pname").innerText = data.name;
  document.getElementById("pprice").innerText = data.price;
  document.getElementById("pdesc").innerText = data.desc;

  window.buyNow = () => {
    const phone = "8801318778325"; // WhatsApp Number
    const msg = `
🛒 New Order
📦 Product: ${data.name}
💰 Price: ৳${data.price}
📝 ${data.desc}
📍 Name:
📞 Phone:
🏠 Address:
`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };
}

// ====== Admin Login ======
window.login = async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, pass);
  window.location.href = "admin.html";
};

// ====== Add Product ======
window.addProduct = async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const desc = document.getElementById("desc").value;
  const file = document.getElementById("image").files[0];

  const storageRef = ref(storage, "products/" + Date.now());
  await uploadBytes(storageRef, file);
  const imageURL = await getDownloadURL(storageRef);

  await addDoc(collection(db, "products"), {
    name, price, desc, image: imageURL
  });

  alert("Product Added!");
};