// validation.js — contact form + newsletter form validation
document.addEventListener('DOMContentLoaded', function () {

  var NAME_RE = /^\p{L}[\p{L}\s.'-]{2,49}$/u;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ---- one rule per field: returns an error message, or '' if valid ----
  var rules = {
    name: function (v) {
      v = v.trim();
      if (!v) return 'Please enter your name.';
      if (v.length < 3) return 'Name must be at least 3 characters.';
      if (!NAME_RE.test(v)) return 'Use letters only (spaces, . \' - allowed).';
      return '';
    },
    email: function (v) {
      v = v.trim();
      if (!v) return 'Please enter your email address.';
      if (!EMAIL_RE.test(v)) return 'Enter a valid email, e.g. name@example.com.';
      return '';
    },
    enquiry: function (v) { return v ? '' : 'Please choose an enquiry type.'; },
    message: function (v) {
      v = v.trim();
      if (!v) return 'Please write a message.';
      if (v.length < 10) return 'Message must be at least 10 characters (' + v.length + '/10).';
      if (v.length > 1000) return 'Message is too long (max 1000 characters).';
      return '';
    }
  };

  function errorBox(field) {
    var id = (field.id || field.name) + '-error';
    var box = document.getElementById(id);
    if (!box) {
      box = document.createElement('small');
      box.id = id;
      box.className = 'field-error';
      box.setAttribute('role', 'alert');
      // contact form: inside the label; newsletter: handled by caller
      field.insertAdjacentElement('afterend', box);
    }
    return box;
  }

  function check(field, ruleName, box) {
    var msg = rules[ruleName](field.value);
    box = box || errorBox(field);
    box.textContent = msg;
    field.classList.toggle('is-invalid', !!msg);
    field.classList.toggle('is-valid', !msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    field.setAttribute('aria-describedby', box.id);
    return !msg;
  }

  function wire(field, ruleName, box) {
    field.addEventListener('blur', function () { check(field, ruleName, box); });
    // once a field has been checked, re-validate while typing so the message clears as soon as it is fixed
    field.addEventListener('input', function () {
      if (field.classList.contains('is-invalid') || field.classList.contains('is-valid')) check(field, ruleName, box);
    });
    field.addEventListener('change', function () { check(field, ruleName, box); });
  }

  function banner(form, text, cls) {
    var b = form.querySelector('.form-status');
    if (!b) {
      b = document.createElement('p');
      b.className = 'form-status';
      b.setAttribute('role', 'status');
      form.appendChild(b);
    }
    b.className = 'form-status ' + cls;
    b.textContent = text;
    return b;
  }

  // ================= CONTACT FORM =================
  var form = document.getElementById('atelierContactForm');
  if (form) {
    form.noValidate = true; // we show our own messages instead of the browser's
    var fields = [
      [form.elements['name'], 'name'],
      [form.elements['email'], 'email'],
      [form.elements['enquiry'], 'enquiry'],
      [form.elements['message'], 'message']
    ];
    form.elements['name'].setAttribute('maxlength', '50');
    form.elements['email'].setAttribute('maxlength', '100');
    form.elements['message'].setAttribute('maxlength', '1000');
    // create the (empty) message slots up front so showing a message never shifts the layout
    fields.forEach(function (f) { errorBox(f[0]); wire(f[0], f[1]); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) { if (!check(f[0], f[1]) && !firstBad) firstBad = f[0]; });
      if (firstBad) {
        banner(form, 'Please fix the highlighted fields and try again.', 'error');
        firstBad.focus();
        return;
      }
      // No server is connected yet: show success and reset the form.
      form.reset();
      fields.forEach(function (f) {
        f[0].classList.remove('is-valid', 'is-invalid');
        f[0].removeAttribute('aria-invalid');
        errorBox(f[0]).textContent = '';
      });
      banner(form, 'Thank you! Your enquiry has been sent. We will reply within one business day.', 'success');
    });
  }

  // ================= NEWSLETTER FORM =================
  var news = document.getElementById('newsForm');
  if (news) {
    news.noValidate = true;
    var input = news.querySelector('input[type="email"]');
    var msg = document.createElement('small');
    msg.id = 'newsEmail-error';
    msg.className = 'field-error news-msg';
    msg.setAttribute('role', 'alert');
    news.insertAdjacentElement('afterend', msg);
    input.id = input.id || 'newsEmail';
    input.setAttribute('maxlength', '100');
    wire(input, 'email', msg);

    news.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.classList.remove('ok');
      if (!check(input, 'email', msg)) { input.focus(); return; }
      input.value = '';
      input.classList.remove('is-valid', 'is-invalid');
      msg.textContent = 'Subscribed! Watch your inbox for new pieces.';
      msg.classList.add('ok');
    });
  }
});
