var addBtn = document.getElementById("addBtn");
var modalOverlay = document.getElementById("modelOver");
var closeBtn = document.getElementById("closeBtn");
var cancelBtn = document.getElementById("cancelBtn");
var contactForm = document.getElementById("contactForm");
var errorMsg = document.getElementById("errorMsg");

var photoBtn = document.getElementById("photoBtn");
var photoInput = document.getElementById("photoInput");
var avatarPreview = document.getElementById("avatarPreview");

var contactsList = document.getElementById("contactsList");
var emptyState = document.getElementById("emptyState");
var searchInput = document.getElementById("searchInput");
var favList = document.getElementById("favList");
var emgList = document.getElementById("emgList");


var contacts = JSON.parse(localStorage.getItem("contacts")) || [];
var currentPhoto = "";


function openModal() {
  modalOverlay.classList.add("show");
}

function closeModal() {
  modalOverlay.classList.remove("show");
  contactForm.reset();
  errorMsg.textContent = "";
  currentPhoto = "";
  avatarPreview.innerHTML = '<i class="fa-solid fa-user"></i>';
}

addBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);


photoBtn.addEventListener("click", function () {
  photoInput.click();
});

photoInput.addEventListener("change", function () {
  var file = photoInput.files[0];
  var reader = new FileReader();

  reader.onload = function () {
    currentPhoto = reader.result;
    avatarPreview.innerHTML = '<img src="' + currentPhoto + '">';
  };

  reader.readAsDataURL(file);
});


contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  var name = document.getElementById("name").value;
  var phone = document.getElementById("phone").value;

  if (name == "" || phone == "") {
    errorMsg.textContent = "Please enter the name and phone number";
    return;
  }


  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].phone == phone) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Phone Number",
        text: "A contact with this phone number already exists: " + contacts[i].name,
        confirmButtonColor: "#3b82f6"
      });
      return;
    }
  }

  var newContact = {
    name: name,
    phone: phone,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    group: document.getElementById("group").value,
    notes: document.getElementById("notes").value,
    favorite: document.getElementById("favorite").checked,
    emergency: document.getElementById("emergency").checked,
    photo: currentPhoto
  };

  contacts.push(newContact);
  saveContacts();
  showContacts();
  closeModal();

  Swal.fire({
    icon: "success",
    title: "Added!",
    text: "Contact has been added successfully.",
    timer: 1500,
    showConfirmButton: false
  });
});

function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}


function showContacts() {
  var search = searchInput.value.toLowerCase();
  var html = "";
  var shown = 0;

  for (var i = 0; i < contacts.length; i++) {
    var c = contacts[i];

    
    var text = (c.name + " " + c.phone + " " + c.email).toLowerCase();
    if (text.indexOf(search) == -1) {
      continue;
    }

    shown++;

    var avatar = c.name.charAt(0).toUpperCase();
    if (c.photo != "") {
      avatar = '<img src="' + c.photo + '">';
    }

    var starClass = "";
    if (c.favorite) {
      starClass = "active-star";
    }

    var heartClass = "";
    if (c.emergency) {
      heartClass = "active-heart";
    }

    html += '<div class="contact-card">';
    html += '<div class="contact-avatar">' + avatar + '</div>';
    html += '<div class="contact-info">';
    html += '<h4>' + c.name + '</h4>';
    html += '<p>' + c.phone + '</p>';
    if (c.email != "") {
      html += '<p>' + c.email + '</p>';
    }
    if (c.group != "") {
      html += '<span class="group-tag">' + c.group + '</span>';
    }
    html += '</div>';
    html += '<div class="contact-actions">';
    html += '<button class="' + starClass + '" onclick="toggleFav(' + i + ')"><i class="fa-solid fa-star"></i></button>';
    html += '<button class="' + heartClass + '" onclick="toggleEmg(' + i + ')"><i class="fa-solid fa-heart-pulse"></i></button>';
    html += '<button class="delete-btn" onclick="deleteContact(' + i + ')"><i class="fa-solid fa-trash"></i></button>';
    html += '</div>';
    html += '</div>';
  }

  contactsList.innerHTML = html;

  if (shown == 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  updateNumbers();
  showSideLists();
}


function updateNumbers() {
  var favs = 0;
  var emgs = 0;

  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].favorite) {
      favs++;
    }
    if (contacts[i].emergency) {
      emgs++;
    }
  }

  document.getElementById("totalCount").textContent = contacts.length;
  document.getElementById("favCount").textContent = favs;
  document.getElementById("emgCount").textContent = emgs;
  document.getElementById("subCount").textContent = contacts.length;
}


function showSideLists() {
  var favHtml = "";
  var emgHtml = "";

  for (var i = 0; i < contacts.length; i++) {
    var row = '<div class="side-item">' + contacts[i].name + '<span>' + contacts[i].phone + '</span></div>';

    if (contacts[i].favorite) {
      favHtml += row;
    }
    if (contacts[i].emergency) {
      emgHtml += row;
    }
  }

  if (favHtml == "") {
    favList.innerHTML = "No favorites yet";
    favList.className = "side-body empty";
  } else {
    favList.innerHTML = favHtml;
    favList.className = "side-body";
  }

  if (emgHtml == "") {
    emgList.innerHTML = "No emergency contacts";
    emgList.className = "side-body empty";
  } else {
    emgList.innerHTML = emgHtml;
    emgList.className = "side-body";
  }
}


function toggleFav(index) {
  contacts[index].favorite = !contacts[index].favorite;
  saveContacts();
  showContacts();
}

function toggleEmg(index) {
  contacts[index].emergency = !contacts[index].emergency;
  saveContacts();
  showContacts();
}

function deleteContact(index) {
  var sure = confirm("Delete this contact?");

  if (sure) {
    contacts.splice(index, 1);
    saveContacts();
    showContacts();

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      timer: 1200,
      showConfirmButton: false
    });
  }
}


searchInput.addEventListener("input", showContacts);

showContacts();