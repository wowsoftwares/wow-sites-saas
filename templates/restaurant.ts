import { ClientData } from "@/lib/validations";

export function generateRestaurantTemplate(data: ClientData): string {
  const services = Array.isArray(data.services) ? data.services : [];
  const socialLinks = data.socialLinks || {};
  const address = data.address || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${data.businessName} - ${data.aboutUs.substring(0, 160)}">
  <title>${data.businessName} - Restaurant</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <!-- Hero Section -->
  <section class="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20 px-4">
    <div class="max-w-6xl mx-auto text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-4">${data.businessName}</h1>
      <p class="text-xl md:text-2xl mb-8">Delicious food, great atmosphere</p>
      <a href="tel:${data.phone}" class="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
        Call Now: ${data.phone}
      </a>
    </div>
  </section>

  <!-- About Section -->
  <section class="py-16 px-4 bg-white">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-4xl font-bold text-center mb-8 text-gray-900">About Us</h2>
      <p class="text-lg text-gray-700 leading-relaxed text-center">${data.aboutUs}</p>
    </div>
  </section>

  <!-- Menu/Services Section -->
  <section class="py-16 px-4 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-900">Our Menu</h2>
      <div class="grid md:grid-cols-3 gap-8">
        ${services
          .map(
            (service) => `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
          <div class="w-full h-48 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg mb-4"></div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900">${service}</h3>
          <p class="text-gray-600">Delicious and freshly prepared</p>
        </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Location Section -->
  ${address ? `
  <section class="py-16 px-4 bg-white">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-bold mb-8 text-gray-900">Visit Us</h2>
      <p class="text-xl text-gray-700 mb-4">${address}</p>
      <a href="https://maps.google.com/?q=${encodeURIComponent(address)}" target="_blank" class="inline-block text-orange-600 hover:text-orange-700 font-semibold">
        Get Directions →
      </a>
    </div>
  </section>
  ` : ""}

  <!-- Contact Form Section -->
  <section class="py-16 px-4 bg-gray-50">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-4xl font-bold text-center mb-8 text-gray-900">Get in Touch</h2>
      <form id="contactForm" class="bg-white rounded-lg shadow-md p-8">
        <div class="mb-6">
          <label for="name" class="block text-gray-700 font-semibold mb-2">Name *</label>
          <input type="text" id="name" name="name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Your name">
        </div>
        <div class="mb-6">
          <label for="email" class="block text-gray-700 font-semibold mb-2">Email *</label>
          <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="your@email.com">
        </div>
        <div class="mb-6">
          <label for="phone" class="block text-gray-700 font-semibold mb-2">Phone *</label>
          <input type="tel" id="phone" name="phone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Your phone number">
        </div>
        <div class="mb-6">
          <label for="message" class="block text-gray-700 font-semibold mb-2">Message *</label>
          <textarea id="message" name="message" required rows="5" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Your message"></textarea>
        </div>
        <button type="submit" class="w-full bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors">
          Send Message
        </button>
        <div id="formMessage" class="mt-4 text-center hidden"></div>
      </form>
    </div>
  </section>

  <!-- Contact Info Section -->
  <section class="py-16 px-4 bg-white">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-bold mb-8 text-gray-900">Contact Us</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900">Phone</h3>
          <a href="tel:${data.phone}" class="text-orange-600 hover:text-orange-700 text-lg">${data.phone}</a>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900">Email</h3>
          <a href="mailto:${data.email}" class="text-orange-600 hover:text-orange-700 text-lg">${data.email}</a>
        </div>
      </div>
      ${Object.keys(socialLinks).length > 0 ? `
      <div class="mt-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Follow Us</h3>
        <div class="flex justify-center gap-4">
          ${socialLinks.facebook ? `<a href="${socialLinks.facebook}" target="_blank" class="text-orange-600 hover:text-orange-700">Facebook</a>` : ""}
          ${socialLinks.instagram ? `<a href="${socialLinks.instagram}" target="_blank" class="text-orange-600 hover:text-orange-700">Instagram</a>` : ""}
        </div>
      </div>
      ` : ""}
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-gray-400 py-8 px-4 text-center">
    <p>&copy; ${new Date().getFullYear()} ${data.businessName}. All rights reserved.</p>
  </footer>

  <script>
    // Contact form validation and handling
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const form = this;
      const formData = new FormData(form);
      const messageDiv = document.getElementById('formMessage');
      
      // Basic validation
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const phone = formData.get('phone').trim();
      const message = formData.get('message').trim();
      
      if (!name || !email || !phone || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }
      
      // Phone validation (basic)
      const phoneRegex = /^[\\d\\s\\-\\+\\(\\)]+$/;
      if (!phoneRegex.test(phone) || phone.replace(/[^\\d]/g, '').length < 10) {
        showMessage('Please enter a valid phone number.', 'error');
        return;
      }
      
      // Show success message (API integration will be added in Phase 2)
      showMessage('Thank you for your message! We will get back to you soon.', 'success');
      form.reset();
    });
    
    function showMessage(text, type) {
      const messageDiv = document.getElementById('formMessage');
      messageDiv.textContent = text;
      messageDiv.className = 'mt-4 text-center p-4 rounded-lg ' + 
        (type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700');
      messageDiv.classList.remove('hidden');
      
      setTimeout(() => {
        messageDiv.classList.add('hidden');
      }, 5000);
    }
  </script>
</body>
</html>`;
}
