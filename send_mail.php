<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $to = "mokoenamandlae@gmail.com";
    $subject = "New Contact Form Submission from " . $name;
    $body = "Name: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Message: " . $message . "\n";

    $headers = "From: " . $email;

    if (mail($to, $subject, $body, $headers)) {
        echo "success";
    } else {
        echo "failure";
    }
} else {
    echo "Invalid request method.";
}
?>
