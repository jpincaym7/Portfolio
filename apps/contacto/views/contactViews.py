# views.py
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from apps.contacto.models import ContactMessage

@require_POST
def contact_form_view(request):
    """
    Handle contact form submissions
    Returns JSON response with success/error status
    """
    # Get form data
    try:
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        subject = request.POST.get('subject', '').strip()
        message = request.POST.get('message', '').strip()
        
        # Validate form data
        if not all([name, email, subject, message]):
            return JsonResponse({
                'success': False,
                'message': 'All fields are required.'
            })
        
        # Create new ContactMessage instance
        contact_message = ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        # Send email notification with HTML template
        try:
            # Prepare context for email template
            context = {
                'name': name,
                'email': email,
                'subject': subject,
                'message': message,
                'date': timezone.now().strftime('%d/%m/%Y'),
                'time': timezone.now().strftime('%H:%M'),
                'ip_address': get_client_ip(request)
            }
            
            # Render HTML content
            html_content = render_to_string('emails/contact_form_notification.html', context)
            
            # Create email
            email_message = EmailMultiAlternatives(
                f'New Contact Form Submission: {subject}',
                f'Name: {name}\nEmail: {email}\nMessage: {message}',  # Plain text fallback
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],  # Add this to your settings.py
            )
            
            # Attach HTML content
            email_message.attach_alternative(html_content, "text/html")
            
            # Send email
            email_message.send()
            
        except Exception as e:
            # Log the error but don't fail the form submission
            print(f"Email sending failed: {str(e)}")
        
        # Return success response
        return JsonResponse({
            'success': True,
            'message': 'Your message has been sent successfully!'
        })
        
    except Exception as e:
        # Return error response
        return JsonResponse({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        })

def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR', 'unknown')
    return ip