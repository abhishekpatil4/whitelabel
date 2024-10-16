import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

def send_email(subject, body, to_email):
    from_email = "abhishek@composio.dev"  # Replace with your email
    from_password = os.getenv("GMAIL_PASSWORD")  # Replace with your email password

    # Create the email
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach the email body
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Set up the server
        server = smtplib.SMTP('smtp.gmail.com', 587)  # Use appropriate SMTP server and port
        server.starttls()  # Upgrade the connection to a secure encrypted SSL/TLS connection
        server.login(from_email, from_password)  # Log in to your email account
        server.send_message(msg)  # Send the email
        server.quit()  # Close the connection
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

print(send_email("Test email", "Hey this is a test email", "abishkpatil@gmail.com"))