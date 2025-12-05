/**
 * scripts/contact.js - DEBUG VERSION
 * Check your browser console (F12) to see these logs!
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Contact script loaded.");

    // 1. Get Elements
    const contactForm = document.getElementById('contactForm');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const subjectField = document.getElementById('subject'); // Look for ID="subject"
    const messageField = document.getElementById('message'); // Look for ID="message"
    const messageDiv = document.getElementById('contact-message');

    // Debug: Check if elements exist
    if (!nameField) console.error("Error: Input with id='name' not found in HTML.");
    if (!emailField) console.error("Error: Input with id='email' not found in HTML.");
    if (!subjectField) console.error("Error: Input with id='subject' not found in HTML.");

    // --- TASK A: Check URL for Service Inquiry (Autofill Subject) ---
    const urlParams = new URLSearchParams(window.location.search);
    const serviceName = urlParams.get('service');

    console.log("URL Service Parameter:", serviceName); // See if the URL actually has ?service=...

    if (serviceName && subjectField) {
        const decodedName = decodeURIComponent(serviceName);
        subjectField.value = `Inquiry regarding: ${decodedName}`;
        console.log("Subject autofilled with:", decodedName);
        
        if (messageField) {
            messageField.value = `Hello, I am interested in the ${decodedName} service. Could you please provide more details regarding...`;
        }
        // Scroll user to the form so they see it
        subjectField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- TASK B: Check Session (Autofill Name/Email) ---
    fetch('php/check_session.php')
        .then(res => res.json())
        .then(data => {
            console.log("Session Data:", data); // Check if you are actually logged in
            if (data.loggedin) {
                if (nameField) nameField.value = data.userName;
                if (emailField) emailField.value = data.email;
                console.log("Name/Email autofilled from session.");
            } else {
                console.log("User is not logged in, skipping name/email autofill.");
            }
        })
        .catch(err => console.error("Session check error:", err));

    // --- TASK C: Handle Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Sending...';
            messageDiv.textContent = ''; 

            fetch('php/submit_inquiry.php', {
                method: 'POST',
                body: new FormData(contactForm)
            })
            .then(res => res.json())
            .then(data => {
                messageDiv.textContent = data.message;
                
                if (data.success) {
                    messageDiv.className = 'text-center mt-3 mb-3 text-success';
                    contactForm.reset(); 
                } else {
                    messageDiv.className = 'text-center mt-3 mb-3 text-danger';
                }
            })
            .catch(err => {
                console.error(err);
                messageDiv.textContent = "An error occurred while connecting to the server.";
                messageDiv.className = 'text-center mt-3 mb-3 text-danger';
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = 'Send Message';
            });
        });
    }
});