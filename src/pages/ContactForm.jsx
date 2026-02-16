import React, { useState } from 'react';
import '../styles/ContactForm.scss';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add your form submission logic here,
    // for example, sending the data to an API.
    console.log({ name, email, consent });
    alert('Form submitted! Check the console for the data.');
  };

  return (
    <div className="contact-form-container">
      <h2></h2>
      <div className="contact__column">
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__field">
            <label className="form__label" htmlFor="name">Name</label>
            <input
              type="text"
              className="form__input name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="email">E-mail</label>
            <input
              type="email"
              className="form__input email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form__consent">
            <label className="form__checkbox">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              <span className="checkbox"></span>
              <p className="consent__text">
                I hereby give consent for my personal data included in my
                application to be processed for the purposes of the recruitment
                process under the European Parliament's and Council of the
                European Union Regulation on the Protection of Natural Persons as
                of 27 April 2016, with regard to the processing of personal data
                and on the free movement of such data, and repealing Directive
                95/46/EC (Data Protection Directive)
              </p>
            </label>
          </div>
          <button type="submit" className="btn btn--primary">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
