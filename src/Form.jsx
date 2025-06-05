import { useState } from "react";

export default function Form({ handleSubmit, fields }) {
  const [errors, setErrors] = useState({});
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // handle validation
    // get submitted form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    // validate entries
    // initialize errors object
    let newErrors = {};
    // Loop through each field and apply its validation rules
    Object.entries(data).forEach(([key, value]) => {
      // identify the current field's validation rules
      const validationRules =
        fields.find((field) => field.name === key)?.validations || [];
      console.log("validationRules:", validationRules);
      // apply validation rules
      validationRules.forEach((rule) => {
        if (!newErrors[key]) newErrors[key] = [];

        // 'required'
        if (rule === "required") {
          const fieldDefinition = fields.find((f) => f.name === key);
          const isFile = fieldDefinition?.type === "file";

          if (
            (isFile && !formData.get(key)?.name) || // no file selected
            (!isFile && !value.trim()) // no value entered
          ) {
            console.error(`Validation failed: ${key} is required.`);
            newErrors[key].push(`${key} is required.`);
          }
        }

        // 'email'
        if (rule === "email" && value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            console.error(`Validation failed: ${key} must be a valid email.`);
            newErrors[key].push(`${key} must be a valid email.`);
          }
        }

        // 'password'
        if (rule === "password" && value) {
          if (value.length < 8) {
            console.error(
              `Validation failed: ${key} must be at least 8 characters long.`
            );
            newErrors[key].push(`${key} must be at least 8 characters long.`);
          }
          if (!/[A-Z]/.test(value)) {
            console.error(
              `Validation failed: ${key} must contain at least one uppercase letter.`
            );
            newErrors[key].push(
              `${key} must contain at least one uppercase letter.`
            );
          }
          if (!/[0-9]/.test(value)) {
            console.error(
              `Validation failed: ${key} must contain at least one number.`
            );
            newErrors[key].push(`${key} must contain at least one number.`);
          }
        }

        // 'confirm-password'
        if (rule === "confirm-password" && value) {
          if (value !== data["password"]) {
            console.error(`Validation failed: ${key} must match the password.`);
            newErrors[key].push(`${key} must match the password.`);
          }
        }
        // Add more validation rules as needed
      });
    });

    console.log("Validation errors:", newErrors);

    // Update error state
    setErrors(newErrors);

    console.log("Form data:", data);
    handleSubmit(data);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
    >
      {fields.map((field) => (
        <div key={field.name}>
          {errors[field.name] &&
            errors[field.name].map((err, index) => (
              <p key={index} className="text-red-500 text-sm mt-1">
                {err}
              </p>
            ))}

          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <button
        type="submit"
        name="submit-form"
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
