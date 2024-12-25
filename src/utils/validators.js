import { toast } from "react-toastify";

export const validateUser = (user) => {
    return user.trim() !== '';
  };
  
export const validatePassword = (password) => {
  return password.trim() !== '';
};

export const validateEmail = (email) => {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function getISTDate() {
  const someDate = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;

  const istDate = new Date(someDate.getTime() + istOffset);

  const defaultValues = istDate.toISOString().split("T")[0];
  const defaultValuestime = istDate.toISOString();

  return {
      defaultValues,
      defaultValuestime,
  };
};


export const showToast = (type, message) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3500,
    pauseOnHover: true,
    draggable: true,
    newestOnTop: false,
    theme: "light",
  });
};
