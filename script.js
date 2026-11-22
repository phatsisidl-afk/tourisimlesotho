const themeBtn = document.getElementById("themeBtn");

function setTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);

  if (theme === "dark") {
    themeBtn.textContent = "Light mode";
  } else {
    themeBtn.textContent = "Dark mode";
  }
}
let savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
  savedTheme = "light";
}
setTheme(savedTheme);
themeBtn.addEventListener("click", function () {
  if (localStorage.getItem("theme") === "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
});

const prices = [250, 150, 300, 900, 450, 1200, 400, 350, 800];

function updateTotal() {
  const service = document.getElementById("bService");
  const people = document.getElementById("bPeople");
  const days = document.getElementById("bDays");
  const total = document.getElementById("total");

  if (!service || !people || !days || !total) {
    return;
  }

  let amount = 0;
  if (service.selectedIndex > 0) {
    const price = prices[service.selectedIndex - 1];
    amount = price * people.value * days.value;
  }

  total.textContent = "M" + amount;
}
const totalFields = ["bService", "bPeople", "bDays"];
for (const id of totalFields) {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener("input", updateTotal);
  }
}

function getMessageBox(field) {
  let box = field.parentElement.querySelector(".invalid-feedback");

  if (box === null) {
    box = document.createElement("div");
    box.className = "invalid-feedback";
    field.after(box);
  }

  return box;
}

function checkField(field) {
  const feedback = field.parentElement.querySelector(".invalid-feedback");

  let message = "";
  const rules = field.validity;

  if (!feedback) {
    return true;
  }

  if (rules.valueMissing) {
    if (field.type = "checkbox") {
      message = "You must tick this box.";
    } else {
      message = "This field is required.";
    }
  } else if (rules.typeMismatch || rules.patternMismatch) {
    message = field.dataset.msg || "This value is not in the right format.";
  } else if (rules.tooShort) {
    message = "Type at least " + field.minLength + " characters.";
  } else if (rules.rangeUnderflow || rules.rangeOverflow) {
    message = "Enter a number from " + field.min + " to " + field.max + ".";
  } else if (field.id = "rConfirm") {
    if (field.value != document.getElementById("rPassword").value) {
      message = "The passwords do not match.";
    }
  }
  if (message === "") {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }

  box.textContent = message;
  return message === "";
}
function setupForm(formId, alertId, successText, afterSuccess) {
  const form = document.getElementById(formId);
  if (!form) {
    return;
  }
  form.noValidate = true;
  let alertBox = document.getElementById(alertId);
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = alertId;
    form.before(alertBox);
  }

  const fields = form.querySelectorAll("input, select, textarea");
  for (const field of fields) {
    field.addEventListener("input", function () {
      if (field.classList.contains("is-invalid")) {
        checkField(field);
      }
    });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let allGood = true;
    for (const field of fields) {
      if (checkField(field) === false) {
        allGood = false;
      }
    }

    if (allGood) {
      if (afterSuccess) {
        afterSuccess();
      }

      alertBox.innerHTML = '<div class="alert alert-success">' + successText + "</div>";

      form.reset();
      updateTotal(); 

      for (const field of fields) {
        field.classList.remove("is-valid");
      }
    } else {
      alertBox.innerHTML = '<div class="alert alert-danger">Please fix the red fields and try again.</div>';
    }
  });
}

function saveBooking() {
  const service = document.getElementById("bService");

  const booking = {
    service: service.options[service.selectedIndex].text,
    people: document.getElementById("bPeople").value,
    days: document.getElementById("bDays").value,
    total: document.getElementById("total").textContent
  };

  localStorage.setItem("lastBooking", JSON.stringify(booking));
  showLastBooking();
}

function showLastBooking() {
  const box = document.getElementById("lastBooking");
  const saved = localStorage.getItem("lastBooking");
  if (!box || !saved) {
    return;
  }

  const b = JSON.parse(saved);
  box.innerHTML = '<div class="alert alert-info">Your last booking: <strong>' + b.service +
    "</strong> for " + b.people + " people, " + b.days + " days. Total: " + b.total + "</div>";
}
showLastBooking();

setupForm("contactForm", "contactAlert", "Your message has been sent");
setupForm("bookForm", "bookAlert", "Booking received! We will email you to confirm.", saveBooking);
setupForm("regForm", "regAlert", "Welcome");


const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    topBtn.hidden = false;
  } else {
    topBtn.hidden = true;
  }
});

topBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
