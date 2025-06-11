// Navbar Behavior
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove background on scroll
    if (currentScroll > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
    
    // Hide/show navbar on scroll up/down
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.classList.add('navbar-hidden');
    } else {
        navbar.classList.remove('navbar-hidden');
    }
    
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuButton.classList.toggle('active');
});

// Dropdown Menu
document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Prevent default only for the dropdown toggle
        e.preventDefault();

        const parent = this.parentElement;
        parent.classList.toggle('active');
    });
});

// Scroll Animation for How It Works section
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
}, observerOptions);

// Start observing the How It Works section
document.addEventListener('DOMContentLoaded', () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
        observer.observe(howItWorksSection);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Collect form data
            const formData = {
                fields: {
                    Name: contactForm.name.value,
                    Email: contactForm.email.value,
                    Phone: contactForm.phone.value,
                    Subject: contactForm.subject.value,
                    Message: contactForm.message.value,
                    "Submission Date": new Date().toISOString()
                }
            };

            try {
                const response = await fetch('/.netlify/functions/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to submit form');
                }

                // Show success message
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();

            } catch (error) {
                console.error('Error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});

// Notification System
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide and remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
} 

document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const resultsDiv = document.getElementById('results');
    const worksOutRadios = document.querySelectorAll('input[name="worksOut"]');
    const workoutDetails = document.getElementById('workout-details');
  
    // 1) Show/hide workout details when user selects "Yes" or "No"
    worksOutRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'yes' && radio.checked) {
          workoutDetails.classList.remove('hidden');
        } else if (radio.value === 'no' && radio.checked) {
          workoutDetails.classList.add('hidden');
        }
      });
    });
  
    // 2) When the quiz form is submitted, prevent default and build a 7-day plan
    quizForm.addEventListener('submit', event => {
      event.preventDefault();
  
      // Read user inputs
      const age = parseInt(document.getElementById('age').value, 10);
      const gender = quizForm.elements['gender'].value;
      const height = parseInt(document.getElementById('height').value, 10);
      const weight = parseInt(document.getElementById('weight').value, 10);
      const targetWeight = parseInt(document.getElementById('target-weight').value, 10);
      const worksOut = quizForm.elements['worksOut'].value;
      const frequency = worksOut === 'yes'
        ? parseInt(document.getElementById('freq').value, 10) || 0
        : 0;
      const intensity = worksOut === 'yes'
        ? document.getElementById('intensity').value
        : '';
      const diet = document.getElementById('diet').value; // "omnivore" | "vegetarian" | "vegan"
      const likes = document.getElementById('likes').value
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
  
      // Determine if user wants to lose weight or gain/maintain
      const losingWeight = targetWeight < weight;
  
      // 3) Define meal databases (breakfast / lunch / dinner / snacks) by diet category.
      //    For simplicity, these arrays contain strings of meal names. You can expand or replace them with actual recipe objects.
      const mealDB = {
        omnivore: {
          breakfast: [
            'Scrambled Eggs & Whole-grain Toast',
            'Greek Yogurt Parfait with Berries',
            'Avocado & Turkey Bacon Toast',
            'Spinach & Mushroom Omelette',
            'Breakfast Burrito with Eggs & Veggies',
            'Peanut Butter Banana Oatmeal',
            'Cottage Cheese & Pineapple'
          ],
          lunch: [
            'Grilled Chicken Salad with Mixed Greens',
            'Turkey & Avocado Wrap',
            'Salmon Poke Bowl',
            'Chicken Quinoa Bowl',
            'Beef Stir-Fry with Veggies',
            'Tuna Salad Sandwich on Whole Wheat',
            'Shrimp & Avocado Salad'
          ],
          dinner: [
            'Baked Salmon + Roasted Broccoli',
            'Grilled Steak + Sweet Potato',
            'Chicken Fajita Bowls',
            'Pork Tenderloin + Brussels Sprouts',
            'Beef Chili with Beans',
            'Balsamic Chicken + Asparagus',
            'Shrimp Garlic Pasta'
          ],
          snacks: [
            'Apple Slices with Almond Butter',
            'Baby Carrots & Hummus',
            'Handful of Mixed Nuts',
            'Greek Yogurt with Honey',
            'String Cheese + Whole Grain Crackers',
            'Celery & Peanut Butter',
            'Hard-boiled Egg'
          ]
        },
        vegetarian: {
          breakfast: [
            'Overnight Oats with Chia Seeds',
            'Veggie Egg Scramble',
            'Greek Yogurt Parfait',
            'Avocado Toast with Tomato',
            'Cottage Cheese & Berries',
            'Banana Pancakes',
            'Spinach & Feta Omelette'
          ],
          lunch: [
            'Quinoa & Black Bean Bowl',
            'Veggie Wrap with Hummus',
            'Caprese Sandwich',
            'Lentil Soup with Whole Wheat Roll',
            'Falafel Salad',
            'Chickpea Curry with Brown Rice',
            'Grilled Veggie Panini'
          ],
          dinner: [
            'Vegetable Stir-Fry with Tofu',
            'Spinach & Ricotta Stuffed Peppers',
            'Vegetarian Chili with Cornbread',
            'Eggplant Parmesan',
            'Butternut Squash Risotto',
            'Black Bean Tacos',
            'Zucchini Noodle Alfredo'
          ],
          snacks: [
            'Carrots & Hummus',
            'Greek Yogurt with Granola',
            'Trail Mix (nuts + dried fruit)',
            'Sliced Bell Peppers & Guacamole',
            'Apple & Peanut Butter',
            'Cucumber Slices with Tzatziki',
            'String Cheese'
          ]
        },
        vegan: {
          breakfast: [
            'Chia Pudding with Berries',
            'Smoothie Bowl (Banana + Spinach)',
            'Vegan Tofu Scramble',
            'Overnight Oats with Almond Milk',
            'Avocado Toast with Chickpeas',
            'Peanut Butter Banana Smoothie',
            'Vegan Pancakes with Maple Syrup'
          ],
          lunch: [
            'Vegan Buddha Bowl (Quinoa + Veggies)',
            'Lentil & Sweet Potato Salad',
            'Vegan Chickpea Wrap',
            'Black Bean & Corn Salad',
            'Tofu Veggie Stir-Fry',
            'Quinoa Tabbouleh',
            'Vegan Sushi Rolls'
          ],
          dinner: [
            'Vegan Lentil Shepherd's Pie',
            'Chickpea Curry with Brown Rice',
            'Stuffed Acorn Squash',
            'Vegan Pasta Primavera',
            'Black Bean Burger with Sweet Potato Fries',
            'Thai Coconut Tofu Curry',
            'Vegan Chili with Cornbread'
          ],
          snacks: [
            'Fresh Fruit Salad',
            'Roasted Chickpeas',
            'Almonds & Walnuts',
            'Veggie Sticks & Hummus',
            'Dates & Almond Butter',
            'Energy Balls (oats + nuts)',
            'Rice Cakes with Avocado'
          ]
        }
      };
  
      // 4) Utility to pick N unique random indices from an array
      function pickNUnique(arr, n) {
        const result = [];
        const used = new Set();
        while (result.length < n && used.size < arr.length) {
          const idx = Math.floor(Math.random() * arr.length);
          if (!used.has(idx)) {
            used.add(idx);
            result.push(arr[idx]);
          }
        }
        return result;
      }
  
      // 5) Build a weekly plan: 7 days with breakfast, lunch, dinner, snack1, snack2.
      //    We want each day's breakfast to be different, each day's lunch different, etc.
      const breakfasts = pickNUnique(mealDB[diet].breakfast, 7);
      const lunches   = pickNUnique(mealDB[diet].lunch, 7);
      const dinners   = pickNUnique(mealDB[diet].dinner, 7);
      // Pick 14 unique snack items (2 per day), or if fewer items exist, allow repeats after exhausting.
      let allSnacksPool = mealDB[diet].snacks.slice();
      if (allSnacksPool.length < 14) {
        // Duplicate pool until at least 14 items
        while (allSnacksPool.length < 14) {
          allSnacksPool = allSnacksPool.concat(mealDB[diet].snacks);
        }
      }
      const snacksPicked = pickNUnique(allSnacksPool, 14);
  
      const daysOfWeek = [
        'Saturday', 'Sunday', 'Monday',
        'Tuesday', 'Wednesday', 'Thursday', 'Friday'
      ];
  
      // Construct an array of 7 day-objects
      const weeklyPlan = daysOfWeek.map((dayName, i) => {
        return {
          day: dayName,
          breakfast: breakfasts[i] || breakfasts[ i % breakfasts.length ],
          lunch: lunches[i] || lunches[ i % lunches.length ],
          dinner: dinners[i] || dinners[ i % dinners.length ],
          snack1: snacksPicked[2*i], 
          snack2: snacksPicked[2*i + 1]
        };
      });
  
      // 6) Generate HTML table markup for the 7-day plan.
      let html = `
        <h2 class="results-heading">Your 7-Day Meal Plan</h2>
        <div class="meal-plan-container">
          <table class="meal-plan-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Snack (Morning)</th>
                <th>Lunch</th>
                <th>Snack (Afternoon)</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
      `;
  
      weeklyPlan.forEach(entry => {
        html += `
          <tr>
            <td>${entry.day}</td>
            <td>${entry.breakfast}</td>
            <td>${entry.snack1}</td>
            <td>${entry.lunch}</td>
            <td>${entry.snack2}</td>
            <td>${entry.dinner}</td>
          </tr>
        `;
      });
  
      html += `
            </tbody>
          </table>
          <button id="back-btn" class="btn secondary back-btn">Back to Quiz</button>
        </div>
      `;
  
      // 7) Inject into page: hide the form, show results
      resultsDiv.innerHTML = html;
      quizForm.classList.add('hidden');
      resultsDiv.classList.remove('hidden');
  
      // 8) "Back to Quiz" logic
      document.getElementById('back-btn').addEventListener('click', () => {
        resultsDiv.classList.add('hidden');
        quizForm.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Reviews functionality
const reviewsPerPage = 10;
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

if (!localStorage.getItem('reviews')) {
    reviews = [
        { name: 'Alice', stars: 5, message: 'These meal plans changed my life!' },
        { name: 'Bob', stars: 4, message: 'Great variety and easy to follow.' },
        { name: 'Catherine', stars: 3, message: 'Good, but could use more vegetarian options.' },
        { name: 'David', stars: 5, message: 'Perfect for my weight loss journey.' },
        { name: 'Emily', stars: 4, message: 'Tasty meals, but portions were small.' },
        { name: 'Frank', stars: 5, message: 'Easy to stick to and delicious.' },
        { name: 'Grace', stars: 2, message: 'Not enough options for my taste.' },
        { name: 'Hannah', stars: 5, message: 'Best meal plan service ever!' },
        { name: 'Ian', stars: 4, message: 'Quality ingredients and good support.' },
        { name: 'Jane', stars: 5, message: 'Helped me gain muscle with proper macros.' },
        { name: 'Kevin', stars: 3, message: 'Okay, but I expected more recipes.' },
        { name: 'Laura', stars: 5, message: 'Absolutely recommend for busy people.' }
    ];
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function renderStarIcons(count) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += '★';
    }
    for (let i = count; i < 5; i++) {
        stars += '☆';
    }
    return stars;
}

function renderReviews(page = 1) {
    const start = (page - 1) * reviewsPerPage;
    const end = start + reviewsPerPage;
    const pageReviews = reviews.slice(start, end);
    const container = document.getElementById('reviews-container');
    container.innerHTML = '';
    pageReviews.forEach(r => {
        const card = document.createElement('div');
        card.classList.add('review-card');
        card.innerHTML = `
            <div class="review-header">
                <div class="review-name">${r.name}</div>
                <div class="review-stars">${renderStarIcons(r.stars)}</div>
            </div>
            <div class="review-message">${r.message}</div>
        `;
        container.appendChild(card);
    });
    renderPagination(page);
}

function renderPagination(current) {
    const pages = Math.ceil(reviews.length / reviewsPerPage);
    const pagination = document.getElementById('reviews-pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
        if (i === current) link.classList.add('active');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            renderReviews(i);
        });
        pagination.appendChild(link);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('reviews-container')) {
        renderReviews();
        const form = document.getElementById('review-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('input[name="review-name"]').value;
            const stars = parseInt(form.querySelector('input[name="review-stars"]:checked').value);
            const message = form.querySelector('textarea[name="review-message"]').value;
            const newReview = { name, stars, message };
            reviews.unshift(newReview);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            form.reset();
            renderReviews();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
  // Page fade-in effect
  document.body.classList.add('fade-in');
});

document.querySelectorAll('a.page-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    document.body.classList.remove('fade-in');
    document.body.style.opacity = 0;
    setTimeout(() => window.location.href = href, 300);
  });
});