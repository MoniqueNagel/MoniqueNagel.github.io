
$(document).ready(function(){
   
   $('#contact-form').submit(function (mail){

      /*assign input values to variable that will determine how they will be sent to my email*/
      const form = document.querySelector('form[id="contact-form"]');
      const senderName = form.elements['senderName'].value;
      const senderEmail = form.elements['senderEmail'].value;
      const message = form.elements['message'].value;

      
      /*construction of the email and how I will be receiving the input from the person sending the message*/
      const msgTemplate = "Message: " + message;

      mail.preventDefault();

      var data = {
         service_id: 'service_5drl7g4',
         template_id: 'template_1twqw9a',
         user_id: 'user_R2FiksWINiUjqEHXs77Vh',
         template_params:{
            from_name: senderName,
            to_name: 'Monique',
            reply_to: senderEmail,
            message: msgTemplate
            
         }
      };

      $.ajax('https://api.emailjs.com/api/v1.0/email/send',{
         type: 'POST',
         data: JSON.stringify(data),
         contentType: 'application/json'
      /*message was successfully sent*/
      }).done(function(){
         alert('Message sent!')

      /*message failed to send*/
      }).fail(function(error){
         alert('Oh no... Your message failed to send: ' + JSON.stringify(error));
      })

   })

})

